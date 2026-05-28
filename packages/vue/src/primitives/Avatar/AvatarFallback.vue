<script setup lang="ts">
import { AvatarFallback } from 'reka-ui';

defineProps<{
  delayMs?: number;
}>();
</script>

<template>
  <AvatarFallback
    :delay-ms="delayMs"
    class="flex h-full w-full items-center justify-center font-medium uppercase tracking-wide"
  >
    <slot />
  </AvatarFallback>
</template>
