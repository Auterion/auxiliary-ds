import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { axe } from '../../test-utils/a11y';
import Accordion from '../Accordion/Accordion.vue';
import AccordionItem from '../Accordion/AccordionItem.vue';
import AccordionTrigger from '../Accordion/AccordionTrigger.vue';
import AccordionContent from '../Accordion/AccordionContent.vue';

/**
 * Mounts a two-item accordion composed of all four parts. `props` is forwarded
 * to the root (e.g. type, collapsible, defaultValue, modelValue).
 */
function mountAccordion(props: Record<string, unknown> = {}) {
  return mount(Accordion, {
    props,
    slots: {
      default: () => [
        h(AccordionItem, { value: 'one' }, {
          default: () => [
            h(AccordionTrigger, {}, { default: () => 'Trigger One' }),
            h(AccordionContent, {}, { default: () => 'Panel one body' }),
          ],
        }),
        h(AccordionItem, { value: 'two', disabled: true }, {
          default: () => [
            h(AccordionTrigger, {}, { default: () => 'Trigger Two' }),
            h(AccordionContent, {}, { default: () => 'Panel two body' }),
          ],
        }),
      ],
    },
    attachTo: document.body,
  });
}

describe('Accordion', () => {
  it('renders all triggers and defaults to type="single" with everything collapsed', () => {
    const wrapper = mountAccordion();
    const triggers = wrapper.findAll('button');
    expect(triggers).toHaveLength(2);
    expect(wrapper.text()).toContain('Trigger One');
    expect(wrapper.text()).toContain('Trigger Two');

    // No panel is open by default, so each trigger is aria-expanded=false.
    for (const trigger of triggers) {
      expect(trigger.attributes('aria-expanded')).toBe('false');
    }
  });

  it('opens the matching panel when defaultValue is set', () => {
    const wrapper = mountAccordion({ defaultValue: 'one' });
    const firstTrigger = wrapper.findAll('button')[0];
    expect(firstTrigger.attributes('aria-expanded')).toBe('true');
    expect(firstTrigger.attributes('data-state')).toBe('open');
    expect(wrapper.text()).toContain('Panel one body');
  });

  it('expands a panel on trigger click and reflects open state', async () => {
    const wrapper = mountAccordion({ collapsible: true });
    const firstTrigger = wrapper.findAll('button')[0];
    expect(firstTrigger.attributes('aria-expanded')).toBe('false');

    await firstTrigger.trigger('click');
    await nextTick();

    expect(firstTrigger.attributes('aria-expanded')).toBe('true');
    expect(firstTrigger.attributes('data-state')).toBe('open');
  });

  it('switches active panel in single mode — opening one closes the other', async () => {
    // Item two is disabled in the helper, so use a fresh non-disabled pair here.
    const wrapper = mount(Accordion, {
      props: { type: 'single' },
      slots: {
        default: () => [
          h(AccordionItem, { value: 'a' }, {
            default: () => [
              h(AccordionTrigger, {}, { default: () => 'A' }),
              h(AccordionContent, {}, { default: () => 'Body A' }),
            ],
          }),
          h(AccordionItem, { value: 'b' }, {
            default: () => [
              h(AccordionTrigger, {}, { default: () => 'B' }),
              h(AccordionContent, {}, { default: () => 'Body B' }),
            ],
          }),
        ],
      },
      attachTo: document.body,
    });

    const [a, b] = wrapper.findAll('button');
    await a.trigger('click');
    await nextTick();
    expect(a.attributes('aria-expanded')).toBe('true');
    expect(b.attributes('aria-expanded')).toBe('false');

    await b.trigger('click');
    await nextTick();
    expect(a.attributes('aria-expanded')).toBe('false');
    expect(b.attributes('aria-expanded')).toBe('true');
  });

  it('emits update:modelValue when a panel is toggled', async () => {
    const wrapper = mountAccordion({ collapsible: true, modelValue: '' });
    await wrapper.findAll('button')[0].trigger('click');
    await nextTick();

    const emitted = wrapper.emitted('update:modelValue');
    expect(emitted).toBeTruthy();
    expect(emitted!.at(-1)).toEqual(['one']);
  });

  it('marks a disabled item as disabled and prevents it from opening', async () => {
    const wrapper = mountAccordion();
    const secondTrigger = wrapper.findAll('button')[1];
    expect(secondTrigger.attributes('disabled')).toBeDefined();

    await secondTrigger.trigger('click');
    await nextTick();
    expect(secondTrigger.attributes('aria-expanded')).toBe('false');
  });

  it('wires the root container class and item separators', () => {
    const wrapper = mountAccordion();
    // Root forwards w-full.
    expect(wrapper.classes()).toContain('w-full');
    // Each item renders a bottom border separator.
    const items = wrapper.findAll('.border-b');
    expect(items.length).toBeGreaterThanOrEqual(2);
  });

  it('has no axe violations with an open panel', async () => {
    const wrapper = mountAccordion({ defaultValue: 'one' });
    await nextTick();
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});
