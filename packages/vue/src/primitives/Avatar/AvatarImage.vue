<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { AvatarImage } from 'reka-ui';
import { cn } from '@auxiliary/css/utils';
import { avatarImage } from '@auxiliary/css/recipes';

const props = defineProps<{
  src: string;
  alt?: string;
  class?: HTMLAttributes['class'];
}>();

const rootClass = computed(() => cn(avatarImage(), props.class));
</script>

<template>
  <AvatarImage :src="src" :alt="alt ?? ''" :class="rootClass" />
</template>
