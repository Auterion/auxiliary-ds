<script setup lang="ts">
import { ProgressIndicator, ProgressRoot } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { progress } from '@auxiliary/css/recipes';
import { cn } from '@auxiliary/css/utils';
import { STATUS_LABELS, type StatusLevel } from './status-glyphs';

const props = withDefaults(
  defineProps<{
    value?: number | null;
    max?: number;
    /**
     * Status level. The bar's own length carries the reading; `level` adds the
     * tier. Because a track has no room for a glyph, the non-color channel here
     * is `aria-valuetext` — the level word travels with the value to assistive
     * tech instead of living in the fill hue alone (AD-D-014 invariant 1).
     */
    level?: StatusLevel | null;
    class?: HTMLAttributes['class'];
  }>(),
  {
    max: 100,
    level: null,
  },
);

const styles = computed(() => progress({ level: props.level ?? undefined }));
const rootClass = computed(() => cn(styles.value.root(), props.class));
const indicatorClass = computed(() => styles.value.indicator());

const translate = computed(() => {
  if (props.value == null) return '-100%';
  const pct = Math.min(100, Math.max(0, (props.value / props.max) * 100));
  return `-${100 - pct}%`;
});

/**
 * Level word + reading, so the tier is announced rather than only painted.
 * Left undefined without a level, so the platform's own percentage wins.
 */
const valueText = computed(() => {
  if (!props.level) return undefined;
  const level = STATUS_LABELS[props.level];
  if (props.value == null) return level;
  const pct = Math.round(Math.min(100, Math.max(0, (props.value / props.max) * 100)));
  return `${level} — ${pct}%`;
});
</script>

<template>
  <ProgressRoot
    :model-value="value"
    :max="max"
    :class="rootClass"
    :aria-valuetext="valueText"
  >
    <ProgressIndicator
      :class="indicatorClass"
      :style="{ transform: `translateX(${translate})` }"
    />
  </ProgressRoot>
</template>
