<script setup lang="ts">
import { DialogDescription } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { dialog } from '@auxiliary/css/recipes';
import { cn } from '@auxiliary/css/utils';

const props = defineProps<{ class?: HTMLAttributes['class'] }>();

const styles = dialog();
const rootClass = computed(() => cn(styles.description(), props.class));
</script>

<template>
  <DialogDescription :class="rootClass">
    <slot />
  </DialogDescription>
</template>
