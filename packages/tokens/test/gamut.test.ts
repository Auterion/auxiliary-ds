import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { parseOklch } from './wcag';

/**
 * Gamut gate for the families this repo AUTHORS.
 *
 * OKLCH is not a bounded space: `oklch(0.631 0.220 264)` is a perfectly legal
 * value that names a colour no display can produce. The browser silently clips
 * it to the gamut boundary, so an out-of-gamut token does not fail, does not
 * warn, and does not look obviously wrong — it just renders as a DIFFERENT
 * colour than the one written down, and every rung that clips renders as very
 * nearly the SAME colour as its neighbours.
 *
 * Nothing in this repo asserted it. Five rungs of `auterion-blue` — the brand
 * ramp — sat outside sRGB, and `.300`/`.400`/`.500` were outside Display P3 as
 * well: the only three primitives in the file that no hardware can show. The
 * token's own `$description` claimed the ramp "tapers at both ends to stay in
 * sRGB gamut", which was false as shipped and is the reason it went unexamined.
 * `.500` is `dark.brand`, so the company's primary colour was one of them.
 *
 * The vendored Tailwind families are excluded deliberately: 95 of their steps
 * exceed sRGB and all stay inside P3, which is upstream's considered
 * P3-forward choice, not drift this repo should police.
 *
 * WHY THIS FILE CONVERTS COLOUR ITSELF instead of using `oklchToLinear` from
 * ./wcag: that helper CLAMPS its output to [0,1] before returning (wcag.ts:71).
 * That is correct for its own callers — contrast and CVD should measure the
 * colour the screen actually shows — but it makes an out-of-gamut value
 * indistinguishable from a boundary value, so gamut violations are undetectable
 * by construction through it. This is the real reason the brand ramp went
 * unexamined for so long: the shared helper cannot see the problem, and every
 * gate in the directory is built on it. The conversion below is the same
 * transform WITHOUT the clamp, which is the only way to ask the question.
 */

/** oklch → linear sRGB, UNCLAMPED. See the note above — the clamp is the point. */
function oklchToLinearRaw([L, C, h]: [number, number, number]): [number, number, number] {
  const a = C * Math.cos((h * Math.PI) / 180);
  const b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}

const srcDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'src');
const palette = JSON.parse(
  readFileSync(resolve(srcDir, 'global', 'color', 'tailwind-palette.tokens.json'), 'utf8'),
).global.color.primitive as Record<string, Record<string, { $value: string }>>;

/** Families authored here, not vendored from Tailwind. */
const AUTHORED = ['auterion-blue', 'cadet', 'ink', 'mono'].filter((f) => palette[f]);

/** Headroom: a rung must not sit within 5% of the boundary, or rounding clips it. */
const MAX_FRACTION = 0.97;

const inSrgb = ([r, g, b]: [number, number, number]) =>
  [r, g, b].every((x) => x >= -1e-4 && x <= 1 + 1e-4);

/** Largest chroma that stays in sRGB at this (L, H), by bisection. */
function maxChroma(L: number, H: number): number {
  let lo = 0;
  let hi = 0.5;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (inSrgb(oklchToLinearRaw([L, mid, H]))) lo = mid;
    else hi = mid;
  }
  return lo;
}

describe.each(AUTHORED)('authored family in sRGB gamut: %s', (family) => {
  const rungs = Object.entries(palette[family]!).filter(([k]) => /^\d+$/.test(k));

  it.each(rungs.map(([step, tok]) => [step, tok.$value]))(
    '%s (%s) is inside sRGB with headroom',
    (step, value) => {
      const [L, C, H] = parseOklch(value);
      const max = maxChroma(L, H);
      expect(
        C,
        `${family}.${step} chroma ${C} is ${((C / max) * 100).toFixed(1)}% of the sRGB maximum ${max.toFixed(4)} at L=${L} H=${H} — it will be silently clipped`,
      ).toBeLessThanOrEqual(max * MAX_FRACTION);
    },
  );
});

describe('gamut gate self-check', () => {
  it('rejects the brand ramp as it shipped', () => {
    // Positive control: the exact value that was `auterion-blue.500`, at 111% of
    // the sRGB maximum. Without this, a bisection that silently returned 0.5
    // would pass every assertion above.
    const [L, C, H] = parseOklch('oklch(0.631 0.220 264)');
    expect(C).toBeGreaterThan(maxChroma(L, H));
  });

  it('accepts a value comfortably inside the gamut', () => {
    const [L, C, H] = parseOklch('oklch(0.631 0.100 264)');
    expect(C).toBeLessThanOrEqual(maxChroma(L, H) * MAX_FRACTION);
  });
});
