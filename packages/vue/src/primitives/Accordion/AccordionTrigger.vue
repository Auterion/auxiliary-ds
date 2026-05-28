<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { AccordionHeader, AccordionTrigger } from 'reka-ui';
import { cn } from '@auxiliary/css/utils';
import { accordion } from '@auxiliary/css/recipes';

const props = defineProps<{ class?: HTMLAttributes['class'] }>();
const styles = accordion();
const rootClass = computed(() => cn(styles.header(), props.class));
</script>

<template>
  <AccordionHeader :class="rootClass">
    <AccordionTrigger :class="styles.trigger()">
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
        :class="styles.chevron()"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </AccordionTrigger>
  </AccordionHeader>
</template>
