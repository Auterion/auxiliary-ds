import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test-utils/a11y';
import Checkbox from '../Checkbox.vue';

describe('Checkbox', () => {
  it('renders a button with role="checkbox" reflecting the unchecked state', () => {
    const wrapper = mount(Checkbox, { props: { modelValue: false } });
    const root = wrapper.get('[role="checkbox"]');
    expect(root.element.tagName).toBe('BUTTON');
    expect(root.attributes('aria-checked')).toBe('false');
    expect(root.attributes('data-state')).toBe('unchecked');
    // no indicator svg when unchecked
    expect(wrapper.find('svg').exists()).toBe(false);
  });

  it('reflects the checked state and renders the check indicator', () => {
    const wrapper = mount(Checkbox, { props: { modelValue: true } });
    const root = wrapper.get('[role="checkbox"]');
    expect(root.attributes('aria-checked')).toBe('true');
    expect(root.attributes('data-state')).toBe('checked');
    // checkmark (polyline), not the indeterminate line
    expect(wrapper.find('polyline').exists()).toBe(true);
    expect(wrapper.find('line').exists()).toBe(false);
  });

  it('renders the indeterminate indicator and exposes aria-checked="mixed"', () => {
    const wrapper = mount(Checkbox, { props: { modelValue: 'indeterminate' } });
    const root = wrapper.get('[role="checkbox"]');
    expect(root.attributes('aria-checked')).toBe('mixed');
    expect(root.attributes('data-state')).toBe('indeterminate');
    // indeterminate renders the horizontal line, not the checkmark
    expect(wrapper.find('line').exists()).toBe(true);
    expect(wrapper.find('polyline').exists()).toBe(false);
  });

  it('emits update:modelValue with the toggled value on click', async () => {
    const wrapper = mount(Checkbox, { props: { modelValue: false } });
    await wrapper.get('[role="checkbox"]').trigger('click');
    const emitted = wrapper.emitted('update:modelValue');
    expect(emitted).toBeTruthy();
    expect(emitted![0]).toEqual([true]);
  });

  it('does not emit when disabled and reflects the disabled attribute', async () => {
    const wrapper = mount(Checkbox, { props: { modelValue: false, disabled: true } });
    const root = wrapper.get('[role="checkbox"]');
    expect(root.attributes('disabled')).toBeDefined();
    expect(root.attributes('data-disabled')).toBeDefined();
    await root.trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('renders a hidden form input carrying name and value for form submission', () => {
    const wrapper = mount(Checkbox, {
      props: { modelValue: true, name: 'terms', value: 'accepted' },
    });
    const input = wrapper.get('input[type="checkbox"]');
    expect(input.attributes('name')).toBe('terms');
    expect(input.attributes('value')).toBe('accepted');
  });

  it('sets aria-invalid and a destructive border on the root when invalid', () => {
    const wrapper = mount(Checkbox, { props: { modelValue: false, invalid: true } });
    const root = wrapper.get('[role="checkbox"]');
    expect(root.attributes('aria-invalid')).toBe('true');
    expect(root.classes()).toContain('border-destructive');
    // `invalid` is consumed, not leaked as a DOM attribute
    expect(root.attributes('invalid')).toBeUndefined();
  });

  it('forwards aria-label to the checkbox root', () => {
    const wrapper = mount(Checkbox, {
      attrs: { 'aria-label': 'Accept terms' },
      props: { modelValue: false },
    });
    expect(wrapper.get('[role="checkbox"]').attributes('aria-label')).toBe('Accept terms');
  });

  it('has no axe violations when given an accessible name', async () => {
    const wrapper = mount(Checkbox, {
      attrs: { 'aria-label': 'Accept terms and conditions' },
      props: { modelValue: false },
    });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});
