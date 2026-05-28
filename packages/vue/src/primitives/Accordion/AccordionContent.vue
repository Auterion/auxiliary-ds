<script setup lang="ts">
import { AccordionContent } from 'reka-ui';
</script>

<template>
  <AccordionContent
    class="overflow-hidden text-sm text-secondary data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
  >
    <div class="pb-3 px-1">
      <slot />
    </div>
  </AccordionContent>
</template>
