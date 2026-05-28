<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { spinner, type Size } from '@auxiliary/css/recipes';
import { cn } from '@auxiliary/css/utils';

const props = withDefaults(
  defineProps<{
    size?: Size;
    label?: string;
    class?: HTMLAttributes['class'];
  }>(),
  {
    size: 'md',
    label: 'Loading',
  },
);

const styles = computed(() => spinner({ size: props.size }));
const rootClass = computed(() => cn(styles.value.root(), props.class));
</script>

<template>
  <span :class="rootClass" role="status" :aria-label="label">
    <svg
      :class="styles.icon()"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="3"
        stroke-opacity="0.2"
      />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        fill="none"
      />
    </svg>
    <span class="sr-only">{{ label }}</span>
  </span>
</template>
