<script setup lang="ts">
import { DropdownMenuContent, DropdownMenuPortal } from 'reka-ui';

withDefaults(
  defineProps<{
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
  }>(),
  {
    side: 'bottom',
    align: 'start',
    sideOffset: 4,
  },
);
</script>

<template>
  <DropdownMenuPortal>
    <DropdownMenuContent
      :side="side"
      :align="align"
      :side-offset="sideOffset"
      class="z-50 min-w-[10rem] rounded-md border border-default bg-elevated p-1 text-sm text-primary shadow-md outline-none"
    >
      <slot />
    </DropdownMenuContent>
  </DropdownMenuPortal>
</template>
