import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test-utils/a11y';
import Button from '../Button.vue';

describe('Button', () => {
  it('renders a button element with default intent/size/type and slot content', () => {
    const wrapper = mount(Button, { slots: { default: 'Click me' } });
    expect(wrapper.element.tagName).toBe('BUTTON');
    expect(wrapper.attributes('type')).toBe('button');
    expect(wrapper.text()).toContain('Click me');
    // default intent=primary, size=md
    expect(wrapper.classes()).toContain('bg-primary');
    expect(wrapper.classes()).toContain('h-9');
  });

  it('maps each intent prop to its recipe classes', () => {
    const cases: Array<[string, string]> = [
      ['primary', 'bg-primary'],
      ['secondary', 'bg-secondary'],
      ['ghost', 'text-foreground'],
      ['danger', 'bg-destructive'],
    ];
    for (const [intent, cls] of cases) {
      const wrapper = mount(Button, { props: { intent: intent as never }, slots: { default: intent } });
      expect(wrapper.classes()).toContain(cls);
    }
  });

  it('maps each size prop to its recipe classes', () => {
    const cases: Array<[string, string]> = [
      ['sm', 'h-8'],
      ['md', 'h-9'],
      ['lg', 'h-10'],
    ];
    for (const [size, cls] of cases) {
      const wrapper = mount(Button, { props: { size: size as never }, slots: { default: size } });
      expect(wrapper.classes()).toContain(cls);
    }
  });

  it('applies loading styling and disables the button when loading', () => {
    const wrapper = mount(Button, { props: { loading: true }, slots: { default: 'Saving' } });
    expect(wrapper.classes()).toContain('opacity-80');
    expect(wrapper.classes()).toContain('pointer-events-none');
    expect(wrapper.attributes('disabled')).toBeDefined();
  });

  it('reflects the disabled prop on the underlying button', () => {
    const enabled = mount(Button, { slots: { default: 'Go' } });
    expect(enabled.attributes('disabled')).toBeUndefined();

    const disabled = mount(Button, { props: { disabled: true }, slots: { default: 'Go' } });
    expect(disabled.attributes('disabled')).toBeDefined();
  });

  it('passes through the type prop', () => {
    const wrapper = mount(Button, { props: { type: 'submit' }, slots: { default: 'Submit' } });
    expect(wrapper.attributes('type')).toBe('submit');
  });

  it('has no axe violations', async () => {
    const wrapper = mount(Button, { props: { intent: 'primary' }, slots: { default: 'Accessible button' } });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});
