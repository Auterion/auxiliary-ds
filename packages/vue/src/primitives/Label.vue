<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@auxiliary/css/utils';
import { label } from '@auxiliary/css/recipes';

const props = defineProps<{
  for?: string;
  class?: HTMLAttributes['class'];
}>();

const rootClass = computed(() => cn(label(), props.class));
</script>

<template>
  <label :for="$props.for" :class="rootClass">
    <slot />
  </label>
</template>
