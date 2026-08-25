import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { parseOklch } from './wcag';

/**
 * Shape gate for the families this repo AUTHORS.
 *
 * The vendored Tailwind ramps are somebody else's well-formed artefact. The
 * Auterion ones are hand-written, and a hand-written ramp drifts in a way that
 * is invisible in a diff: `cadet` had a chroma spike at 600 (0.035 against
 * 0.010/0.012 either side — 3.5x its neighbours) and a lightness step of 0.03
 * where the steps either side were 0.12, so 500 and 600 measured as very nearly
 * one colour while 400→500 jumped four times as far.
 *
 * That deformation existed to hit a contrast pair for a Space Cadet
 * `--muted-foreground` override which no longer exists anywhere in the codebase
 * — the ramp was carrying a workaround for a consumer that had been deleted, and
 * the gate that "protected" it hardcoded a COPY of the token value, so it would
 * have passed no matter what the token said.
 *
 * Two properties, both cheap and both violated in practice:
 *   1. lightness is strictly monotonic and no step is a spike or a stall, and
 *   2. chroma is a single hump — it rises to one peak and falls, never dips and
 *      re-rises, which is what a hue-consistent neutral ramp looks like.
 */

const srcDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'src');
const palette = JSON.parse(
  readFileSync(resolve(srcDir, 'global', 'color', 'tailwind-palette.tokens.json'), 'utf8'),
).global.color.primitive as Record<string, Record<string, { $value: string }>>;

/** The families authored here, not vendored from Tailwind. */
const AUTHORED = ['cadet', 'auterion-blue', 'ink', 'mono'].filter((f) => palette[f]);

function ramp(family: string) {
  return Object.entries(palette[family]!)
    .filter(([k]) => /^\d+$/.test(k))
    .sort((a, b) => Number(a[0]) - Number(b[0]))
    .map(([step, tok]) => ({ step, ...(([L, C, h]) => ({ L, C, h }))(parseOklch(tok.$value)) }));
}

describe.each(AUTHORED)('authored ramp: %s', (family) => {
  const steps = ramp(family);

  it('has the full 50…950 ladder', () => {
    expect(steps.length).toBeGreaterThanOrEqual(11);
  });

  it('is strictly monotonic in lightness (light → dark)', () => {
    for (let i = 1; i < steps.length; i++) {
      expect(
        steps[i - 1]!.L,
        `${family}.${steps[i - 1]!.step} must be lighter than ${family}.${steps[i]!.step}`,
      ).toBeGreaterThan(steps[i]!.L);
    }
  });

  it('has no lightness step that stalls against its neighbours', () => {
    // A step less than a third of the mean of the steps around it reads as a
    // duplicate rung — two ramp entries that are the same colour.
    const deltas = steps.slice(1).map((s, i) => steps[i]!.L - s.L);
    for (let i = 1; i < deltas.length - 1; i++) {
      const neighbours = (deltas[i - 1]! + deltas[i + 1]!) / 2;
      expect(
        deltas[i]!,
        `${family}: the ${steps[i]!.step}→${steps[i + 1]!.step} lightness step (${deltas[i]!.toFixed(3)}) stalls against its neighbours (${neighbours.toFixed(3)})`,
      ).toBeGreaterThan(neighbours / 3);
    }
  });

  it('has a single-hump chroma curve (no dip-then-spike)', () => {
    const c = steps.map((s) => s.C);
    const peak = c.indexOf(Math.max(...c));
    for (let i = 1; i <= peak; i++) {
      expect(c[i]!, `${family}: chroma dips before its peak at index ${i}`).toBeGreaterThanOrEqual(c[i - 1]! - 1e-9);
    }
    for (let i = peak + 1; i < c.length; i++) {
      expect(c[i]!, `${family}: chroma rises again after its peak at index ${i}`).toBeLessThanOrEqual(c[i - 1]! + 1e-9);
    }
  });

  it('holds one hue across the ramp', () => {
    const hues = steps.map((s) => s.h).filter((h) => Number.isFinite(h));
    expect(Math.max(...hues) - Math.min(...hues), `${family} hue drifts`).toBeLessThanOrEqual(15);
  });
});

// Positive control: the gate must reject the shape that was shipping.
describe('ramp-shape gate self-check', () => {
  it('rejects the pre-fix cadet ramp', () => {
    const bad = ['0.75 0.015', '0.63 0.010', '0.60 0.035', '0.48 0.012'].map((v) =>
      parseOklch(`oklch(${v} 200)`),
    );
    const deltas = bad.slice(1).map((s, i) => bad[i]![0] - s[0]);
    // the 500→600 step against the mean of its neighbours
    expect(deltas[1]!).toBeLessThan((deltas[0]! + deltas[2]!) / 2 / 3);
    // and the chroma dips (0.015 → 0.010) before spiking (0.035)
    expect(bad[1]![1]).toBeLessThan(bad[0]![1]);
    expect(bad[2]![1]).toBeGreaterThan(bad[1]![1]);
  });
});
