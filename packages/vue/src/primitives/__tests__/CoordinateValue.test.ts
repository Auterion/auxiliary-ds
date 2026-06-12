import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test-utils/a11y';
import CoordinateValue from '../CoordinateValue.vue';

type Level = 'alarm' | 'warning' | 'caution' | 'advisory' | 'nominal';
const LEVELS: Level[] = ['alarm', 'warning', 'caution', 'advisory', 'nominal'];

// Zürich.
const LAT = 47.3769;
const LON = 8.5417;

describe('CoordinateValue', () => {
  it('renders decimal degrees by default', () => {
    const wrapper = mount(CoordinateValue, { props: { lat: LAT, lon: LON } });
    expect(wrapper.text()).toContain('47.3769° N, 8.5417° E');
  });

  it('renders each coordinate format', () => {
    expect(mount(CoordinateValue, { props: { lat: LAT, lon: LON, format: 'dms' } }).text()).toContain(
      '47°22′36.8″ N',
    );
    expect(mount(CoordinateValue, { props: { lat: LAT, lon: LON, format: 'ddm' } }).text()).toContain(
      '47°22.614′ N',
    );
    expect(mount(CoordinateValue, { props: { lat: LAT, lon: LON, format: 'mgrs' } }).text()).toContain(
      '32T MT 65403 47150',
    );
  });

  it('degrades invalid coordinates to the sentinel rather than blanking', () => {
    const wrapper = mount(CoordinateValue, { props: { lat: NaN, lon: LON } });
    expect(wrapper.text()).toContain('—');
  });

  it('renders the optional label', () => {
    const wrapper = mount(CoordinateValue, { props: { lat: LAT, lon: LON, label: 'Home' } });
    expect(wrapper.text()).toContain('Home');
  });

  it('renders an uppercased format tag when requested', () => {
    const wrapper = mount(CoordinateValue, {
      props: { lat: LAT, lon: LON, format: 'mgrs', showFormatTag: true },
    });
    expect(wrapper.text()).toContain('MGRS');
  });

  it('maps each level to its expected color class', () => {
    for (const level of LEVELS) {
      const wrapper = mount(CoordinateValue, { props: { lat: LAT, lon: LON, level } });
      const valueSpan = wrapper.find('.font-mono');
      expect(valueSpan.classes()).toContain(`text-${level}-emphasis`);
    }
  });

  it('passes through a custom class to the root', () => {
    const wrapper = mount(CoordinateValue, { props: { lat: LAT, lon: LON, class: 'mt-4' } });
    expect(wrapper.classes()).toContain('mt-4');
  });

  it('has no axe violations', async () => {
    const wrapper = mount(CoordinateValue, {
      props: { lat: LAT, lon: LON, format: 'mgrs', label: 'Target', showFormatTag: true },
    });
    expect(await axe(wrapper.element)).toHaveNoViolations();
  });
});
