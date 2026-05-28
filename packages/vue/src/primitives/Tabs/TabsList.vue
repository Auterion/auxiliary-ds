<script setup lang="ts">
import { TabsList } from 'reka-ui';
</script>

<template>
  <TabsList class="inline-flex h-9 items-center gap-1 rounded-md border border-border bg-card p-1">
    <slot />
  </TabsList>
</template>
