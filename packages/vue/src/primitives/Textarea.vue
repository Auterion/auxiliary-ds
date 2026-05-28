<script setup lang="ts">
defineProps<{
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  id?: string;
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();
</script>

<template>
  <textarea
    :id="id"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :rows="rows ?? 4"
    class="w-full rounded-md bg-background border border-input px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 ring-ring disabled:opacity-50 disabled:cursor-not-allowed resize-y"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>
