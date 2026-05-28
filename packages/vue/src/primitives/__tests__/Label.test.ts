import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test-utils/a11y';
import Label from '../Label.vue';

describe('Label', () => {
  it('renders a <label> element with slotted content', () => {
    const wrapper = mount(Label, { slots: { default: 'Email address' } });
    expect(wrapper.element.tagName).toBe('LABEL');
    expect(wrapper.text()).toContain('Email address');
  });

  it('applies the default typography classes', () => {
    const wrapper = mount(Label, { slots: { default: 'Name' } });
    expect(wrapper.classes()).toContain('text-sm');
    expect(wrapper.classes()).toContain('font-medium');
    expect(wrapper.classes()).toContain('text-muted-foreground');
  });

  it('forwards the `for` prop to the for attribute', () => {
    const wrapper = mount(Label, {
      props: { for: 'email-input' },
      slots: { default: 'Email' },
    });
    expect(wrapper.attributes('for')).toBe('email-input');
  });

  it('omits the for attribute when the prop is not provided', () => {
    const wrapper = mount(Label, { slots: { default: 'Email' } });
    expect(wrapper.attributes('for')).toBeUndefined();
  });

  it('renders rich slot markup', () => {
    const wrapper = mount(Label, {
      slots: { default: 'Password <span class="req">*</span>' },
    });
    expect(wrapper.find('span.req').exists()).toBe(true);
    expect(wrapper.find('span.req').text()).toBe('*');
  });

  it('has no axe violations when associated with a control', async () => {
    const wrapper = mount(
      {
        components: { Label },
        template: `<div><Label for="fld">Username</Label><input id="fld" /></div>`,
      },
    );
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});
