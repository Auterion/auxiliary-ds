<script setup lang="ts">
import { TooltipContent, TooltipPortal } from 'reka-ui';

withDefaults(
  defineProps<{
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
  }>(),
  {
    side: 'top',
    align: 'center',
    sideOffset: 4,
  },
);
</script>

<template>
  <TooltipPortal>
    <TooltipContent
      :side="side"
      :align="align"
      :side-offset="sideOffset"
      class="z-50 max-w-xs rounded-md bg-primary px-2 py-1 text-xs text-primary-foreground shadow-md"
    >
      <slot />
    </TooltipContent>
  </TooltipPortal>
</template>
