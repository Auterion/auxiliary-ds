<script setup lang="ts">
import {
  RadioGroupRoot,
  useForwardPropsEmits,
  type RadioGroupRootEmits,
  type RadioGroupRootProps,
} from 'reka-ui';

const props = defineProps<RadioGroupRootProps>();
const emits = defineEmits<RadioGroupRootEmits>();
const forwarded = useForwardPropsEmits(props, emits);
</script>

<template>
  <RadioGroupRoot
    v-bind="forwarded"
    class="flex gap-2"
    :class="props.orientation === 'horizontal' ? 'flex-row' : 'flex-col'"
  >
    <slot />
  </RadioGroupRoot>
</template>
