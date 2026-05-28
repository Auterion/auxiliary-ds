<script setup lang="ts">
import { AvatarImage } from 'reka-ui';

defineProps<{
  src: string;
  alt?: string;
}>();
</script>

<template>
  <AvatarImage :src="src" :alt="alt ?? ''" class="h-full w-full object-cover" />
</template>
