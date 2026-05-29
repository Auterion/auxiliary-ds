<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@auxiliary/css/utils';
import { table } from '@auxiliary/css/recipes';

const props = defineProps<{ class?: HTMLAttributes['class'] }>();

const styles = table();
const rootClass = computed(() => cn(styles.row(), props.class));
</script>

<template>
  <tr :class="rootClass">
    <slot />
  </tr>
</template>
