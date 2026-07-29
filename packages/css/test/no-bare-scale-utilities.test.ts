import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Component-tier completeness gate.
 *
 * The component tier (`component.*` → `--component-<name>-<part>-<prop>`) exists so
 * that a component's geometry is one named thing that Figma, the docs and the CSS all
 * read from. A bare Tailwind scale utility — `gap-2`, `p-4`, `h-8` — bypasses that:
 * the value is real and renders fine, so nothing fails, but the component now has a
 * measurement that lives only in a class string. It cannot be pushed to Figma, it does
 * not appear in the docs token table, and the next person changing the component's
 * spacing has no way to know it exists.
 *
 * This is not hypothetical. Six sites survived the component-tier migration with a
 * bare gap sitting *on the same line* as a tokenised padding and radius (card footer,
 * dialog, toast viewport, radio-group, alert-manager ×2) — invisible precisely because
 * the line looked tokenised.
 *
 * SCOPE — spacing and sizing only, and only where a scale value is meant.
 *
 * Allowed, deliberately:
 *   - `-0` (`w-0`, `p-0`). Zero is structural, not a scale step; there is no
 *     `spacing.0` to point at and never should be.
 *   - Prefixes outside the spacing/sizing families: `inset-*`, `top/left/right/bottom-*`,
 *     `flex-1`, `z-[1]`, `ring-offset-2`, `underline-offset-2`, `space-*` reversal
 *     utilities. These are layout/stacking mechanics, not measurements the component
 *     tier models.
 *   - Keyword values: `w-full`, `h-full`, `max-h-screen`, `size-sm`. Not numeric.
 *
 * If a real component needs a scale value, the fix is always to add the token to
 * `packages/tokens/src/component/<name>.tokens.json` and consume it with the
 * `gap-(--component-…)` shorthand — never to widen this allowlist.
 */

const recipesDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'recipes');
const recipeFiles = readdirSync(recipesDir).filter(
  (f: string) => f.endsWith('.ts') && f !== 'index.ts' && f !== 'sizes.ts',
);

/** Spacing/sizing families the component tier is responsible for. */
const SCALE_PREFIXES = [
  'p', 'px', 'py', 'pt', 'pb', 'pl', 'pr', 'ps', 'pe',
  'm', 'mx', 'my', 'mt', 'mb', 'ml', 'mr', 'ms', 'me',
  'gap', 'gap-x', 'gap-y', 'space-x', 'space-y',
  'h', 'w', 'size',
];

/**
 * A utility only counts when it STARTS a class — preceded by a quote, whitespace, or a
 * variant colon (`md:gap-4` is an offender). Anything preceded by `-` is the tail of a
 * longer utility name (`min-w-0`, `ring-offset-2`, `underline-offset-2`) and is not.
 *
 * The trailing lookahead rejects fractions (`left-1/2`), arbitrary values and any
 * continuation, so only a plain numeric scale step matches.
 */
const BARE_SCALE = new RegExp(
  String.raw`(?:^|[\s'"\`:])(-?(?:${SCALE_PREFIXES.join('|')})-(\d+(?:\.\d+)?))(?![\w./[-])`,
  'g',
);

/**
 * Blank out comments, preserving line count so reported line numbers stay true.
 *
 * Necessary, not incidental: two recipes carry a comment explaining the value that
 * USED to be there (`the old h-9`, `it was pl-7`). Those comments are the reason the
 * fix is understandable, and a gate that punishes them would get them deleted.
 */
function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, ' '))
    .replace(/\/\/[^\n]*/g, '');
}

/**
 * Every bare non-zero scale utility in `src`. The leading delimiter and any variant
 * prefix are dropped — `md:gap-4` reports as `gap-4`, since the variant is not what
 * makes it an offender.
 *
 * Scanning is scoped to quoted string literals: a recipe's classes only ever live in
 * one, so anything outside is prose or code and cannot be a Tailwind class. Recipes
 * use no template literals (backticks appear only inside comments), so they are
 * deliberately not extracted.
 */
function offendersIn(src: string): { line: number; match: string }[] {
  return stripComments(src)
    .split('\n')
    .flatMap((text, i) => {
      const classStrings = [...text.matchAll(/'([^']*)'|"([^"]*)"/g)].map(
        (m) => m[1] ?? m[2] ?? '',
      );
      return classStrings.flatMap((classes) =>
        [...classes.matchAll(BARE_SCALE)]
          // Zero is structural — see the header.
          .filter((m) => Number(m[2]) !== 0)
          .map((m) => ({ line: i + 1, match: m[1]! })),
      );
    });
}

describe('recipes carry no bare Tailwind scale utilities', () => {
  it('every spacing/sizing value comes from a component token', () => {
    const offenders = recipeFiles.flatMap((file) =>
      offendersIn(readFileSync(join(recipesDir, file), 'utf8')).map(
        ({ line, match }) => `${file}:${line}  ${match}`,
      ),
    );
    expect(
      offenders,
      `bare Tailwind scale utilities in recipes — add a component token instead:\n${offenders.join('\n')}`,
    ).toEqual([]);
  });

  it('actually detects an offender', () => {
    // Positive control. Every real offender is now fixed, so without this a regex that
    // silently stopped matching would leave a permanently-green test that checks nothing.
    const sample = [
      "root: 'flex flex-col gap-2',",
      "body: 'px-4 py-1.5 md:gap-4 -mt-2 h-8',",
      "fine: 'w-full h-full w-0 min-w-0 flex-1 left-1/2 z-[1] ring-offset-2 max-h-screen',",
      "good: 'gap-(--component-card-footer-gap) p-(--component-dialog-padding)',",
      "// prose about the old 'gap-2' and `h-9` must not register",
      '/* nor a block comment mentioning p-4 */',
    ].join('\n');
    expect(offendersIn(sample).map((o) => o.match)).toEqual([
      'gap-2',
      'px-4',
      'py-1.5',
      'gap-4',
      '-mt-2',
      'h-8',
    ]);
  });
});
