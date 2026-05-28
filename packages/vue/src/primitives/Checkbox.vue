<script setup lang="ts">
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui';

defineProps<{
  modelValue?: boolean | 'indeterminate';
  defaultValue?: boolean | 'indeterminate';
  disabled?: boolean;
  required?: boolean;
  name?: string;
  value?: string;
  id?: string;
}>();

defineEmits<{
  (e: 'update:modelValue', checked: boolean | 'indeterminate'): void;
}>();
</script>

<template>
  <CheckboxRoot
    :id="id"
    :model-value="modelValue"
    :default-value="defaultValue"
    :disabled="disabled"
    :required="required"
    :name="name"
    :value="value"
    class="flex h-4 w-4 shrink-0 items-center justify-center rounded border border-input bg-input outline-none data-[state=checked]:bg-accent data-[state=checked]:border-accent data-[state=indeterminate]:bg-accent data-[state=indeterminate]:border-accent focus-visible:ring-2 ring-focus disabled:opacity-50 disabled:cursor-not-allowed"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <CheckboxIndicator class="text-accent-fg">
      <svg
        v-if="modelValue === 'indeterminate'"
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        aria-hidden="true"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
      <svg
        v-else
        width="10"
        height="10"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
