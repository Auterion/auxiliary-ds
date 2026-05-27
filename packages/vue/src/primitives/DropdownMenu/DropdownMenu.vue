<script setup lang="ts">
import { DropdownMenuRoot } from 'reka-ui';

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
  <DropdownMenuRoot
    :open="open"
    :default-open="defaultOpen"
    :modal="modal"
    @update:open="$emit('update:open', $event)"
  >
    <slot />
  </DropdownMenuRoot>
</template>
