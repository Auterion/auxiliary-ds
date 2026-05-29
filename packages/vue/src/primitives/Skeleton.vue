<script setup lang="ts">
// Placeholder shimmer for loading states. Pair with sizing utilities
// (e.g. <Skeleton class="h-4 w-32" />) to match the eventual content footprint.
// When `loading` is false it renders the default slot (the real content), so a
// parent can swap placeholder → content without a v-if wrapper.
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@auxiliary/css/utils';
import { skeleton } from '@auxiliary/css/recipes';

const props = withDefaults(
  defineProps<{
    loading?: boolean;
    class?: HTMLAttributes['class'];
  }>(),
  { loading: true },
);

const rootClass = computed(() => cn(skeleton(), props.class));
</script>

<template>
  <span v-if="loading" aria-hidden="true" :class="rootClass" />
  <slot v-else />
</template>
