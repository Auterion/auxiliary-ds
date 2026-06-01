<script setup lang="ts">
import { computed } from 'vue';
import { gaugeGeometry } from './geometry';

/**
 * Radial gauge/dial for a single bounded value (battery %, CPU, signal).
 * Renders the **number beside the graphic** (the operational "numbers before
 * graphics" rule) in tabular figures, and exposes ARIA `meter` semantics so the
 * value is announced without reading the arc. Pure SVG + token colors (SSR-safe).
 */
const props = withDefaults(
  defineProps<{
    value: number;
    min?: number;
    max?: number;
    unit?: string;
    /** Accessible name, e.g. "Battery". The readout is announced via aria-valuetext. */
    label?: string;
    size?: number;
    thickness?: number;
    /** Value-arc color — any CSS color or var. Defaults to the first viz series. */
    color?: string;
  }>(),
  {
    min: 0,
    max: 100,
    unit: '',
    label: undefined,
    size: 96,
    thickness: 8,
    color: 'var(--viz-categorical-1)',
  },
);

const geo = computed(() =>
  gaugeGeometry(props.value, {
    min: props.min,
    max: props.max,
    size: props.size,
    thickness: props.thickness,
  }),
);
const readout = computed(() => `${props.value}${props.unit}`);
const valuetext = computed(() => `${props.value}${props.unit ? ` ${props.unit}` : ''}`);
</script>

<template>
  <div
    role="meter"
    :aria-valuenow="value"
    :aria-valuemin="min"
    :aria-valuemax="max"
    :aria-valuetext="valuetext"
    :aria-label="label"
    :style="{ position: 'relative', display: 'inline-flex', width: `${size}px`, height: `${size}px` }"
  >
    <svg :viewBox="geo.viewBox" :width="size" :height="size" fill="none">
      <path :d="geo.track" :stroke-width="thickness" stroke-linecap="round" stroke="var(--border)" />
      <path
        v-if="geo.value"
        :d="geo.value"
        :stroke-width="thickness"
        stroke-linecap="round"
        :stroke="color"
      />
    </svg>
    <div
      aria-hidden="true"
      :style="{
        position: 'absolute',
        inset: '0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontVariantNumeric: 'tabular-nums',
        fontWeight: 600,
        fontSize: `${size / 5}px`,
        color: 'var(--foreground)',
      }"
    >
      {{ readout }}
    </div>
  </div>
</template>
