<script setup lang="ts">
import { SelectItem, SelectItemIndicator, SelectItemText } from 'reka-ui';

defineProps<{
  value: string;
  disabled?: boolean;
}>();
</script>

<template>
  <SelectItem
    :value="value"
    :disabled="disabled"
    class="relative flex h-8 cursor-pointer select-none items-center rounded-sm pl-7 pr-2 text-sm outline-none data-[highlighted]:bg-hover data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
  >
    <SelectItemIndicator class="absolute left-2 flex items-center justify-center">
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <polyline points="20 6 9 17 4 12" />
      </svg>
    </SelectItemIndicator>
    <SelectItemText>
      <slot />
    </SelectItemText>
  </SelectItem>
</template>
