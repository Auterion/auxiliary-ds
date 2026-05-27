<script setup lang="ts">
import { PopoverContent, PopoverPortal } from 'reka-ui';

withDefaults(
  defineProps<{
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
    alignOffset?: number;
  }>(),
  {
    side: 'bottom',
    align: 'center',
    sideOffset: 6,
    alignOffset: 0,
  },
);
</script>

<template>
  <PopoverPortal>
    <PopoverContent
      :side="side"
      :align="align"
      :side-offset="sideOffset"
      :align-offset="alignOffset"
      class="z-50 w-72 rounded-md border border-default bg-elevated p-4 text-sm text-primary shadow-md outline-none focus-visible:ring-2 ring-focus"
    >
      <slot />
    </PopoverContent>
  </PopoverPortal>
</template>
