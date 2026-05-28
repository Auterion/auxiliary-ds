<script setup lang="ts">
import { DialogTitle } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { dialog } from '@auxiliary/css/recipes';
import { cn } from '@auxiliary/css/utils';

const props = defineProps<{ class?: HTMLAttributes['class'] }>();

const styles = dialog();
const rootClass = computed(() => cn(styles.title(), props.class));
</script>

<template>
  <DialogTitle :class="rootClass">
    <slot />
  </DialogTitle>
</template>
