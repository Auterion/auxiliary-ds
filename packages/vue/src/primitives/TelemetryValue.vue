<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { telemetryValue, type Size } from '@auxiliary/css/recipes';
import { convertQuantity, formatNumber, type Quantity, type UnitSystem } from '@auxiliary/css/format';
import { cn } from '@auxiliary/css/utils';
import { useUnitSystem } from '../composables/useUnitSystem';

const props = withDefaults(
  defineProps<{
    /**
     * Numeric or pre-formatted string value. With `quantity` set, a numeric
     * value is treated as canonical SI and converted to the active unit system.
     */
    value: number | string;
    /** Unit suffix (e.g. "m", "m/s", "°"). Ignored when `quantity` derives the unit. */
    unit?: string;
    /** Optional label rendered above the value. */
    label?: string;
    /** Decimals for numeric values (ignored for strings). Defaults to the unit's precision in quantity mode, else 1. */
    precision?: number;
    /** Quantity kind — when set, `value` is canonical SI and gets converted + unit-labelled. */
    quantity?: Quantity;
    /** Override the deployment unit system from `<UnitSystemProvider>`. */
    system?: UnitSystem;
    /** Override the deployment locale. Unset = deterministic formatting (no grouping). */
    locale?: string;
    /** Trend arrow next to the value. */
    trend?: 'up' | 'down' | 'stable' | null;
    /** Visual size. */
    size?: Size;
    /** Status level — colors the value when set (e.g. red for alarm threshold). */
    level?: 'alarm' | 'warning' | 'caution' | 'advisory' | 'nominal' | null;
    class?: HTMLAttributes['class'];
  }>(),
  {
    trend: null,
    size: 'md',
    level: null,
  },
);

const ctx = useUnitSystem();
const system = computed(() => props.system ?? ctx.system.value);
const locale = computed(() => props.locale ?? ctx.locale.value);

const styles = computed(() =>
  telemetryValue({ size: props.size, level: props.level ?? undefined }),
);

const rootClass = computed(() => cn(styles.value.root(), props.class));

/** Converted SI value in quantity mode; null otherwise. */
const converted = computed(() =>
  props.quantity != null && typeof props.value === 'number'
    ? convertQuantity(props.value, props.quantity, system.value)
    : null,
);

const formattedValue = computed(() => {
  if (converted.value) {
    return formatNumber(converted.value.value, {
      locale: locale.value,
      precision: props.precision ?? converted.value.precision,
    });
  }
  if (typeof props.value === 'number') {
    return formatNumber(props.value, { locale: locale.value, precision: props.precision ?? 1 });
  }
  return props.value;
});

/** Unit derived from `quantity` wins over the manual `unit` prop. */
const displayUnit = computed(() => converted.value?.unit ?? props.unit);

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
      <span v-if="displayUnit" :class="styles.unit()">{{ displayUnit }}</span>
      <span
        v-if="trendArrow"
        :class="styles.trend()"
        :aria-label="`trend ${trend}`"
      >{{ trendArrow }}</span>
    </div>
  </div>
</template>
