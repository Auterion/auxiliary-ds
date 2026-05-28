<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@auxiliary/css/utils';
import { textarea } from '@auxiliary/css/recipes';

const props = defineProps<{
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  id?: string;
  class?: HTMLAttributes['class'];
}>();

defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const rootClass = computed(() => cn(textarea(), props.class));
</script>

<template>
  <textarea
    :id="id"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :rows="rows ?? 4"
    :class="rootClass"
    @input="$emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>
