<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { telemetryValue, type Size } from '@auxiliary/css/recipes';
import { cn } from '@auxiliary/css/utils';

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
    size?: Size;
    /** Status level — colors the value when set (e.g. red for alarm threshold). */
    level?: 'alarm' | 'warning' | 'caution' | 'advisory' | 'nominal' | null;
    class?: HTMLAttributes['class'];
  }>(),
  {
    precision: 1,
    trend: null,
    size: 'md',
    level: null,
  },
);

const styles = computed(() =>
  telemetryValue({ size: props.size, level: props.level ?? undefined }),
);

const rootClass = computed(() => cn(styles.value.root(), props.class));

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toFixed(props.precision);
  }
  return props.value;
});

const trendArrow = computed(() => {
  if (props.trend === 'up') return '▲';
  if (props.trend === 'down') return '▼';
  if (props.trend === 'stable') return '–';
  return '';
});
</script>

<template>
  <div :class="rootClass">
    <span v-if="label" :class="styles.label()">{{ label }}</span>
    <div :class="styles.valueRow()">
      <span :class="styles.value()">{{ formattedValue }}</span>
      <span v-if="unit" :class="styles.unit()">{{ unit }}</span>
      <span
        v-if="trendArrow"
        :class="styles.trend()"
        :aria-label="`trend ${trend}`"
      >{{ trendArrow }}</span>
    </div>
  </div>
</template>
