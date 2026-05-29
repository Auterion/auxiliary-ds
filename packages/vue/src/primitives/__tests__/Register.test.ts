import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test-utils/a11y';
import Register from '../Register.vue';

describe('Register', () => {
  it('defaults to the operational register (the opt-in case)', () => {
    const wrapper = mount(Register, { slots: { default: 'Panel' } });
    expect(wrapper.attributes('data-register')).toBe('operational');
    expect(wrapper.text()).toContain('Panel');
  });

  it('can opt a subtree back into expressive', () => {
    const wrapper = mount(Register, { props: { register: 'expressive' } });
    expect(wrapper.attributes('data-register')).toBe('expressive');
  });

  it('renders a div by default and honors the `as` prop', () => {
    expect(mount(Register).element.tagName).toBe('DIV');
    const section = mount(Register, { props: { as: 'section' } });
    expect(section.element.tagName).toBe('SECTION');
  });

  it('passes through a custom class', () => {
    const wrapper = mount(Register, { props: { class: 'grid gap-2' } });
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['grid', 'gap-2']));
  });

  it('is a transparent wrapper with no axe violations', async () => {
    const wrapper = mount(Register, { slots: { default: '<button>Arm</button>' } });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});
