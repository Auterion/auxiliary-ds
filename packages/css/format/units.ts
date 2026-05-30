/**
 * Unit systems + locale-aware number formatting for operational readouts.
 *
 * The design system speaks **SI** internally — callers pass canonical values
 * (metres, metres-per-second, degrees Celsius, degrees) and pick a display
 * `system` (metric / imperial) per deployment. "Imperial" here means the
 * **aviation** convention a GCS expects: feet, knots, feet-per-minute, °F.
 * Named-unit overrides (`km`, `mph`, `NM`, `mils`, …) cover the rest.
 */
export type UnitSystem = 'metric' | 'imperial';

export type Quantity =
  | 'distance'
  | 'altitude'
  | 'speed'
  | 'verticalSpeed'
  | 'temperature'
  | 'angle';

export interface FormatQuantityOptions {
  /** Display system. Default `'metric'`. */
  system?: UnitSystem;
  /** Explicit named-unit override (e.g. `'km'`, `'mph'`, `'NM'`, `'mils'`). */
  unit?: string;
  /** Decimal places. Defaults to the unit's own precision. */
  precision?: number;
  /** Intl locale; when unset, formatting is a deterministic `toFixed` (no grouping). */
  locale?: string;
}

/** Sentinel for un-formattable input (non-finite). Mirrors `COORD_INVALID`. */
export const VALUE_NA = '—';

interface UnitDef {
  symbol: string;
  /** Convert a canonical SI value into this unit. */
  toDisplay: (si: number) => number;
  /** Default decimal places for this unit. */
  precision: number;
  /** Whether a space separates the number and symbol (`408 m` vs `247°`). */
  spaced: boolean;
}

interface QuantityDef {
  metric: string;
  imperial: string;
  units: Record<string, UnitDef>;
}

const factor = (symbol: string, k: number, precision: number, spaced = true): UnitDef => ({
  symbol,
  toDisplay: (si) => si * k,
  precision,
  spaced,
});

// 1 m = 3.280839895 ft; 1 m/s = 1.943844492 kn; 1 m/s = 196.8503937 ft/min.
const REGISTRY: Record<Quantity, QuantityDef> = {
  distance: {
    metric: 'm',
    imperial: 'ft',
    units: {
      m: factor('m', 1, 0),
      ft: factor('ft', 3.280839895, 0),
      km: factor('km', 0.001, 2),
      NM: factor('NM', 1 / 1852, 2),
      mi: factor('mi', 1 / 1609.344, 2),
    },
  },
  altitude: {
    metric: 'm',
    imperial: 'ft',
    units: {
      m: factor('m', 1, 0),
      ft: factor('ft', 3.280839895, 0),
    },
  },
  speed: {
    metric: 'm/s',
    imperial: 'kn',
    units: {
      'm/s': factor('m/s', 1, 1),
      kn: factor('kn', 1.943844492, 1),
      'km/h': factor('km/h', 3.6, 0),
      mph: factor('mph', 2.236936292, 0),
    },
  },
  verticalSpeed: {
    metric: 'm/s',
    imperial: 'ft/min',
    units: {
      'm/s': factor('m/s', 1, 1),
      'ft/min': factor('ft/min', 196.8503937, 0),
    },
  },
  temperature: {
    metric: '°C',
    imperial: '°F',
    units: {
      '°C': { symbol: '°C', toDisplay: (si) => si, precision: 0, spaced: false },
      '°F': { symbol: '°F', toDisplay: (si) => si * 1.8 + 32, precision: 0, spaced: false },
    },
  },
  angle: {
    // System-invariant: degrees in both. `mils` (NATO, 6400 = 360°) is an override.
    metric: '°',
    imperial: '°',
    units: {
      '°': { symbol: '°', toDisplay: (si) => si, precision: 0, spaced: false },
      mils: factor('mils', 6400 / 360, 0),
    },
  },
};

function resolveUnit(q: Quantity, system: UnitSystem, unit?: string): UnitDef {
  const def = REGISTRY[q];
  const key = unit ?? def[system];
  return def.units[key] ?? def.units[def[system]]!;
}

/**
 * Format a number for display. With no `locale` it is a deterministic
 * `toFixed` (no grouping separators); with a `locale` it uses
 * `Intl.NumberFormat`. Non-finite input returns {@link VALUE_NA}.
 */
export function formatNumber(
  value: number,
  options: { locale?: string; precision?: number } = {},
): string {
  if (!Number.isFinite(value)) return VALUE_NA;
  const precision = options.precision ?? 0;
  if (options.locale == null) return value.toFixed(precision);
  return new Intl.NumberFormat(options.locale, {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  }).format(value);
}

/**
 * Convert a canonical SI value into the chosen system's unit, returning the
 * display number, its unit symbol, the unit's default precision, and whether a
 * space separates them. Pure — does no string formatting.
 */
export function convertQuantity(
  si: number,
  quantity: Quantity,
  system: UnitSystem = 'metric',
  unit?: string,
): { value: number; unit: string; precision: number; spaced: boolean } {
  const def = resolveUnit(quantity, system, unit);
  return { value: def.toDisplay(si), unit: def.symbol, precision: def.precision, spaced: def.spaced };
}

/**
 * Format a canonical SI value as a display string with its unit, e.g.
 * `formatQuantity(408, 'altitude', { system: 'imperial' })` → `"1339 ft"`.
 * Non-finite input returns {@link VALUE_NA} rather than throwing.
 *
 * @example
 * formatQuantity(408, 'altitude')                          // "408 m"
 * formatQuantity(408, 'altitude', { system: 'imperial' })  // "1339 ft"
 * formatQuantity(21, 'temperature', { system: 'imperial' })// "70°F"
 * formatQuantity(247, 'angle', { unit: 'mils' })           // "4391 mils"
 */
export function formatQuantity(si: number, quantity: Quantity, options: FormatQuantityOptions = {}): string {
  if (!Number.isFinite(si)) return VALUE_NA;
  const { value, unit, precision, spaced } = convertQuantity(si, quantity, options.system, options.unit);
  const num = formatNumber(value, { locale: options.locale, precision: options.precision ?? precision });
  if (num === VALUE_NA) return VALUE_NA;
  return spaced ? `${num} ${unit}` : `${num}${unit}`;
}
