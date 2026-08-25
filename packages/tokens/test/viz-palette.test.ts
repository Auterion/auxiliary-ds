import { describe, expect, it } from 'vitest';
import { contrastRatio, deltaEOk, loadTheme, luminance, type ThemeName } from './wcag';
import { deltaEOkCvd } from './cvd';

/**
 * Per-theme data-viz palette gate (ROADMAP §6.5, rebuilt for the four-mode
 * palette).
 *
 * The viz scales are SEMANTIC roles now — viz-categorical-1…6, viz-sequential-
 * 1…5, viz-diverging-1…5 — re-resolving under [data-theme] like every other
 * role, so each theme carries its own realization of one brand-anchored
 * identity (series 1 = Auterion ultramarine; darknight = warm luminance
 * ladder under the blue-energy cap). Invariants:
 *
 *  1. Every categorical series ≥ 3:1 against background AND card (a series
 *     you can't see isn't a series). Sunlight relies on the same floor —
 *     its rungs are darkened instead of floored higher so the palette keeps
 *     six usable steps.
 *  2. Pairwise distinguishability: ΔEok ≥ 0.05 normally, and ≥ 0.04 under
 *     simulated protanopia/deuteranopia (Machado severity 1.0 — ~8% of
 *     males). Tritanopia (<0.01%) is floored at 0.025 in the cool themes;
 *     in darknight the blue cap physically removes the blue–yellow axis, so
 *     the tritan floor is replaced by an enforced OKLCH-lightness gap ≥ 0.05
 *     per pair — series identity at night rides on brightness ordering,
 *     exactly like the darknight status ladder.
 *  3. The reserved status ladder stays reserved: every categorical series
 *     keeps ΔEok ≥ 0.05 from every ladder fill and destructive.
 *  4. Sequential ramps are strictly monotonic in luminance.
 *  5. Diverging endpoints ≥ 3:1 against the background.
 *
 * (The darknight blue cap covers the viz roles automatically via the
 * every-token gate in sunlight-night-gates.test.ts.)
 */

const THEMES: ThemeName[] = ['light', 'dark', 'sunlight', 'darknight'];
const CAT = [1, 2, 3, 4, 5, 6] as const;
const LADDER = ['alarm', 'warning', 'caution', 'advisory', 'nominal'] as const;

describe.each(THEMES)('viz palette — %s theme', (name) => {
  const theme = loadTheme(name);
  const cat = CAT.map((i) => theme[`viz-categorical-${i}`]!);
  const pairs = CAT.flatMap((a, i) => CAT.slice(i + 1).map((b) => [a, b] as const));

  it.each(CAT)('categorical %d ≥ 3:1 vs background and card', (i) => {
    expect(contrastRatio(theme.background!, cat[i - 1]!)).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(theme.card!, cat[i - 1]!)).toBeGreaterThanOrEqual(3);
  });

  it.each(pairs)('categorical %d vs %d stays distinguishable (normal + CVD)', (a, b) => {
    const [ca, cb] = [cat[a - 1]!, cat[b - 1]!];
    expect(deltaEOk(ca, cb), 'normal').toBeGreaterThanOrEqual(0.05);
    expect(deltaEOkCvd(ca, cb, 'protanopia'), 'protanopia').toBeGreaterThanOrEqual(0.04);
    expect(deltaEOkCvd(ca, cb, 'deuteranopia'), 'deuteranopia').toBeGreaterThanOrEqual(0.04);
    if (name === 'darknight') {
      expect(Math.abs(ca[0] - cb[0]), 'OKLCH lightness gap').toBeGreaterThanOrEqual(0.05);
    } else {
      expect(deltaEOkCvd(ca, cb, 'tritanopia'), 'tritanopia').toBeGreaterThanOrEqual(0.025);
    }
  });

  /**
   * A series may not be painted in a role the interface already speaks in.
   *
   * The status roles were always reserved. The TEXT roles were not, and that is
   * where it bit: chart chrome is drawn in `muted-foreground` (axis labels at
   * TimeSeries.vue, the legend at Bars.vue), so a series sitting on it makes
   * "this stroke is data" and "this stroke is chrome" the same color — the one
   * distinction a categorical palette exists to make. Light `viz-categorical-6`
   * was `mono.950`, the identical primitive to `foreground` (ΔEok 0.0000).
   *
   * `brand` is deliberately NOT reserved: series 1 IS the Auterion ultramarine
   * by design (see packages/viz/src/palette.ts), so reserving it would fail the
   * palette's own intent.
   */
  const RESERVED = [...LADDER, 'destructive', 'foreground', 'muted-foreground'] as const;

  it('no categorical series sits on a reserved role', () => {
    for (const i of CAT) {
      for (const role of RESERVED) {
        expect(
          deltaEOk(cat[i - 1]!, theme[role]!),
          `viz-categorical-${i} vs ${role}`,
        ).toBeGreaterThanOrEqual(0.05);
      }
    }
  });

  // Positive control: the reservation must actually reject a series painted in a
  // reserved ink. Without it, a typo in RESERVED yields a green test over an
  // empty loop — which is how the text roles went unchecked in the first place.
  it('actually rejects a series painted in a reserved ink', () => {
    expect(deltaEOk(theme.foreground!, theme.foreground!)).toBeLessThan(0.05);
  });

  it('sequential ramp is strictly monotonic in luminance', () => {
    const seq = [1, 2, 3, 4, 5].map((i) => luminance(theme[`viz-sequential-${i}`]!));
    const dir = Math.sign(seq[1]! - seq[0]!);
    expect(dir).not.toBe(0);
    for (let i = 1; i < seq.length; i++) {
      expect(Math.sign(seq[i]! - seq[i - 1]!), `step ${i}`).toBe(dir);
    }
  });

  it('diverging endpoints ≥ 3:1 vs background', () => {
    expect(contrastRatio(theme.background!, theme['viz-diverging-1']!)).toBeGreaterThanOrEqual(3);
    expect(contrastRatio(theme.background!, theme['viz-diverging-5']!)).toBeGreaterThanOrEqual(3);
  });
});

describe('CVD simulation self-check', () => {
  it('red/green collapses under deuteranopia but not tritanopia', () => {
    const red: [number, number, number] = [0.628, 0.258, 29.23];
    const green: [number, number, number] = [0.648, 0.2, 142];
    expect(deltaEOk(red, green)).toBeGreaterThan(0.2);
    expect(deltaEOkCvd(red, green, 'deuteranopia')).toBeLessThan(0.1);
    expect(deltaEOkCvd(red, green, 'tritanopia')).toBeGreaterThan(0.15);
  });
});
