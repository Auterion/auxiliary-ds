import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Bars from './Bars.vue';

describe('Bars', () => {
  it('renders one rect per value', () => {
    const w = mount(Bars, { props: { values: [3, 7, 5, 9], label: 'Flights per site' } });
    expect(w.findAll('rect')).toHaveLength(4);
    expect(w.get('svg').attributes('role')).toBe('img');
    expect(w.get('svg').attributes('aria-label')).toBe('Flights per site');
  });

  it('renders category labels when provided', () => {
    const w = mount(Bars, { props: { values: [1, 2], labels: ['A', 'B'] } });
    expect(w.find('figcaption').exists()).toBe(true);
    expect(w.text()).toContain('A');
    expect(w.text()).toContain('B');
  });

  it('uses distinct palette fills with colorByIndex', () => {
    const w = mount(Bars, { props: { values: [1, 2, 3], colorByIndex: true } });
    const fills = w.findAll('rect').map((r) => r.attributes('fill'));
    expect(new Set(fills).size).toBe(3);
  });
});
