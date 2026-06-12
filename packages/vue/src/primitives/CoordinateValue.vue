<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { coordinateValue, type Size } from '@auxiliary/css/recipes';
import { formatLatLon, type CoordFormat } from '@auxiliary/css/format';
import { cn } from '@auxiliary/css/utils';
import type { StatusLevel } from './status-glyphs';

const props = withDefaults(
  defineProps<{
    /** WGS84 latitude in decimal degrees. */
    lat: number;
    /** WGS84 longitude in decimal degrees. */
    lon: number;
    /** Display format: decimal degrees, DMS, decimal minutes, or MGRS. */
    format?: CoordFormat;
    /** Decimal places — meaning depends on `format` (dd → degrees, dms → seconds, ddm → minutes). */
    precision?: number;
    /** MGRS grid precision, 1..5 (10 km → 1 m). `mgrs` only. */
    mgrsAccuracy?: number;
    /** Optional label rendered above the value. */
    label?: string;
    /** Render a small format tag (e.g. "MGRS") next to the value. */
    showFormatTag?: boolean;
    /** Visual size. */
    size?: Size;
    /** Status level — colors the value when set (e.g. red for an out-of-bounds fix). */
    level?: StatusLevel | null;
    class?: HTMLAttributes['class'];
  }>(),
  {
    format: 'dd',
    mgrsAccuracy: 5,
    showFormatTag: false,
    size: 'md',
    level: null,
  },
);

const styles = computed(() =>
  coordinateValue({ size: props.size, level: props.level ?? undefined }),
);

const rootClass = computed(() => cn(styles.value.root(), props.class));

const formatted = computed(() =>
  formatLatLon(props.lat, props.lon, {
    format: props.format,
    precision: props.precision,
    mgrsAccuracy: props.mgrsAccuracy,
  }),
);

const formatTag = computed(() => props.format.toUpperCase());
</script>

<template>
  <div :class="rootClass">
    <span v-if="label" :class="styles.label()">{{ label }}</span>
    <div :class="styles.valueRow()">
      <span :class="styles.value()">{{ formatted }}</span>
      <span v-if="showFormatTag" :class="styles.formatTag()">{{ formatTag }}</span>
    </div>
  </div>
</template>
