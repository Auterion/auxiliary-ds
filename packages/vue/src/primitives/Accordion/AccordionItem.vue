<script setup lang="ts">
import { AccordionItem } from 'reka-ui';

defineProps<{
  value: string;
  disabled?: boolean;
}>();
</script>

<template>
  <AccordionItem
    :value="value"
    :disabled="disabled"
    class="border-b border-default last:border-b-0"
  >
    <slot />
  </AccordionItem>
</template>
