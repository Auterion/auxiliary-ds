<script setup lang="ts">
import { PopoverContent, PopoverPortal } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@auxiliary/css/utils';
import { popover } from '@auxiliary/css/recipes';

const props = withDefaults(
  defineProps<{
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
    alignOffset?: number;
    class?: HTMLAttributes['class'];
  }>(),
  {
    side: 'bottom',
    align: 'center',
    sideOffset: 6,
    alignOffset: 0,
  },
);

const styles = popover();
const rootClass = computed(() => cn(styles.content(), props.class));
</script>

<template>
  <PopoverPortal>
    <PopoverContent
      :side="side"
      :align="align"
      :side-offset="sideOffset"
      :align-offset="alignOffset"
      :class="rootClass"
    >
      <slot />
    </PopoverContent>
  </PopoverPortal>
</template>
