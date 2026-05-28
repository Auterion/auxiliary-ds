<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { ToastClose } from 'reka-ui';
import { cn } from '@auxiliary/css/utils';
import { toast } from '@auxiliary/css/recipes';

const props = defineProps<{
  asChild?: boolean;
  class?: HTMLAttributes['class'];
}>();

const styles = toast();
const rootClass = computed(() => cn(styles.close(), props.class));
</script>

<template>
  <ToastClose
    :as-child="asChild"
    aria-label="Close"
    :class="rootClass"
  >
    <slot>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </slot>
  </ToastClose>
</template>
