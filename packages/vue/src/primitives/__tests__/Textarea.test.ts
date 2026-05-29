import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test-utils/a11y';
import Textarea from '../Textarea.vue';

describe('Textarea', () => {
  it('renders a textarea reflecting the modelValue', () => {
    const wrapper = mount(Textarea, { props: { modelValue: 'hello' } });
    const el = wrapper.get('textarea');
    expect((el.element as HTMLTextAreaElement).value).toBe('hello');
  });

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(Textarea, { props: { modelValue: '' } });
    await wrapper.get('textarea').setValue('new text');
    const emitted = wrapper.emitted('update:modelValue');
    expect(emitted).toBeTruthy();
    expect(emitted![emitted!.length - 1]).toEqual(['new text']);
  });

  it('forwards placeholder, id and rows to the textarea', () => {
    const wrapper = mount(Textarea, {
      props: { placeholder: 'Type here', id: 'notes', rows: 8 },
    });
    const el = wrapper.get('textarea');
    expect(el.attributes('placeholder')).toBe('Type here');
    expect(el.attributes('id')).toBe('notes');
    expect(el.attributes('rows')).toBe('8');
  });

  it('defaults to 4 rows when rows is not provided', () => {
    const wrapper = mount(Textarea);
    expect(wrapper.get('textarea').attributes('rows')).toBe('4');
  });

  it('reflects the disabled prop', async () => {
    const wrapper = mount(Textarea, { props: { disabled: true } });
    const el = wrapper.get('textarea').element as HTMLTextAreaElement;
    expect(el.disabled).toBe(true);
    expect(wrapper.get('textarea').classes()).toContain('disabled:opacity-50');

    await wrapper.setProps({ disabled: false });
    expect((wrapper.get('textarea').element as HTMLTextAreaElement).disabled).toBe(false);
  });

  it('updates the displayed value when modelValue changes', async () => {
    const wrapper = mount(Textarea, { props: { modelValue: 'first' } });
    await wrapper.setProps({ modelValue: 'second' });
    expect((wrapper.get('textarea').element as HTMLTextAreaElement).value).toBe('second');
  });

  it('maps each size prop to its recipe padding class (defaulting to md)', () => {
    const cases: Array<['sm' | 'md' | 'lg', string]> = [
      ['sm', 'py-1.5'],
      ['md', 'py-2'],
      ['lg', 'py-2.5'],
    ];
    for (const [size, cls] of cases) {
      const wrapper = mount(Textarea, { props: { size } });
      expect(wrapper.get('textarea').classes()).toContain(cls);
    }
    expect(mount(Textarea).get('textarea').classes()).toContain('py-2');
  });

  it('sets aria-invalid and a destructive border when invalid', () => {
    const wrapper = mount(Textarea, { props: { invalid: true } });
    const el = wrapper.get('textarea');
    expect(el.attributes('aria-invalid')).toBe('true');
    expect(el.classes()).toContain('border-destructive');
  });

  it('forwards arbitrary attributes (aria-*, data-*, maxlength, required) to the textarea', () => {
    const wrapper = mount(Textarea, {
      attrs: {
        'aria-label': 'Notes',
        'aria-invalid': 'true',
        'data-testid': 'notes-box',
        maxlength: 200,
        required: true,
      },
    });
    const el = wrapper.get('textarea');
    expect(el.attributes('aria-label')).toBe('Notes');
    expect(el.attributes('aria-invalid')).toBe('true');
    expect(el.attributes('data-testid')).toBe('notes-box');
    expect(el.attributes('maxlength')).toBe('200');
    expect(el.attributes('required')).toBeDefined();
  });

  it('has no axe violations when associated with a label', async () => {
    const wrapper = mount(
      {
        components: { Textarea },
        template: `<div>
          <label for="bio">Bio</label>
          <Textarea id="bio" model-value="content" placeholder="About you" />
        </div>`,
      },
      { attachTo: document.body },
    );
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
    wrapper.unmount();
  });
});
