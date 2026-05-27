<script setup lang="ts">
import { SelectRoot } from 'reka-ui';

defineProps<{
  modelValue?: string;
  defaultValue?: string;
  open?: boolean;
  defaultOpen?: boolean;
  disabled?: boolean;
  name?: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
  (e: 'update:open', open: boolean): void;
}>();
</script>

<template>
  <SelectRoot
    :model-value="modelValue"
    :default-value="defaultValue"
    :open="open"
    :default-open="defaultOpen"
    :disabled="disabled"
    :name="name"
    @update:model-value="$emit('update:modelValue', $event)"
    @update:open="$emit('update:open', $event)"
  >
    <slot />
  </SelectRoot>
</template>
