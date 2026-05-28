<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { AccordionItem } from 'reka-ui';
import { cn } from '@auxiliary/css/utils';
import { accordion } from '@auxiliary/css/recipes';

const props = defineProps<{
  value: string;
  disabled?: boolean;
  class?: HTMLAttributes['class'];
}>();
const styles = accordion();
const rootClass = computed(() => cn(styles.item(), props.class));
</script>

<template>
  <AccordionItem :value="value" :disabled="disabled" :class="rootClass">
    <slot />
  </AccordionItem>
</template>
