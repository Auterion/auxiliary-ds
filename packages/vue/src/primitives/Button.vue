<script setup lang="ts">
import { computed } from 'vue';
import { button, type ButtonVariants } from '@auxiliary/css/recipes';

const props = withDefaults(
  defineProps<{
    intent?: ButtonVariants['intent'];
    size?: ButtonVariants['size'];
    loading?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
  }>(),
  {
    intent: 'primary',
    size: 'md',
    loading: false,
    disabled: false,
    type: 'button',
  },
);

const classes = computed(() =>
  button({ intent: props.intent, size: props.size, loading: props.loading }),
);
</script>

<template>
  <button :type="type" :disabled="disabled || loading" :class="classes">
    <slot />
  </button>
</template>
