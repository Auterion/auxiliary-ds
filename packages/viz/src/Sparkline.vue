<script setup lang="ts">
import { computed } from 'vue';
import { sparklinePath } from './geometry';

/**
 * Inline trend line — the smallest chart, pairs with `TelemetryValue`.
 * Pure SVG (SSR-safe), token-driven stroke. Without a `label` it's treated as
 * decorative (`aria-hidden`) on the assumption an adjacent readout carries the
 * value; pass `label` to make it a standalone `img` for assistive tech.
 */
const props = withDefaults(
  defineProps<{
    values: number[];
    width?: number;
    height?: number;
    /** Fill the area under the line at low opacity. */
    area?: boolean;
    /** Stroke/fill color — any CSS color or var. Defaults to the first viz series. */
    color?: string;
    label?: string;
  }>(),
  {
    width: 120,
    height: 32,
    area: false,
    color: 'var(--viz-categorical-1)',
    label: undefined,
  },
);

const geo = computed(() => sparklinePath(props.values, { width: props.width, height: props.height }));
</script>

<template>
  <svg
    :viewBox="geo.viewBox"
    :width="width"
    :height="height"
    fill="none"
    :role="label ? 'img' : undefined"
    :aria-label="label"
    :aria-hidden="label ? undefined : 'true'"
    style="display: inline-block; vertical-align: middle; overflow: visible"
  >
    <path v-if="area && geo.area" :d="geo.area" :fill="color" fill-opacity="0.15" stroke="none" />
    <path
      v-if="geo.line"
      :d="geo.line"
      :stroke="color"
      stroke-width="1.5"
      stroke-linejoin="round"
      stroke-linecap="round"
      vector-effect="non-scaling-stroke"
    />
    <circle v-if="geo.last" :cx="geo.last.x" :cy="geo.last.y" r="1.75" :fill="color" />
  </svg>
</template>
