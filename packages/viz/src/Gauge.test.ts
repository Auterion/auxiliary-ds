import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Gauge from './Gauge.vue';

describe('Gauge', () => {
  it('renders track + value arcs and the numeric readout with its unit', () => {
    const w = mount(Gauge, { props: { value: 74, unit: '%', label: 'Battery' } });
    expect(w.findAll('path')).toHaveLength(2); // track + value
    expect(w.text()).toContain('74%');
  });

  it('exposes ARIA meter semantics', () => {
    const w = mount(Gauge, { props: { value: 74, min: 0, max: 100, unit: '%', label: 'Battery' } });
    const meter = w.get('[role="meter"]');
    expect(meter.attributes('aria-valuenow')).toBe('74');
    expect(meter.attributes('aria-valuemin')).toBe('0');
    expect(meter.attributes('aria-valuemax')).toBe('100');
    expect(meter.attributes('aria-valuetext')).toBe('74 %');
    expect(meter.attributes('aria-label')).toBe('Battery');
  });

  it('omits the value arc at the floor', () => {
    expect(mount(Gauge, { props: { value: 0 } }).findAll('path')).toHaveLength(1); // track only
  });
});
