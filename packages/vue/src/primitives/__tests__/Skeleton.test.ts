import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test-utils/a11y';
import Skeleton from '../Skeleton.vue';

describe('Skeleton', () => {
  it('renders a span element', () => {
    const wrapper = mount(Skeleton);
    expect(wrapper.element.tagName).toBe('SPAN');
  });

  it('is aria-hidden so it is ignored by assistive tech', () => {
    const wrapper = mount(Skeleton);
    expect(wrapper.attributes('aria-hidden')).toBe('true');
  });

  it('applies the shimmer/placeholder utility classes', () => {
    const wrapper = mount(Skeleton);
    const classes = wrapper.classes();
    expect(classes).toContain('block');
    expect(classes).toContain('animate-pulse');
    expect(classes).toContain('rounded');
    expect(classes).toContain('bg-muted');
  });

  it('merges sizing utilities passed via class', () => {
    const wrapper = mount(Skeleton, { attrs: { class: 'h-4 w-32' } });
    const classes = wrapper.classes();
    expect(classes).toContain('h-4');
    expect(classes).toContain('w-32');
    // base classes are preserved alongside the consumer-provided ones
    expect(classes).toContain('animate-pulse');
    expect(classes).toContain('bg-muted');
  });

  it('has no axe violations', async () => {
    const wrapper = mount(Skeleton, { attrs: { class: 'h-4 w-32' } });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});
