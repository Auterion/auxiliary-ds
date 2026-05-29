<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@auxiliary/css/utils';
import { table } from '@auxiliary/css/recipes';

const props = defineProps<{ class?: HTMLAttributes['class'] }>();

const styles = table();
const rootClass = computed(() => cn(styles.body(), props.class));
</script>

<template>
  <tbody :class="rootClass">
    <slot />
  </tbody>
</template>
