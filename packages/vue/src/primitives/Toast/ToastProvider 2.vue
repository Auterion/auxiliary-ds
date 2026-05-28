<script setup lang="ts">
import { ToastProvider } from 'reka-ui';

withDefaults(
  defineProps<{
    duration?: number;
    label?: string;
    swipeDirection?: 'right' | 'left' | 'up' | 'down';
    swipeThreshold?: number;
  }>(),
  {
    duration: 5000,
    label: 'Notification',
    swipeDirection: 'right',
    swipeThreshold: 50,
  },
);
</script>

<template>
  <ToastProvider
    :duration="duration"
    :label="label"
    :swipe-direction="swipeDirection"
    :swipe-threshold="swipeThreshold"
  >
    <slot />
  </ToastProvider>
</template>
