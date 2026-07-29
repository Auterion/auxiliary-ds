/**
 * GTC token-model validator.
 *
 * Enforces the Global/Theme/Component model from https://buninux.com/design-tokens
 * (rulebook: https://github.com/bunind/gtc-tokens) against Auxiliary's token source.
 *
 * WHY THIS IS A SEPARATE MODULE AND NOT MORE `assertX()` IN build.mjs
 * ------------------------------------------------------------------
 * The four existing build assertions run against a *hydrated Style Dictionary
 * dictionary*. SD resolves aliases before you ever see them, which means:
 *   - a dangling `{ref}` makes SD throw first, with a message that doesn't name
 *     the offending token path;
 *   - a reference *cycle* makes SD hang or blow the stack before any assert runs.
 * The GTC ruleset fundamentally needs the raw merged authored tree — a different
 * data source, so a different module. `build.mjs` calls `assertGtc()` BEFORE
 * `sd.getPlatformTokens()` so those two failure modes become legible errors.
 *
 * WHAT THIS CANNOT CHECK — stated plainly, because a validator that overclaims
 * is worse than one that scopes itself:
 *   1. Classifier-vs-Identifier ordering. Both are OPEN vocabularies by GTC's own
 *      definition ("Classifier: alternative variant"; "Identifier: distinguishing
 *      tag or property"). In `theme.button.primary.alpha.hover` nothing in the
 *      string distinguishes `primary` (Classifier) from `alpha` (Identifier) —
 *      swap them and no algorithm can tell. Enforcing it would need a
 *      hand-maintained per-Element vocabulary whose upkeep exceeds the defects it
 *      catches. Deliberately not attempted; do NOT fake it with a heuristic.
 *   2. GTC rule 1, "why before where." A semantic judgement about intent.
 *   3. GTC's "use the minimum number of levels." Ambiguity is not computable.
 *      `depth-budget` is a crude ceiling, not this rule.
 *
 * DELIBERATE DIVERGENCES from canonical GTC (documented in
 * apps/docs/foundations/tokens.md — do not "fix" these):
 *   - Four groups, not three. `register.*` is a second orthogonal non-colour axis
 *     ([data-register] density/motion) that GTC does not model.
 *   - `global-self-contained` replaces GTC's `global-is-source`. GTC says Global
 *     aliases nothing. Auxiliary's global tier carries a role-alias layer
 *     (`text.caption -> {text.xs}`), the `size.icon.*` group, and 14 `type/*`
 *     typography composites — 83 intra-tier refs. Those don't violate what GTC's
 *     rule protects (a Global tier that is self-contained and acyclic), so the
 *     rule is narrowed to "global may not alias OUTSIDE global" rather than dropped.
 *   - `factual-scale-keys` uses a base-4 variant for spacing: GTC says numeric key
 *     N means "Npx"; Auxiliary's spacing keys are Tailwind step indices on a 4px
 *     base (`spacing.4` = 16px). Still factual — computable from the key without
 *     lookup — which is the property GTC's rule actually protects.
 *   - Role keys (`radius.sm`, `leading.tight`, `z.modal`) are outside the factual-key
 *     rule in canonical GTC too; it is scoped to numeric keys only.
 */

import { globSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));

export const THEMES = ['light', 'dark', 'sunlight', 'darknight'];
export const REGISTERS = ['expressive', 'operational'];
/** Size vocabularies a component token family may use. Must be complete, never partial. */
export const SIZE_VOCABULARIES = [
  ['sm', 'md', 'lg'],
  ['xs', 'sm', 'md', 'lg', 'xl'],
];

/** Interaction states. GTC: State is ALWAYS the terminal level. */
const STATES = new Set([
  'hover', 'active', 'pressed', 'focus', 'focus-visible',
  'disabled', 'selected', 'checked', 'open', 'visited',
]);

/**
 * A level is either a lowercase-kebab word (`card-foreground`, `spacing-gap`), or a
 * factual numeric scale key. GTC's own scales are numeric (`base.0`, `size-unit.12`,
 * `blue.3`) — the key IS the value — so digits are a first-class level, not an
 * exception. `N_M` is a half-step: DTCG object keys can't hold a ".", so `spacing.2_5`
 * is authored with "_" and kebabed at CSS emission to `--spacing-2-5`.
 */
const LEVEL_RE = /^([a-z][a-z0-9]*(-[a-z0-9]+)*|\d+(_\d+)?)$/;

/** Segments that are neither kebab nor numeric. Every entry needs a reason. */
const KEBAB_EXEMPT = new Set([
  // Tailwind's size ladder leads with a digit but isn't a numeric scale key.
  '2xs', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl', '10xl',
  // Style Dictionary's convention for a group's own default value.
  'DEFAULT',
]);

const isAliasString = (v) => typeof v === 'string' && v.startsWith('{') && v.endsWith('}');
const stripBraces = (v) => v.slice(1, -1);

/** Every `{ref}` inside a token's raw value, including typography composite fields. */
const refsOf = (raw) => {
  const out = [];
  const walk = (v) => {
    if (isAliasString(v)) out.push(stripBraces(v));
    else if (Array.isArray(v)) v.forEach(walk);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  walk(raw);
  return out;
};

/** Deep-merge source files into one tree. Merge order is irrelevant by design. */
const mergeInto = (target, src) => {
  for (const [k, v] of Object.entries(src)) {
    if (v && typeof v === 'object' && !Array.isArray(v) && !('$value' in v)) {
      target[k] ??= {};
      mergeInto(target[k], v);
    } else {
      target[k] = v;
    }
  }
  return target;
};

/** Read and merge every `src/**\/*.tokens.json` under `root`. */
export function loadSource(root = HERE) {
  const files = globSync('src/**/*.tokens.json', { cwd: root }).sort();
  if (files.length === 0) throw new Error(`gtc-validate: no token files under ${root}/src`);
  const tree = {};
  const origin = new Map(); // dotted path prefix -> file, for error messages
  for (const rel of files) {
    const json = JSON.parse(readFileSync(resolve(root, rel), 'utf8'));
    mergeInto(tree, json);
    origin.set(rel, json);
  }
  return { tree, files };
}

/**
 * Map a raw top-level key to a GTC group.
 *
 * Handles BOTH layouts so the validator can run before and after the tier rename:
 *   - GTC:    global.* / theme.<mode>.* / component.* / operational.*
 *   - legacy: <scale>.* / <mode>.* / operational.*   (no group prefix)
 */
export const groupOfSegments = (seg) => {
  const head = seg[0];
  if (head === 'global') return 'global';
  if (head === 'component') return 'component';
  if (head === 'register') return 'register';
  if (REGISTERS.includes(head)) return 'register';
  if (head === 'theme') return 'theme';
  if (THEMES.includes(head)) return 'theme'; // legacy: light.background
  return 'global'; // legacy: spacing.4, radius.md, …
};

/** True once the source has been migrated to explicit GTC group prefixes. */
export const isGtcLayout = (tree) => Object.hasOwn(tree, 'global');

/** Flatten the merged tree into token records. A node is a token iff it has $value. */
export function collectTokens(tree) {
  const out = [];
  const walk = (node, seg) => {
    if (node && typeof node === 'object' && '$value' in node) {
      out.push({
        path: seg.join('.'),
        seg,
        group: groupOfSegments(seg),
        type: node.$type,
        raw: node.$value,
        refs: refsOf(node.$value),
      });
      return;
    }
    if (!node || typeof node !== 'object') return;
    for (const [k, v] of Object.entries(node)) {
      if (k.startsWith('$')) continue; // $description on a group node
      walk(v, [...seg, k]);
    }
  };
  walk(tree, []);
  return out;
}

/** Component Elements must be real shipped components — parsed from the vue barrel. */
export function shippedComponentNames(repoRoot = resolve(HERE, '../..')) {
  const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  const names = new Set();
  for (const pkg of ['vue', 'viz']) {
    let src;
    try {
      src = readFileSync(resolve(repoRoot, 'packages', pkg, 'src/index.ts'), 'utf8');
    } catch {
      continue;
    }
    // Same shape gen-props.mjs uses, so the two can never disagree.
    for (const m of src.matchAll(/export\s*\{\s*default as (\w+)[^}]*\}\s*from\s*'(\.\/[^']+\.vue)';/g)) {
      names.add(kebab(m[1]));
    }
  }
  return names;
}

/**
 * Validate a token set against the GTC model.
 *
 * @returns {{rule: string, path: string, message: string}[]} findings — never throws.
 */
export function validateGtc(tokens, opts = {}) {
  const { gtcLayout = true, componentNames = null } = opts;
  const findings = [];
  const add = (rule, path, message) => findings.push({ rule, path, message });
  const byPath = new Map(tokens.map((t) => [t.path, t]));

  for (const t of tokens) {
    // R1 — every {alias} resolves. This is the acceptance test for the tier
    // rename: a missed `{color.primitive.x}` -> `{global.color.primitive.x}`
    // rewrite shows up here rather than as an opaque Style Dictionary throw.
    for (const ref of t.refs) {
      if (!byPath.has(ref)) add('alias-resolves', t.path, `-> {${ref}} does not exist`);
    }

    // R2 — global is self-contained (see divergence note in the file header).
    if (t.group === 'global') {
      for (const ref of t.refs) {
        if (groupOfSegments(ref.split('.')) !== 'global') {
          add('global-self-contained', t.path, `-> {${ref}} leaves the global tier`);
        }
      }
    }

    // R3 — theme/component/register never store raw values.
    if (t.group !== 'global') {
      const scalars = t.raw && typeof t.raw === 'object' && !Array.isArray(t.raw)
        ? Object.values(t.raw)
        : [t.raw];
      for (const v of scalars) {
        if (!isAliasString(v)) {
          add('no-raw-outside-global', t.path, `= ${JSON.stringify(v)} (must alias a global token)`);
        }
      }
    }

    // R5 — the component tier is colour-free. Colour is the theme axis's exclusive
    // property; a component colour would be invisible to the per-theme contrast,
    // CVD and blue-energy gates and would not re-resolve under [data-theme].
    if (t.group === 'component' && t.type === 'color') {
      add('no-component-color', t.path, 'is a color (component tier is structural only)');
    }

    // R7 — axis orthogonality: theme is colour-only, register/component never colour.
    if (t.group === 'theme' && t.type !== 'color') {
      add('axis-orthogonality', t.path, `is ${t.type} (theme is color-only)`);
    }
    if (t.group === 'register' && t.type === 'color') {
      add('axis-orthogonality', t.path, 'is a color (register never touches color)');
    }

    // Naming — a dot separates levels, a hyphen joins words inside one level.
    for (const s of t.seg) {
      if (!KEBAB_EXEMPT.has(s) && !LEVEL_RE.test(s)) {
        add('kebab-levels', t.path, `segment "${s}" is not a lowercase-kebab level`);
      }
    }

    // GTC: State is always last.
    for (let i = 0; i < t.seg.length - 1; i++) {
      if (STATES.has(t.seg[i])) {
        add('state-terminal', t.path, `state "${t.seg[i]}" must be the final level`);
      }
    }

    // R6 — factual numeric scale keys (base-4 variant for spacing; see header).
    const msg = factualScaleKey(t);
    if (msg) add('factual-scale-keys', t.path, msg);

    if (gtcLayout) {
      // GTC rule 2 — every name starts with a Group.
      if (!['global', 'theme', 'component', 'register'].includes(t.seg[0]) && !REGISTERS.includes(t.seg[0])) {
        add('group-first', t.path, `"${t.seg[0]}" is not a GTC group`);
      }
      if (t.group === 'theme' && t.seg[0] === 'theme' && !THEMES.includes(t.seg[1])) {
        add('group-first', t.path, `"theme" must be followed by one of ${THEMES.join('|')}`);
      }
      // Never lead with a value.
      if (t.group !== 'global' && /^\d/.test(t.seg[1] ?? '')) {
        add('no-value-lead', t.path, `level "${t.seg[1]}" leads with a digit`);
      }
    }

    // Element must name a real shipped component — this is what mechanically
    // enforces GTC rule 3 ("design role, not screen"): you cannot name a token
    // `sidebar` or `login` because there is no such component export.
    if (componentNames && t.group === 'component' && t.seg[0] === 'component') {
      const el = t.seg[1];
      if (el && !componentNames.has(el)) {
        add('component-element-known', t.path, `"${el}" is not a shipped component`);
      }
    }
  }

  // R4 — no reference cycles. Must run before SD hydration; SD's resolver is what
  // would otherwise blow the stack.
  findings.push(...findCycles(tokens, byPath));

  // R8 — component size families must be complete. Since $extensions.mode is not
  // adopted, size is a path segment, so GTC's "one value per mode, all modes
  // present" guarantee would otherwise be silently lost: a missing `lg` emits no
  // --component-x-lg and the recipe's lg variant references an undeclared var.
  findings.push(...checkSizeParity(tokens));

  return findings;
}

/** GTC: the key IS the value, so an agent never has to guess. */
function factualScaleKey(t) {
  if (t.group !== 'global' || t.type !== 'dimension') return null;
  if (isAliasString(t.raw)) return null;
  const key = t.seg.at(-1);
  const spacing = t.seg.includes('spacing');
  if (spacing) {
    const m = key.match(/^(\d+)(?:_(\d+))?$/);
    if (!m) return null; // named rung — out of scope
    const steps = Number(m[1]) + (m[2] ? Number(`0.${m[2]}`) : 0);
    const want = `${steps * 4}px`;
    return t.raw === want ? null : `expected "${want}" for base-4 step key ${key}, got ${JSON.stringify(t.raw)}`;
  }
  if (!/^\d+$/.test(key)) return null; // role key — out of scope
  return t.raw === `${key}px` ? null : `expected "${key}px", got ${JSON.stringify(t.raw)}`;
}

/** Iterative DFS with white/grey/black colouring. */
function findCycles(tokens, byPath) {
  const findings = [];
  const state = new Map(); // path -> 'grey' | 'black'
  for (const t of tokens) {
    if (state.get(t.path)) continue;
    const stack = [{ node: t, i: 0, trail: [t.path] }];
    state.set(t.path, 'grey');
    while (stack.length) {
      const frame = stack.at(-1);
      if (frame.i >= frame.node.refs.length) {
        state.set(frame.node.path, 'black');
        stack.pop();
        continue;
      }
      const ref = frame.node.refs[frame.i++];
      const next = byPath.get(ref);
      if (!next) continue; // reported by alias-resolves
      if (state.get(ref) === 'grey') {
        findings.push({
          rule: 'no-cycles',
          path: next.path,
          message: `reference cycle: ${[...frame.trail, ref].join(' -> ')}`,
        });
        continue;
      }
      if (state.get(ref) === 'black') continue;
      state.set(ref, 'grey');
      stack.push({ node: next, i: 0, trail: [...frame.trail, ref] });
    }
  }
  return findings;
}

/**
 * Every size-bearing property of a component must declare the SAME size set.
 *
 * Not "must match a fixed sm/md/lg vocabulary" — Badge and StatusBadge genuinely
 * ship two sizes, and forcing a third would invent a rung the design doesn't have.
 * The defect worth catching is INTERNAL inconsistency: if `padding-x` has an `lg`
 * and `height` doesn't, the lg variant renders with no height var and falls back to
 * nothing. Comparing each property against its own component's union catches that
 * while leaving the size count a design decision.
 */
function checkSizeParity(tokens) {
  const allSizes = new Set(SIZE_VOCABULARIES.flat());
  const perComponent = new Map(); // component -> Map(family -> Set(size))
  for (const t of tokens) {
    if (t.group !== 'component') continue;
    const leaf = t.seg.at(-1);
    if (!allSizes.has(leaf)) continue;
    const component = t.seg.slice(0, 2).join('.');
    const family = t.seg.slice(0, -1).join('.');
    if (!perComponent.has(component)) perComponent.set(component, new Map());
    const families = perComponent.get(component);
    if (!families.has(family)) families.set(family, new Set());
    families.get(family).add(leaf);
  }
  const findings = [];
  for (const [component, families] of perComponent) {
    const union = new Set();
    for (const sizes of families.values()) for (const s of sizes) union.add(s);
    for (const [family, sizes] of families) {
      const missing = [...union].filter((s) => !sizes.has(s));
      if (missing.length) {
        findings.push({
          rule: 'size-suffix-parity',
          path: family,
          message: `missing size(s) ${missing.join(', ')} — ${component} declares {${[...union].join(', ')}} elsewhere`,
        });
      }
    }
  }
  return findings;
}

/** Convenience for build.mjs — throws a formatted Error when findings exist. */
export function assertGtc(root = HERE) {
  const { tree } = loadSource(root);
  const tokens = collectTokens(tree);
  const findings = validateGtc(tokens, {
    gtcLayout: isGtcLayout(tree),
    componentNames: shippedComponentNames(),
  });
  if (findings.length === 0) return;
  const byRule = new Map();
  for (const f of findings) {
    if (!byRule.has(f.rule)) byRule.set(f.rule, []);
    byRule.get(f.rule).push(`    ${f.path}: ${f.message}`);
  }
  const body = [...byRule]
    .map(([rule, lines]) => `  [${rule}] ${lines.length} finding(s)\n${lines.join('\n')}`)
    .join('\n');
  throw new Error(`GTC model check failed — ${findings.length} finding(s):\n${body}`);
}

// CLI: `node gtc-validate.mjs`
if (process.argv[1] && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))) {
  try {
    assertGtc();
    const { tree, files } = loadSource();
    const n = collectTokens(tree).length;
    console.log(`✔ GTC model check passed — ${n} tokens across ${files.length} files (${isGtcLayout(tree) ? 'GTC' : 'legacy'} layout)`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}
