<script setup lang="ts">
import { SelectIcon, SelectTrigger } from 'reka-ui';
import { computed, type HTMLAttributes } from 'vue';
import { cn } from '@auxiliary/css/utils';
import { select, type SelectVariants } from '@auxiliary/css/recipes';

const props = defineProps<{
  /** Shared size scale (sm | md | lg) — flexes the trigger height/padding/type. */
  size?: SelectVariants['size'];
  /** Marks the control invalid: sets aria-invalid + destructive border/ring. */
  invalid?: boolean;
  class?: HTMLAttributes['class'];
}>();

const styles = computed(() => select({ size: props.size, invalid: props.invalid }));
const rootClass = computed(() => cn(styles.value.trigger(), props.class));
</script>

<template>
  <SelectTrigger :aria-invalid="invalid || undefined" :class="rootClass">
    <slot />
    <SelectIcon>
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        :class="styles.triggerIcon()"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </SelectIcon>
  </SelectTrigger>
</template>
