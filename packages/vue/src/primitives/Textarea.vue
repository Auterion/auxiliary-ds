<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@auxiliary/css/utils';
import { textarea, type TextareaVariants } from '@auxiliary/css/recipes';

const props = defineProps<{
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  id?: string;
  /** Shared size scale (sm | md | lg) — flexes padding + type. */
  size?: TextareaVariants['size'];
  /** Marks the field invalid: sets aria-invalid + destructive border/ring. */
  invalid?: boolean;
  class?: HTMLAttributes['class'];
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const rootClass = computed(() =>
  cn(textarea({ size: props.size, invalid: props.invalid }), props.class),
);
</script>

<template>
  <textarea
    :id="id"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :rows="rows ?? 4"
    :aria-invalid="invalid || undefined"
    :class="rootClass"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>
