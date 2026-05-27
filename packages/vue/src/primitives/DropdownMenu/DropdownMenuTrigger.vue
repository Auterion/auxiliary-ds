<script setup lang="ts">
import { DropdownMenuTrigger } from 'reka-ui';

defineProps<{
  asChild?: boolean;
}>();
</script>

<template>
  <DropdownMenuTrigger :as-child="asChild">
    <slot />
  </DropdownMenuTrigger>
</template>
