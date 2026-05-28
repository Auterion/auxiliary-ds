<script setup lang="ts">
import { TabsRoot } from 'reka-ui';

defineProps<{
  modelValue?: string;
  defaultValue?: string;
  orientation?: 'horizontal' | 'vertical';
  activationMode?: 'automatic' | 'manual';
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
  <TabsRoot
    :model-value="modelValue"
    :default-value="defaultValue"
    :orientation="orientation"
    :activation-mode="activationMode"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <slot />
  </TabsRoot>
</template>
