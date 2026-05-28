<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { ToastTitle } from 'reka-ui';
import { cn } from '@auxiliary/css/utils';
import { toast } from '@auxiliary/css/recipes';

const props = defineProps<{ class?: HTMLAttributes['class'] }>();

const styles = toast();
const rootClass = computed(() => cn(styles.title(), props.class));
</script>

<template>
  <ToastTitle :class="rootClass">
    <slot />
  </ToastTitle>
</template>
