<script setup lang="ts">
/* The scroll-lit statement.
 *
 * One paragraph, set at display scale, whose words go from dim to full ink as
 * they pass a reading line. It is the only scroll-linked effect on the sheet
 * and it earns its place by being a READING aid — it marks how far through the
 * sentence you are — rather than decoration.
 *
 * Under `prefers-reduced-motion` every word is simply lit (`_hangar.css`), so
 * the paragraph is fully legible with the effect off. That is the test: an
 * effect you cannot switch off without losing content is not an effect, it is
 * a bug.
 */
import { onBeforeUnmount, onMounted, ref } from 'vue';

const props = defineProps<{ text: string }>();

const el = ref<HTMLElement | null>(null);
const lit = ref(0);
const words = props.text.split(' ');

let frame = 0;

function measure() {
  frame = 0;
  const node = el.value;
  if (!node) return;
  const r = node.getBoundingClientRect();
  /* The reading line sits at 62% of the viewport: low enough that a word lights
   * as you arrive at it, high enough that the last word lights before the
   * paragraph leaves. */
  const line = window.innerHeight * 0.62;
  const progress = (line - r.top) / Math.max(r.height, 1);
  lit.value = Math.round(Math.min(1, Math.max(0, progress)) * words.length);
}

/* Reads layout, so it is rAF-batched and never runs inside render. */
function onScroll() {
  if (frame) return;
  frame = requestAnimationFrame(measure);
}

/* CAPTURE, deliberately. The sheet scrolls inside `.hg-root`, not the window,
 * and scroll events do not bubble — but they are dispatched through the capture
 * phase, so one listener at the window catches whichever element is actually
 * scrolling. Without this the effect silently does nothing, which is the worst
 * kind of broken: it looks like a design choice. */
const opts = { passive: true, capture: true } as const;

onMounted(() => {
  measure();
  window.addEventListener('scroll', onScroll, opts);
  window.addEventListener('resize', onScroll, { passive: true });
});
onBeforeUnmount(() => {
  if (frame) cancelAnimationFrame(frame);
  window.removeEventListener('scroll', onScroll, opts);
  window.removeEventListener('resize', onScroll);
});
</script>

<template>
  <p ref="el" class="hg-statement">
    <!-- The full sentence stays in the accessibility tree as one string; the
         spans are a paint, not a structure. -->
    <span
      v-for="(w, i) in words"
      :key="i"
      class="hg-statement-word"
      :data-lit="i < lit ? 'true' : 'false'"
      >{{ w }}{{ i < words.length - 1 ? ' ' : '' }}</span
    >
  </p>
</template>
