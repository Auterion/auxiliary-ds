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
    expect(classes).toContain('rounded-(--component-skeleton-radius)');
    expect(classes).toContain('bg-input');
  });

  it('merges sizing utilities passed via class', () => {
    const wrapper = mount(Skeleton, { attrs: { class: 'h-4 w-32' } });
    const classes = wrapper.classes();
    expect(classes).toContain('h-4');
    expect(classes).toContain('w-32');
    // base classes are preserved alongside the consumer-provided ones
    expect(classes).toContain('animate-pulse');
    expect(classes).toContain('bg-input');
  });

  it('shows the placeholder (not the slot) while loading, which is the default', () => {
    const wrapper = mount(Skeleton, { slots: { default: '<p>Real content</p>' } });
    expect(wrapper.classes()).toContain('animate-pulse');
    expect(wrapper.html()).not.toContain('Real content');
  });

  it('renders the default slot instead of the placeholder when loading is false', () => {
    const wrapper = mount(Skeleton, {
      props: { loading: false },
      slots: { default: '<p>Real content</p>' },
    });
    expect(wrapper.find('.animate-pulse').exists()).toBe(false);
    expect(wrapper.html()).toContain('Real content');
  });

  it('has no axe violations', async () => {
    const wrapper = mount(Skeleton, { attrs: { class: 'h-4 w-32' } });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});
