import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test-utils/a11y';
import Progress from '../Progress.vue';

type Level = 'alarm' | 'warning' | 'caution' | 'advisory' | 'nominal';
const LEVELS: Level[] = ['alarm', 'warning', 'caution', 'advisory', 'nominal'];

// The reka-ui ProgressRoot renders the root element; the ProgressIndicator is the
// second <div> (the colored bar).
const indicator = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('div')[1];

describe('Progress', () => {
  it('renders the progressbar role with derived aria value attributes', () => {
    const wrapper = mount(Progress, { props: { value: 40 } });
    const root = wrapper.find('[role="progressbar"]');
    expect(root.exists()).toBe(true);
    expect(root.attributes('aria-valuemin')).toBe('0');
    expect(root.attributes('aria-valuemax')).toBe('100');
    expect(root.attributes('aria-valuenow')).toBe('40');
  });

  it('maps each level to its solid color class on the indicator', () => {
    for (const level of LEVELS) {
      const wrapper = mount(Progress, { props: { value: 50, level } });
      expect(indicator(wrapper).classes()).toContain(`bg-${level}`);
    }
  });

  it('falls back to bg-primary when no level is provided', () => {
    const wrapper = mount(Progress, { props: { value: 50 } });
    const classes = indicator(wrapper).classes();
    expect(classes).toContain('bg-primary');
    for (const level of LEVELS) {
      expect(classes).not.toContain(`bg-${level}`);
    }
  });

  it('translates the indicator proportionally to value/max', () => {
    // value 40 of 100 -> 60% remaining offset
    const a = mount(Progress, { props: { value: 40 } });
    expect(indicator(a).attributes('style')).toContain('translateX(-60%)');

    // respects a custom max: 30 of 60 == 50%
    const b = mount(Progress, { props: { value: 30, max: 60 } });
    expect(indicator(b).attributes('style')).toContain('translateX(-50%)');
  });

  it('clamps the visual offset for values above max and below zero', () => {
    const over = mount(Progress, { props: { value: 250, max: 100 } });
    expect(indicator(over).attributes('style')).toContain('translateX(-0%)');

    const under = mount(Progress, { props: { value: -50, max: 100 } });
    expect(indicator(under).attributes('style')).toContain('translateX(-100%)');
  });

  it('renders an indeterminate state with no aria-valuenow when value is null', () => {
    const wrapper = mount(Progress, { props: { value: null } });
    const root = wrapper.find('[role="progressbar"]');
    expect(root.attributes('data-state')).toBe('indeterminate');
    expect(root.attributes('aria-valuenow')).toBeUndefined();
    expect(indicator(wrapper).attributes('style')).toContain('translateX(-100%)');
  });

  // Load-bearing a11y invariant (mirrors StatusBadge): operational status must never be
  // conveyed by color alone. Even when a `level` color is applied, the numeric progress
  // value remains exposed to assistive tech via the progressbar's accessible name/value.
  it('never conveys status by color alone — the value stays exposed to assistive tech', () => {
    for (const level of LEVELS) {
      const wrapper = mount(Progress, { props: { value: 75, level } });
      const root = wrapper.find('[role="progressbar"]');
      expect(root.attributes('aria-valuenow')).toBe('75');
      expect(root.attributes('aria-label')).toBe('75%');
    }
  });

  it('has no axe violations', async () => {
    const wrapper = mount(Progress, { props: { value: 60, level: 'caution' } });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});
