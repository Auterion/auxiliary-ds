/**
 * Framework-agnostic chart geometry — pure functions, no DOM, SSR-safe.
 *
 * The headless core behind the SVG charts (Sparkline, Gauge). Kept free of Vue
 * so the math is unit-testable on its own and reusable by any renderer.
 */

const round = (n: number): number => Math.round(n * 100) / 100;

export interface Point {
  x: number;
  y: number;
}

export interface SparklineOptions {
  width?: number;
  height?: number;
  /** Inset so stroke width and the last-point marker aren't clipped at the edges. */
  padding?: number;
}

export interface SparklineGeometry {
  width: number;
  height: number;
  viewBox: string;
  /** `<path d>` for the line. Empty string when there's nothing to draw. */
  line: string;
  /** `<path d>` for the filled area under the line (closed to the baseline). */
  area: string;
  points: Point[];
  /** The most recent point — for an "current value" marker. Null when no data. */
  last: Point | null;
}

/**
 * Map a series of values to an SVG line + area path, normalized to the box.
 * A flat series (all equal) or a single point renders a centered horizontal line
 * rather than dividing by zero.
 */
export function sparklinePath(values: number[], options: SparklineOptions = {}): SparklineGeometry {
  const width = options.width ?? 120;
  const height = options.height ?? 32;
  const padding = options.padding ?? 2;
  const innerW = Math.max(0, width - padding * 2);
  const innerH = Math.max(0, height - padding * 2);
  const viewBox = `0 0 ${width} ${height}`;

  if (values.length === 0) {
    return { width, height, viewBox, line: '', area: '', points: [], last: null };
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min;
  const n = values.length;

  const points: Point[] = values.map((v, i) => ({
    x: round(padding + (n === 1 ? innerW / 2 : (innerW * i) / (n - 1))),
    y: round(padding + (span === 0 ? innerH / 2 : innerH * (1 - (v - min) / span))),
  }));

  const line = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x} ${p.y}`).join(' ');
  const first = points[0]!;
  const last = points[points.length - 1]!;
  const base = round(padding + innerH);
  const area = `${line} L${last.x} ${base} L${first.x} ${base} Z`;

  return { width, height, viewBox, line, area, points, last };
}

export interface BarRect {
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
}

export interface BarsOptions {
  width?: number;
  height?: number;
  /** Gap between bars as a fraction of the slot (0–1). Default 0.2. */
  gap?: number;
  /** Y-axis maximum. Defaults to the largest value (so the tallest bar fills). */
  max?: number;
  padding?: number;
}

export interface BarsGeometry {
  width: number;
  height: number;
  viewBox: string;
  rects: BarRect[];
  max: number;
}

/** Lay out a value series as vertical bars filling the box, baseline at the bottom. */
export function barRects(values: number[], options: BarsOptions = {}): BarsGeometry {
  const width = options.width ?? 240;
  const height = options.height ?? 120;
  const gap = options.gap ?? 0.2;
  const padding = options.padding ?? 2;
  const viewBox = `0 0 ${width} ${height}`;
  const n = values.length;
  if (n === 0) return { width, height, viewBox, rects: [], max: 0 };

  const max = options.max ?? Math.max(0, ...values);
  const innerW = Math.max(0, width - padding * 2);
  const innerH = Math.max(0, height - padding * 2);
  const slot = innerW / n;
  const barW = slot * (1 - gap);

  const rects: BarRect[] = values.map((value, i) => {
    const h = max === 0 ? 0 : innerH * (Math.max(0, value) / max);
    return {
      x: round(padding + i * slot + (slot - barW) / 2),
      y: round(padding + innerH - h),
      width: round(barW),
      height: round(h),
      value,
    };
  });
  return { width, height, viewBox, rects, max };
}

export interface HistogramBin {
  x0: number;
  x1: number;
  count: number;
}

export interface Histogram {
  bins: HistogramBin[];
  counts: number[];
  max: number;
}

/** Bin raw samples into `bins` equal-width buckets over [min, max]. */
export function histogram(values: number[], bins = 10): Histogram {
  if (values.length === 0 || bins < 1) return { bins: [], counts: [], max: 0 };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const counts = new Array<number>(bins).fill(0);
  for (const v of values) {
    let idx = Math.floor(((v - min) / span) * bins);
    if (idx >= bins) idx = bins - 1;
    if (idx < 0) idx = 0;
    counts[idx]!++;
  }
  const out: HistogramBin[] = counts.map((count, i) => ({
    x0: min + (span * i) / bins,
    x1: min + (span * (i + 1)) / bins,
    count,
  }));
  return { bins: out, counts, max: Math.max(...counts) };
}

export interface GaugeOptions {
  min?: number;
  max?: number;
  size?: number;
  thickness?: number;
  /** Arc start, degrees clockwise from 12 o'clock. Default 135 (lower-left). */
  startAngle?: number;
  /** Total arc sweep in degrees. Default 270 (a gap at the bottom). */
  sweep?: number;
}

export interface GaugeGeometry {
  size: number;
  thickness: number;
  center: number;
  radius: number;
  viewBox: string;
  /** Full-range background arc. */
  track: string;
  /** Filled arc from start to the current value. Empty string at fraction 0. */
  value: string;
  /** Clamped 0–1 position of `value` within [min, max]. */
  fraction: number;
}

/** Polar point, degrees clockwise from 12 o'clock (SVG y-down). */
function polar(cx: number, cy: number, r: number, deg: number): Point {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arc(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const start = polar(cx, cy, r, startDeg);
  const end = polar(cx, cy, r, endDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return `M${round(start.x)} ${round(start.y)} A${r} ${r} 0 ${largeArc} 1 ${round(end.x)} ${round(end.y)}`;
}

/**
 * Arc geometry for a radial gauge/dial. `value` is clamped into [min, max] and
 * mapped onto a `sweep`-degree arc starting at `startAngle`.
 */
export function gaugeGeometry(value: number, options: GaugeOptions = {}): GaugeGeometry {
  const min = options.min ?? 0;
  const max = options.max ?? 100;
  const size = options.size ?? 96;
  const thickness = options.thickness ?? 8;
  const startAngle = options.startAngle ?? 135;
  const sweep = options.sweep ?? 270;

  const center = size / 2;
  const radius = center - thickness / 2;
  const span = max - min;
  const fraction = span === 0 ? 0 : Math.min(1, Math.max(0, (value - min) / span));

  return {
    size,
    thickness,
    center,
    radius,
    viewBox: `0 0 ${size} ${size}`,
    track: arc(center, center, radius, startAngle, startAngle + sweep),
    value: fraction === 0 ? '' : arc(center, center, radius, startAngle, startAngle + sweep * fraction),
    fraction,
  };
}
