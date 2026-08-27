<script setup lang="ts">
/**
 * A bare status dot that is not colour-alone.
 *
 * Dense operational chrome wants a 6px mark, not a `StatusBadge` pill — a fleet
 * row, a link indicator, a map annotation. The demo had 35 of them and every one
 * carried its level in hue and nothing else; several were wrapped in
 * `aria-hidden`, so the level was absent from the accessibility tree entirely
 * while also being invisible to anyone who cannot separate the hues.
 *
 * `AD-D-014` invariant 1 does not have a size exemption. This keeps the dot at
 * 6px and adds the two channels the library's own components use: the reserved
 * `STATUS_LABELS` word, visually hidden, and — where there is room — the
 * grayscale-distinct `STATUS_GLYPHS` outline. Both come from `@auxiliary/vue`
 * rather than being re-typed here, which is the whole point: one vocabulary.
 */
import { computed } from 'vue';
import { STATUS_GLYPHS, STATUS_LABELS, type StatusLevel } from '@auxiliary/vue';

const props = withDefaults(
  defineProps<{
    level: StatusLevel;
    /** Draw the severity outline instead of a filled dot. Costs ~14px. */
    glyph?: boolean;
    /** Name the thing the level belongs to, e.g. "Condor-04". */
    label?: string;
    class?: string;
  }>(),
  { glyph: false },
);

const word = computed(() =>
  props.label ? `${props.label}: ${STATUS_LABELS[props.level]}` : STATUS_LABELS[props.level],
);
</script>

<template>
  <span :class="['inline-flex items-center', props.class]">
    <svg
      v-if="glyph"
      class="a27-dot-glyph"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <path :d="STATUS_GLYPHS[level]" />
    </svg>
    <span v-else class="dk-dot block" aria-hidden="true" />
    <!-- Always rendered, never hidden: this is the channel that survives
         grayscale, dichromacy and a screen reader. -->
    <span class="sr-only">{{ word }}</span>
  </span>
</template>
