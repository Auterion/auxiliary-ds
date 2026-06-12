<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { statusBadge, type StatusBadgeVariants } from '@auxiliary/css/recipes';
import { cn } from '@auxiliary/css/utils';
import { STATUS_GLYPHS, STATUS_LABELS, type StatusLevel } from './status-glyphs';

const props = withDefaults(
  defineProps<{
    level: StatusLevel;
    variant?: StatusBadgeVariants['variant'];
    size?: StatusBadgeVariants['size'];
    /** Per-level glyph — the grayscale-distinct visual cue. On by default. */
    icon?: boolean;
    dot?: boolean;
    /**
     * Overrides the visually-hidden level label announced to assistive tech.
     * Never rendered visibly (`label` is reserved for visible text across the
     * system) — the visible content is the slot.
     */
    srLabel?: string;
    class?: HTMLAttributes['class'];
  }>(),
  {
    variant: 'solid',
    size: 'md',
    icon: true,
    dot: false,
    srLabel: undefined,
  },
);

const styles = computed(() =>
  statusBadge({ level: props.level, variant: props.variant, size: props.size }),
);

const classes = computed(() => cn(styles.value.base(), props.class));
const iconClass = computed(() => styles.value.icon());
const dotClass = computed(() => styles.value.dot());
const glyph = computed(() => STATUS_GLYPHS[props.level]);
const srLabel = computed(() => props.srLabel ?? STATUS_LABELS[props.level]);
</script>

<template>
  <span :class="classes">
    <svg
      v-if="icon"
      :class="iconClass"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path :d="glyph" />
    </svg>
    <span
      v-if="dot"
      :class="dotClass"
      aria-hidden="true"
    />
    <!-- Always present: conveys the level to assistive tech and in grayscale even
         when the slot is empty or non-descriptive. Never color-only. -->
    <span class="sr-only">{{ srLabel }}</span>
    <slot />
  </span>
</template>
