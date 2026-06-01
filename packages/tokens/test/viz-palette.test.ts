import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { deltaEOk, loadTheme, parseOklch } from './wcag';

/**
 * Data-viz palette gate (ROADMAP §6.5).
 *
 * The viz palettes are derived from the OKLCH primitive ramps and must hold two
 * invariants the rest of the system depends on:
 *
 *  1. The reserved status ladder stays reserved — no categorical series may sit
 *     near a status hue (alarm/warning/caution/advisory/nominal), or a chart
 *     series would read as an operational state.
 *  2. Series stay distinguishable — pairwise in color (ΔEok) AND in lightness.
 *     The status ladder reserves the warm + cyan + green band, so the
 *     categorical palette lives in the cool→magenta arc; with hue range limited,
 *     *luminance spread* is what keeps series apart under CVD (the same
 *     "luminance hierarchy over saturation" rule the darknight ladder uses).
 *
 * Source-based (reads the DTCG tokens, not built CSS) like the other token gates.
 * Full CVD simulation (Brettel) is a later refinement; the luminance-spread floor
 * is the proxy here.
 */

const srcDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'src');

type Leaf = { $value: string };
type Group = Record<string, Leaf>;
const vizFile = JSON.parse(
  readFileSync(resolve(srcDir, 'primitive', 'viz.tokens.json'), 'utf8'),
) as { viz: { categorical: Group; sequential: Group; diverging: Group } };

const toColors = (g: Group) => Object.values(g).map((t) => parseOklch(t.$value));
const categorical = toColors(vizFile.viz.categorical);
const sequential = toColors(vizFile.viz.sequential);
const diverging = toColors(vizFile.viz.diverging);
const lightness = (c: ReturnType<typeof parseOklch>) => c[0];
const chroma = (c: ReturnType<typeof parseOklch>) => c[1];

// Resolved status-ladder colors (alarm=red.700, warning=orange.500, …).
const light = loadTheme('light');
const STATUS = ['alarm', 'warning', 'caution', 'advisory', 'nominal'] as const;
const statusColors = STATUS.map((role) => {
  const c = light[role];
  if (!c) throw new Error(`Missing status role: ${role}`);
  return [role, c] as const;
});

// Floors sit below measured headroom (status ≥0.22, pairwise ≥0.14, L-gap ≥0.06).
const STATUS_FLOOR = 0.12;
const PAIR_FLOOR = 0.1;
const LUM_GAP = 0.04;

describe('viz palette — reserved status ladder', () => {
  it.each(categorical.map((c, i) => [i + 1, c] as const))(
    'categorical series %i is clear of every status hue (ΔEok ≥ %s)',
    (_i, c) => {
      for (const [role, s] of statusColors) {
        expect(deltaEOk(c, s), `vs ${role}`).toBeGreaterThanOrEqual(STATUS_FLOOR);
      }
    },
  );
});

describe('viz palette — categorical series stay distinguishable', () => {
  it('every pair separates in color (ΔEok)', () => {
    for (let i = 0; i < categorical.length; i++) {
      for (let j = i + 1; j < categorical.length; j++) {
        expect(
          deltaEOk(categorical[i]!, categorical[j]!),
          `series ${i + 1} vs ${j + 1}`,
        ).toBeGreaterThanOrEqual(PAIR_FLOOR);
      }
    }
  });

  it('every pair separates in lightness (grayscale / CVD-safe)', () => {
    const sorted = categorical.map(lightness).sort((a, b) => a - b);
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i + 1]! - sorted[i]!, `adjacent L gap #${i}`).toBeGreaterThanOrEqual(LUM_GAP);
    }
  });
});

describe('viz palette — sequential is a monotonic lightness ramp', () => {
  it('lightness decreases strictly from step 1 → n', () => {
    for (let i = 0; i < sequential.length - 1; i++) {
      expect(lightness(sequential[i]!), `step ${i + 1} → ${i + 2}`).toBeGreaterThan(
        lightness(sequential[i + 1]!),
      );
    }
  });
});

describe('viz palette — diverging has distinct ends and a neutral midpoint', () => {
  it('the two ends are perceptually far apart', () => {
    expect(deltaEOk(diverging[0]!, diverging[diverging.length - 1]!)).toBeGreaterThanOrEqual(0.18);
  });
  it('the midpoint is near-neutral (low chroma)', () => {
    const mid = diverging[Math.floor(diverging.length / 2)]!;
    expect(chroma(mid), 'midpoint chroma').toBeLessThanOrEqual(0.04);
  });
});
