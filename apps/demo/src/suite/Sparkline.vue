<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    data: number[];
    variant?: 'line' | 'bar';
    /** Any CSS color string — defaults to currentColor so `text-*` drives it. */
    stroke?: string;
    width?: number;
    height?: number;
  }>(),
  { variant: 'line', stroke: 'currentColor', width: 240, height: 44 },
);

const min = computed(() => Math.min(...props.data));
const max = computed(() => Math.max(...props.data));
const range = computed(() => max.value - min.value || 1);

const points = computed(() => {
  const { width, height, data } = props;
  const stepX = width / (data.length - 1 || 1);
  return data.map((d, i) => {
    const x = i * stepX;
    const y = height - ((d - min.value) / range.value) * (height - 4) - 2;
    return [x, y] as const;
  });
});

const linePath = computed(() => points.value.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' '));
const areaPath = computed(
  () => `${linePath.value} L${props.width} ${props.height} L0 ${props.height} Z`,
);

const bars = computed(() => {
  const { width, height, data } = props;
  const gap = 1.5;
  const bw = width / data.length - gap;
  return data.map((d, i) => {
    const h = ((d - min.value) / range.value) * (height - 2) + 2;
    return { x: i * (bw + gap), y: height - h, w: Math.max(0.75, bw), h };
  });
});

const gid = computed(() => `sl-${Math.abs(props.data.reduce((a, b) => a + b, 0) | 0)}`);
</script>

<template>
  <svg
    :viewBox="`0 0 ${width} ${height}`"
    :width="width"
    :height="height"
    preserveAspectRatio="none"
    class="block w-full"
    :style="{ color: stroke }"
    aria-hidden="true"
  >
    <template v-if="variant === 'line'">
      <defs>
        <linearGradient :id="gid" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="currentColor" stop-opacity="0.22" />
          <stop offset="100%" stop-color="currentColor" stop-opacity="0" />
        </linearGradient>
      </defs>
      <path :d="areaPath" :fill="`url(#${gid})`" stroke="none" />
      <path :d="linePath" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" />
    </template>
    <template v-else>
      <rect
        v-for="(b, i) in bars"
        :key="i"
        :x="b.x"
        :y="b.y"
        :width="b.w"
        :height="b.h"
        rx="0.5"
        fill="currentColor"
        :opacity="0.35 + 0.65 * (i / bars.length)"
      />
    </template>
  </svg>
</template>
