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
    class="inline-flex h-7 items-center justify-center rounded px-3 text-sm text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 ring-ring data-[state=active]:bg-primary data-[state=active]:text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
  >
    <slot />
  </TabsTrigger>
</template>
