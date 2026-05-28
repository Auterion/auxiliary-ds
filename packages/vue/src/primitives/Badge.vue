<script setup lang="ts">
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    variant?: 'default' | 'secondary' | 'outline' | 'accent';
    size?: 'sm' | 'md';
  }>(),
  {
    variant: 'default',
    size: 'md',
  },
);

const classes = computed(() => {
  const base = 'inline-flex items-center gap-1 rounded font-medium';
  const sizing = props.size === 'sm' ? 'h-5 px-1.5 text-[10px]' : 'h-6 px-2 text-xs';
  const variant = {
    default:   'bg-muted text-foreground border border-border',
    secondary: 'bg-card text-muted-foreground border border-border',
    outline:   'border border-border text-muted-foreground',
    accent:    'bg-primary text-primary-foreground',
  }[props.variant];
  return [base, sizing, variant].join(' ');
});
</script>

<template>
  <span :class="classes">
    <slot />
  </span>
</template>
