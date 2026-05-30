import { forward as mgrsForward } from 'mgrs';

/**
 * Coordinate display formats for operational / C2 surfaces.
 *
 * - `dd`   — decimal degrees (`47.3769° N, 8.5417° E`)
 * - `dms`  — degrees / minutes / seconds (`47°22′36.8″ N  8°32′30.1″ E`)
 * - `ddm`  — degrees + decimal minutes (`47°22.614′ N  8°32.502′ E`)
 * - `mgrs` — Military Grid Reference System (`32T MT 65403 47150`)
 */
export type CoordFormat = 'dd' | 'dms' | 'ddm' | 'mgrs';

export interface FormatLatLonOptions {
  /** Display format. Default `'dd'`. */
  format?: CoordFormat;
  /**
   * Decimal places. Meaning depends on `format`: `dd` → degrees, `dms` →
   * seconds, `ddm` → minutes. Ignored for `mgrs`. Defaults per format
   * (`dd` → 4, `dms` → 1, `ddm` → 3).
   */
  precision?: number;
  /** MGRS grid precision, 1..5 (10 km → 1 m). Default `5`. `mgrs` only. */
  mgrsAccuracy?: number;
  /** `dd`: append N/S/E/W instead of a signed value. Default `true`. */
  hemisphere?: boolean;
}

/**
 * Sentinel rendered when a coordinate cannot be formatted (NaN, out of range,
 * or outside MGRS's supported band). A bad value must never blank or break a
 * telemetry panel — it degrades to this em dash instead of throwing.
 */
export const COORD_INVALID = '—';

const DEFAULT_PRECISION: Record<Exclude<CoordFormat, 'mgrs'>, number> = {
  dd: 4,
  dms: 1,
  ddm: 3,
};

function isValidLatLon(lat: number, lon: number): boolean {
  return (
    Number.isFinite(lat) &&
    Number.isFinite(lon) &&
    lat >= -90 &&
    lat <= 90 &&
    lon >= -180 &&
    lon <= 180
  );
}

/** Pad the integer part of a fixed-precision number to two digits (`6.8` → `06.8`). */
function padInt(value: number, precision: number): string {
  const fixed = value.toFixed(precision);
  const [intPart] = fixed.split('.');
  return intPart!.length < 2 ? `0${fixed}` : fixed;
}

function hemisphereLetter(value: number, axis: 'lat' | 'lon'): string {
  if (axis === 'lat') return value >= 0 ? 'N' : 'S';
  return value >= 0 ? 'E' : 'W';
}

/** Decimal degrees for one axis: `47.3769° N` (or signed when `hemisphere` is false). */
function formatDd(value: number, axis: 'lat' | 'lon', precision: number, hemisphere: boolean): string {
  if (!hemisphere) return `${value.toFixed(precision)}°`;
  return `${Math.abs(value).toFixed(precision)}° ${hemisphereLetter(value, axis)}`;
}

/** Degrees / minutes / seconds for one axis, carrying rounding up across units. */
function formatDms(value: number, axis: 'lat' | 'lon', precision: number): string {
  const letter = hemisphereLetter(value, axis);
  const abs = Math.abs(value);

  let deg = Math.floor(abs);
  let min = Math.floor((abs - deg) * 60);
  let sec = (abs - deg - min / 60) * 3600;

  // Rounding the seconds can tip to 60 — carry into minutes/degrees so we never
  // print `…′60.0″`.
  if (Number(sec.toFixed(precision)) >= 60) {
    sec = 0;
    min += 1;
  }
  if (min >= 60) {
    min -= 60;
    deg += 1;
  }

  return `${deg}°${String(min).padStart(2, '0')}′${padInt(sec, precision)}″ ${letter}`;
}

/** Degrees + decimal minutes for one axis, carrying rounding up across units. */
function formatDdm(value: number, axis: 'lat' | 'lon', precision: number): string {
  const letter = hemisphereLetter(value, axis);
  const abs = Math.abs(value);

  let deg = Math.floor(abs);
  let min = (abs - deg) * 60;

  if (Number(min.toFixed(precision)) >= 60) {
    min = 0;
    deg += 1;
  }

  return `${deg}°${padInt(min, precision)}′ ${letter}`;
}

/**
 * Group a raw MGRS string (`32TMT6540347150`) into readable parts
 * (`32T MT 65403 47150`): grid-zone designator, 100 km square, then the
 * easting/northing digits split in half.
 */
function groupMgrs(raw: string): string {
  const match = /^(\d{1,2}[C-X])([A-Z]{2})(\d*)$/.exec(raw);
  if (!match) return raw;
  const [, gzd, square, digits] = match;
  const half = digits!.length / 2;
  const easting = digits!.slice(0, half);
  const northing = digits!.slice(half);
  return [gzd, square, easting, northing].filter(Boolean).join(' ');
}

/**
 * Format a WGS84 latitude/longitude pair for display.
 *
 * Pure and framework-agnostic — safe to call from any surface. Invalid input
 * (NaN, out of range, or beyond MGRS's polar limits) returns {@link COORD_INVALID}
 * rather than throwing.
 *
 * @example
 * formatLatLon(47.3769, 8.5417)                      // "47.3769° N, 8.5417° E"
 * formatLatLon(47.3769, 8.5417, { format: 'dms' })   // "47°22′36.8″ N  8°32′30.1″ E"
 * formatLatLon(47.3769, 8.5417, { format: 'mgrs' })  // "32T MT 65403 47150"
 */
export function formatLatLon(lat: number, lon: number, options: FormatLatLonOptions = {}): string {
  const { format = 'dd', mgrsAccuracy = 5, hemisphere = true } = options;

  if (!isValidLatLon(lat, lon)) return COORD_INVALID;

  if (format === 'mgrs') {
    try {
      return groupMgrs(mgrsForward([lon, lat], mgrsAccuracy));
    } catch {
      // mgrs throws for points in the polar regions it does not cover.
      return COORD_INVALID;
    }
  }

  const precision = options.precision ?? DEFAULT_PRECISION[format];

  if (format === 'dd') {
    return `${formatDd(lat, 'lat', precision, hemisphere)}, ${formatDd(lon, 'lon', precision, hemisphere)}`;
  }
  if (format === 'dms') {
    return `${formatDms(lat, 'lat', precision)}  ${formatDms(lon, 'lon', precision)}`;
  }
  // ddm
  return `${formatDdm(lat, 'lat', precision)}  ${formatDdm(lon, 'lon', precision)}`;
}
