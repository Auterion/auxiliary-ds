<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { badge, type BadgeVariants } from '@auxiliary/css/recipes';
import { cn } from '@auxiliary/css/utils';

const props = withDefaults(
  defineProps<{
    variant?: BadgeVariants['variant'];
    size?: BadgeVariants['size'];
    class?: HTMLAttributes['class'];
  }>(),
  {
    variant: 'neutral',
    size: 'md',
  },
);

const classes = computed(() =>
  cn(badge({ variant: props.variant, size: props.size }), props.class),
);
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>
