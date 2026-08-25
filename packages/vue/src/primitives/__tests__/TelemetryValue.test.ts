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
      expect(valueSpan.classes()).toContain(`text-${level}-emphasis`);
    }
  });

  it('uses the neutral foreground color when no level is set', () => {
    const wrapper = mount(TelemetryValue, { props: { value: 1 } });
    const valueSpan = wrapper.find('span');
    expect(valueSpan.classes()).toContain('text-foreground');
  });

  // The glyph is decorative to AT and the word is invisible to sighted users:
  // `aria-label` on a role-less <span> is dropped by screen readers in favour of
  // the raw character, so the name has to come from real text.
  it('renders the trend arrow as a hidden glyph beside an sr-only word', () => {
    const wrapper = mount(TelemetryValue, { props: { value: 1, trend: 'up' } });
    const glyph = wrapper.find('[aria-hidden="true"]');
    expect(glyph.exists()).toBe(true);
    expect(glyph.text()).toBe('↑');
    expect(wrapper.find('.sr-only').text()).toBe('trend up');
  });

  // U+2191/2193/2192 sit inside the Geist Mono latin subset; the geometric
  // triangles they replaced did not, so the three states rendered in two faces.
  it('uses trend glyphs that are inside the mono subset', () => {
    for (const [trend, glyph] of [['up', '↑'], ['down', '↓'], ['stable', '→']] as const) {
      const wrapper = mount(TelemetryValue, { props: { value: 1, trend } });
      expect(wrapper.find('[aria-hidden="true"]').text()).toBe(glyph);
    }
  });

  it('honours the formatter\'s unit spacing rule', () => {
    // `247°` closes up; `408 m` keeps the gap. Same rule formatQuantity applies.
    const tight = mount(TelemetryValue, { props: { value: 247, unit: '°' } });
    expect(tight.find('.font-mono + span').classes().join(' ')).toContain('ms-[calc(');
    const spaced = mount(TelemetryValue, { props: { value: 408, unit: 'm' } });
    expect(spaced.find('.font-mono + span').classes().join(' ')).not.toContain('ms-[calc(');
  });

  it('has no axe violations', async () => {
    const wrapper = mount(TelemetryValue, {
      props: { value: 11.5, unit: 'V', label: 'Battery', level: 'warning', trend: 'down' },
    });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });

  describe('unit systems (quantity mode)', () => {
    it('treats the value as canonical SI and derives the unit', () => {
      const metric = mount(TelemetryValue, { props: { value: 408, quantity: 'altitude' } });
      expect(metric.text()).toContain('408');
      expect(metric.find('.font-mono ~ span').text()).toBe('m');
    });

    it('converts to imperial (aviation) when system is imperial', () => {
      const wrapper = mount(TelemetryValue, {
        props: { value: 12.4, quantity: 'speed', system: 'imperial' },
      });
      expect(wrapper.text()).toContain('24.1');
      expect(wrapper.text()).toContain('kn');
    });

    it("derived unit overrides the manual unit prop", () => {
      const wrapper = mount(TelemetryValue, {
        props: { value: 408, quantity: 'altitude', system: 'imperial', unit: 'WRONG' },
      });
      expect(wrapper.text()).not.toContain('WRONG');
      expect(wrapper.text()).toContain('ft');
    });
  });

  describe('locale formatting (opt-in)', () => {
    it('localizes the number when a locale is given', () => {
      const wrapper = mount(TelemetryValue, { props: { value: 1234.5, locale: 'de-DE' } });
      expect(wrapper.text()).toContain('1.234,5');
    });

    // Load-bearing: existing readouts with no quantity/locale must be byte-identical
    // to the previous toFixed behavior — no silent grouping or regression.
    it('default formatting is unchanged (deterministic toFixed, no grouping)', () => {
      expect(mount(TelemetryValue, { props: { value: 1234.5 } }).find('.font-mono').text()).toBe('1234.5');
      expect(mount(TelemetryValue, { props: { value: 42 } }).find('.font-mono').text()).toBe('42.0');
      expect(
        mount(TelemetryValue, { props: { value: 3.14159, precision: 3 } }).find('.font-mono').text(),
      ).toBe('3.142');
    });
  });
});
