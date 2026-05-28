<script setup lang="ts">
import { AccordionRoot } from 'reka-ui';

defineProps<{
  type?: 'single' | 'multiple';
  modelValue?: string | string[];
  defaultValue?: string | string[];
  collapsible?: boolean;
  disabled?: boolean;
  orientation?: 'horizontal' | 'vertical';
}>();

defineEmits<{
  (e: 'update:modelValue', value: string | string[]): void;
}>();
</script>

<template>
  <AccordionRoot
    :type="type ?? 'single'"
    :model-value="modelValue"
    :default-value="defaultValue"
    :collapsible="collapsible"
    :disabled="disabled"
    :orientation="orientation"
    class="w-full"
    @update:model-value="$emit('update:modelValue', $event as string | string[])"
  >
    <slot />
  </AccordionRoot>
</template>
