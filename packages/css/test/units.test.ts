import { describe, expect, it } from 'vitest';
import { formatQuantity, convertQuantity, formatNumber, VALUE_NA } from '../format/units.js';

describe('convertQuantity / formatQuantity', () => {
  describe('metric (canonical SI passthrough)', () => {
    it('renders distance/altitude in metres', () => {
      expect(formatQuantity(408, 'altitude')).toBe('408 m');
    });
    it('renders speed in m/s and vertical speed in m/s', () => {
      expect(formatQuantity(12.4, 'speed')).toBe('12.4 m/s');
      expect(formatQuantity(2.5, 'verticalSpeed')).toBe('2.5 m/s');
    });
  });

  describe('imperial = aviation convention', () => {
    it('altitude → feet', () => {
      expect(formatQuantity(408, 'altitude', { system: 'imperial' })).toBe('1339 ft');
    });
    it('speed → knots', () => {
      expect(formatQuantity(12.4, 'speed', { system: 'imperial' })).toBe('24.1 kn');
    });
    it('vertical speed → feet per minute', () => {
      expect(formatQuantity(2.5, 'verticalSpeed', { system: 'imperial' })).toBe('492 ft/min');
    });
    it('temperature → °F via the affine transform (not a plain factor)', () => {
      expect(formatQuantity(21, 'temperature', { system: 'imperial' })).toBe('70°F');
      expect(formatQuantity(0, 'temperature', { system: 'imperial' })).toBe('32°F');
      expect(formatQuantity(21, 'temperature', { system: 'imperial', precision: 1 })).toBe('69.8°F');
    });
  });

  describe('temperature is offset, not scaled', () => {
    it('metric passes °C through, no space before the degree symbol', () => {
      expect(formatQuantity(21, 'temperature')).toBe('21°C');
    });
  });

  describe('angle is system-invariant with a mils override', () => {
    it('renders degrees in both systems', () => {
      expect(formatQuantity(247, 'angle')).toBe('247°');
      expect(formatQuantity(247, 'angle', { system: 'imperial' })).toBe('247°');
    });
    it('converts to NATO mils on request (6400 = 360°)', () => {
      expect(formatQuantity(247, 'angle', { unit: 'mils' })).toBe('4391 mils');
      expect(formatQuantity(360, 'angle', { unit: 'mils' })).toBe('6400 mils');
    });
  });

  describe('named-unit overrides', () => {
    it('honors km / NM / mph overrides', () => {
      expect(formatQuantity(2000, 'distance', { unit: 'km' })).toBe('2.00 km');
      expect(formatQuantity(1852, 'distance', { unit: 'NM' })).toBe('1.00 NM');
      expect(formatQuantity(12.4, 'speed', { unit: 'mph' })).toBe('28 mph');
    });
    it('falls back to the system unit for an unknown override', () => {
      expect(formatQuantity(408, 'altitude', { system: 'imperial', unit: 'parsec' })).toBe('1339 ft');
    });
  });

  describe('convertQuantity returns raw parts (no formatting)', () => {
    it('exposes value, unit, precision, spaced', () => {
      const r = convertQuantity(408, 'altitude', 'imperial');
      expect(r.unit).toBe('ft');
      expect(r.precision).toBe(0);
      expect(r.spaced).toBe(true);
      expect(r.value).toBeCloseTo(1338.5827, 3);
    });
  });

  describe('graceful degradation', () => {
    it('returns the sentinel for non-finite input', () => {
      expect(formatQuantity(NaN, 'altitude')).toBe(VALUE_NA);
      expect(formatQuantity(Infinity, 'speed', { system: 'imperial' })).toBe(VALUE_NA);
    });
  });
});

describe('formatNumber', () => {
  it('is a deterministic toFixed when no locale is given (no grouping)', () => {
    expect(formatNumber(1234.5, { precision: 1 })).toBe('1234.5');
    expect(formatNumber(42, { precision: 0 })).toBe('42');
  });

  it('uses Intl grouping/separators when a locale is given', () => {
    expect(formatNumber(1234.5, { locale: 'en-US', precision: 1 })).toBe('1,234.5');
    expect(formatNumber(1234.5, { locale: 'de-DE', precision: 1 })).toBe('1.234,5');
  });

  it('returns the sentinel for non-finite input', () => {
    expect(formatNumber(NaN)).toBe(VALUE_NA);
  });
});
