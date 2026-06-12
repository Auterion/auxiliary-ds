<script setup lang="ts">
import { ProgressIndicator, ProgressRoot } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { progress } from '@auxiliary/css/recipes';
import { cn } from '@auxiliary/css/utils';
import type { StatusLevel } from './status-glyphs';

const props = withDefaults(
  defineProps<{
    value?: number | null;
    max?: number;
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
</script>

<template>
  <ProgressRoot :model-value="value" :max="max" :class="rootClass">
    <ProgressIndicator
      :class="indicatorClass"
      :style="{ transform: `translateX(${translate})` }"
    />
  </ProgressRoot>
</template>
