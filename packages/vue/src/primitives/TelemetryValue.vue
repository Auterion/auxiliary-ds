<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    /** Numeric or pre-formatted string value. Numeric values use precision + tabular-nums. */
    value: number | string;
    /** Unit suffix (e.g. "m", "m/s", "°"). */
    unit?: string;
    /** Optional label rendered above the value. */
    label?: string;
    /** Decimals for numeric values (ignored for strings). */
    precision?: number;
    /** Trend arrow next to the value. */
    trend?: 'up' | 'down' | 'stable' | null;
    /** Visual size. */
    size?: 'sm' | 'md' | 'lg';
    /** Status level — colors the value when set (e.g. red for alarm threshold). */
    level?: 'alarm' | 'warning' | 'caution' | 'advisory' | 'nominal' | null;
  }>(),
  {
    precision: 1,
    trend: null,
    size: 'md',
    level: null,
  },
);

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toFixed(props.precision);
  }
  return props.value;
});

const valueClass = computed(() => {
  const sizing =
    props.size === 'lg' ? 'text-2xl' : props.size === 'sm' ? 'text-sm' : 'text-lg';
  const color = props.level
    ? {
        alarm:    'text-alarm',
        warning:  'text-warning',
        caution:  'text-caution',
        advisory: 'text-advisory',
        nominal:  'text-nominal',
      }[props.level]
    : 'text-foreground';
  return [sizing, color, 'font-mono tabular font-medium leading-tight'].join(' ');
});

const trendArrow = computed(() => {
  if (props.trend === 'up') return '▲';
  if (props.trend === 'down') return '▼';
  if (props.trend === 'stable') return '–';
  return '';
});
</script>

<template>
  <div class="inline-flex flex-col">
    <span v-if="label" class="text-xs uppercase tracking-wide text-muted-foreground">{{ label }}</span>
    <div class="inline-flex items-baseline gap-1.5">
      <span :class="valueClass">{{ formattedValue }}</span>
      <span v-if="unit" class="font-mono text-xs text-muted-foreground">{{ unit }}</span>
      <span
        v-if="trendArrow"
        class="font-mono text-xs text-muted-foreground"
        :aria-label="`trend ${trend}`"
      >{{ trendArrow }}</span>
    </div>
  </div>
</template>
