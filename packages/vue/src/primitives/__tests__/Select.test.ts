import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick, defineComponent, h } from 'vue';
import { axe } from '../../test-utils/a11y';
import Select from '../Select/Select.vue';
import SelectTrigger from '../Select/SelectTrigger.vue';
import SelectValue from '../Select/SelectValue.vue';
import SelectContent from '../Select/SelectContent.vue';
import SelectItem from '../Select/SelectItem.vue';
import SelectSeparator from '../Select/SelectSeparator.vue';

// Reka teleports SelectContent into document.body. Build a fresh harness component
// per test and unmount it afterwards so Vue tears down its own teleported nodes.
function harness(rootProps: Record<string, unknown> = {}, contentProps: Record<string, unknown> = {}) {
  return defineComponent({
    setup() {
      return () =>
        h(Select, rootProps, () => [
          h(SelectTrigger, () => h(SelectValue, { placeholder: 'Pick a unit' })),
          h(SelectContent, contentProps, () => [
            h(SelectItem, { value: 'metric' }, () => 'Metric'),
            h(SelectSeparator),
            h(SelectItem, { value: 'imperial' }, () => 'Imperial'),
            h(SelectItem, { value: 'nautical', disabled: true }, () => 'Nautical'),
          ]),
        ]);
    },
  });
}

describe('Select', () => {
  it('renders the trigger with placeholder but keeps content out of the DOM while closed', () => {
    const wrapper = mount(harness());
    expect(wrapper.text()).toContain('Pick a unit');
    // Content is portalled and only mounted when open.
    expect(document.body.textContent).not.toContain('Imperial');
    wrapper.unmount();
  });

  it('exposes the trigger as a combobox button that is collapsed when closed', () => {
    const wrapper = mount(harness());
    const trigger = wrapper.find('button');
    expect(trigger.exists()).toBe(true);
    expect(trigger.attributes('role')).toBe('combobox');
    expect(trigger.attributes('aria-expanded')).toBe('false');
    wrapper.unmount();
  });

  it('applies the design-system trigger classes', () => {
    const wrapper = mount(harness());
    const trigger = wrapper.find('button');
    const cls = trigger.classes();
    expect(cls).toContain('border-input');
    expect(cls).toContain('bg-background');
    expect(cls).toContain('rounded-md');
    // placeholder state is styled as muted
    expect(cls).toContain('data-[placeholder]:text-muted-foreground');
    wrapper.unmount();
  });

  it('teleports the listbox and items to document.body when defaultOpen is set', async () => {
    const wrapper = mount(harness({ defaultOpen: true }));
    await nextTick();

    const listbox = document.body.querySelector('[role="listbox"]');
    expect(listbox).not.toBeNull();
    expect(document.body.textContent).toContain('Metric');
    expect(document.body.textContent).toContain('Imperial');
    expect(document.body.textContent).toContain('Nautical');
    wrapper.unmount();
  });

  it('renders items with the option role and marks disabled items as disabled', async () => {
    const wrapper = mount(harness({ defaultOpen: true }));
    await nextTick();

    const options = Array.from(document.body.querySelectorAll('[role="option"]'));
    expect(options.length).toBe(3);

    const disabled = options.find((o) => o.textContent?.includes('Nautical'));
    expect(disabled).toBeTruthy();
    expect(disabled?.getAttribute('aria-disabled')).toBe('true');
    expect(disabled?.getAttribute('data-disabled')).not.toBeNull();
    wrapper.unmount();
  });

  it('reflects a controlled modelValue as the selected option', async () => {
    const wrapper = mount(harness({ defaultOpen: true, modelValue: 'imperial' }));
    await nextTick();

    const selected = document.body.querySelector('[role="option"][aria-selected="true"]');
    expect(selected).not.toBeNull();
    expect(selected?.textContent).toContain('Imperial');
    wrapper.unmount();
  });

  it('renders a separator within the open content', async () => {
    const wrapper = mount(harness({ defaultOpen: true }));
    await nextTick();

    const sep = document.body.querySelector('.border-t.border-border');
    expect(sep).not.toBeNull();
    wrapper.unmount();
  });

  it('has no axe violations in its closed (trigger) state when the trigger is labelled', async () => {
    // A Select trigger is a combobox button; it needs an accessible name. Consumers
    // supply one via aria-label (forwarded to the underlying Reka trigger). With a
    // name present, the closed component is clean.
    const labelled = defineComponent({
      setup() {
        return () =>
          h(Select, null, () =>
            h(SelectTrigger, { 'aria-label': 'Unit system' }, () =>
              h(SelectValue, { placeholder: 'Pick a unit' }),
            ),
          );
      },
    });
    const wrapper = mount(labelled);
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });

  // SelectContent forwards aria-label onto the role="listbox" element, giving the listbox an
  // accessible name. axe is scoped to the listbox subtree: Reka's focus-guard spans
  // (tabindex="0" + aria-hidden) are rendered as siblings *outside* the listbox and trip an
  // unrelated upstream `aria-hidden-focus` rule, so they are not part of this component's surface.
  it('gives the open listbox an accessible name with no axe violations', async () => {
    const wrapper = mount(harness({ defaultOpen: true }, { 'aria-label': 'Measurement unit' }));
    await nextTick();

    const listbox = document.body.querySelector('[role="listbox"]');
    expect(listbox).not.toBeNull();
    expect(listbox!.getAttribute('aria-label')).toBe('Measurement unit');

    const results = await axe(listbox as HTMLElement);
    expect(results).toHaveNoViolations();
    wrapper.unmount();
  });
});
