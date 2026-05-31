import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test-utils/a11y';
import Input from '../Input.vue';

describe('Input', () => {
  it('renders an input element defaulting to type="text"', () => {
    const wrapper = mount(Input);
    const input = wrapper.find('input');
    expect(input.exists()).toBe(true);
    expect(input.attributes('type')).toBe('text');
  });

  it('forwards type, placeholder, and id props to the input element', () => {
    const wrapper = mount(Input, {
      props: { type: 'email', placeholder: 'you@example.com', id: 'email-field' },
    });
    const input = wrapper.find('input');
    expect(input.attributes('type')).toBe('email');
    expect(input.attributes('placeholder')).toBe('you@example.com');
    expect(input.attributes('id')).toBe('email-field');
  });

  it('reflects modelValue as the input value', () => {
    const wrapper = mount(Input, { props: { modelValue: 'hello' } });
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('hello');
  });

  it('emits update:modelValue with the new string value on input', async () => {
    const wrapper = mount(Input, { props: { modelValue: '' } });
    await wrapper.find('input').setValue('typed text');
    const emitted = wrapper.emitted('update:modelValue');
    expect(emitted).toBeTruthy();
    expect(emitted![emitted!.length - 1]).toEqual(['typed text']);
  });

  it('updates the displayed value when modelValue prop changes', async () => {
    const wrapper = mount(Input, { props: { modelValue: 'first' } });
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('first');
    await wrapper.setProps({ modelValue: 'second' });
    expect((wrapper.find('input').element as HTMLInputElement).value).toBe('second');
  });

  it('renders a disabled input and the disabled styling classes when disabled', () => {
    const wrapper = mount(Input, { props: { disabled: true } });
    const input = wrapper.find('input');
    expect(input.attributes('disabled')).toBeDefined();
    expect(input.classes()).toContain('disabled:opacity-50');
    expect(input.classes()).toContain('disabled:cursor-not-allowed');
  });

  it('maps each size prop to its recipe height class (defaulting to md)', () => {
    const cases: Array<['sm' | 'md' | 'lg', string]> = [
      ['sm', 'h-[max(var(--control-height-sm),var(--target-floor))]'],
      ['md', 'h-[max(var(--control-height-md),var(--target-floor))]'],
      ['lg', 'h-[max(var(--control-height-lg),var(--target-floor))]'],
    ];
    for (const [size, cls] of cases) {
      const wrapper = mount(Input, { props: { size } });
      expect(wrapper.find('input').classes()).toContain(cls);
    }
    expect(mount(Input).find('input').classes()).toContain('h-[max(var(--control-height-md),var(--target-floor))]');
  });

  it('sets aria-invalid and a destructive border when invalid', () => {
    const wrapper = mount(Input, { props: { invalid: true } });
    const input = wrapper.find('input');
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.classes()).toContain('border-destructive');
  });

  it('omits aria-invalid when not invalid', () => {
    expect(mount(Input).find('input').attributes('aria-invalid')).toBeUndefined();
  });

  it('forwards arbitrary attributes (aria-*, data-*, maxlength, required) to the input element', () => {
    const wrapper = mount(Input, {
      attrs: {
        'aria-label': 'Search',
        'aria-invalid': 'true',
        'data-testid': 'search-box',
        maxlength: 40,
        required: true,
        autocomplete: 'off',
      },
    });
    const input = wrapper.find('input');
    expect(input.attributes('aria-label')).toBe('Search');
    expect(input.attributes('aria-invalid')).toBe('true');
    expect(input.attributes('data-testid')).toBe('search-box');
    expect(input.attributes('maxlength')).toBe('40');
    expect(input.attributes('required')).toBeDefined();
    expect(input.attributes('autocomplete')).toBe('off');
  });

  it('has no axe violations when associated with a label', async () => {
    const wrapper = mount(Input, {
      props: { id: 'name-field', modelValue: '' },
      attachTo: document.body,
    });
    const label = document.createElement('label');
    label.setAttribute('for', 'name-field');
    label.textContent = 'Name';
    wrapper.element.parentNode?.insertBefore(label, wrapper.element);

    const results = await axe(label.parentElement as HTMLElement);
    expect(results).toHaveNoViolations();

    wrapper.unmount();
    label.remove();
  });
});
