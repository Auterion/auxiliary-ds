<script setup lang="ts">
import { ComboboxContent, ComboboxPortal, ComboboxViewport } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@auxiliary/css/utils';
import { combobox } from '@auxiliary/css/recipes';

// Forward fallthrough attrs (aria-label, etc.) onto the listbox element rather
// than the renderless portal.
defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    position?: 'inline' | 'popper';
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

const styles = combobox();
const rootClass = computed(() => cn(styles.content(), props.class));
</script>

<template>
  <ComboboxPortal>
    <ComboboxContent
      v-bind="$attrs"
      :position="position"
      :side="side"
      :side-offset="sideOffset"
      :class="rootClass"
    >
      <ComboboxViewport :class="styles.viewport()">
        <slot />
      </ComboboxViewport>
    </ComboboxContent>
  </ComboboxPortal>
</template>
