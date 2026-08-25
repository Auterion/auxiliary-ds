import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test-utils/a11y';
import StatusBadge from '../StatusBadge.vue';
import AlertBanner from '../AlertBanner.vue';
import TelemetryValue from '../TelemetryValue.vue';
import CoordinateValue from '../CoordinateValue.vue';
import Progress from '../Progress.vue';
import { STATUS_GLYPHS, STATUS_LABELS, type StatusLevel } from '../status-glyphs';

/**
 * Non-color status-cue gate (ROADMAP cross-cutting: operational invariants).
 *
 * The color-blind-safe contract: a status level must NEVER be conveyed by color
 * alone. axe checks contrast/roles but not "is the level distinguishable without
 * color." This gate enforces, for EVERY component that accepts `level` and every
 * level, an intrinsic cue that is:
 *   1. grayscale-distinct  — a per-level glyph shape (5 unique outlines), and
 *   2. accessible to AT     — a rendered level label (sr-only), and
 *   3. component-guaranteed — present even with an EMPTY slot / no title.
 *
 * SCOPE IS THE POINT. This gate previously covered StatusBadge and AlertBanner
 * only — the two components built for alerts — while TelemetryValue,
 * CoordinateValue and Progress shipped `level` as a bare text/fill color. It read
 * as coverage of the invariant and was coverage of two fifths of it. Any new
 * component taking `level` belongs in LADDER_COMPONENTS below, and a `level` prop
 * that cannot satisfy this contract is a component that should not take `level`.
 *
 * Progress is the deliberate exception to (1): a track has no room for a glyph,
 * so its non-color channel is `aria-valuetext`. It is gated here rather than
 * excused, so the exception stays visible.
 */

const LEVELS = Object.keys(STATUS_GLYPHS) as StatusLevel[];

/** Components whose `level` must carry a glyph AND an sr-only word. */
const GLYPH_COMPONENTS = [
  { name: 'StatusBadge', component: StatusBadge, props: () => ({}), slots: { default: '' } },
  { name: 'AlertBanner', component: AlertBanner, props: () => ({}), slots: undefined },
  { name: 'TelemetryValue', component: TelemetryValue, props: () => ({ value: 99 }), slots: undefined },
  { name: 'CoordinateValue', component: CoordinateValue, props: () => ({ lat: 47.37, lon: 8.54 }), slots: undefined },
] as const;

describe('non-color status cue', () => {
  it('uses a distinct glyph shape per level (grayscale-distinguishable)', () => {
    const shapes = LEVELS.map((l) => STATUS_GLYPHS[l]);
    expect(new Set(shapes).size).toBe(LEVELS.length);
  });

  for (const { name, component, props, slots } of GLYPH_COMPONENTS) {
    describe.each(LEVELS)(`${name} — %s`, (level) => {
      it('conveys the level with no consumer content (not color-only)', () => {
        const w = mount(component, {
          props: { ...props(), level },
          ...(slots ? { slots } : {}),
        });
        // AT cue: the level word is in the accessible text regardless of content.
        expect(w.text().toLowerCase()).toContain(level);
        // Visual cue: the per-level glyph outline is rendered.
        expect(w.find('path').attributes('d')).toBe(STATUS_GLYPHS[level]);
      });

      it('has no axe violations with no consumer content', async () => {
        const w = mount(component, {
          props: { ...props(), level },
          ...(slots ? { slots } : {}),
        });
        expect(await axe(w.element)).toHaveNoViolations();
      });
    });
  }

  describe.each(LEVELS)('Progress — %s', (level) => {
    it('announces the level through aria-valuetext, not fill color alone', () => {
      const w = mount(Progress, { props: { value: 40, level } });
      expect(w.attributes('aria-valuetext')).toContain(STATUS_LABELS[level]);
    });

    it('has no axe violations', async () => {
      const w = mount(Progress, { props: { value: 40, level } });
      expect(await axe(w.element)).toHaveNoViolations();
    });
  });

  it('leaves aria-valuetext to the platform when Progress has no level', () => {
    const w = mount(Progress, { props: { value: 40 } });
    expect(w.attributes('aria-valuetext')).toBeUndefined();
  });

  // Positive control. Every component above satisfies the contract, so without a
  // deliberately broken input a matcher that silently stopped matching would leave
  // a permanently-green gate that checks nothing — the exact failure mode that let
  // three components ship `level` as color-only under a passing suite.
  it('actually fails a component whose level is color-only', () => {
    const ColorOnly = {
      props: { level: { type: String, required: true } },
      template: '<span :class="`text-${level}-emphasis`">42</span>',
    };
    const w = mount(ColorOnly, { props: { level: 'alarm' } });
    expect(w.text().toLowerCase()).not.toContain('alarm');
    expect(w.find('path').exists()).toBe(false);
  });
});
