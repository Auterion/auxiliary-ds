<script setup lang="ts">
import { ProgressIndicator, ProgressRoot } from 'reka-ui';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    value?: number | null;
    max?: number;
    level?: 'alarm' | 'warning' | 'caution' | 'advisory' | 'nominal' | null;
  }>(),
  {
    max: 100,
    level: null,
  },
);

const indicatorClass = computed(() => {
  if (props.level) {
    return {
      alarm:    'bg-alarm',
      warning:  'bg-warning',
      caution:  'bg-caution',
      advisory: 'bg-advisory',
      nominal:  'bg-nominal',
    }[props.level];
  }
  return 'bg-accent';
});

const translate = computed(() => {
  if (props.value == null) return '-100%';
  const pct = Math.min(100, Math.max(0, (props.value / props.max) * 100));
  return `-${100 - pct}%`;
});
</script>

<template>
  <ProgressRoot
    :model-value="value"
    :max="max"
    class="relative h-2 w-full overflow-hidden rounded-full bg-input"
  >
    <ProgressIndicator
      class="h-full w-full transition-transform duration-300"
      :class="indicatorClass"
      :style="{ transform: `translateX(${translate})` }"
    />
  </ProgressRoot>
</template>
