<script setup lang="ts">
defineProps<{
  modelValue?: string | number;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
  <input
    :id="id"
    :type="type ?? 'text'"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    class="h-9 w-full rounded-md bg-input border border-input px-3 text-sm text-primary placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 ring-focus disabled:opacity-50 disabled:cursor-not-allowed"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
