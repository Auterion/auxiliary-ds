<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef, watch } from 'vue';
import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';
import { observeTheme, resolveScale } from './palette';

/**
 * Streaming time-series on uPlot (canvas) — the high-rate operational case.
 * Updates flow through `uplot.setData` (canvas redraw), never DOM mutation, so
 * a 10–60 Hz feed doesn't reflow the page; pair with `downsample`/`pushCapped`
 * from this package to keep the data window bounded.
 *
 * Canvas can't resolve CSS vars, so series/axis/grid colors are resolved from
 * the HOST element's computed style (scoped `[data-theme]` ancestors honored)
 * and the chart re-initializes when a `data-theme` attribute changes anywhere
 * above it — live theme switches recolor without a remount.
 *
 * Client-only: uPlot needs a 2D canvas context, so SSR / non-canvas test envs
 * render just the labelled container and skip init (graceful degradation).
 */
const props = withDefaults(
  defineProps<{
    /** uPlot-aligned data: `[xValues, ...ySeries]`. */
    data: uPlot.AlignedData;
    width?: number;
    height?: number;
    /** Per-series labels (used for the series name / a11y). */
    series?: string[];
    /** Accessible name for the chart region. */
    label?: string;
  }>(),
  { width: 360, height: 140, series: () => [], label: undefined },
);

const host = shallowRef<HTMLDivElement | null>(null);
let chart: uPlot | null = null;
let stopThemeObserver: (() => void) | null = null;

// Resolve a theme var against the HOST element (not documentElement), so a
// scoped [data-theme] on any ancestor is honored. canvas strokeStyle can't
// take 'currentColor', so when the var is missing (theme stylesheet not
// loaded) fall back to the host's resolved text color — a real color that
// tracks whatever theming IS present — and warn instead of guessing a hex.
function cssVar(name: string): string {
  if (typeof document === 'undefined' || !host.value) return '#888';
  const styles = getComputedStyle(host.value);
  const value = styles.getPropertyValue(name).trim();
  if (value) return value;
  if (import.meta.env?.DEV) {
    console.warn(`[viz] ${name} is unset — is the Auxiliary theme stylesheet loaded?`);
  }
  return styles.color || '#888';
}

function buildOptions(): uPlot.Options {
  const ySeriesCount = Math.max(0, props.data.length - 1);
  const axis = cssVar('--muted-foreground');
  const grid = cssVar('--border');
  const palette = host.value ? resolveScale(host.value, 'categorical') : [];
  return {
    width: props.width,
    height: props.height,
    legend: { show: false },
    cursor: { points: { show: true } },
    scales: { x: { time: false } },
    axes: [
      { stroke: axis, grid: { stroke: grid, width: 1 }, ticks: { stroke: grid } },
      { stroke: axis, grid: { stroke: grid, width: 1 }, ticks: { stroke: grid } },
    ],
    series: [
      {},
      ...Array.from({ length: ySeriesCount }, (_unused, i) => ({
        label: props.series[i] ?? `Series ${i + 1}`,
        stroke: palette[i % palette.length] ?? '#888',
        width: 1.5,
        points: { show: false },
      })),
    ],
  };
}

function init() {
  const el = host.value;
  if (!el || typeof document === 'undefined') return;
  if (!document.createElement('canvas').getContext('2d')) return; // SSR / no-canvas: degrade
  chart?.destroy();
  chart = new uPlot(buildOptions(), props.data, el);
}

onMounted(() => {
  init();
  if (host.value && chart) {
    // Re-resolve colors when [data-theme] flips anywhere above the chart.
    stopThemeObserver = observeTheme(host.value, init);
  }
});

// Streaming: push new data through setData (canvas redraw) — no DOM reflow.
watch(
  () => props.data,
  (d) => chart?.setData(d),
  { deep: false },
);
watch([() => props.width, () => props.height], ([w, h]) => chart?.setSize({ width: w, height: h }));

onBeforeUnmount(() => {
  stopThemeObserver?.();
  stopThemeObserver = null;
  chart?.destroy();
  chart = null;
});
</script>

<template>
  <!-- `label` is optional, so a hardcoded role="img" ships an UNNAMED graphic by
       default. Sparkline, Bars and Distribution all gate the role on the name and
       hide the graphic otherwise; this is the same three lines. -->
  <div
    ref="host"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
    :style="{ width: `${width}px`, height: `${height}px` }"
  />
</template>
