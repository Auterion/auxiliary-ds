<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { ToastDescription } from 'reka-ui';
import { cn } from '@auxiliary/css/utils';
import { toast } from '@auxiliary/css/recipes';

const props = defineProps<{ class?: HTMLAttributes['class'] }>();

const styles = toast();
const rootClass = computed(() => cn(styles.description(), props.class));
</script>

<template>
  <ToastDescription :class="rootClass">
    <slot />
  </ToastDescription>
</template>
