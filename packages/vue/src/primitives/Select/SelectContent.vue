<script setup lang="ts">
import { SelectContent, SelectPortal, SelectViewport } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@auxiliary/css/utils';
import { select } from '@auxiliary/css/recipes';

// The element Reka gives role="listbox" is the SelectContent root. An ARIA listbox needs an
// accessible name, so we forward fallthrough attrs (notably aria-label / aria-labelledby) onto
// it rather than letting them land on the renderless portal.
defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    position?: 'item-aligned' | 'popper';
    side?: 'top' | 'right' | 'bottom' | 'left';
    sideOffset?: number;
    class?: HTMLAttributes['class'];
  }>(),
  {
    position: 'popper',
    side: 'bottom',
    sideOffset: 4,
  },
);

const styles = select();
const rootClass = computed(() => cn(styles.content(), props.class));
</script>

<template>
  <SelectPortal>
    <SelectContent
      v-bind="$attrs"
      :position="position"
      :side="side"
      :side-offset="sideOffset"
      :class="rootClass"
    >
      <SelectViewport :class="styles.viewport()">
        <slot />
      </SelectViewport>
    </SelectContent>
  </SelectPortal>
</template>
