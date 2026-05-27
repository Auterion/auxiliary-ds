<script setup lang="ts">
import { DialogRoot } from 'reka-ui';

defineProps<{
  open?: boolean;
  defaultOpen?: boolean;
  modal?: boolean;
}>();

defineEmits<{
  (e: 'update:open', open: boolean): void;
}>();
</script>

<template>
  <DialogRoot
    :open="open"
    :default-open="defaultOpen"
    :modal="modal"
    @update:open="$emit('update:open', $event)"
  >
    <slot />
  </DialogRoot>
</template>
