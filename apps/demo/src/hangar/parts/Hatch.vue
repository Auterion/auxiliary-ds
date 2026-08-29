<script setup lang="ts">
/* The eyebrow's hatch glyph — four diagonal strokes.
 *
 * It is the sheet's only recurring ornament, and it earns the place by being
 * the mark that says "a section starts here" without spending a word or a hue
 * on saying it. Decorative: the label beside it always carries the meaning. */
withDefaults(defineProps<{ size?: number }>(), { size: 14 });
</script>

<template>
  <svg
    :width="size * 1.35"
    :height="size"
    viewBox="0 0 19 14"
    fill="none"
    stroke="currentColor"
    stroke-width="1.6"
    class="hg-hatch"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M1 13 7 1M6 13 12 1M11 13 17 1" />
  </svg>
</template>
