<script setup lang="ts">
import { computed } from 'vue';
import { barRects, histogram } from './geometry';

/**
 * A histogram — the shape of a sample distribution. Bins raw `values` into
 * equal-width buckets and renders them as adjacent bars (no gap, so the
 * distribution reads as a continuous shape). Pure SVG (SSR-safe), token-driven.
 */
const props = withDefaults(
  defineProps<{
    values: number[];
    /** Number of equal-width bins. */
    bins?: number;
    width?: number;
    height?: number;
    color?: string;
    label?: string;
  }>(),
  {
    bins: 12,
    width: 260,
    height: 140,
    color: 'var(--viz-sequential-3)',
    label: undefined,
  },
);

const hist = computed(() => histogram(props.values, props.bins));
const geo = computed(() =>
  barRects(hist.value.counts, { width: props.width, height: props.height, gap: 0.06 }),
);
</script>

<template>
  <svg
    :viewBox="geo.viewBox"
    :width="width"
    :height="height"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
    style="display: block"
  >
    <rect
      v-for="(r, i) in geo.rects"
      :key="i"
      :x="r.x"
      :y="r.y"
      :width="r.width"
      :height="r.height"
      :fill="color"
    />
  </svg>
</template>
