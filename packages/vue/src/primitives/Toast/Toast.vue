<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import {
  ToastRoot,
  useForwardPropsEmits,
  type ToastRootEmits,
  type ToastRootProps,
} from 'reka-ui';
import { cn } from '@auxiliary/css/utils';
import { toast } from '@auxiliary/css/recipes';

const props = defineProps<ToastRootProps & { class?: HTMLAttributes['class'] }>();
const emits = defineEmits<ToastRootEmits>();
const delegated = computed(() => {
  const { class: _class, ...rest } = props;
  return rest;
});
const forwarded = useForwardPropsEmits(delegated, emits);
const styles = toast();
const rootClass = computed(() => cn(styles.root(), props.class));
</script>

<template>
  <ToastRoot v-bind="forwarded" :class="rootClass">
    <slot />
  </ToastRoot>
</template>
