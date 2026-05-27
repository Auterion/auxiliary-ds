<script setup lang="ts">
import { TooltipTrigger } from 'reka-ui';

defineProps<{
  asChild?: boolean;
}>();
</script>

<template>
  <TooltipTrigger :as-child="asChild">
    <slot />
  </TooltipTrigger>
</template>
