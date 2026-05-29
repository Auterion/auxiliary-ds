<script setup lang="ts">
// Accessible table caption — names the table for assistive tech. Place as the
// first child of <Table>.
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@auxiliary/css/utils';
import { table } from '@auxiliary/css/recipes';

const props = defineProps<{ class?: HTMLAttributes['class'] }>();

const styles = table();
const rootClass = computed(() => cn(styles.caption(), props.class));
</script>

<template>
  <caption :class="rootClass">
    <slot />
  </caption>
</template>
