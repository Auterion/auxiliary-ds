import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test-utils/a11y';
import StatusBadge from '../StatusBadge.vue';
import AlertBanner from '../AlertBanner.vue';
import { STATUS_GLYPHS, type StatusKind } from '../status-glyphs';

/**
 * Non-color status-cue gate (ROADMAP cross-cutting: operational invariants).
 *
 * The color-blind-safe contract: a status level must NEVER be conveyed by color
 * alone. axe checks contrast/roles but not "is the level distinguishable without
 * color." This gate enforces, for both status components and every level, an
 * intrinsic cue that is:
 *   1. grayscale-distinct  — a per-level glyph shape (5 unique outlines), and
 *   2. accessible to AT     — a rendered level label (sr-only), and
 *   3. component-guaranteed — present even with an EMPTY slot / no title.
 */

const LEVELS = Object.keys(STATUS_GLYPHS) as StatusKind[];

describe('non-color status cue', () => {
  it('uses a distinct glyph shape per level (grayscale-distinguishable)', () => {
    const shapes = LEVELS.map((l) => STATUS_GLYPHS[l]);
    expect(new Set(shapes).size).toBe(LEVELS.length);
  });

  describe.each(LEVELS)('StatusBadge — %s', (level) => {
    it('conveys the level with an empty slot (not color-only, not consumer-dependent)', () => {
      const w = mount(StatusBadge, { props: { level }, slots: { default: '' } });
      // AT cue: the level word is in the accessible text even with no slot content.
      expect(w.text().toLowerCase()).toContain(level);
      // Visual cue: the per-level glyph outline is rendered.
      expect(w.find('path').attributes('d')).toBe(STATUS_GLYPHS[level]);
    });

    it('has no axe violations with an empty slot', async () => {
      const w = mount(StatusBadge, { props: { level }, slots: { default: '' } });
      expect(await axe(w.element)).toHaveNoViolations();
    });
  });

  describe.each(LEVELS)('AlertBanner — %s', (level) => {
    it('conveys the level with no title/description (not color-only)', () => {
      const w = mount(AlertBanner, { props: { level } });
      expect(w.text().toLowerCase()).toContain(level);
      expect(w.find('path').attributes('d')).toBe(STATUS_GLYPHS[level]);
    });

    it('has no axe violations with no title/description', async () => {
      const w = mount(AlertBanner, { props: { level } });
      expect(await axe(w.element)).toHaveNoViolations();
    });
  });
});
