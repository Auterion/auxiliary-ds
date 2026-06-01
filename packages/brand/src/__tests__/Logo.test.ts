import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import Logo from '../Logo.vue';

describe('Logo', () => {
  it('renders a labelled placeholder for a known logo whose master is pending', () => {
    const wrapper = mount(Logo, { props: { id: 'auterion', kind: 'mark' } });
    const root = wrapper.get('.aux-logo');
    expect(root.classes()).toContain('aux-logo--pending');
    expect(root.attributes('role')).toBe('img');
    expect(root.attributes('aria-label')).toBe('Auterion logo');
    expect(root.text()).toContain('Auterion');
    expect(root.text()).toContain('mark');
  });

  it('honours an explicit accessible name', () => {
    const wrapper = mount(Logo, { props: { id: 'suite', title: 'AuterionSuite home' } });
    expect(wrapper.get('.aux-logo').attributes('aria-label')).toBe('AuterionSuite home');
  });

  it('removes the mark from the a11y tree when decorative', () => {
    const wrapper = mount(Logo, { props: { id: 'auterion', decorative: true } });
    const root = wrapper.get('.aux-logo');
    expect(root.attributes('aria-hidden')).toBe('true');
    expect(root.attributes('role')).toBeUndefined();
  });

  it('shows an unknown-id placeholder rather than throwing', () => {
    const wrapper = mount(Logo, { props: { id: 'does-not-exist' } });
    expect(wrapper.get('.aux-logo').text()).toContain('unknown logo: does-not-exist');
  });
});
