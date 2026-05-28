<script setup lang="ts">
import { AccordionHeader, AccordionTrigger } from 'reka-ui';
</script>

<template>
  <AccordionHeader class="flex">
    <AccordionTrigger
      class="flex flex-1 items-center justify-between py-3 text-sm font-medium text-primary hover:bg-hover transition-colors focus-visible:outline-none focus-visible:ring-2 ring-focus px-1 [&[data-state=open]>svg]:rotate-180"
    >
      <slot />
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="ml-2 shrink-0 text-muted transition-transform duration-200"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </AccordionTrigger>
  </AccordionHeader>
</template>
