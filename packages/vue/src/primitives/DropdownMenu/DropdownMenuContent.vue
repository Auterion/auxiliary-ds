<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { DropdownMenuContent, DropdownMenuPortal } from 'reka-ui';
import { cn } from '@auxiliary/css/utils';
import { dropdownMenu } from '@auxiliary/css/recipes';

const props = withDefaults(
  defineProps<{
    side?: 'top' | 'right' | 'bottom' | 'left';
    align?: 'start' | 'center' | 'end';
    sideOffset?: number;
    class?: HTMLAttributes['class'];
  }>(),
  {
    side: 'bottom',
    align: 'start',
    sideOffset: 4,
  },
);

const styles = dropdownMenu();
const rootClass = computed(() => cn(styles.content(), props.class));
</script>

<template>
  <DropdownMenuPortal>
    <DropdownMenuContent
      :side="side"
      :align="align"
      :side-offset="sideOffset"
      :class="rootClass"
    >
      <slot />
    </DropdownMenuContent>
  </DropdownMenuPortal>
</template>
