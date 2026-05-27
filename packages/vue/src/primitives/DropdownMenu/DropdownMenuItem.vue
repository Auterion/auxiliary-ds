<script setup lang="ts">
import { DropdownMenuItem } from 'reka-ui';

defineProps<{
  disabled?: boolean;
}>();

defineEmits<{
  (e: 'select', event: Event): void;
}>();
</script>

<template>
  <DropdownMenuItem
    :disabled="disabled"
    class="flex h-8 cursor-pointer select-none items-center rounded-sm px-2 text-sm outline-none data-[highlighted]:bg-hover data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
    @select="$emit('select', $event)"
  >
    <slot />
  </DropdownMenuItem>
</template>
