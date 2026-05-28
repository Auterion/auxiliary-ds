<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { card } from '@auxiliary/css/recipes';
import { cn } from '@auxiliary/css/utils';

const props = defineProps<{ class?: HTMLAttributes['class'] }>();

const styles = card();
const rootClass = computed(() => cn(styles.description(), props.class));
</script>

<template>
  <p :class="rootClass">
    <slot />
  </p>
</template>
