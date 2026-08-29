<script setup lang="ts">
import Hatch from './Hatch.vue';

defineProps<{ label: string }>();
</script>

<template>
  <p class="hg-eyebrow">
    <Hatch />
    <span>{{ label }}</span>
  </p>
</template>
