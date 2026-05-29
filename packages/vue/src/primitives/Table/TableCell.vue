<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@auxiliary/css/utils';
import { table } from '@auxiliary/css/recipes';

const props = defineProps<{ class?: HTMLAttributes['class'] }>();

const styles = table();
const rootClass = computed(() => cn(styles.cell(), props.class));
</script>

<template>
  <td :class="rootClass">
    <slot />
  </td>
</template>
