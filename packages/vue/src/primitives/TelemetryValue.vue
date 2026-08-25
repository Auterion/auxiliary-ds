<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { telemetryValue, type Size } from '@auxiliary/css/recipes';
import { convertQuantity, formatNumber, type Quantity, type UnitSystem } from '@auxiliary/css/format';
import { cn } from '@auxiliary/css/utils';
import { STATUS_GLYPHS, STATUS_LABELS, type StatusLevel } from './status-glyphs';
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
    /**
     * Status level at a threshold. Renders the shared severity glyph and a
     * visually-hidden level word alongside the color — never color alone.
     */
    level?: StatusLevel | null;
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

/** Converted SI value in quantity mode; null otherwise. */
const converted = computed(() =>
  props.quantity != null && typeof props.value === 'number'
    ? convertQuantity(props.value, props.quantity, system.value)
    : null,
);

/** Unit derived from `quantity` wins over the manual `unit` prop. */
const displayUnit = computed(() => converted.value?.unit ?? props.unit);

/**
 * Honour the formatter's own spacing rule (`408 m` vs `247°`) so the component
 * and `formatQuantity` never disagree. Outside quantity mode the unit is a bare
 * string, so fall back to the same set of symbols that set the flag in units.ts.
 */
const spaced = computed(
  () => converted.value?.spaced ?? !/^[°%′″]/.test(displayUnit.value ?? ''),
);

const styles = computed(() =>
  telemetryValue({
    size: props.size,
    level: props.level ?? undefined,
    spaced: spaced.value,
  }),
);

const rootClass = computed(() => cn(styles.value.root(), props.class));

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

/**
 * U+2191/2193/2192 — all three inside the Geist Mono latin unicode-range, so the
 * three trend states render in one face at one advance width. The geometric
 * triangles they replaced fell outside every declared subset.
 */
const trendArrow = computed(() => {
  if (props.trend === 'up') return '↑';
  if (props.trend === 'down') return '↓';
  if (props.trend === 'stable') return '→';
  return '';
});

const levelGlyph = computed(() => (props.level ? STATUS_GLYPHS[props.level] : null));
const levelLabel = computed(() => (props.level ? STATUS_LABELS[props.level] : null));
</script>

<template>
  <div :class="rootClass">
    <span v-if="label" :class="styles.label()">{{ label }}</span>
    <div :class="styles.valueRow()">
      <!-- Non-color redundancy for `level`: a grayscale-distinct shape and, below,
           the level word for assistive tech. Color is the fast cue, never the only one. -->
      <svg
        v-if="levelGlyph"
        :class="styles.levelIcon()"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path :d="levelGlyph" />
      </svg>
      <span :class="styles.value()">{{ formattedValue }}</span>
      <span v-if="displayUnit" :class="styles.unit()">{{ displayUnit }}</span>
      <span
        v-if="trendArrow"
        :class="styles.trend()"
        aria-hidden="true"
      >{{ trendArrow }}</span>
      <span v-if="levelLabel" class="sr-only">{{ levelLabel }}</span>
      <span v-if="trend" class="sr-only">trend {{ trend }}</span>
    </div>
  </div>
</template>
