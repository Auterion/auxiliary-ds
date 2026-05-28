<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { ToastViewport } from 'reka-ui';
import { cn } from '@auxiliary/css/utils';
import { toast } from '@auxiliary/css/recipes';

const props = defineProps<{ class?: HTMLAttributes['class'] }>();

const styles = toast();
const rootClass = computed(() => cn(styles.viewport(), props.class));
</script>

<template>
  <ToastViewport :class="rootClass" />
</template>
