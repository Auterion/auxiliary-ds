/**
 * Resolve a Tailwind class to the CSS declarations it actually generates.
 *
 * Uses the real Tailwind compiler against the real `theme.css`, which makes Tailwind
 * itself the authority for "what does `bg-primary` mean". The alternative — a
 * hand-written class -> token table — is a second source of truth that drifts the first
 * time someone adds a utility, and drifts silently, because a class Tailwind cannot
 * match is DROPPED with no error (see the header of test/tailwind-resolution.test.ts).
 *
 * Compile once, resolve many: creating the compiler is the expensive part, so callers
 * pass every candidate class up front and then look rules up from the built stylesheet.
 */
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
export const cssRoot = resolvePath(here, '..');
const require = createRequire(resolvePath(cssRoot, 'package.json'));

/**
 * A class may carry variant prefixes (`hover:`, `focus-visible:`, `data-[state=open]:`,
 * `[&_svg]:`). Split at the last TOP-LEVEL colon: everything before is the condition,
 * after is the utility.
 *
 * Depth tracking is load-bearing, not defensive. `[appearance:textfield]` is a single
 * utility with a colon inside it; a naive `lastIndexOf(':')` splits it into the state
 * `[appearance` and the class `textfield]`, which resolves to nothing — and "resolves to
 * nothing" is indistinguishable from a genuinely dropped class.
 */
export function splitVariant(cls) {
  let depth = 0;
  let cut = -1;
  for (let i = 0; i < cls.length; i++) {
    const c = cls[i];
    if (c === '[' || c === '(') depth++;
    else if (c === ']' || c === ')') depth--;
    else if (c === ':' && depth === 0) cut = i;
  }
  return cut === -1
    ? { state: '', base: cls }
    : { state: cls.slice(0, cut), base: cls.slice(cut + 1) };
}

const escapeSelector = (c) => '.' + c.replace(/([.[\]/(){}!:#%,'"+*~^$|?<>=&@`\\])/g, '\\$1');

/**
 * Look up the declaration block Tailwind generated for a class.
 *
 * Kept identical in behaviour to test/tailwind-resolution.test.ts's `ruleFor` so the
 * gate and the emitter can never disagree about whether a class resolved.
 */
export function ruleFor(css, cls) {
  const sel = escapeSelector(cls);
  for (const marker of [`${sel} {`, `${sel}{`, `${sel},`]) {
    const i = css.indexOf(marker);
    if (i < 0) continue;
    const open = css.indexOf('{', i);
    if (open < 0) continue;
    const close = css.indexOf('}', open);
    return css.slice(open + 1, close).replace(/\s+/g, ' ').trim();
  }
  return null;
}

/** `background-color: var(--primary)` -> [{ property, value }] */
export function declarations(block) {
  return block
    .split(';')
    .map((d) => d.trim())
    .filter(Boolean)
    .map((d) => {
      const i = d.indexOf(':');
      return i === -1 ? null : { property: d.slice(0, i).trim(), value: d.slice(i + 1).trim() };
    })
    .filter(Boolean);
}

/** Every `var(--x)` name in a declaration value, in source order, deduplicated. */
export function varRefs(value) {
  return [...new Set([...value.matchAll(/var\((--[\w\\.-]+)/g)].map((m) => m[1]))];
}

/**
 * Compile `theme.css` against a candidate class set.
 *
 * @param {string[]} candidates every class that will be looked up
 * @returns {Promise<(cls: string) => string|null>} class -> declaration block, or null
 *   when Tailwind produced nothing (the silent-drop failure mode).
 */
export async function createResolver(candidates) {
  const { compile } = require('tailwindcss');
  const loadStylesheet = async (id, base) => {
    const path =
      id === 'tailwindcss'
        ? require.resolve('tailwindcss/index.css')
        : id.startsWith('.')
          ? resolvePath(base, id)
          : require.resolve(id);
    return { path, base: dirname(path), content: readFileSync(path, 'utf8') };
  };
  const compiler = await compile(readFileSync(resolvePath(cssRoot, 'theme.css'), 'utf8'), {
    base: cssRoot,
    loadStylesheet,
    loadModule: async () => {
      throw new Error('tailwind-resolve: no plugins expected in theme.css');
    },
  });
  const css = compiler.build([...new Set(candidates)]);
  return (cls) => ruleFor(css, cls);
}
