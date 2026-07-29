/**
 * Tailwind resolution gate — the answer to "an unmatched utility class fails silently."
 *
 * `theme.css` has `@source "./recipes/**\/*.ts"`, so Tailwind scans recipe files as
 * literal text. A class it cannot match is simply DROPPED: no error, no warning, no
 * missing-import diagnostic — the component just renders without that property. That
 * is the single most dangerous failure mode in the recipe layer, and the reason the
 * component-token migration needs a mechanical net rather than review discipline.
 *
 * This suite compiles the real `theme.css` against the real recipe class set and
 * asserts three things:
 *   1. every structural utility a recipe uses actually produces a rule;
 *   2. no structural declaration falls back to Tailwind's own `--spacing` multiplier
 *      instead of one of our named scale tokens;
 *   3. no structural declaration is a bare length literal.
 *
 * (2) and (3) carry a KNOWN_ESCAPES allowlist seeded with the escapes that exist
 * today. It is a RATCHET: entries come out as the component tier lands, never go in.
 * `does not list anything already fixed` keeps it honest.
 */
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';

const cssRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const recipesDir = resolve(cssRoot, 'recipes');
const require = createRequire(resolve(cssRoot, 'package.json'));

/**
 * Utilities whose value should come from a design token, not a literal or a multiplier.
 * A value suffix is required — bare `size`/`p`/`h` are variant KEYS in a tv() object
 * (`size: { sm: … }`), not classes, and must not be treated as dropped utilities.
 * `rounded` and `border` are the two utilities that are legitimately bare.
 */
const STRUCTURAL_RE =
  /^-?(?:(?:p[xytblrse]?|m[xytblrse]?|h|w|size|min-w|max-w|min-h|max-h|gap|gap-x|gap-y|rounded|border|inset|inset-x|inset-y|top|right|bottom|left|translate-x|translate-y)-.+|rounded|border)$/;

/**
 * Escapes present before the component tier landed. Each entry is a class whose
 * generated declaration bypasses the token scales. Remove entries as they are fixed —
 * never add.
 */
/**
 * EMPTY, and that is the point.
 *
 * This list began with every structural value in the recipe layer that bypassed the
 * token scales. It is a ratchet — entries come out as they are fixed, never in — and
 * the component-tier migration retired all of them:
 *   - the fractional rungs (`px-2.5`, `gap-1.5`, `h-3.5`…) were dead tokens; they
 *     bound the moment `--spacing-2-5` was emitted as the escaped `--spacing-2\.5`
 *     that Tailwind actually looks up;
 *   - `h-9` / `w-9` gained a real `spacing.9` rung;
 *   - the seven bare `rounded` sites were a live defect (hardcoded 0.25rem, no var,
 *     immune to the operational register) and now carry component radius tokens;
 *   - the surface widths left Tailwind's `--container-*` scale for `size.container.*`;
 *   - `pl-7` and `translate-x-[18px]` were never measurements at all — both are now
 *     calc() expressions over the tokens they were silently derived from.
 *
 * Adding an entry here is a regression. Fix the token instead.
 */
const KNOWN_ESCAPES = new Set<string>([]);

/**
 * NOT detected by this gate, and deliberately not listed above: `max-w-lg` / `max-w-xs`
 * resolve to `var(--container-lg)` — Tailwind's OWN container scale, which we never
 * define. They are token-shaped, so the literal/multiplier rules cannot see them, but
 * they are still outside our token set. Tracked as the `size.container.*` work in the
 * component-tier phase rather than allowlisted here, so this list stays a ratchet with
 * one meaning.
 */

/**
 * Whitespace-separated tokens from every string literal in a source file, skipping
 * comments.
 *
 * A plain "match every quoted run" regex is NOT safe here: an apostrophe in a prose
 * comment ("the model's vocabulary") opens a phantom string that swallows everything
 * up to the next apostrophe — which silently removed one entire recipe's classes from
 * this gate. Tracking string/comment state costs a few lines and removes the whole
 * class of blind spot.
 */
function stringTokens(src: string): string[] {
  const out: string[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i];
    if (c === '/' && src[i + 1] === '/') {
      i = src.indexOf('\n', i);
      if (i === -1) break;
    } else if (c === '/' && src[i + 1] === '*') {
      const end = src.indexOf('*/', i + 2);
      i = end === -1 ? src.length : end + 2;
    } else if (c === "'" || c === '"' || c === '`') {
      const quote = c;
      let j = i + 1;
      let body = '';
      while (j < src.length) {
        if (src[j] === '\\') {
          body += src[j + 1] ?? '';
          j += 2;
          continue;
        }
        if (src[j] === quote) break;
        body += src[j];
        j++;
      }
      for (const tok of body.split(/\s+/)) if (tok) out.push(tok);
      i = j + 1;
    } else {
      i++;
    }
  }
  return out;
}

/** Extract candidate class tokens from every recipe file. */
function recipeCandidates(): { all: string[]; structural: string[] } {
  const files = readdirSync(recipesDir).filter((f) => f.endsWith('.ts'));
  const seen = new Set<string>();
  for (const file of files) {
    const src = readFileSync(resolve(recipesDir, file), 'utf8');
    for (const tok of stringTokens(src)) seen.add(tok);
  }
  const all = [...seen];
  // A recipe class may carry variant prefixes (`hover:`, `data-[x]:`, `focus-visible:`).
  // Strip them for the structural test — we care about the utility, not the condition.
  const structural = all
    .map((c) => c.slice(c.lastIndexOf(':') + 1))
    // `px-(--component-button-padding-x-md)` — Tailwind v4's CSS-variable shorthand —
    // IS a structural utility and must be checked. Only skip bracket-arbitrary values
    // that embed a function call (`h-[max(…)]`, `pl-[calc(…)]`), whose composition the
    // token rules below cannot meaningfully evaluate.
    .filter((c) => STRUCTURAL_RE.test(c) && !/\[[^\]]*\(/.test(c));
  return { all, structural: [...new Set(structural)] };
}

/**
 * Utilities the mechanism itself depends on, pinned so the last test can assert them
 * even once no recipe writes them literally any more. Without this, migrating the
 * final `px-4` out of the recipes would make that assertion silently unbuildable.
 */
const PINNED = ['px-4', 'rounded-md', 'h-5', 'text-sm'];

const escapeSelector = (c: string) => '.' + c.replace(/([.[\]/(){}!:#%,'"+*~^$|?<>=&@`\\])/g, '\\$1');

/**
 * Lengths that are legitimately atomic rather than token-derived: zero, the 1px
 * hairline Tailwind hardcodes (there is no --border-width-* namespace), the pill
 * radius, and percentage/auto keywords. ANCHORED at both ends — an unanchored
 * `^0` would silently accept `0.25rem`, which is exactly the bare-`rounded` escape
 * this gate exists to catch.
 */
const ATOMIC_LENGTH = /^(0|0px|1px|100%|auto|9999px)$/;

/** Does this declaration block bypass the token scales? One definition, used by every test. */
function escapesTokens(decl: string): boolean {
  if (/calc\(var\(--spacing\)\s*\*/.test(decl)) return true; // Tailwind's multiplier, not our rung
  return decl
    .split(';')
    .filter(Boolean)
    .some((d) => {
      const value = d.split(':').slice(1).join(':').trim();
      return /^-?[\d.]+(rem|px|em)$/.test(value) && !ATOMIC_LENGTH.test(value);
    });
}

/** class -> the declaration block Tailwind generated for it, or null. */
function ruleFor(css: string, cls: string): string | null {
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

let css = '';
let candidates: { all: string[]; structural: string[] };

beforeAll(async () => {
  const { compile } = require('tailwindcss');
  const loadStylesheet = async (id: string, base: string) => {
    const path =
      id === 'tailwindcss'
        ? require.resolve('tailwindcss/index.css')
        : id.startsWith('.')
          ? resolve(base, id)
          : require.resolve(id);
    return { path, base: dirname(path), content: readFileSync(path, 'utf8') };
  };
  candidates = recipeCandidates();
  // Build the variant-stripped forms too. A recipe may only ever write
  // `data-[state=open]:border-0`; we still want to assert that the underlying
  // `border-0` utility resolves, so it has to be requested as its own candidate.
  const compiler = await compile(readFileSync(resolve(cssRoot, 'theme.css'), 'utf8'), {
    base: cssRoot,
    loadStylesheet,
    loadModule: async () => {
      throw new Error('tailwind-resolution: no plugins expected in theme.css');
    },
  });
  css = compiler.build([
    ...new Set([...candidates.all, ...candidates.structural, ...PINNED]),
  ]);
}, 30_000);

describe('tailwind resolution', () => {
  it('scans a non-trivial recipe class set', () => {
    // Guards against a silent pass: a broken scanner would make every test below vacuous.
    expect(candidates.structural.length).toBeGreaterThan(80);
  });

  it('generates a rule for every structural utility the recipes use', () => {
    const dropped = candidates.structural.filter((c) => ruleFor(css, c) === null);
    expect(dropped, 'these classes produce NO css — Tailwind dropped them silently').toEqual([]);
  });

  it('resolves every structural utility through a token, not a literal or multiplier', () => {
    const offenders = candidates.structural
      .filter((c) => !KNOWN_ESCAPES.has(c))
      .map((c) => [c, ruleFor(css, c) ?? ''] as const)
      .filter(([, decl]) => escapesTokens(decl))
      .map(([c, decl]) => `${c} => ${decl}`);
    expect(offenders, 'these bypass the token scales — add a named rung or a component token').toEqual([]);
  });

  it('does not list anything already fixed in KNOWN_ESCAPES', () => {
    // The allowlist is a ratchet. An entry that no longer escapes must be deleted,
    // or the gate quietly stops protecting that class.
    const stale = [...KNOWN_ESCAPES].filter((c) => {
      const decl = ruleFor(css, c);
      if (decl === null) return false; // no longer used by any recipe — harmless
      return !escapesTokens(decl);
    });
    expect(stale, 'these no longer escape — remove them from KNOWN_ESCAPES').toEqual([]);
  });

  it('resolves the load-bearing utilities to their token vars', () => {
    // Pins the mechanism the component tier depends on: a named scale rung wins,
    // and the register axis reaches the utility through that var.
    expect(ruleFor(css, 'px-4')).toContain('var(--spacing-4)');
    expect(ruleFor(css, 'rounded-md')).toContain('var(--radius-md)');
    expect(ruleFor(css, 'h-5')).toContain('var(--spacing-5)');
    expect(ruleFor(css, 'text-sm')).toContain('var(--text-sm)');
    expect(ruleFor(css, 'text-sm')).toContain('var(--text-sm--line-height)');
  });
});
