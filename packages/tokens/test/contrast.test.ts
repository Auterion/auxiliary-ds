import { describe, expect, it } from 'vitest';
import {
  blueEnergy,
  contrastRatio,
  loadTheme,
  pairRatio,
  parseOklch,
  type ThemeName,
} from './wcag';

/**
 * Per-theme contrast gate (ROADMAP cross-cutting: operational invariants).
 *
 * Locks the color-blind-safe + sunlight/night legibility contract at the token
 * layer so a future palette edit can't silently regress it. axe (in @auxiliary/vue)
 * checks WCAG *semantics*; this certifies the *ratios* across all four themes,
 * including the sunlight (glare) and darknight (scotopic) operational themes that
 * axe never exercises.
 *
 * Floor discipline mirrors the Phase 1 coverage floor: floors are set at the
 * WCAG AA target the tokens now meet, and only ever ratchet UP. Every status and
 * body pair was brought to >= 4.5:1 in this change; the floors lock that.
 */

// Body/UI surface text — WCAG 2.2 SC 1.4.3 AA normal text (4.5:1).
// Sunlight raised toward AAA (7:1, SC 1.4.6) because veiling glare compresses the
// on-screen ratio; the sunlight palette (black/white/zinc) already clears it.
const BODY_PAIRS = [
  ['background', 'foreground'],
  ['card', 'card-foreground'],
  ['popover', 'popover-foreground'],
  ['primary', 'primary-foreground'],
  ['secondary', 'secondary-foreground'],
  ['muted', 'muted-foreground'],
  ['accent', 'accent-foreground'],
] as const;

// Status fills carry small-bold labels, which do NOT qualify as "large" text, so
// the real WCAG target is 4.5:1 (not the 3.0 large/UI allowance). All status
// pairs were remediated to meet it.
const STATUS_PAIRS = [
  ['destructive', 'destructive-foreground'],
  ['alarm', 'alarm-foreground'],
  ['warning', 'warning-foreground'],
  ['caution', 'caution-foreground'],
  ['advisory', 'advisory-foreground'],
  ['nominal', 'nominal-foreground'],
] as const;

// Floors only ever ratchet up. TODO(ratchet): raise dark/darknight status to 5.0+
// and sunlight status toward 7.0 as the palette is refined.
const FLOORS: Record<ThemeName, { body: number; status: number }> = {
  light: { body: 4.5, status: 4.5 },
  dark: { body: 4.5, status: 4.5 },
  sunlight: { body: 7.0, status: 4.5 }, // AAA-leaning body for glare
  darknight: { body: 4.5, status: 4.5 },
};

const THEMES: ThemeName[] = ['light', 'dark', 'sunlight', 'darknight'];

describe('WCAG converter self-check', () => {
  it('computes black-on-white as 21:1', () => {
    expect(contrastRatio(parseOklch('oklch(0 0 0)'), parseOklch('oklch(1 0 0)'))).toBeCloseTo(21, 1);
  });
});

describe.each(THEMES)('contrast floors — %s theme', (themeName) => {
  const theme = loadTheme(themeName);
  const floor = FLOORS[themeName];

  it.each(BODY_PAIRS)(`body %s/%s >= ${floor.body}:1`, (bg, fg) => {
    expect(pairRatio(theme, bg, fg)).toBeGreaterThanOrEqual(floor.body);
  });

  it.each(STATUS_PAIRS)(`status %s/%s >= ${floor.status}:1`, (bg, fg) => {
    expect(pairRatio(theme, bg, fg)).toBeGreaterThanOrEqual(floor.status);
  });
});

/**
 * Darknight is a scotopic (night-vision) theme: bright blue/cyan light bleaches
 * rhodopsin and destroys 20-30min of dark adaptation. WCAG luminance cannot model
 * this, so we add a spectral invariant: every status FILL (the large emitting area)
 * must stay below a linear-sRGB blue cap. Locked just above today's max (advisory
 * cyan.900 = 0.13). TODO(ratchet): lower toward 0.10 by dimming advisory further.
 */
describe('darknight night-vision: status fills stay low-blue', () => {
  const theme = loadTheme('darknight');
  const BLUE_CAP = 0.15;
  it.each(STATUS_PAIRS.map(([fill]) => fill))('%s fill blue energy <= 0.15', (fill) => {
    const color = theme[fill];
    expect(color, `missing darknight role: ${fill}`).toBeDefined();
    expect(blueEnergy(color!)).toBeLessThanOrEqual(BLUE_CAP);
  });
});
