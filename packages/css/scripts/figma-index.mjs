/**
 * CSS custom property  ->  Figma variable.
 *
 * The component schema records bindings as token paths, not class strings. Getting from
 * one to the other needs exactly two hops: Tailwind resolves a class to a declaration
 * containing `var(--x)` (the real compiler does that — see build-schema.mjs), and this
 * module resolves `--x` back to the Figma variable that carries it.
 *
 * There is no hand-written mapping table here, and that is the point. Emitted CSS names
 * ARE the Figma variable paths with `/` -> `-` and the GTC tier stripped, because both
 * come out of the same emitter (`packages/tokens/build.mjs`: `cssVarName` for CSS,
 * `t.path.slice(1).join('/')` for Figma). So the index is derived from
 * `dist/figma-native.json` by replaying that naming rule per tier. A table would be a
 * second source of truth and would drift the first time a token was added.
 *
 * The three tiers, and why each names differently:
 *
 *   Global      spacing/4        -> --spacing-4          (tier stripped, one mode)
 *   Theme       primary          -> --primary            (tier stripped, 4 theme modes)
 *   Component   button/radius    -> --component-button-radius
 *               button/height    -> --component-button-height-{sm,md,lg}
 *
 * The Component tier is the interesting one. Its size axis is a Figma *mode*, but CSS
 * has no modes, so the emitter expands it into one suffixed variable per size. Recovering
 * the mode is what lets a generated Figma component set bind `height` ONCE and switch
 * modes per size variant, instead of binding three unrelated variables.
 *
 * **Direction matters.** This maps Figma name -> CSS name and never the reverse, because
 * the reverse is ambiguous: `--component-button-padding-x` could split as
 * `button/padding-x` or `button/padding/x`, and nothing in the string says which. Going
 * forward and checking the result against the variables `tokens.css` actually declares
 * is exact, and gives a free totality check — a Figma variable whose CSS name is not
 * declared anywhere means the two emitters have diverged.
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

/** Figma modes of the Component collection — the component tier's size axis. */
export const SIZE_MODES = ['sm', 'md', 'lg'];

/**
 * `_` is the token source's DTCG-safe stand-in for a decimal point, and it emits as an
 * ESCAPED dot because that is what Tailwind looks up (`--spacing-2\.5` for `px-2.5`).
 * Mirrors `kebabSegment` in packages/tokens/build.mjs — if that changes, this must too,
 * and the totality check below fails loudly rather than silently losing five rungs.
 */
const toCssSegment = (s) => String(s).replace(/_/g, '\\.');
const cssNameFor = (figmaPath, prefix = '') =>
  '--' + prefix + figmaPath.split('/').map(toCssSegment).join('-');

/**
 * CSS vars that legitimately resolve to NO Figma variable. Each needs a reason — this is
 * an allowlist, and an allowlist without reasons becomes a place to hide failures.
 *
 * Tailwind's per-size pairing vars are the whole list. `text-sm` emits
 * `font-size: var(--text-sm); line-height: var(--text-sm--line-height)`. The size half
 * IS a variable (`Global/text/sm`); the line-height half is not, and deliberately so:
 * the token source models it as a sibling group (`text-leading/*`) that the Figma export
 * filters out, because Figma carries line height on the Text Style, not as a FLOAT
 * variable. Recording it as a literal is the truthful answer; inventing a variable for
 * it would put a number in Figma that nothing in code reads.
 */
const NON_VARIABLE = [
  { re: /^--text-[\w\\.]+--line-height$/, why: 'line height rides on the Figma Text Style' },
  { re: /^--text-[\w\\.]+--letter-spacing$/, why: 'letter spacing rides on the Figma Text Style' },
  // Tailwind's own machinery: --tw-ring-shadow, --tw-leading, --tw-font-weight and
  // friends are plumbing between utilities, always fed from a real token upstream
  // (`ring-ring` sets --tw-ring-color: var(--ring)). They describe how Tailwind
  // composes a property, not what the design says.
  { re: /^--tw-/, why: 'Tailwind-internal plumbing, fed from a token upstream' },
  // Reka UI measures the trigger at runtime and writes the width onto the content
  // element, so the popup can match it. There is no design value to tokenise — the
  // number is whatever the trigger happened to be.
  { re: /^--reka-/, why: 'measured by Reka UI at runtime, not a design value' },
  // Named animations — Tailwind's built-ins (`animate-spin`, `animate-pulse`) and ours
  // (`--animate-fade-in`, `--animate-accordion-down`, defined in theme.css). Ours are
  // built FROM tokens (duration + easing through var(), so they follow the register),
  // but the composite itself has no Figma Variable type to bind to, the same way a
  // cubic-bezier does not.
  { re: /^--animate-/, why: 'a keyframe composite has no Figma Variable type' },
  // Easings ARE tokens (global.ease.*) but deliberately not Figma Variables: a
  // cubic-bezier has no representable Variable type, so the tokens build skips
  // $type "cubicBezier" outright and easings stay documentation. Reached via the
  // --default-transition-timing-function redirect in theme.css.
  { re: /^--ease-/, why: 'cubic-bezier has no Figma Variable type; easings stay documentation' },
];

/** @typedef {{ figma: string, collection: string, path: string, type: string, mode: string|null }} Binding */

/** Every custom property `tokens.css` declares, escapes and all (`--spacing-2\.5`). */
export function declaredCssVars(tokensCss) {
  return new Set([...tokensCss.matchAll(/(--[\w\\.-]+)\s*:/g)].map((m) => m[1]));
}

/**
 * Build the `--css-var` -> Binding index.
 *
 * @param {object} figmaNative parsed dist/figma-native.json
 * @param {string} tokensCss   contents of dist/tokens.css
 * @returns {{ index: Map<string, Binding>, unemitted: string[] }}
 *   `unemitted` lists Figma variables whose CSS counterpart is not declared — a
 *   divergence between the two emitters, surfaced rather than swallowed.
 */
export function buildIndex(figmaNative, tokensCss) {
  const declared = declaredCssVars(tokensCss);
  /** @type {Map<string, Binding>} */
  const index = new Map();
  /** @type {string[]} */
  const unemitted = [];

  const put = (cssVar, binding) => {
    const existing = index.get(cssVar);
    // A collision means two tiers claim one CSS var — the exact failure the component
    // tier's un-stripped `component/` prefix exists to prevent. Never resolve silently.
    if (existing && existing.figma !== binding.figma) {
      throw new Error(
        `figma-index: ${cssVar} is claimed by both ${existing.figma} and ${binding.figma}. ` +
          'Two tiers cannot emit the same CSS variable.',
      );
    }
    index.set(cssVar, binding);
  };

  for (const coll of figmaNative.collections) {
    const isComponent = coll.name === 'Component';
    for (const v of coll.variables) {
      const base = { collection: coll.name, path: v.name, type: v.type };
      const figma = `${coll.name}/${v.name}`;
      const stem = cssNameFor(v.name, isComponent ? 'component-' : '');

      if (!isComponent) {
        if (declared.has(stem)) put(stem, { ...base, figma, mode: null });
        else unemitted.push(figma);
        continue;
      }

      // Two shapes are possible and only the declared set can say which: a size-less
      // token emits one var, a sized one emits three. Checking beats inferring from
      // values — three sizes that happen to share a value are still three variables.
      if (declared.has(stem)) {
        put(stem, { ...base, figma, mode: null });
        continue;
      }
      const sized = SIZE_MODES.filter((m) => declared.has(`${stem}-${m}`));
      if (sized.length === 0) {
        unemitted.push(figma);
        continue;
      }
      for (const m of sized) put(`${stem}-${m}`, { ...base, figma, mode: m });
    }
  }
  return { index, unemitted };
}

/** Why a var has no Figma variable, or null if it should have had one. */
export function nonVariableReason(cssVar) {
  return NON_VARIABLE.find((e) => e.re.test(cssVar))?.why ?? null;
}

/**
 * Pure redirects declared in `theme.css` — `--a: var(--b);` and nothing else.
 *
 * `theme.css` bridges Tailwind's namespaces onto ours: `--default-transition-duration:
 * var(--duration-base)` makes `transition-colors` inherit the motion token. Following
 * the redirect resolves the binding to `Global/duration/base` instead of reporting a
 * missing token, which is both true and more useful. Only single-var declarations
 * qualify — anything with a literal or a second term is a value, not an alias.
 */
export function themeRedirects(themeCss) {
  const out = new Map();
  for (const m of themeCss.matchAll(/(--[\w\\.-]+)\s*:\s*var\((--[\w\\.-]+)\)\s*;/g)) {
    out.set(m[1], m[2]);
  }
  return out;
}

/**
 * Follow redirects to the variable that actually carries the value.
 *
 * `terminal` is where the chain stopped — needed because a redirect can land on
 * something legitimately non-variable (`--default-transition-timing-function` →
 * `--ease-out`, and a cubic-bezier has no Figma Variable type). Callers must test the
 * terminal against `nonVariableReason`, not just the name they started with.
 *
 * @returns {{ binding: Binding|null, via: string[], terminal: string }}
 */
export function resolveVar(index, redirects, cssVar) {
  const via = [];
  let name = cssVar;
  // Bounded by the chain length so a hand-edited cycle in theme.css cannot hang a build.
  for (let hop = 0; hop <= redirects.size; hop++) {
    const binding = index.get(name);
    if (binding) return { binding, via, terminal: name };
    const next = redirects.get(name);
    if (!next || via.includes(next)) break;
    via.push(next);
    name = next;
  }
  return { binding: null, via, terminal: name };
}

/** Load the tokens build output this index is derived from. */
export function loadTokensDist() {
  const nativePath = require.resolve('@auxiliary/tokens/dist/figma-native.json');
  const cssPath = require.resolve('@auxiliary/tokens/dist/tokens.css');
  return {
    figmaNative: JSON.parse(readFileSync(nativePath, 'utf8')),
    tokensCss: readFileSync(cssPath, 'utf8'),
  };
}
