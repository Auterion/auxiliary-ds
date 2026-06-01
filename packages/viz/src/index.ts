/**
 * `@auxiliary/viz` — the data-visualization layer: token-driven, theme- &
 * CVD-safe palettes and a restrained chart set.
 *
 * - palette — categorical / sequential / diverging scales + helpers
 * - geometry — framework-agnostic SVG path math (headless core)
 * - charts — `Sparkline`, `Gauge` (SVG), `TimeSeries` (uPlot, streaming)
 */
export * from './palette';
export * from './geometry';
export * from './streaming';

export { default as Sparkline } from './Sparkline.vue';
export { default as Gauge } from './Gauge.vue';
export { default as Bars } from './Bars.vue';
export { default as Distribution } from './Distribution.vue';
export { default as TimeSeries } from './TimeSeries.vue';
