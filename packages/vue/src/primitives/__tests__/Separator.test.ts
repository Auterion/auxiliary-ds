import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test-utils/a11y';
import Separator from '../Separator.vue';

describe('Separator', () => {
  it('defaults to a decorative horizontal rule', () => {
    const wrapper = mount(Separator);
    expect(wrapper.attributes('data-orientation')).toBe('horizontal');
    // decorative defaults to true → role="none", no separator semantics
    expect(wrapper.attributes('role')).toBe('none');
    expect(wrapper.attributes('aria-orientation')).toBeUndefined();
  });

  it('applies horizontal border classes by default', () => {
    const wrapper = mount(Separator);
    const classes = wrapper.classes();
    expect(classes).toContain('border-t');
    expect(classes).toContain('border-border');
    expect(classes).toContain('h-px');
    expect(classes).toContain('w-full');
    expect(classes).toContain('bg-transparent');
    expect(classes).not.toContain('border-l');
  });

  it('applies vertical border classes when orientation="vertical"', () => {
    const wrapper = mount(Separator, { props: { orientation: 'vertical' } });
    expect(wrapper.attributes('data-orientation')).toBe('vertical');
    const classes = wrapper.classes();
    expect(classes).toContain('border-l');
    expect(classes).toContain('w-px');
    expect(classes).toContain('h-full');
    expect(classes).not.toContain('border-t');
  });

  it('exposes separator semantics when decorative=false', () => {
    const wrapper = mount(Separator, { props: { decorative: false } });
    expect(wrapper.attributes('role')).toBe('separator');
  });

  it('sets aria-orientation for a non-decorative vertical separator', () => {
    const wrapper = mount(Separator, {
      props: { decorative: false, orientation: 'vertical' },
    });
    expect(wrapper.attributes('role')).toBe('separator');
    expect(wrapper.attributes('aria-orientation')).toBe('vertical');
  });

  it('has no axe violations as a non-decorative separator', async () => {
    const wrapper = mount(Separator, { props: { decorative: false } });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });

  it('has no axe violations as a decorative separator', async () => {
    const wrapper = mount(Separator);
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});
