<script setup lang="ts">
import { computed } from 'vue';
import { barRects } from './geometry';
import { categorical } from './palette';

/**
 * A categorical bar chart — values across labelled categories. Pure SVG
 * (SSR-safe), token-driven. One color by default; `colorByIndex` draws each bar
 * from the viz categorical palette (for genuinely distinct categories, not a
 * single measured series).
 */
const props = withDefaults(
  defineProps<{
    values: number[];
    /** Category labels, shown under the bars when provided. */
    labels?: string[];
    width?: number;
    height?: number;
    /** Y-axis max. Defaults to the largest value. */
    max?: number;
    color?: string;
    /** Color each bar from the categorical palette instead of one `color`. */
    colorByIndex?: boolean;
    label?: string;
  }>(),
  {
    labels: () => [],
    width: 260,
    height: 140,
    max: undefined,
    color: 'var(--viz-categorical-1)',
    colorByIndex: false,
    label: undefined,
  },
);

const geo = computed(() =>
  barRects(props.values, { width: props.width, height: props.height, max: props.max }),
);
const fillFor = (i: number): string =>
  props.colorByIndex ? categorical[i % categorical.length]! : props.color;
</script>

<template>
  <figure :style="{ margin: '0', width: `${width}px` }">
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
        :fill="fillFor(i)"
        rx="1.5"
      />
    </svg>
    <figcaption
      v-if="labels.length"
      :style="{ display: 'flex', fontSize: '0.6875rem', color: 'var(--muted-foreground)' }"
    >
      <span
        v-for="(l, i) in labels"
        :key="i"
        :style="{ flex: '1', textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }"
        >{{ l }}</span
      >
    </figcaption>
  </figure>
</template>
