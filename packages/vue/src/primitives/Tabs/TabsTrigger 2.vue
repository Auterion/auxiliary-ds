<script setup lang="ts">
import { TabsTrigger } from 'reka-ui';

defineProps<{
  value: string;
  disabled?: boolean;
}>();
</script>

<template>
  <TabsTrigger
    :value="value"
    :disabled="disabled"
    class="inline-flex h-7 items-center justify-center rounded px-3 text-sm text-secondary outline-none transition-colors hover:text-primary focus-visible:ring-2 ring-focus data-[state=active]:bg-accent data-[state=active]:text-accent-fg disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <slot />
  </TabsTrigger>
</template>
