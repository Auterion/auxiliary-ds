import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick } from 'vue';
import { axe } from '../../test-utils/a11y';
import Combobox from '../Combobox/Combobox.vue';
import ComboboxInput from '../Combobox/ComboboxInput.vue';
import ComboboxContent from '../Combobox/ComboboxContent.vue';
import ComboboxItem from '../Combobox/ComboboxItem.vue';
import ComboboxEmpty from '../Combobox/ComboboxEmpty.vue';
import ComboboxSeparator from '../Combobox/ComboboxSeparator.vue';

// Reka teleports ComboboxContent into document.body. Fresh harness per test;
// unmount after so Vue tears down teleported nodes.
function harness(rootProps: Record<string, unknown> = {}, inputProps: Record<string, unknown> = {}) {
  return defineComponent({
    setup() {
      return () =>
        h(Combobox, rootProps, () => [
          h(ComboboxInput, { placeholder: 'Search units…', ...inputProps }),
          h(ComboboxContent, () => [
            h(ComboboxEmpty, () => 'No results.'),
            h(ComboboxItem, { value: 'metric' }, () => 'Metric'),
            h(ComboboxSeparator),
            h(ComboboxItem, { value: 'imperial' }, () => 'Imperial'),
            h(ComboboxItem, { value: 'nautical', disabled: true }, () => 'Nautical'),
          ]),
        ]);
    },
  });
}

describe('Combobox', () => {
  it('renders a text input and keeps the list out of the DOM while closed', () => {
    const wrapper = mount(harness());
    const input = wrapper.find('input');
    expect(input.exists()).toBe(true);
    expect(input.attributes('placeholder')).toBe('Search units…');
    expect(document.body.textContent).not.toContain('Imperial');
    wrapper.unmount();
  });

  it('teleports the listbox and options to document.body when open', async () => {
    const wrapper = mount(harness({ open: true }));
    await nextTick();
    expect(document.body.querySelector('[role="listbox"]')).not.toBeNull();
    const options = document.body.querySelectorAll('[role="option"]');
    expect(options.length).toBe(3);
    expect(document.body.textContent).toContain('Metric');
    expect(document.body.textContent).toContain('Imperial');
    wrapper.unmount();
  });

  it('marks a disabled option as disabled', async () => {
    const wrapper = mount(harness({ open: true }));
    await nextTick();
    const nautical = Array.from(document.body.querySelectorAll('[role="option"]')).find((o) =>
      o.textContent?.includes('Nautical'),
    );
    expect(nautical?.getAttribute('data-disabled')).not.toBeNull();
    wrapper.unmount();
  });

  it('reflects a controlled modelValue as the selected option', async () => {
    const wrapper = mount(harness({ open: true, modelValue: 'imperial' }));
    await nextTick();
    const selected = document.body.querySelector('[role="option"][aria-selected="true"]');
    expect(selected?.textContent).toContain('Imperial');
    wrapper.unmount();
  });

  it('sets aria-invalid on the input and a destructive border on the anchor when invalid', () => {
    const wrapper = mount(harness({}, { invalid: true }));
    const input = wrapper.find('input');
    expect(input.attributes('aria-invalid')).toBe('true');
    // anchor wraps the input
    expect(input.element.closest('.border-destructive')).not.toBeNull();
    wrapper.unmount();
  });

  it('flexes the input height via the size prop', () => {
    const wrapper = mount(harness({}, { size: 'lg' }));
    expect(wrapper.find('input').element.closest('.h-10')).not.toBeNull();
    wrapper.unmount();
  });

  it('forwards aria-label onto the role="combobox" input and has no axe violations', async () => {
    const wrapper = mount(harness({}, { 'aria-label': 'Unit system' }), { attachTo: document.body });
    const input = wrapper.find('input');
    expect(input.attributes('aria-label')).toBe('Unit system');
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
    wrapper.unmount();
  });
});
