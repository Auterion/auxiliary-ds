import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test-utils/a11y';
import TelemetryValue from '../TelemetryValue.vue';

type Level = 'alarm' | 'warning' | 'caution' | 'advisory' | 'nominal';
const LEVELS: Level[] = ['alarm', 'warning', 'caution', 'advisory', 'nominal'];

describe('TelemetryValue', () => {
  it('formats numeric values with the default precision (1 decimal)', () => {
    const wrapper = mount(TelemetryValue, { props: { value: 42 } });
    expect(wrapper.text()).toContain('42.0');
  });

  it('honors the precision prop for numeric values', () => {
    const wrapper = mount(TelemetryValue, { props: { value: 3.14159, precision: 3 } });
    expect(wrapper.text()).toContain('3.142');
  });

  it('renders pre-formatted string values verbatim', () => {
    const wrapper = mount(TelemetryValue, { props: { value: 'N/A', precision: 2 } });
    expect(wrapper.text()).toContain('N/A');
  });

  it('renders the optional label and unit', () => {
    const wrapper = mount(TelemetryValue, {
      props: { value: 12, unit: 'm/s', label: 'Ground speed' },
    });
    expect(wrapper.text()).toContain('Ground speed');
    expect(wrapper.text()).toContain('m/s');
  });

  it('maps each level to its expected color class', () => {
    for (const level of LEVELS) {
      const wrapper = mount(TelemetryValue, { props: { value: 1, level } });
      const valueSpan = wrapper.find('.font-mono');
      expect(valueSpan.classes()).toContain(`text-${level}`);
    }
  });

  it('uses the neutral foreground color when no level is set', () => {
    const wrapper = mount(TelemetryValue, { props: { value: 1 } });
    const valueSpan = wrapper.find('span');
    expect(valueSpan.classes()).toContain('text-foreground');
  });

  it('renders an accessible trend arrow with an aria-label', () => {
    const wrapper = mount(TelemetryValue, { props: { value: 1, trend: 'up' } });
    const trend = wrapper.find('[aria-label="trend up"]');
    expect(trend.exists()).toBe(true);
    expect(trend.text()).toBe('▲');
  });

  // Load-bearing a11y invariant: operational status must never be conveyed by color
  // alone — the numeric/text value itself is always rendered alongside the level color.
  it('never conveys status by color alone — the value text is always present', () => {
    for (const level of LEVELS) {
      const wrapper = mount(TelemetryValue, { props: { value: 99, level } });
      expect(wrapper.text()).toContain('99.0');
    }
  });

  it('has no axe violations', async () => {
    const wrapper = mount(TelemetryValue, {
      props: { value: 11.5, unit: 'V', label: 'Battery', level: 'warning', trend: 'down' },
    });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});
