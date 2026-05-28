<script setup lang="ts">
import { TooltipContent, TooltipPortal } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@auxiliary/css/utils';
import { tooltip } from '@auxiliary/css/recipes';

const props = withDefaults(
  defineProps<{
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
    class?: HTMLAttributes['class'];
  }>(),
  {
    side: 'top',
    align: 'center',
    sideOffset: 4,
  },
);

const rootClass = computed(() => cn(tooltip(), props.class));
</script>

<template>
  <TooltipPortal>
    <TooltipContent
      :side="side"
      :align="align"
      :side-offset="sideOffset"
      :class="rootClass"
    >
      <slot />
    </TooltipContent>
  </TooltipPortal>
</template>
