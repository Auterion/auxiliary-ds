<script setup lang="ts">
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from 'reka-ui';

const props = withDefaults(
  defineProps<{
    modelValue?: number[];
    defaultValue?: number[];
    min?: number;
    max?: number;
    step?: number;
    orientation?: 'horizontal' | 'vertical';
    disabled?: boolean;
    inverted?: boolean;
    name?: string;
  }>(),
  {
    min: 0,
    max: 100,
    step: 1,
    orientation: 'horizontal',
  },
);

defineEmits<{
  (e: 'update:modelValue', value: number[]): void;
}>();
</script>

<template>
  <SliderRoot
    :model-value="modelValue"
    :default-value="defaultValue"
    :min="min"
    :max="max"
    :step="step"
    :orientation="orientation"
    :disabled="disabled"
    :inverted="inverted"
    :name="name"
    class="relative flex w-full touch-none select-none items-center"
    @update:model-value="$emit('update:modelValue', $event ?? [])"
  >
    <SliderTrack class="relative h-1.5 w-full grow overflow-hidden rounded-full bg-input">
      <SliderRange class="absolute h-full bg-accent" />
    </SliderTrack>
    <SliderThumb
      v-for="(_, i) in (props.modelValue ?? props.defaultValue ?? [0])"
      :key="i"
      class="block h-4 w-4 rounded-full border border-accent bg-canvas shadow-sm outline-none focus-visible:ring-2 ring-focus disabled:opacity-50"
    />
  </SliderRoot>
</template>
