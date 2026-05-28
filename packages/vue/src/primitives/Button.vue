<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { button, type ButtonVariants } from '@auxiliary/css/recipes';
import { cn } from '@auxiliary/css/utils';

const props = withDefaults(
  defineProps<{
    variant?: ButtonVariants['variant'];
    size?: ButtonVariants['size'];
    loading?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    class?: HTMLAttributes['class'];
  }>(),
  {
    variant: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    type: 'button',
  },
);

const classes = computed(() =>
  cn(button({ variant: props.variant, size: props.size, loading: props.loading }), props.class),
);
</script>

<template>
  <button :type="type" :disabled="disabled || loading" :class="classes">
    <slot />
  </button>
</template>
