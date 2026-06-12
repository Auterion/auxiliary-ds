import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test-utils/a11y';
import AlertBanner from '../AlertBanner.vue';
import type { StatusLevel } from '../status-glyphs';

const LEVELS: StatusLevel[] = ['alarm', 'warning', 'caution', 'advisory', 'nominal'];

describe('AlertBanner', () => {
  it('maps every level to its expected background, foreground and border color class', () => {
    for (const level of LEVELS) {
      const wrapper = mount(AlertBanner, {
        props: { level, description: `${level} message` },
      });
      const classes = wrapper.classes();
      expect(classes).toContain(`bg-${level}`);
      expect(classes).toContain(`text-${level}-foreground`);
      expect(classes).toContain(`border-${level}`);
    }
  });

  it('renders as an alert region with role="alert"', () => {
    const wrapper = mount(AlertBanner, {
      props: { level: 'alarm', title: 'Engine failure' },
    });
    expect(wrapper.attributes('role')).toBe('alert');
  });

  it('renders the title (prop and slot) and description (prop and slot)', () => {
    const propWrapper = mount(AlertBanner, {
      props: { level: 'warning', title: 'Low battery', description: 'Land soon' },
    });
    expect(propWrapper.text()).toContain('Low battery');
    expect(propWrapper.text()).toContain('Land soon');

    const slotWrapper = mount(AlertBanner, {
      props: { level: 'warning' },
      slots: { title: 'Slot title', default: 'Slot body' },
    });
    expect(slotWrapper.text()).toContain('Slot title');
    expect(slotWrapper.text()).toContain('Slot body');
  });

  it('renders an action button only when actionLabel is set and emits "action" on click', async () => {
    const without = mount(AlertBanner, { props: { level: 'advisory', title: 'Info' } });
    expect(without.find('button').exists()).toBe(false);

    const wrapper = mount(AlertBanner, {
      props: { level: 'advisory', title: 'Info', actionLabel: 'Acknowledge' },
    });
    const button = wrapper.get('button');
    expect(button.text()).toBe('Acknowledge');
    await button.trigger('click');
    expect(wrapper.emitted('action')).toHaveLength(1);
  });

  it('renders a labelled dismiss button only when dismissible and emits "dismiss" on click', async () => {
    const without = mount(AlertBanner, { props: { level: 'caution', title: 'Check' } });
    expect(without.find('button[aria-label="Dismiss"]').exists()).toBe(false);

    const wrapper = mount(AlertBanner, {
      props: { level: 'caution', title: 'Check', dismissible: true },
    });
    const dismiss = wrapper.get('button[aria-label="Dismiss"]');
    await dismiss.trigger('click');
    expect(wrapper.emitted('dismiss')).toHaveLength(1);
  });

  it('marks the status icon as decorative (aria-hidden)', () => {
    const wrapper = mount(AlertBanner, { props: { level: 'nominal', title: 'All systems go' } });
    const icon = wrapper.find('svg[aria-hidden="true"]');
    expect(icon.exists()).toBe(true);
  });

  // Load-bearing a11y invariant (mirrors StatusBadge): operational status must never be
  // conveyed by color alone — a textual title/description is always rendered alongside color.
  it('never conveys status by color alone — text content is always present', () => {
    for (const level of LEVELS) {
      const wrapper = mount(AlertBanner, {
        props: { level, title: `${level} title`, description: `${level} detail` },
      });
      expect(wrapper.text().trim().length).toBeGreaterThan(0);
      expect(wrapper.text()).toContain(`${level} title`);
    }
  });

  it('has no axe violations', async () => {
    const wrapper = mount(AlertBanner, {
      props: {
        level: 'warning',
        title: 'Low battery',
        description: 'Return to base',
        dismissible: true,
        actionLabel: 'Acknowledge',
      },
    });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});
