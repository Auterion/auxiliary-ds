<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@auxiliary/css/utils';
import { input, type InputVariants } from '@auxiliary/css/recipes';

const props = defineProps<{
  /**
   * String-only model: a text input's value is a string, and the emit always
   * round-trips one (a `string | number` model silently became a string after
   * the first keystroke). For numeric values use `NumberField`, which owns
   * parsing, stepping, and min/max.
   */
  modelValue?: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  /** Shared size scale (sm | md | lg). Note: shadows the rarely-used native
   * `size` character-width attribute, which is not exposed — use width utilities. */
  size?: InputVariants['size'];
  /** Marks the field invalid: sets aria-invalid + destructive border/ring. */
  invalid?: boolean;
  class?: HTMLAttributes['class'];
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const rootClass = computed(() =>
  cn(input({ size: props.size, invalid: props.invalid }), props.class),
);
</script>

<template>
  <input
    :id="id"
    :type="type ?? 'text'"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :aria-invalid="invalid || undefined"
    :class="rootClass"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
