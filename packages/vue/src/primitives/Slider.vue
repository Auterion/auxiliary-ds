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

const props = withDefaults(defineProps<SliderRootProps>(), {
  min: 0,
  max: 100,
  step: 1,
  orientation: 'horizontal',
});
const emits = defineEmits<SliderRootEmits>();
const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <SliderRoot
    v-bind="forwarded"
    class="relative flex w-full touch-none select-none items-center"
  >
    <SliderTrack class="relative h-1.5 w-full grow overflow-hidden rounded-full bg-background">
      <SliderRange class="absolute h-full bg-primary" />
    </SliderTrack>
    <SliderThumb
      v-for="(_, i) in (props.modelValue ?? props.defaultValue ?? [0])"
      :key="i"
      class="block h-4 w-4 rounded-full border border-primary bg-background shadow-sm outline-none focus-visible:ring-2 ring-ring disabled:opacity-50"
    />
  </SliderRoot>
</template>
