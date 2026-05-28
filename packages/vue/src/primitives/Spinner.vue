<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg';
    label?: string;
  }>(),
  {
    size: 'md',
    label: 'Loading',
  },
);

const sizing = computed(
  () => ({ sm: 'h-3 w-3', md: 'h-4 w-4', lg: 'h-6 w-6' })[props.size],
);
</script>

<template>
  <span class="inline-flex items-center" :role="'status'" :aria-label="label">
    <svg
      :class="['animate-spin text-current', sizing]"
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
