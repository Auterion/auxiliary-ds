<script setup lang="ts">
import { onBeforeUnmount, onMounted, shallowRef, watch } from 'vue';
import uPlot from 'uplot';
import 'uplot/dist/uPlot.min.css';
import { categorical } from './palette';

/**
 * Streaming time-series on uPlot (canvas) — the high-rate operational case.
 * Updates flow through `uplot.setData` (canvas redraw), never DOM mutation, so
 * a 10–60 Hz feed doesn't reflow the page; pair with `downsample`/`pushCapped`
 * from this package to keep the data window bounded. Series colors come from the
 * viz palette; axis/grid follow the active theme (resolved once at mount —
 * re-mount to recolor after a theme switch, a known uPlot+CSS-var limitation).
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
        stroke: categorical[i % categorical.length]!,
        width: 1.5,
        points: { show: false },
      })),
    ],
  };
}

onMounted(() => {
  const el = host.value;
  if (!el || typeof document === 'undefined') return;
  if (!document.createElement('canvas').getContext('2d')) return; // SSR / no-canvas: degrade
  chart = new uPlot(buildOptions(), props.data, el);
});

// Streaming: push new data through setData (canvas redraw) — no DOM reflow.
watch(
  () => props.data,
  (d) => chart?.setData(d),
  { deep: false },
);
watch([() => props.width, () => props.height], ([w, h]) => chart?.setSize({ width: w, height: h }));

onBeforeUnmount(() => {
  chart?.destroy();
  chart = null;
});
</script>

<template>
  <div
    ref="host"
    role="img"
    :aria-label="label"
    :style="{ width: `${width}px`, height: `${height}px` }"
  />
</template>
