<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { AccordionContent } from 'reka-ui';
import { cn } from '@auxiliary/css/utils';
import { accordion } from '@auxiliary/css/recipes';

const props = defineProps<{ class?: HTMLAttributes['class'] }>();
const styles = accordion();
const rootClass = computed(() => cn(styles.content(), props.class));
</script>

<template>
  <AccordionContent :class="rootClass">
    <div :class="styles.contentInner()">
      <slot />
    </div>
  </AccordionContent>
</template>
