<script setup lang="ts">
import { SelectContent, SelectPortal, SelectViewport } from 'reka-ui';

withDefaults(
  defineProps<{
    position?: 'item-aligned' | 'popper';
    side?: 'top' | 'right' | 'bottom' | 'left';
    sideOffset?: number;
  }>(),
  {
    position: 'popper',
    side: 'bottom',
    sideOffset: 4,
  },
);
</script>

<template>
  <SelectPortal>
    <SelectContent
      :position="position"
      :side="side"
      :side-offset="sideOffset"
      class="z-50 min-w-[var(--reka-select-trigger-width)] overflow-hidden rounded-md border border-default bg-elevated text-sm text-primary shadow-md outline-none"
    >
      <SelectViewport class="p-1">
        <slot />
      </SelectViewport>
    </SelectContent>
  </SelectPortal>
</template>
