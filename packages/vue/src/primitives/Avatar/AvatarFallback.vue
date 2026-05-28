<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { AvatarFallback } from 'reka-ui';
import { cn } from '@auxiliary/css/utils';
import { avatarFallback } from '@auxiliary/css/recipes';

const props = defineProps<{
  delayMs?: number;
  class?: HTMLAttributes['class'];
}>();

const rootClass = computed(() => cn(avatarFallback(), props.class));
</script>

<template>
  <AvatarFallback :delay-ms="delayMs" :class="rootClass">
    <slot />
  </AvatarFallback>
</template>
