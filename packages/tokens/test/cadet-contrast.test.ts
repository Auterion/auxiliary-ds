import { describe, expect, it } from 'vitest';
import { contrastRatio, parseOklch } from './wcag';

/**
 * Space Cadet mode contrast gate.
 *
 * Brand.vue overrides --muted-foreground to cadet.600 on auterion-blue dark
 * surfaces. These pairs bypass the semantic theme files, so the main contrast
 * gate doesn't cover them. Lock the contract here.
 */

const cadet600 = parseOklch('oklch(0.60 0.035 200)');
const abNight = parseOklch('oklch(0.165 0.014 265)');
const abShade = parseOklch('oklch(0.205 0.017 265)');

describe('Space Cadet: cadet.600 muted-foreground readability', () => {
  it('clears 4.5:1 against auterion-blue.night (background)', () => {
    expect(contrastRatio(cadet600, abNight)).toBeGreaterThanOrEqual(4.5);
  });

  it('clears 4.5:1 against auterion-blue.shade (card)', () => {
    expect(contrastRatio(cadet600, abShade)).toBeGreaterThanOrEqual(4.5);
  });
});
