<script setup lang="ts">
import { TooltipProvider } from 'reka-ui';

withDefaults(
  defineProps<{
    delayDuration?: number;
    skipDelayDuration?: number;
    disableHoverableContent?: boolean;
  }>(),
  {
    delayDuration: 400,
    skipDelayDuration: 200,
    disableHoverableContent: false,
  },
);
</script>

<template>
  <TooltipProvider
    :delay-duration="delayDuration"
    :skip-delay-duration="skipDelayDuration"
    :disable-hoverable-content="disableHoverableContent"
  >
    <slot />
  </TooltipProvider>
</template>
