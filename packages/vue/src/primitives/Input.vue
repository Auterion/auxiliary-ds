<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@auxiliary/css/utils';
import { input } from '@auxiliary/css/recipes';

const props = defineProps<{
  modelValue?: string | number;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  class?: HTMLAttributes['class'];
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const rootClass = computed(() => cn(input(), props.class));
</script>

<template>
  <input
    :id="id"
    :type="type ?? 'text'"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :class="rootClass"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
  />
</template>
