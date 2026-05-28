import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test-utils/a11y';
import StatusBadge, { type StatusLevel } from '../StatusBadge.vue';

const LEVELS: StatusLevel[] = ['alarm', 'warning', 'caution', 'advisory', 'nominal'];

describe('StatusBadge', () => {
  it('renders the slotted label text', () => {
    const wrapper = mount(StatusBadge, {
      props: { level: 'alarm' },
      slots: { default: 'ENGINE FAIL' },
    });
    expect(wrapper.text()).toContain('ENGINE FAIL');
  });

  it('applies the solid level color for every level', () => {
    for (const level of LEVELS) {
      const wrapper = mount(StatusBadge, { props: { level }, slots: { default: level } });
      expect(wrapper.classes()).toContain(`bg-${level}`);
    }
  });

  it('uses border-only color in the outline variant', () => {
    const wrapper = mount(StatusBadge, {
      props: { level: 'caution', variant: 'outline' },
      slots: { default: 'CHECK' },
    });
    expect(wrapper.classes()).toContain('text-caution');
    expect(wrapper.classes()).not.toContain('bg-caution');
  });

  it('renders an aria-hidden dot only when dot=true', () => {
    const without = mount(StatusBadge, { props: { level: 'nominal' }, slots: { default: 'OK' } });
    expect(without.find('[aria-hidden="true"]').exists()).toBe(false);

    const withDot = mount(StatusBadge, {
      props: { level: 'nominal', dot: true },
      slots: { default: 'OK' },
    });
    const dot = withDot.find('[aria-hidden="true"]');
    expect(dot.exists()).toBe(true);
  });

  // Load-bearing a11y invariant (see ROADMAP Phase 1): operational status must never be
  // conveyed by color alone — a text label is always rendered alongside the color.
  it('never conveys status by color alone — a text label is always present', () => {
    for (const level of LEVELS) {
      const wrapper = mount(StatusBadge, { props: { level }, slots: { default: `${level} state` } });
      expect(wrapper.text().trim().length).toBeGreaterThan(0);
    }
  });

  it('has no axe violations', async () => {
    const wrapper = mount(StatusBadge, { props: { level: 'warning' }, slots: { default: 'LOW BATTERY' } });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});
