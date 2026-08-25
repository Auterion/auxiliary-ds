<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { spinner, type Size } from '@auxiliary/css/recipes';
import { cn } from '@auxiliary/css/utils';

const props = withDefaults(
  defineProps<{
    size?: Size;
    /**
     * Accessible name announced for the spinner (aria-label + sr-only text).
     * Never rendered visibly (`label` is reserved for visible text across the
     * system).
     */
    ariaLabel?: string;
    class?: HTMLAttributes['class'];
  }>(),
  {
    size: 'md',
    ariaLabel: 'Loading',
  },
);

const styles = computed(() => spinner({ size: props.size }));
const rootClass = computed(() => cn(styles.value.root(), props.class));
</script>

<template>
  <span :class="rootClass" role="status" :aria-label="ariaLabel">
    <!-- stroke-width 3 is the one deliberate exception to the stroke-width-2 glyph
       set (gated in __tests__/glyph-weight.test.ts): this is a rotating ARC, not
       an icon. At 2 the ring reads as a hairline and the motion stops being
       legible at small sizes. -->
  <svg
      :class="styles.icon()"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        stroke-width="3"
        stroke-opacity="0.2"
      />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        stroke="currentColor"
        stroke-width="3"
        stroke-linecap="round"
        fill="none"
      />
    </svg>
    <span class="sr-only">{{ ariaLabel }}</span>
  </span>
</template>
