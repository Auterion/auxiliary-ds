<script setup lang="ts">
import { computed } from 'vue';
import { ICON_REGISTRY, type IconName, type IconWeight } from './registry';

const SIZE_MAP = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 20,
  xl: 24,
} as const;

type SizeKey = keyof typeof SIZE_MAP;

const props = withDefaults(
  defineProps<{
    name: IconName;
    weight?: IconWeight;
    size?: SizeKey | number;
    /**
     * Accessible label. If provided, the icon becomes role="img" with the label.
     * If omitted, the icon is aria-hidden — assume the surrounding text carries meaning.
     */
    label?: string;
  }>(),
  {
    weight: 'solid',
    size: 'md',
  },
);

const shape = computed(() => {
  const entry = ICON_REGISTRY[props.name];
  const weights = entry.weights as Record<string, string | undefined>;
  const inner =
    weights[props.weight] ??
    weights.solid ??
    weights.regular ??
    weights.light ??
    weights.thin ??
    '';
  return { viewBox: entry.viewBox, inner };
});

const dimension = computed(() =>
  typeof props.size === 'number' ? props.size : SIZE_MAP[props.size],
);
</script>

<template>
  <svg
    :width="dimension"
    :height="dimension"
    :viewBox="shape.viewBox"
    :aria-hidden="label ? undefined : true"
    :aria-label="label"
    :role="label ? 'img' : undefined"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    v-html="shape.inner"
  />
</template>
