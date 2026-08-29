<script setup lang="ts">
/**
 * The in-situ frame — AMC's fullscreen video view, reproduced.
 *
 * A control sheet proves a control is coherent with itself. Only an in-situ
 * frame proves it is coherent with the twelve other things already on the
 * screen, which is where strike controls actually go wrong: the button is fine
 * and its neighbours are the problem. So each turn gets one, at the artboard's
 * own proportions.
 *
 * The feed is simulated sensor imagery (see `_strike.css`), 16:9 inside a
 * 1.857:1 frame. It letterboxes, and the bars are NOT part of the click
 * target — a click there selects nothing, which is the behaviour
 * `VideoFeed.vue` gets from its letterbox arithmetic and this gets from the
 * DOM for free.
 */
withDefaults(
  defineProps<{
    /** `crosshair` while the operator is picking; `default` otherwise. */
    picking?: boolean;
    /** Screen-reader name for the pick target — states what a click does now. */
    feedLabel?: string;
  }>(),
  { picking: false, feedLabel: 'Video feed' },
);

const emit = defineEmits<{ pick: [{ x: number; y: number }] }>();

function onPick(event: MouseEvent) {
  const el = event.currentTarget as HTMLElement;
  const r = el.getBoundingClientRect();
  if (!r.width || !r.height) return;

  // Enter/Space on a <button> dispatches a click with clientX/clientY of 0 and
  // `detail === 0`. Taken as a pointer position that becomes a NEGATIVE
  // fraction — so the lock drew off-frame inside an overflow:hidden box and
  // never appeared, while the interlock still opened and the strike guard
  // became pressable against a target that did not exist. A keyboard operator
  // has no pointer to aim with, so centre-frame is the honest default; the
  // reticle is then adjustable by the same controls a pointer user has.
  if (event.detail === 0) {
    emit('pick', { x: 0.5, y: 0.5 });
    return;
  }

  emit('pick', {
    x: (event.clientX - r.left) / r.width,
    y: (event.clientY - r.top) / r.height,
  });
}
</script>

<template>
  <div class="sk-stage sk-amc sk-tone-amc">
    <!-- The app behind the panel: the same frame, dimmed to almost nothing. -->
    <div class="sk-stage-backdrop sk-feed-image" aria-hidden="true" />
    <div class="sk-stage-scrim" aria-hidden="true" />

    <div class="sk-stage-frame">
      <div class="sk-feed-box">
        <button
          type="button"
          class="sk-feed sk-feed-image"
          :style="{ cursor: picking ? 'crosshair' : 'default' }"
          :aria-label="feedLabel"
          :disabled="!picking"
          @click="onPick"
        />
        <!-- Reticles and lock boxes: reports, never controls. -->
        <slot name="feed" />
      </div>

      <slot />
    </div>
  </div>
</template>
