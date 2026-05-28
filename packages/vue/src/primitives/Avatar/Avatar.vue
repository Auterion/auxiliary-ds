<script setup lang="ts">
import { AvatarRoot } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { avatar, type Size } from '@auxiliary/css/recipes';
import { cn } from '@auxiliary/css/utils';

const props = withDefaults(
  defineProps<{
    size?: Size;
    class?: HTMLAttributes['class'];
  }>(),
  { size: 'md' },
);

const classes = computed(() => cn(avatar({ size: props.size }), props.class));
</script>

<template>
  <AvatarRoot :class="classes">
    <slot />
  </AvatarRoot>
</template>
