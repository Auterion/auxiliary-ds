<script setup lang="ts">
import { ToastAction } from 'reka-ui';

defineProps<{
  altText: string;
  asChild?: boolean;
}>();
</script>

<template>
  <ToastAction :alt-text="altText" :as-child="asChild">
    <slot />
  </ToastAction>
</template>
