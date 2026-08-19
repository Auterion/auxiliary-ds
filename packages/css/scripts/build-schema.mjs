/**
 * Emit `dist/component-schema.json` — what every component is, in tokens.
 *
 * ## Why this exists
 *
 * A recipe already says everything: `button.ts` binds geometry to component tokens
 * (`px-(--component-button-padding-x-md)`) and colour to theme roles (`bg-primary`).
 * But it says it in Tailwind classes, so nothing except a browser can read it. Pushing
 * Button into Figma meant a human reading the recipe and hand-deriving the bindings —
 * which does not generalise past one component and goes stale on the next edit.
 *
 * This turns the recipes into a machine-readable contract: for every component, every
 * variant combination, every slot — which token binds to which CSS property. One
 * artifact that a Figma generator, an agent, and a reviewer all read.
 *
 * ## How it stays honest
 *
 * Nothing here interprets a class. The chain is:
 *
 *   tv() introspection   -> which variant combinations exist   (tailwind-variants)
 *   recipe invocation    -> the merged class list per slot      (tailwind-merge applied)
 *   Tailwind compiler    -> the CSS those classes generate      (the real compiler)
 *   figma-index          -> the Figma variable behind each var  (derived from tokens)
 *
 * Every link is the same machinery the runtime uses, so the schema cannot describe a
 * component differently from how it renders. The one judgement call is which
 * declarations are worth recording (see LAYOUT_PROPS), and an unresolvable `var()` is a
 * hard failure rather than an omission — `test/component-schema.test.ts` gates it.
 *
 * The artifact is COMMITTED. A recipe edit then shows up in review as a design diff
 * ("button's fill moved from Theme/primary to Theme/brand") rather than a class-string
 * diff, which is most of the value.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  buildIndex,
  loadTokensDist,
  nonVariableReason,
  resolveVar,
  themeRedirects,
} from './figma-index.mjs';
import { createResolver, declarations, splitVariant, varRefs } from './tailwind-resolve.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const cssRoot = resolve(here, '..');
/**
 * Committed, and NOT under dist/ — `dist/` is gitignored, and being reviewable in a diff
 * is most of this file's value. Same placement as the other generated-and-committed
 * artifacts with drift gates (`apps/docs/.vitepress/data/props.generated.json`,
 * `packages/icons/src/registry.ts`).
 */
export const OUT_FILE = resolve(cssRoot, 'component-schema.json');

/**
 * Non-token declarations worth recording anyway.
 *
 * A Figma generator needs to know a Button is a horizontal centred flex row, not just
 * that its gap is `Component/button/gap`. These properties carry structure that has no
 * token because there is nothing to tokenise — `display: inline-flex` is not a design
 * decision anyone re-themes. Everything else without a token ref is dropped: recording
 * every `transition-property` would bury the bindings this file exists to show.
 */
const LAYOUT_PROPS = new Set([
  'display',
  'flex-direction',
  'align-items',
  'justify-content',
  'flex-wrap',
  'position',
  'text-align',
  'text-transform',
  'white-space',
  'border-style',
  'border-width',
  'text-decoration-line',
  'aspect-ratio',
  // Recorded as a literal because it cannot be anything else: a Figma Variable has no
  // animation type, so `animation: var(--animate-fade-in)` has no binding to report.
  // It is still design intent an agent generating UI needs, and leaving it out would
  // make a component that animates look identical to one that does not.
  'animation',
]);

/**
 * Classes that generate NO CSS — a defect record, not an exemption.
 *
 * EMPTY, and that is the point.
 *
 * It began with six animation utilities from the shadcn/radix vocabulary that this repo
 * never defined — `animate-in`, `animate-out`, `fade-in-0`, `fade-out-0`,
 * `animate-accordion-up`, `animate-accordion-down`. There was no `tw-animate-css`
 * dependency and no `--animate-*` theme entry, so all six were dropped silently: the
 * accordion had never slid and the dialog overlay had never faded, while `theme.css`
 * shipped a `prefers-reduced-motion` reset neutralising animations that did not exist.
 * They are now real, defined in `theme.css` from the motion tokens.
 *
 * A RATCHET: entries come out when the class starts resolving, never in. The stale-entry
 * check below fails the build on an entry that no longer applies, so this list cannot
 * outlive the defect it records. Adding one is a regression — define the class instead.
 */
export const DEAD_CLASSES = new Set([]);

/**
 * Enumerate a variant key's values.
 *
 * A boolean variant is authored with only the interesting half — `loading: { true: … }`,
 * `invalid: { true: … }` — because the false case is "no extra classes". Enumerating the
 * declared keys alone would therefore emit a Button matrix in which every button is
 * loading. The unset case is a real state and gets a row.
 */
function variantValues(values) {
  const keys = Object.keys(values);
  const boolish = keys.every((k) => k === 'true' || k === 'false');
  return boolish && !keys.includes('false') ? ['false', ...keys] : keys;
}

/** Cartesian product of `{ key: [values] }` as an array of prop objects. */
function combinations(space) {
  let rows = [{}];
  for (const [key, values] of Object.entries(space)) {
    rows = rows.flatMap((row) => values.map((v) => ({ ...row, [key]: v })));
  }
  return rows;
}

/** tv() takes real booleans for boolean variants; the enumeration carries strings. */
const coerce = (v) => (v === 'true' ? true : v === 'false' ? false : v);
const callProps = (props) =>
  Object.fromEntries(Object.entries(props).map(([k, v]) => [k, coerce(v)]));

/**
 * The slots a recipe really has.
 *
 * `tv()` injects a `base` key into `.slots` for the recipe's own `base` string, so a
 * slotted recipe that declares no `base` still exposes `slots.base === undefined` and a
 * `base()` accessor returning undefined. StatusBadge, by contrast, genuinely names a
 * slot `base`. Keying off the declared value tells the two apart; keying off the name
 * would silently drop a real slot.
 */
function slotNames(recipe) {
  return Object.entries(recipe.slots ?? {})
    .filter(([, v]) => v !== undefined)
    .map(([k]) => k);
}

/**
 * Class list per slot for one variant combination.
 *
 * A slotted recipe returns an object of slot functions; a flat one returns a string.
 * Flat recipes are normalised to a single `root` slot so consumers have one shape.
 *
 * A slot accessor returns `undefined` rather than `''` when it resolves to no classes
 * (`toast.action` is declared as `''` — a real, deliberately unstyled slot). It stays in
 * the schema with no properties, which is the truth about it.
 */
function slotClasses(recipe, props) {
  const out = recipe(callProps(props));
  if (typeof out === 'string') return { root: out };
  return Object.fromEntries(slotNames(recipe).map((s) => [s, out[s]() ?? '']));
}

/**
 * `@supports` fallbacks flatten into the declaration list, and Tailwind emits an
 * opacity-modified colour twice: an inlined literal for old engines, then the real
 * `color-mix(in oklab, var(--primary) 90%, transparent)` inside `@supports`. Strip the
 * wrapper and let the later declaration win, exactly as the cascade would — otherwise
 * `bg-primary/90` records a baked oklch() literal and loses the token entirely.
 */
function normalizeBlock(block) {
  // Match up to the opening brace, NOT a balanced paren group: the condition is
  // `@supports (color: color-mix(in lab, red, red))`, whose nested parens defeat a
  // `\([^)]*\)` match and leave `: color-mix(…)) {` behind — which then parses as a
  // property literally named `@supports (color`.
  return block.replace(/@supports[^{]*\{/g, '').replace(/\}/g, '');
}

function propertiesOf(block) {
  const byProperty = new Map();
  for (const d of declarations(normalizeBlock(block))) byProperty.set(d.property, d.value);
  return byProperty;
}

/** `color-mix(in oklab, var(--primary) 90%, transparent)` -> 0.9 */
function alphaOf(value) {
  const m = value.match(/color-mix\(in oklab,\s*var\(--[\w\\.-]+\)\s*([\d.]+)%/);
  return m ? Math.round(Number(m[1])) / 100 : null;
}

/**
 * One property's entry, in the smallest shape that stays lossless.
 *
 * The overwhelmingly common case is a property bound to exactly one token —
 * `background-color: var(--primary)` — and spelling that out as `{refs:[{var,figma}],
 * value}` is four times the JSON for no extra information, since the var name is
 * recoverable from the Figma path. It collapses to `{figma}`. Anything else — an
 * expression, a second reference, a literal — keeps `value` verbatim, because the
 * moment a shape is summarised it can be summarised wrongly.
 */
function leaf(value, refs, alpha) {
  const single = refs.length === 1 && refs[0];
  const isPlainVar = single && value === `var(${single.var})`;
  const isAlphaVar = single && alpha !== null && value.startsWith('color-mix(');
  if (isPlainVar || isAlphaVar) {
    return {
      figma: single.figma,
      ...(single.mode ? { mode: single.mode } : {}),
      ...(single.via ? { via: single.via } : {}),
      ...(alpha !== null ? { alpha } : {}),
    };
  }
  return { ...(refs.length ? { refs } : {}), ...(alpha !== null ? { alpha } : {}), value };
}

/**
 * Split rows into what every variant shares and what each one changes.
 *
 * Without this the matrix repeats `display: inline-flex` once per row — 24 times for
 * Button, 20 for StatusBadge — and buries the four declarations that actually differ.
 * Factoring is not just compression: "what does `variant=danger` change" is the design
 * question, and after this the answer is literally the row's contents.
 *
 * A property is common only when it appears in EVERY row with an identical value.
 * Anything else stays per-row, so a reader never has to merge to know the truth.
 */
function factorCommon(rows) {
  const common = {};
  const key = (v) => JSON.stringify(v);
  const first = rows[0];
  if (!first) return { common, deltas: [] };

  for (const [slot, states] of Object.entries(first.slots)) {
    for (const [state, props] of Object.entries(states)) {
      for (const [property, entry] of Object.entries(props)) {
        const sig = key(entry);
        const everywhere = rows.every((r) => key(r.slots[slot]?.[state]?.[property]) === sig);
        if (!everywhere) continue;
        ((common[slot] ??= {})[state] ??= {})[property] = entry;
      }
    }
  }

  const deltas = rows.map((r) => {
    const out = {};
    for (const [slot, states] of Object.entries(r.slots)) {
      for (const [state, props] of Object.entries(states)) {
        for (const [property, entry] of Object.entries(props)) {
          if (key(common[slot]?.[state]?.[property]) === key(entry)) continue;
          ((out[slot] ??= {})[state] ??= {})[property] = entry;
        }
      }
    }
    return out;
  });
  return { common, deltas };
}

/**
 * `{ slot: { '': {...}, hover: {...} } }` -> `{ slot: { properties, states } }`.
 * The '' key is an implementation detail of bucketing by variant prefix; readers get
 * `properties` for the resting state and `states` for the rest.
 */
function shape(bySlot) {
  const out = {};
  for (const [slot, states] of Object.entries(bySlot)) {
    const properties = states[''] ?? {};
    const rest = Object.fromEntries(Object.entries(states).filter(([s]) => s !== ''));
    const entry = {
      ...(Object.keys(properties).length ? { properties } : {}),
      ...(Object.keys(rest).length ? { states: rest } : {}),
    };
    if (Object.keys(entry).length) out[slot] = entry;
  }
  return out;
}

/**
 * Build the schema.
 *
 * The recipes module is INJECTED rather than imported here, because its two callers can
 * reach the recipes by different routes and both are correct. The build script runs
 * under plain node after tsc and loads `dist/recipes/index.js`; the gate runs under
 * vitest and loads the TypeScript source directly. Hard-coding the dist path would drag
 * `test` into depending on the package's own `build`, which root turbo.json
 * deliberately avoids (`test.dependsOn: ["^build"]` — upstream only) so a test loop
 * never waits on a compile.
 *
 * @param {object} recipesModule the `@auxiliary/css/recipes` barrel
 */
export async function buildComponentSchema(recipesModule) {
  const { figmaNative, tokensCss } = loadTokensDist();
  const { index } = buildIndex(figmaNative, tokensCss);
  const redirects = themeRedirects(readFileSync(resolve(cssRoot, 'theme.css'), 'utf8'));

  {
    const mod = recipesModule ?? (await import(resolve(cssRoot, 'dist/recipes/index.js')));
    const recipes = Object.entries(mod)
      .filter(([, v]) => typeof v === 'function' && Array.isArray(v.variantKeys))
      .sort(([a], [b]) => a.localeCompare(b));

    // Pass 1 — every class any recipe can produce, so Tailwind compiles once.
    const plans = recipes.map(([name, recipe]) => {
      const space = Object.fromEntries(
        recipe.variantKeys.map((k) => [k, variantValues(recipe.variants[k])]),
      );
      return { name, recipe, rows: combinations(space).map((props) => ({ props, slots: slotClasses(recipe, props) })) };
    });
    const candidates = plans.flatMap((p) =>
      p.rows.flatMap((r) =>
        Object.values(r.slots).flatMap((cls) => cls.split(/\s+/).filter(Boolean).map((c) => splitVariant(c).base)),
      ),
    );
    const resolveClass = await createResolver(candidates);

    // Pass 2 — resolve each class to declarations and each var to its Figma variable.
    const dropped = [];
    const unresolved = [];
    const seenDead = new Set();

    /** One slot's class string -> { rest: {...}, states: { hover: {...} } }. */
    function describe(component, slot, classString) {
      const buckets = new Map(); // state -> Map(property -> entry)
      for (const cls of classString.split(/\s+/).filter(Boolean)) {
        const { state, base } = splitVariant(cls);
        const block = resolveClass(base);
        if (block === null) {
          if (!DEAD_CLASSES.has(base)) dropped.push(`${component}.${slot}: ${cls}`);
          else seenDead.add(base);
          continue;
        }
        const bucket = buckets.get(state) ?? new Map();
        buckets.set(state, bucket);
        for (const [property, value] of propertiesOf(block)) {
          const refs = [];
          let tokenBacked = false;
          for (const name of varRefs(value)) {
            if (nonVariableReason(name)) continue;
            const { binding, via, terminal } = resolveVar(index, redirects, name);
            if (!binding) {
              // A redirect can legitimately land on something unrepresentable, so the
              // allowlist is checked at the END of the chain as well as the start.
              if (!nonVariableReason(terminal)) {
                unresolved.push(
                  `${component}.${slot} ${property}: ${name}` +
                    (via.length ? ` (via ${via.join(' -> ')})` : ''),
                );
              }
              continue;
            }
            tokenBacked = true;
            refs.push({
              var: name,
              figma: binding.figma,
              ...(binding.mode ? { mode: binding.mode } : {}),
              ...(via.length ? { via } : {}),
            });
          }
          if (!tokenBacked && !LAYOUT_PROPS.has(property)) continue;
          bucket.set(property, leaf(value, refs, alphaOf(value)));
        }
      }
      /**
       * Tailwind sets a `--tw-*` companion alongside some real properties
       * (`font-weight` also writes `--tw-font-weight`). Where the two carry the same
       * binding the companion says nothing; where they don't — `--tw-ring-color` is the
       * ONLY place the ring's token appears, since `box-shadow` merely references it —
       * it is the binding and must stay.
       */
      const dedupeTw = (m) => {
        const real = new Set(
          [...m].filter(([p]) => !p.startsWith('--tw-')).map(([, e]) => JSON.stringify(e)),
        );
        return new Map([...m].filter(([p, e]) => !p.startsWith('--tw-') || !real.has(JSON.stringify(e))));
      };
      const asObject = (m) =>
        Object.fromEntries([...dedupeTw(m)].sort(([a], [b]) => a.localeCompare(b)));
      // '' is the resting state; every other key is a Tailwind variant prefix.
      return Object.fromEntries([...buckets].sort().map(([s, m]) => [s, asObject(m)]));
    }

    const schema = {};
    for (const { name, recipe, rows } of plans) {
      const described = rows.map(({ props, slots }) => ({
        props,
        slots: Object.fromEntries(
          Object.entries(slots).map(([slot, cls]) => [slot, describe(name, slot, cls)]),
        ),
      }));
      const { common, deltas } = factorCommon(described);
      schema[name] = {
        api: Object.fromEntries(
          recipe.variantKeys.map((k) => [k, variantValues(recipe.variants[k])]),
        ),
        defaults: recipe.defaultVariants ?? {},
        slots: slotNames(recipe).length ? slotNames(recipe) : ['root'],
        common: shape(common),
        matrix: described.map((row, i) => ({ props: row.props, slots: shape(deltas[i]) })),
      };
    }

    if (dropped.length) {
      throw new Error(
        'component-schema: Tailwind generated no CSS for these classes — they render as ' +
          'nothing and would be silently absent from the schema:\n  ' +
          [...new Set(dropped)].join('\n  '),
      );
    }
    if (unresolved.length) {
      throw new Error(
        'component-schema: these var() references resolve to no token, so the binding ' +
          'cannot be expressed in Figma:\n  ' +
          [...new Set(unresolved)].join('\n  ') +
          '\nAdd the token, follow it through theme.css, or declare it in ' +
          'scripts/figma-index.mjs NON_VARIABLE with a reason.',
      );
    }
    const stale = [...DEAD_CLASSES].filter((c) => !seenDead.has(c));
    if (stale.length) {
      throw new Error(
        'component-schema: these DEAD_CLASSES entries no longer appear in any recipe, or ' +
          'now resolve. The list is a ratchet — delete them:\n  ' +
          stale.join('\n  '),
      );
    }
    return schema;
  }
}

/** True when this module was run directly, rather than imported by the gate. */
const isEntry = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isEntry) {
  const schema = await buildComponentSchema();
  writeFileSync(OUT_FILE, JSON.stringify(schema, null, 2) + '\n');
  const components = Object.keys(schema).length;
  const rows = Object.values(schema).reduce((n, c) => n + c.matrix.length, 0);
  console.log(`✓ component-schema.json — ${components} components, ${rows} variant rows`);
}
