import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test-utils/a11y';
import Slider from '../Slider.vue';

describe('Slider', () => {
  it('renders a slider thumb with the expected role and bounds', () => {
    const wrapper = mount(Slider, { props: { modelValue: [40] } });
    const thumb = wrapper.find('[role="slider"]');
    expect(thumb.exists()).toBe(true);
    expect(thumb.attributes('aria-valuemin')).toBe('0');
    expect(thumb.attributes('aria-valuemax')).toBe('100');
  });

  it('renders one thumb per value for a range slider', () => {
    const wrapper = mount(Slider, { props: { modelValue: [20, 80] } });
    expect(wrapper.findAll('[role="slider"]')).toHaveLength(2);
  });

  it('renders a single thumb by default when no value is provided', () => {
    const wrapper = mount(Slider);
    expect(wrapper.findAll('[role="slider"]')).toHaveLength(1);
  });

  it('honors custom min/max bounds on the thumb', () => {
    const wrapper = mount(Slider, { props: { modelValue: [5], min: 0, max: 10 } });
    const thumb = wrapper.find('[role="slider"]');
    expect(thumb.attributes('aria-valuemin')).toBe('0');
    expect(thumb.attributes('aria-valuemax')).toBe('10');
  });

  it('emits update:modelValue when the value changes via keyboard', async () => {
    const wrapper = mount(Slider, {
      props: { modelValue: [50] },
      attachTo: document.body,
    });
    const thumb = wrapper.find('[role="slider"]');
    await thumb.trigger('keydown', { key: 'ArrowRight' });

    const emitted = wrapper.emitted('update:modelValue');
    expect(emitted).toBeTruthy();
    expect(emitted![0]).toEqual([[51]]);
    wrapper.unmount();
  });

  it('does not emit value changes while disabled', async () => {
    const wrapper = mount(Slider, {
      props: { modelValue: [30], disabled: true },
      attachTo: document.body,
    });
    const thumb = wrapper.find('[role="slider"]');
    // Reka flags the disabled state on the thumb element.
    expect(thumb.attributes('data-disabled')).toBeDefined();

    await thumb.trigger('keydown', { key: 'ArrowRight' });
    expect(wrapper.emitted('update:modelValue')).toBeFalsy();
    wrapper.unmount();
  });

  it('reflects vertical orientation on the thumb', () => {
    const wrapper = mount(Slider, {
      props: { modelValue: [25], orientation: 'vertical' },
    });
    const thumb = wrapper.find('[role="slider"]');
    expect(thumb.attributes('aria-orientation')).toBe('vertical');
  });

  it('has no axe violations in its default rendered state', async () => {
    const wrapper = mount(Slider, { props: { modelValue: [60] } });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });

  // An accessible name routes to the role="slider" thumb, not the role-less root <span>.
  it('routes an accessible name to the slider thumb without axe violations', async () => {
    const wrapper = mount(Slider, { props: { modelValue: [60], 'aria-label': 'Brightness' } });
    const thumb = wrapper.find('[role="slider"]');
    expect(thumb.attributes('aria-label')).toBe('Brightness');
    // The prohibited attr must NOT be on the role-less root.
    expect(wrapper.element.getAttribute('aria-label')).toBeNull();
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});
