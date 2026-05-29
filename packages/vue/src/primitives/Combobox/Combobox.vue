<script setup lang="ts">
// Type-ahead select built on Reka UI's Combobox. Root owns state + filtering;
// compose with ComboboxInput, ComboboxContent, ComboboxItem, ComboboxEmpty.
import {
  ComboboxRoot,
  useForwardPropsEmits,
  type ComboboxRootEmits,
  type ComboboxRootProps,
} from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';

const props = defineProps<ComboboxRootProps & { class?: HTMLAttributes['class'] }>();
const emits = defineEmits<ComboboxRootEmits>();

const delegated = computed(() => {
  const { class: _class, ...rest } = props;
  return rest;
});
const forwarded = useForwardPropsEmits(delegated, emits);
</script>

<template>
  <ComboboxRoot v-bind="forwarded" :class="props.class">
    <slot />
  </ComboboxRoot>
</template>
