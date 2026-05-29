<script setup lang="ts">
import { ComboboxAnchor, ComboboxInput, ComboboxTrigger } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@auxiliary/css/utils';
import { combobox, type ComboboxVariants } from '@auxiliary/css/recipes';

// The element Reka gives role="combobox" is the inner input; forward fallthrough
// attrs (aria-label / aria-labelledby / id) onto it, not the anchor wrapper.
defineOptions({ inheritAttrs: false });

const props = defineProps<{
  placeholder?: string;
  /** Shared size scale (sm | md | lg). */
  size?: ComboboxVariants['size'];
  /** Marks the control invalid: sets aria-invalid + destructive border/ring. */
  invalid?: boolean;
  class?: HTMLAttributes['class'];
}>();

const styles = computed(() => combobox({ size: props.size, invalid: props.invalid }));
const rootClass = computed(() => cn(styles.value.anchor(), props.class));
</script>

<template>
  <ComboboxAnchor :class="rootClass">
    <ComboboxInput
      v-bind="$attrs"
      :placeholder="placeholder"
      :aria-invalid="invalid || undefined"
      :class="styles.input()"
    />
    <ComboboxTrigger :class="styles.trigger()" aria-label="Toggle options">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </ComboboxTrigger>
  </ComboboxAnchor>
</template>
