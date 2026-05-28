<script setup lang="ts">
import { ToastRoot } from 'reka-ui';

defineProps<{
  open?: boolean;
  defaultOpen?: boolean;
  duration?: number;
  type?: 'foreground' | 'background';
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
</script>

<template>
  <ToastRoot
    :open="open"
    :default-open="defaultOpen"
    :duration="duration"
    :type="type"
    class="grid grid-cols-[1fr_auto] items-start gap-3 rounded-md border border-default bg-elevated p-4 text-sm text-primary shadow-md outline-none focus-visible:ring-2 ring-focus"
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
