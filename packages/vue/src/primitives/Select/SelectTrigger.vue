<script setup lang="ts">
import { SelectIcon, SelectTrigger } from 'reka-ui';
</script>

<template>
  <SelectTrigger
    class="inline-flex h-9 w-full items-center justify-between gap-2 rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none focus-visible:ring-2 ring-ring disabled:opacity-50 disabled:cursor-not-allowed data-[placeholder]:text-muted-foreground"
  >
    <slot />
    <SelectIcon>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="text-muted-foreground"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </SelectIcon>
  </SelectTrigger>
</template>
