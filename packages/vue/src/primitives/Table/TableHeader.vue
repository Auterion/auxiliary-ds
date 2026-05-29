<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@auxiliary/css/utils';
import { table } from '@auxiliary/css/recipes';

const props = defineProps<{
  /** Stick the header row to the top of the scroll container (needs a bounded height on Table). */
  sticky?: boolean;
  class?: HTMLAttributes['class'];
}>();

const styles = computed(() => table({ sticky: props.sticky }));
const rootClass = computed(() => cn(styles.value.header(), props.class));
</script>

<template>
  <thead :class="rootClass">
    <slot />
  </thead>
</template>
