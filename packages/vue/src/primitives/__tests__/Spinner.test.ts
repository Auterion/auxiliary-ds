import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test-utils/a11y';
import Spinner from '../Spinner.vue';

const SIZES = {
  sm: 'h-3 w-3',
  md: 'h-4 w-4',
  lg: 'h-6 w-6',
} as const;

describe('Spinner', () => {
  it('renders a status role with the default label', () => {
    const wrapper = mount(Spinner);
    const root = wrapper.find('[role="status"]');
    expect(root.exists()).toBe(true);
    expect(root.attributes('aria-label')).toBe('Loading');
    // The label is also exposed to screen readers via an sr-only text node.
    expect(wrapper.find('.sr-only').text()).toBe('Loading');
  });

  it('applies the correct sizing class for each size and defaults to md', () => {
    const svg = mount(Spinner).find('svg');
    expect(svg.classes()).toContain('h-4');
    expect(svg.classes()).toContain('w-4');

    for (const [size, [h, w]] of Object.entries(SIZES).map(
      ([s, cls]) => [s, cls.split(' ')] as const,
    )) {
      const wrapper = mount(Spinner, { props: { size: size as 'sm' | 'md' | 'lg' } });
      const sized = wrapper.find('svg');
      expect(sized.classes()).toContain(h);
      expect(sized.classes()).toContain(w);
    }
  });

  it('always animates and inherits the current text color', () => {
    const svg = mount(Spinner).find('svg');
    expect(svg.classes()).toContain('animate-spin');
    expect(svg.classes()).toContain('text-current');
  });

  it('uses a custom label for both aria-label and sr-only text', () => {
    const wrapper = mount(Spinner, { props: { label: 'Fetching telemetry' } });
    expect(wrapper.find('[role="status"]').attributes('aria-label')).toBe('Fetching telemetry');
    expect(wrapper.find('.sr-only').text()).toBe('Fetching telemetry');
  });

  it('marks the decorative svg as aria-hidden so the label is the sole announcement', () => {
    const wrapper = mount(Spinner);
    expect(wrapper.find('svg').attributes('aria-hidden')).toBe('true');
  });

  it('has no axe violations', async () => {
    const wrapper = mount(Spinner, { props: { size: 'lg', label: 'Loading data' } });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});
