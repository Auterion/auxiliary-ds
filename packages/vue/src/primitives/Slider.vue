<script setup lang="ts">
import {
  SliderRange,
  SliderRoot,
  SliderThumb,
  SliderTrack,
  useForwardPropsEmits,
  type SliderRootEmits,
  type SliderRootProps,
} from 'reka-ui';
import { computed, useAttrs } from 'vue';

// An accessible name must land on the role="slider" thumb, not on SliderRoot — Reka renders
// the root as a role-less <span>, where aria-label/aria-labelledby is a prohibited attribute.
// So we take control of attribute placement and route naming attrs to the thumb(s).
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SliderRootProps>(), {
  min: 0,
  max: 100,
  step: 1,
  orientation: 'horizontal',
});
const emits = defineEmits<SliderRootEmits>();
const forwarded = useForwardPropsEmits(props, emits);

const attrs = useAttrs();
const thumbAria = computed(() => ({
  'aria-label': attrs['aria-label'] as string | undefined,
  'aria-labelledby': attrs['aria-labelledby'] as string | undefined,
}));
const rootAttrs = computed(() => {
  const { 'aria-label': _label, 'aria-labelledby': _labelledby, ...rest } = attrs;
  return rest;
});
const thumbs = computed(() => props.modelValue ?? props.defaultValue ?? [0]);
</script>

<template>
  <SliderRoot
    v-bind="{ ...forwarded, ...rootAttrs }"
    class="relative flex w-full touch-none select-none items-center"
  >
    <SliderTrack class="relative h-1.5 w-full grow overflow-hidden rounded-full bg-background">
      <SliderRange class="absolute h-full bg-primary" />
    </SliderTrack>
    <SliderThumb
      v-for="(_, i) in thumbs"
      :key="i"
      v-bind="thumbAria"
      class="block h-4 w-4 rounded-full border border-primary bg-background shadow-sm outline-none focus-visible:ring-2 ring-ring disabled:opacity-50"
    />
  </SliderRoot>
</template>
