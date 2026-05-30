import { describe, expect, it } from 'vitest';
import { formatLatLon, COORD_INVALID } from '../format/coordinates.js';

// Zürich, a fixed reference point used across the format assertions.
const LAT = 47.3769;
const LON = 8.5417;

describe('formatLatLon', () => {
  describe('decimal degrees (dd)', () => {
    it('formats with hemisphere letters and 4 decimals by default', () => {
      expect(formatLatLon(LAT, LON)).toBe('47.3769° N, 8.5417° E');
    });

    it('honors precision', () => {
      expect(formatLatLon(LAT, LON, { precision: 2 })).toBe('47.38° N, 8.54° E');
    });

    it('emits signed values when hemisphere is disabled', () => {
      expect(formatLatLon(LAT, LON, { hemisphere: false })).toBe('47.3769°, 8.5417°');
    });

    it('uses S/W letters for the southern/western hemispheres', () => {
      expect(formatLatLon(-33.8688, -151.2093, { precision: 2 })).toBe('33.87° S, 151.21° W');
    });
  });

  describe('degrees-minutes-seconds (dms)', () => {
    it('formats with zero-padded minutes/seconds and 1 decimal second by default', () => {
      expect(formatLatLon(LAT, LON, { format: 'dms' })).toBe('47°22′36.8″ N  8°32′30.1″ E');
    });

    it('carries rounding up across units instead of printing 60', () => {
      // 46.99999, 7.99999 round up through seconds → minutes → degrees.
      expect(formatLatLon(46.99999, 7.99999, { format: 'dms' })).toBe('47°00′00.0″ N  8°00′00.0″ E');
    });
  });

  describe('degrees-decimal-minutes (ddm)', () => {
    it('formats with 3 decimal minutes by default', () => {
      expect(formatLatLon(LAT, LON, { format: 'ddm' })).toBe('47°22.614′ N  8°32.502′ E');
    });
  });

  describe('MGRS', () => {
    it('groups the grid reference at full (1 m) accuracy', () => {
      expect(formatLatLon(LAT, LON, { format: 'mgrs' })).toBe('32T MT 65403 47150');
    });

    it('shortens the grid digits as accuracy drops', () => {
      expect(formatLatLon(LAT, LON, { format: 'mgrs', mgrsAccuracy: 3 })).toBe('32T MT 654 471');
      expect(formatLatLon(LAT, LON, { format: 'mgrs', mgrsAccuracy: 1 })).toBe('32T MT 6 4');
    });

    // Locks the (lon, lat) argument order to the underlying lib — swapping the
    // inputs lands in a different grid zone, so this guards a classic foot-gun.
    it('treats arguments as (lat, lon), not (lon, lat)', () => {
      expect(formatLatLon(LAT, LON, { format: 'mgrs' })).not.toBe(
        formatLatLon(LON, LAT, { format: 'mgrs' }),
      );
    });

    it('degrades to the sentinel for polar points MGRS does not cover', () => {
      expect(formatLatLon(89, 0, { format: 'mgrs' })).toBe(COORD_INVALID);
    });
  });

  describe('invalid input degrades gracefully (never throws)', () => {
    it('returns the sentinel for NaN', () => {
      expect(formatLatLon(NaN, LON)).toBe(COORD_INVALID);
      expect(formatLatLon(LAT, NaN)).toBe(COORD_INVALID);
    });

    it('returns the sentinel for out-of-range degrees', () => {
      expect(formatLatLon(95, 0)).toBe(COORD_INVALID);
      expect(formatLatLon(0, 200)).toBe(COORD_INVALID);
    });
  });
});
