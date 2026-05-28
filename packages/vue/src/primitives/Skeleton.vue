<script setup lang="ts">
// Placeholder shimmer for loading states. Pair with sizing utilities
// (e.g. <Skeleton class="h-4 w-32" />) to match the eventual content footprint.
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@auxiliary/css/utils';
import { skeleton } from '@auxiliary/css/recipes';

const props = defineProps<{ class?: HTMLAttributes['class'] }>();

const rootClass = computed(() => cn(skeleton(), props.class));
</script>

<template>
  <span aria-hidden="true" :class="rootClass" />
</template>
