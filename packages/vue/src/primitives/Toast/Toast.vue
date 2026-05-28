<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { ToastRoot } from 'reka-ui';
import { cn } from '@auxiliary/css/utils';
import { toast } from '@auxiliary/css/recipes';

const props = defineProps<{
  open?: boolean;
  defaultOpen?: boolean;
  duration?: number;
  type?: 'foreground' | 'background';
  class?: HTMLAttributes['class'];
}>();

defineEmits<{
  (e: 'update:open', open: boolean): void;
  (e: 'escapeKeyDown', event: KeyboardEvent): void;
  (e: 'pause'): void;
  (e: 'resume'): void;
  (e: 'swipeStart', event: CustomEvent): void;
  (e: 'swipeMove', event: CustomEvent): void;
  (e: 'swipeCancel', event: CustomEvent): void;
  (e: 'swipeEnd', event: CustomEvent): void;
}>();

const styles = toast();
const rootClass = computed(() => cn(styles.root(), props.class));
</script>

<template>
  <ToastRoot
    :open="open"
    :default-open="defaultOpen"
    :duration="duration"
    :type="type"
    :class="rootClass"
    @update:open="$emit('update:open', $event)"
    @escape-key-down="$emit('escapeKeyDown', $event)"
    @pause="$emit('pause')"
    @resume="$emit('resume')"
    @swipe-start="$emit('swipeStart', $event)"
    @swipe-move="$emit('swipeMove', $event)"
    @swipe-cancel="$emit('swipeCancel', $event)"
    @swipe-end="$emit('swipeEnd', $event)"
  >
    <slot />
  </ToastRoot>
</template>
