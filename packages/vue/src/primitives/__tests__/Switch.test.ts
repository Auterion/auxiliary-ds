import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test-utils/a11y';
import Switch from '../Switch.vue';

describe('Switch', () => {
  it('renders a switch role with thumb and reflects the unchecked default state', () => {
    const wrapper = mount(Switch);
    const root = wrapper.find('[role="switch"]');
    expect(root.exists()).toBe(true);
    expect(root.attributes('data-state')).toBe('unchecked');
    expect(root.attributes('aria-checked')).toBe('false');
  });

  it('reflects the checked prop via data-state and aria-checked', async () => {
    const wrapper = mount(Switch, { props: { modelValue: true } });
    const root = wrapper.find('[role="switch"]');
    expect(root.attributes('data-state')).toBe('checked');
    expect(root.attributes('aria-checked')).toBe('true');
  });

  it('emits update:modelValue when toggled by click', async () => {
    const wrapper = mount(Switch, { props: { modelValue: false } });
    await wrapper.find('[role="switch"]').trigger('click');
    const emitted = wrapper.emitted('update:modelValue');
    expect(emitted).toBeTruthy();
    expect(emitted![0]).toEqual([true]);
  });

  it('updates rendered state when the controlled prop changes', async () => {
    const wrapper = mount(Switch, { props: { modelValue: false } });
    expect(wrapper.find('[role="switch"]').attributes('data-state')).toBe('unchecked');
    await wrapper.setProps({ modelValue: true });
    expect(wrapper.find('[role="switch"]').attributes('data-state')).toBe('checked');
  });

  it('does not toggle when disabled', async () => {
    const wrapper = mount(Switch, { props: { modelValue: false, disabled: true } });
    const root = wrapper.find('[role="switch"]');
    expect(root.attributes('disabled')).toBeDefined();
    await root.trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeFalsy();
  });

  it('forwards the name prop for form association', () => {
    const wrapper = mount(Switch, { props: { name: 'notifications', modelValue: true } });
    // Reka renders a hidden input carrying the name/value for native form submission.
    const hidden = wrapper.find('input[name="notifications"]');
    expect(hidden.exists()).toBe(true);
  });

  it('has no axe violations when given an accessible name', async () => {
    const wrapper = mount(Switch, {
      attrs: { 'aria-label': 'Enable notifications' },
    });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});
