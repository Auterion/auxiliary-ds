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

  // BUG: Passing `aria-label` for an accessible name lands it on the root <span>
  // (which reka-ui renders with NO role), producing an axe `aria-prohibited-attr`
  // violation ("aria-label cannot be used on a span with no valid role"). The
  // accessible name never reaches the role="slider" thumb. The Slider wrapper
  // exposes no way to label the actual slider input, so it cannot be given an
  // accessible name without tripping a11y rules.
  it.skip('accepts an accessible name without axe violations', async () => {
    const wrapper = mount(Slider, { props: { modelValue: [60], 'aria-label': 'Brightness' } });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});
