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
import { computed, useAttrs, type HTMLAttributes } from 'vue';
import { cn } from '@auxiliary/css/utils';
import { slider } from '@auxiliary/css/recipes';

// An accessible name must land on the role="slider" thumb, not on SliderRoot — Reka renders
// the root as a role-less <span>, where aria-label/aria-labelledby is a prohibited attribute.
// So we take control of attribute placement and route naming attrs to the thumb(s).
defineOptions({ inheritAttrs: false });

const props = withDefaults(defineProps<SliderRootProps & { class?: HTMLAttributes['class'] }>(), {
  min: 0,
  max: 100,
  step: 1,
  orientation: 'horizontal',
});
const emits = defineEmits<SliderRootEmits>();
const delegated = computed(() => {
  const { class: _class, ...rest } = props;
  return rest;
});
const forwarded = useForwardPropsEmits(delegated, emits);

const styles = slider();
const rootClass = computed(() => cn(styles.root(), props.class));

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
  <SliderRoot v-bind="{ ...forwarded, ...rootAttrs }" :class="rootClass">
    <SliderTrack :class="styles.track()">
      <SliderRange :class="styles.range()" />
    </SliderTrack>
    <SliderThumb v-for="(_, i) in thumbs" :key="i" v-bind="thumbAria" :class="styles.thumb()" />
  </SliderRoot>
</template>
