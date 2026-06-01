import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Distribution from './Distribution.vue';

describe('Distribution', () => {
  it('renders one rect per bin', () => {
    const values = Array.from({ length: 100 }, (_v, i) => i % 20);
    const w = mount(Distribution, { props: { values, bins: 10, label: 'Latency' } });
    expect(w.findAll('rect')).toHaveLength(10);
    expect(w.get('svg').attributes('aria-label')).toBe('Latency');
  });

  it('is decorative without a label', () => {
    const w = mount(Distribution, { props: { values: [1, 2, 3, 4, 5], bins: 5 } });
    expect(w.get('svg').attributes('aria-hidden')).toBe('true');
  });
});
