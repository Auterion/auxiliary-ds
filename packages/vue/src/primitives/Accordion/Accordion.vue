<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import {
  AccordionRoot,
  useForwardPropsEmits,
  type AccordionRootEmits,
  type AccordionRootProps,
} from 'reka-ui';
import { cn } from '@auxiliary/css/utils';
import { accordion } from '@auxiliary/css/recipes';

const props = defineProps<AccordionRootProps & { class?: HTMLAttributes['class'] }>();
const emits = defineEmits<AccordionRootEmits>();
const delegated = computed(() => {
  const { class: _class, ...rest } = props;
  return rest;
});
const forwarded = useForwardPropsEmits(delegated, emits);
const styles = accordion();
const rootClass = computed(() => cn(styles.root(), props.class));
</script>

<template>
  <AccordionRoot v-bind="forwarded" :type="props.type ?? 'single'" :class="rootClass">
    <slot />
  </AccordionRoot>
</template>
