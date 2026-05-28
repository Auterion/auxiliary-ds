import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { axe } from '../../test-utils/a11y';
import Tabs from '../Tabs/Tabs.vue';
import TabsList from '../Tabs/TabsList.vue';
import TabsTrigger from '../Tabs/TabsTrigger.vue';
import TabsContent from '../Tabs/TabsContent.vue';

/**
 * Composes the four parts into a representative tabs tree.
 * `props` is forwarded to the <Tabs> root (e.g. defaultValue, modelValue).
 */
function mountTabs(props: Record<string, unknown> = {}) {
  return mount(Tabs, {
    props,
    slots: {
      default: () => [
        h(TabsList, () => [
          h(TabsTrigger, { value: 'account' }, () => 'Account'),
          h(TabsTrigger, { value: 'password' }, () => 'Password'),
          h(TabsTrigger, { value: 'locked', disabled: true }, () => 'Locked'),
        ]),
        h(TabsContent, { value: 'account' }, () => 'Account panel'),
        h(TabsContent, { value: 'password' }, () => 'Password panel'),
      ],
    },
  });
}

// reka-ui activates a tab on left mousedown / focus / Enter+Space — NOT on a
// plain `click`. Use mousedown(button:0) to drive the underlying behaviour.
const activate = (el: { trigger: (e: string, o?: object) => Promise<void> }) =>
  el.trigger('mousedown', { button: 0 });

describe('Tabs', () => {
  it('renders triggers and the default-selected panel content', () => {
    const wrapper = mountTabs({ defaultValue: 'account' });
    const triggers = wrapper.findAll('[role="tab"]');
    expect(triggers).toHaveLength(3);
    expect(wrapper.text()).toContain('Account panel');
    // Only the active panel is rendered; inactive panels are unmounted.
    expect(wrapper.text()).not.toContain('Password panel');
  });

  it('marks the default tab active via data-state', () => {
    const wrapper = mountTabs({ defaultValue: 'account' });
    const triggers = wrapper.findAll('[role="tab"]');
    expect(triggers[0].attributes('data-state')).toBe('active');
    expect(triggers[1].attributes('data-state')).toBe('inactive');
  });

  it('switches the active tab and visible panel on activation', async () => {
    const wrapper = mountTabs({ defaultValue: 'account' });
    const triggers = wrapper.findAll('[role="tab"]');

    await activate(triggers[1]);

    expect(triggers[0].attributes('data-state')).toBe('inactive');
    expect(triggers[1].attributes('data-state')).toBe('active');
    expect(wrapper.text()).toContain('Password panel');
    expect(wrapper.text()).not.toContain('Account panel');
  });

  it('reflects selection through aria-selected on the triggers', async () => {
    const wrapper = mountTabs({ defaultValue: 'account' });
    const triggers = wrapper.findAll('[role="tab"]');

    expect(triggers[0].attributes('aria-selected')).toBe('true');
    expect(triggers[1].attributes('aria-selected')).toBe('false');

    await activate(triggers[1]);

    expect(triggers[0].attributes('aria-selected')).toBe('false');
    expect(triggers[1].attributes('aria-selected')).toBe('true');
  });

  it('emits update:modelValue when controlled and a trigger is activated', async () => {
    const wrapper = mountTabs({ modelValue: 'account' });
    const triggers = wrapper.findAll('[role="tab"]');

    await activate(triggers[1]);

    const emitted = wrapper.emitted('update:modelValue');
    expect(emitted).toBeTruthy();
    expect(emitted?.[0]).toEqual(['password']);
  });

  it('does not activate a disabled trigger', async () => {
    const wrapper = mountTabs({ defaultValue: 'account' });
    const triggers = wrapper.findAll('[role="tab"]');
    const disabled = triggers[2];

    expect(disabled.attributes('disabled')).toBeDefined();

    await activate(disabled);

    expect(disabled.attributes('data-state')).toBe('inactive');
    expect(triggers[0].attributes('data-state')).toBe('active');
  });

  it('applies the active-state styling hooks to the triggers', () => {
    const wrapper = mountTabs({ defaultValue: 'account' });
    const triggers = wrapper.findAll('[role="tab"]');
    // The component relies on Tailwind data-state variants for active styling.
    expect(triggers[0].classes()).toContain('data-[state=active]:bg-primary');
    expect(triggers[0].classes()).toContain('data-[state=active]:text-primary-foreground');
  });

  it('wires panels back to their trigger via aria-labelledby / role=tabpanel', () => {
    const wrapper = mountTabs({ defaultValue: 'account' });
    const activeTrigger = wrapper.findAll('[role="tab"]')[0];
    // The active panel is the only rendered tabpanel (inactive ones are unmounted).
    const panel = wrapper.find('[role="tabpanel"]');

    expect(panel.exists()).toBe(true);
    expect(panel.attributes('aria-labelledby')).toBe(activeTrigger.attributes('id'));
  });

  it('has no axe violations on the composed tree', async () => {
    const wrapper = mountTabs({ defaultValue: 'account' });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});
