import { describe, expect, it } from 'vitest';
import { blueEnergy, deltaEOk, loadTheme, luminance, pairRatio, parseOklch, type ThemeName } from './wcag';

/**
 * Extended sunlight/night legibility gates (ROADMAP §6i — defense layer).
 *
 * The per-theme text-contrast gate (contrast.test.ts) certifies that *text* is
 * readable. These gates certify the operational themes' non-text legibility
 * contract that axe and text-contrast can't see:
 *
 *  1. Focus visibility — the focus ring clears WCAG 1.4.11 (3:1) in every theme.
 *  2. Structural UI contrast — border + input clear 3:1 in the operational themes
 *     (sunlight/darknight), so panels and fields hold their geometry under glare
 *     and in the dark.
 *  3. Night-vision (darknight, scotopic) — *every* token stays low-blue, AND the
 *     severity ladder emits monotonically (alarm brightest → nominal dimmest),
 *     because rod vision reads intensity, not warm hue (the Purkinje shift).
 *  4. Severity separation — the five ladder fills stay perceptually distinct by
 *     color (ΔEok), a color-channel complement to the grayscale-glyph gate.
 *
 * Grounded in measured values: strict 3:1 on every status *fill* vs background is
 * deliberately NOT gated — it's physically impossible for bright hues like yellow
 * on white, and the darknight luminance ladder *requires* a dim nominal. Floors
 * only ratchet up.
 */

// --- 1. Focus ring ≥ 3:1 (WCAG 1.4.11) in every theme ------------------------
// The keyboard focus indicator must stay visible against the background — under
// sun, in the dark, and everywhere else. All four clear it today (light/dark
// zinc.500 ≈ 4.8/4.1:1, sunlight 21:1, darknight 12.2:1); this locks it.
describe('focus ring is visible against the background (≥ 3:1)', () => {
  const RING_FLOOR = 3.0;
  const THEMES: ThemeName[] = ['light', 'dark', 'sunlight', 'darknight'];
  it.each(THEMES)('%s ring vs background ≥ 3:1', (name) => {
    expect(pairRatio(loadTheme(name), 'background', 'ring')).toBeGreaterThanOrEqual(RING_FLOOR);
  });
});

// --- 2. Operational structure: border + input ≥ 3:1 (WCAG 1.4.11) -------------
// Panels and fields must hold their geometry under glare (sunlight) and in the
// dark (darknight). The redesigned operational palettes deepen these edges to
// clear 3:1; light/dark keep subtle dividers and are intentionally not gated here.
describe('operational themes: structural UI contrast (≥ 3:1)', () => {
  it.each(['sunlight', 'darknight'] as ThemeName[])('%s border + input vs background ≥ 3:1', (name) => {
    const theme = loadTheme(name);
    expect(pairRatio(theme, 'background', 'border'), 'border').toBeGreaterThanOrEqual(3);
    expect(pairRatio(theme, 'background', 'input'), 'input').toBeGreaterThanOrEqual(3);
  });
});

// --- 3. Darknight severity emits monotonically (scotopic urgency = brightness) -
// At night rod vision dominates and can't discriminate warm hue (dark red reads
// near-black). So urgency is carried by emitted luminance: alarm is the brightest
// element, stepping down to a near-extinguished nominal. This is the invariant the
// redesign fixed — today's pre-redesign ramp was luminance-scrambled (alarm dimmer
// than caution).
describe('darknight severity is a monotonic luminance ladder', () => {
  const LADDER = ['alarm', 'warning', 'caution', 'advisory', 'nominal'] as const;
  it('emits alarm (brightest) → nominal (dimmest), strictly decreasing', () => {
    const theme = loadTheme('darknight');
    const ys = LADDER.map((s) => luminance(theme[s]!));
    for (let i = 1; i < ys.length; i++) {
      expect(ys[i - 1], `${LADDER[i - 1]} must out-emit ${LADDER[i]}`).toBeGreaterThan(ys[i]!);
    }
  });
});

// --- 4. Darknight night-vision: ALL tokens stay low-blue ----------------------
// contrast.test.ts caps the status *fills*; this extends the spectral invariant
// to every role (surfaces, foregrounds, borders, ring), so no token leaks blue
// light. Locked just above today's max (advisory cyan.900 = 0.13). The only role
// that previously exceeded it — nominal-foreground — is now lime.300 (low-blue).
describe('darknight night-vision: every token stays low-blue', () => {
  const BLUE_CAP = 0.15;
  const theme = loadTheme('darknight');
  it.each(Object.keys(theme))('%s blue energy ≤ 0.15', (role) => {
    expect(blueEnergy(theme[role]!), `${role} leaks blue`).toBeLessThanOrEqual(BLUE_CAP);
  });
});

// --- 5. Severity ladder fills stay perceptually distinct (ΔEok) ---------------
// A ratchet floor below today's tightest pair (dark/darknight alarm↔warning at
// ~0.045). The grayscale-glyph gate is the *primary* non-color guarantee; this
// prevents the colors themselves from drifting closer together.
const FILLS = ['alarm', 'warning', 'caution', 'advisory', 'nominal'] as const;
const FILL_PAIRS = FILLS.flatMap((a, i) => FILLS.slice(i + 1).map((b) => [a, b] as const));
const MIN_DELTA_E = 0.04; // TODO(ratchet): raise toward 0.06 as the dark palettes are refined.

describe.each(['light', 'dark', 'sunlight', 'darknight'] as ThemeName[])(
  'severity ladder is color-distinct — %s theme',
  (name) => {
    const theme = loadTheme(name);
    it.each(FILL_PAIRS)(`%s vs %s ΔEok ≥ ${MIN_DELTA_E}`, (a, b) => {
      expect(deltaEOk(theme[a]!, theme[b]!)).toBeGreaterThanOrEqual(MIN_DELTA_E);
    });
  },
);

describe('ΔEok self-check', () => {
  it('is 0 for identical colors and large for opponents', () => {
    const red = parseOklch('oklch(0.628 0.258 29.23)');
    const green = parseOklch('oklch(0.866 0.295 142.5)');
    expect(deltaEOk(red, red)).toBe(0);
    expect(deltaEOk(red, green)).toBeGreaterThan(0.4);
  });
});
