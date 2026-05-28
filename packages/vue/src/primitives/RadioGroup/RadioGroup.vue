<script setup lang="ts">
import { RadioGroupRoot } from 'reka-ui';

defineProps<{
  modelValue?: string;
  defaultValue?: string;
  disabled?: boolean;
  required?: boolean;
  name?: string;
  orientation?: 'horizontal' | 'vertical';
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
  <RadioGroupRoot
    :model-value="modelValue"
    :default-value="defaultValue"
    :disabled="disabled"
    :required="required"
    :name="name"
    :orientation="orientation"
    class="flex gap-2"
    :class="orientation === 'horizontal' ? 'flex-row' : 'flex-col'"
    @update:model-value="$emit('update:modelValue', String($event ?? ''))"
  >
    <slot />
  </RadioGroupRoot>
</template>
