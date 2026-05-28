<script setup lang="ts">
import { AvatarRoot } from 'reka-ui';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    size?: 'sm' | 'md' | 'lg';
  }>(),
  { size: 'md' },
);

const sizing = computed(
  () =>
    ({
      sm: 'h-6 w-6 text-xs',
      md: 'h-8 w-8 text-sm',
      lg: 'h-10 w-10 text-base',
    })[props.size],
);
</script>

<template>
  <AvatarRoot
    :class="[
      'inline-flex shrink-0 select-none items-center justify-center overflow-hidden rounded-full bg-muted text-muted-foreground',
      sizing,
    ]"
  >
    <slot />
  </AvatarRoot>
</template>
