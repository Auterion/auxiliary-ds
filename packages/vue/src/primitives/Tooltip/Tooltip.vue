<script setup lang="ts">
import { TooltipRoot } from 'reka-ui';

defineProps<{
  open?: boolean;
  defaultOpen?: boolean;
  delayDuration?: number;
}>();

defineEmits<{
  (e: 'update:open', open: boolean): void;
}>();
</script>

<template>
  <TooltipRoot
    :open="open"
    :default-open="defaultOpen"
    :delay-duration="delayDuration"
    @update:open="$emit('update:open', $event)"
  >
    <slot />
  </TooltipRoot>
</template>
