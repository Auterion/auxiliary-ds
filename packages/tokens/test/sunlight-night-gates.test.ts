import { describe, expect, it } from 'vitest';
import { blueEnergy, deltaEOk, loadTheme, luminance, pairRatio, parseOklch, type ThemeName } from './wcag';
import { deltaEOkCvd } from './cvd';

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
 * deliberately NOT gated — sunlight caution (yellow.600, 2.93 vs white) is the one
 * documented sub-3:1 rung: the deepest yellow whose black label clears the 7:1 text
 * lean (amber.600 would cross 3:1 but costs caution↔warning ΔEok, a bad trade for
 * the FAA distinction). The darknight luminance ladder *requires* a dim nominal.
 * Floors only ratchet up.
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

  // The ring can be invisible against a solid primary fill (sunlight ring IS
  // primary: black on black). Recipes therefore put a 2px ring-offset gap —
  // rendered in `background` — between fill and ring, so what must hold is the
  // GAP's visibility: background vs primary ≥ 3:1 in every theme. (Gap vs ring
  // is the background/ring gate above; gap vs danger fill is the destructive
  // gate in contrast.test.ts.)
  it.each(THEMES)('%s background vs primary ≥ 3:1 (ring-offset gap)', (name) => {
    expect(pairRatio(loadTheme(name), 'background', 'primary')).toBeGreaterThanOrEqual(3.0);
  });
});

// --- 1b. Menu keyboard cursor (≥ 3:1, WCAG 1.4.11) ----------------------------
// data-[highlighted] is the ONLY indicator of keyboard position in open menus/
// listboxes (dropdown-menu, select, combobox). The recipes paint it bg-primary +
// text-primary-foreground (the native-menu convention); this gates the fill
// against the popover surface it sits on. The old bg-accent tint measured
// 1.19–2.17:1 — invisible exactly where arrow-key users need it.
describe('menu highlight (primary) is visible against the popover (≥ 3:1)', () => {
  const THEMES: ThemeName[] = ['light', 'dark', 'sunlight', 'darknight'];
  it.each(THEMES)('%s primary vs popover ≥ 3:1', (name) => {
    expect(pairRatio(loadTheme(name), 'popover', 'primary')).toBeGreaterThanOrEqual(3.0);
  });
});

// --- 2. Structural UI contrast (WCAG 1.4.11) ----------------------------------
// `input` is the ONLY boundary of text fields (border-input on bg-background in
// every form recipe), so it must clear 3:1 in ALL themes — light/dark used to sit
// at 1.30/1.34 and text fields effectively had no visible edge. `border` is
// decorative structure (card edges, separators); it stays subtle in light/dark
// and is gated only in the operational themes, where panels must hold their
// geometry under glare (sunlight) and in the dark (darknight).
describe('structural UI contrast (≥ 3:1)', () => {
  const ALL: ThemeName[] = ['light', 'dark', 'sunlight', 'darknight'];
  it.each(ALL)('%s input vs background ≥ 3:1', (name) => {
    expect(pairRatio(loadTheme(name), 'background', 'input'), 'input').toBeGreaterThanOrEqual(3);
  });
  it.each(['sunlight', 'darknight'] as ThemeName[])('%s border vs background ≥ 3:1', (name) => {
    expect(pairRatio(loadTheme(name), 'background', 'border'), 'border').toBeGreaterThanOrEqual(3);
  });
});

// --- 2b. Severity-salience contracts (theme review, 2026-06) ------------------
// Perceived prominence (fill contrast vs the page) must track urgency — the
// pre-review ladders were scrambled (light: nominal was the second-loudest
// banner at 4.53 vs warning's 2.65; dark was EXACTLY inverted, nominal 11.23
// vs alarm 3.10). Each theme has its own verified contract:
//  - light: strictly decreasing, alarm -> nominal (the bottom three rungs are
//    deliberately quiet ~1.6-1.75; hue + glyph carry identity — the documented
//    glyph-redundancy compromise applied consistently).
//  - sunlight: alarm tops the ladder (red.800, 8.37) — no benign rung may
//    out-shout it under glare. Full monotonicity is not required (advisory
//    keeps its AAA 7.25 for glare legibility).
//  - dark: the benign end (advisory, nominal) stays quieter than the urgent
//    middle (warning, caution). Alarm reads by hue + glyph, not brightness —
//    red cannot go bright on ink with a white foreground (gate-driven).
describe('severity salience tracks urgency', () => {
  const LADDER5 = ['alarm', 'warning', 'caution', 'advisory', 'nominal'] as const;
  const sal = (name: ThemeName, role: string) => pairRatio(loadTheme(name), 'background', role);

  it('light: fill salience strictly decreases down the ladder', () => {
    const v = LADDER5.map((l) => sal('light', l));
    for (let i = 1; i < v.length; i++) {
      expect(v[i - 1]!, `${LADDER5[i - 1]} must out-shout ${LADDER5[i]}`).toBeGreaterThan(v[i]!);
    }
  });

  it('sunlight: no status fill out-shouts alarm', () => {
    for (const l of LADDER5.slice(1)) {
      expect(sal('sunlight', 'alarm'), `alarm vs ${l}`).toBeGreaterThanOrEqual(sal('sunlight', l));
    }
  });

  it('dark: the benign end stays quieter than the urgent middle', () => {
    const benign = Math.max(sal('dark', 'advisory'), sal('dark', 'nominal'));
    const urgent = Math.min(sal('dark', 'warning'), sal('dark', 'caution'));
    expect(benign).toBeLessThan(urgent);
  });

  it('darknight: interactive chrome and destructive do not out-emit alarm', () => {
    const theme = loadTheme('darknight');
    expect(luminance(theme.primary!), 'primary').toBeLessThan(luminance(theme.alarm!));
    expect(luminance(theme.destructive!), 'destructive').toBeLessThan(luminance(theme.alarm!));
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

// --- 5. Severity ladder stays perceptually distinct (ΔEok, normal + CVD) ------
// The grayscale-glyph gate (packages/vue … status-cue.test.ts) is the *primary*
// non-color guarantee; this prevents the colors themselves from drifting closer
// together.
//
// SCOPE, twice widened, because the previous scope read as coverage it did not have:
//
//   1. BOTH TIERS. This covered the five `FILLS` only. The `*-emphasis` inks —
//      which paint StatusBadge outline, TelemetryValue, CoordinateValue and every
//      status readout that sits directly on a page surface — were ungated, and
//      light/sunlight `warning-emphasis` vs `caution-emphasis` measured ΔEok
//      0.0013 under deuteranopia. Two rungs of a safety ladder, one color.
//
//   2. UNDER SIMULATED DICHROMACY. This measured normal vision only, while
//      viz-palette.test.ts already held a *decorative chart series* to 0.04 under
//      protanopia AND deuteranopia using `deltaEOkCvd` from ./cvd — written,
//      shipped, and imported by exactly one file. The safety ladder was held to a
//      weaker standard than the chart legend.
//
// Fixing it required re-spacing on LIGHTNESS, the only channel dichromacy leaves
// intact — hue separation is worth nothing to a deuteranope. Nine pairs across
// both tiers and all four themes were below the floor before this widened.
const LADDER = ['alarm', 'warning', 'caution', 'advisory', 'nominal'] as const;
const LADDER_PAIRS = LADDER.flatMap((a, i) => LADDER.slice(i + 1).map((b) => [a, b] as const));
const TIERS = ['', '-emphasis'] as const;
const MIN_DELTA_E = 0.04; // TODO(ratchet): raise toward 0.06 as the dark palettes are refined.

describe.each(['light', 'dark', 'sunlight', 'darknight'] as ThemeName[])(
  'severity ladder is color-distinct — %s theme',
  (name) => {
    const theme = loadTheme(name);
    for (const tier of TIERS) {
      const label = tier === '' ? 'fill' : 'emphasis';
      it.each(LADDER_PAIRS)(
        `${label}: %s vs %s ΔEok ≥ ${MIN_DELTA_E} — normal, protanopia, deuteranopia`,
        (a, b) => {
          const [ca, cb] = [theme[`${a}${tier}`]!, theme[`${b}${tier}`]!];
          expect(deltaEOk(ca, cb), 'normal').toBeGreaterThanOrEqual(MIN_DELTA_E);
          expect(deltaEOkCvd(ca, cb, 'protanopia'), 'protanopia').toBeGreaterThanOrEqual(MIN_DELTA_E);
          expect(deltaEOkCvd(ca, cb, 'deuteranopia'), 'deuteranopia').toBeGreaterThanOrEqual(MIN_DELTA_E);
        },
      );
    }
  },
);

// Positive control for the CVD half specifically. Without it, a `deltaEOkCvd`
// that silently started returning the normal-vision value would leave every
// assertion above passing while checking nothing — which is precisely how the
// ungated emphasis tier survived 347 green token tests.
describe('CVD simulation self-check', () => {
  it('collapses a red/green pair that normal vision separates', () => {
    const red = parseOklch('oklch(0.55 0.20 25)');
    const green = parseOklch('oklch(0.55 0.20 145)');
    expect(deltaEOk(red, green), 'normal vision separates them').toBeGreaterThan(0.15);
    expect(deltaEOkCvd(red, green, 'deuteranopia'), 'deuteranopia does not').toBeLessThan(0.04);
  });
});

describe('ΔEok self-check', () => {
  it('is 0 for identical colors and large for opponents', () => {
    const red = parseOklch('oklch(0.628 0.258 29.23)');
    const green = parseOklch('oklch(0.866 0.295 142.5)');
    expect(deltaEOk(red, red)).toBe(0);
    expect(deltaEOk(red, green)).toBeGreaterThan(0.4);
  });
});
