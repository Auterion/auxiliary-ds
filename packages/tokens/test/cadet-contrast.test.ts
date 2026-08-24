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
const inkBackground = parseOklch('oklch(0.139 0.014 265)');
const inkCard = parseOklch('oklch(0.210 0.018 265)');

describe('Space Cadet: cadet.600 muted-foreground readability', () => {
  it('clears 4.5:1 against ink.950 (background)', () => {
    expect(contrastRatio(cadet600, inkBackground)).toBeGreaterThanOrEqual(4.5);
  });

  it('clears 4.5:1 against ink.900 (card)', () => {
    expect(contrastRatio(cadet600, inkCard)).toBeGreaterThanOrEqual(4.5);
  });
});
