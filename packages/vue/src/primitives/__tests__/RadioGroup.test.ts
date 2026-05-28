import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test-utils/a11y';
import RadioGroup from '../RadioGroup/RadioGroup.vue';
import RadioGroupItem from '../RadioGroup/RadioGroupItem.vue';

// Mounts a RadioGroup with three items so we can exercise selection/keyboard behavior.
function mountGroup(rootProps: Record<string, unknown> = {}, itemProps: Record<string, unknown>[] = []) {
  return mount(RadioGroup, {
    props: rootProps,
    attrs: { 'aria-label': 'Pick a flight mode' },
    slots: {
      default: () =>
        [
          { value: 'manual', label: 'Manual', ...(itemProps[0] ?? {}) },
          { value: 'auto', label: 'Auto', ...(itemProps[1] ?? {}) },
          { value: 'mission', label: 'Mission', ...(itemProps[2] ?? {}) },
        ].map((o) =>
          mountItem(o),
        ),
    },
  });
}

import { h } from 'vue';
function mountItem(o: Record<string, unknown>) {
  return h(RadioGroupItem, {
    value: o.value as string,
    disabled: o.disabled as boolean | undefined,
    'aria-label': o.label as string,
  });
}

describe('RadioGroup', () => {
  it('renders a radiogroup with one radio per item', () => {
    const wrapper = mountGroup();
    expect(wrapper.find('[role="radiogroup"]').exists()).toBe(true);
    const radios = wrapper.findAll('[role="radio"]');
    expect(radios).toHaveLength(3);
    // unchecked by default
    radios.forEach((r) => {
      expect(r.attributes('aria-checked')).toBe('false');
      expect(r.attributes('data-state')).toBe('unchecked');
    });
  });

  it('reflects the controlled modelValue as the checked radio', () => {
    const wrapper = mountGroup({ modelValue: 'auto' });
    const radios = wrapper.findAll('[role="radio"]');
    expect(radios[0].attributes('aria-checked')).toBe('false');
    expect(radios[1].attributes('aria-checked')).toBe('true');
    expect(radios[1].attributes('data-state')).toBe('checked');
    // checked item shows the indicator dot
    expect(radios[1].find('span').exists()).toBe(true);
  });

  it('emits update:modelValue with the clicked value', async () => {
    const wrapper = mountGroup();
    await wrapper.findAll('[role="radio"]')[2].trigger('click');
    const emitted = wrapper.emitted('update:modelValue');
    expect(emitted).toBeTruthy();
    expect(emitted![0]).toEqual(['mission']);
  });

  it('updates the checked radio after setProps changes modelValue', async () => {
    const wrapper = mountGroup({ modelValue: 'manual' });
    let radios = wrapper.findAll('[role="radio"]');
    expect(radios[0].attributes('aria-checked')).toBe('true');

    await wrapper.setProps({ modelValue: 'mission' });
    radios = wrapper.findAll('[role="radio"]');
    expect(radios[0].attributes('aria-checked')).toBe('false');
    expect(radios[2].attributes('aria-checked')).toBe('true');
  });

  it('marks a disabled item and does not select it on click', async () => {
    const wrapper = mountGroup({}, [{}, { disabled: true }]);
    const radios = wrapper.findAll('[role="radio"]');
    const disabled = radios[1];
    expect(disabled.attributes('disabled')).toBeDefined();
    expect(disabled.attributes('data-disabled')).toBeDefined();

    await disabled.trigger('click');
    expect(wrapper.emitted('update:modelValue')).toBeUndefined();
  });

  it('applies orientation classes on the root', () => {
    const vertical = mountGroup();
    expect(vertical.find('[role="radiogroup"]').classes()).toContain('flex-col');

    const horizontal = mountGroup({ orientation: 'horizontal' });
    expect(horizontal.find('[role="radiogroup"]').classes()).toContain('flex-row');
  });

  it('forwards the group name to a hidden input for form submission', () => {
    const wrapper = mountGroup({ name: 'flightMode', modelValue: 'auto' });
    // Reka renders a single visually-hidden bubble input carrying the group name/value.
    const input = wrapper.find('input[name="flightMode"]');
    expect(input.exists()).toBe(true);
    expect(input.attributes('value')).toBe('auto');
  });

  it('has no axe violations', async () => {
    const wrapper = mountGroup({ modelValue: 'manual' });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});
