<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { coordinateValue, type Size } from '@auxiliary/css/recipes';
import { formatLatLon, type CoordFormat } from '@auxiliary/css/format';
import { cn } from '@auxiliary/css/utils';
import { STATUS_GLYPHS, STATUS_LABELS, type StatusLevel } from './status-glyphs';

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
    /**
     * Status level for an out-of-bounds fix. Renders the shared severity glyph
     * and a visually-hidden level word alongside the color — never color alone.
     */
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

const levelGlyph = computed(() => (props.level ? STATUS_GLYPHS[props.level] : null));
const levelLabel = computed(() => (props.level ? STATUS_LABELS[props.level] : null));
</script>

<template>
  <div :class="rootClass">
    <span v-if="label" :class="styles.label()">{{ label }}</span>
    <div :class="styles.valueRow()">
      <!-- Non-color redundancy for `level` — same shape + sr-only word as TelemetryValue. -->
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
      <span :class="styles.value()">{{ formatted }}</span>
      <span v-if="showFormatTag" :class="styles.formatTag()">{{ formatTag }}</span>
      <span v-if="levelLabel" class="sr-only">{{ levelLabel }}</span>
    </div>
  </div>
</template>
