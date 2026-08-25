import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { globSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/**
 * The composed screens must be built OUT of the system, not beside it.
 *
 * `no-bare-scale-utilities.test.ts` guards `packages/css/recipes` — and only
 * that directory. The pattern and template pages, which are the most-copied
 * artefacts the docs site ships, sat entirely outside it and defined their
 * layout with ~330 raw rem/px literals in inline styles: `gap:0.5rem`,
 * `padding:0.75rem`, `border-radius:0.375rem`, and a handful (`0.2rem`,
 * `0.45rem`, `0.6rem`) that were not on the scale at all.
 *
 * These are the pages a product team lifts a screen from. A raw literal here
 * propagates into product code, and it does not re-resolve under
 * `[data-register]` or answer to a token change — so the docs were teaching the
 * exact bypass the recipe gate exists to prevent.
 */

const docsRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

const files = [
  ...globSync(join(docsRoot, 'patterns', '*.md')),
  ...globSync(join(docsRoot, 'templates', '*.md')),
];

/** Layout properties the token scale is responsible for. */
const LAYOUT_PROP =
  String.raw`(?:padding|margin|gap|row-gap|column-gap|rowGap|columnGap|border-radius|borderRadius|paddingTop|paddingRight|paddingBottom|paddingLeft|marginTop|marginRight|marginBottom|marginLeft)`;
/** A raw length: a number followed by px/rem/em, not wrapped in var(). */
const RAW_LENGTH = new RegExp(
  String.raw`\b${LAYOUT_PROP}\s*:\s*['"]?[^;"'\n}]*?\b\d*\.?\d+(?:px|rem|em)\b`,
  'g',
);

describe('pattern and template docs define layout from tokens', () => {
  it('finds the pages it is meant to police', () => {
    expect(files.length, 'no pattern/template pages found — has the layout moved?').toBeGreaterThanOrEqual(15);
  });

  it.each(files.map((f) => [f.split('/').slice(-2).join('/'), f]))(
    '%s uses no raw layout lengths',
    (_name, file) => {
      const offenders = (readFileSync(file, 'utf8').match(RAW_LENGTH) ?? [])
        // A 1px hairline border-radius/inset has no scale rung and never should.
        .filter((m) => !/\b1px\b/.test(m));
      expect(
        offenders,
        `raw layout lengths — use var(--spacing-*) / var(--radius-*):\n${offenders.join('\n')}`,
      ).toEqual([]);
    },
  );

  it('actually detects a raw literal', () => {
    // Positive control — the shape that was shipping on every one of these pages.
    const sample = `<div style="display:flex; gap:0.5rem; padding:0.75rem; border-radius:0.375rem;">`;
    expect((sample.match(RAW_LENGTH) ?? []).length).toBeGreaterThanOrEqual(3);
  });
});
