<script setup lang="ts">
/**
 * ZOOM — one stepper, below the fence.
 *
 * `+` · readout · `−` in a single hairline column, so the current factor sits
 * at the point of control instead of in the OSD burn-in at the far corner of
 * the frame, and the two arrows point at the thing they change. Three separate
 * boxes read as three controls; one box with two arrows and a number reads as
 * one.
 *
 * Tap steps; press and hold runs. A gimbal is a continuous instrument and
 * fifteen taps to cross the range is not how anyone frames a shot — but the
 * repeat has to be released cleanly, so the stop is bound to the window rather
 * than to the button, which stops the run even if the pointer leaves the frame
 * mid-hold.
 *
 * At the stops the segment DIMS rather than taking `disabled`: `disabled`
 * mid-hold would kill the pointerup that ends the repeat, and it would drop
 * the button out of the tab order the instant a keyboard user reached the end
 * of the range.
 */
import { computed, onScopeDispose } from 'vue';
import { Icon } from '@auxiliary/icons';

const props = withDefaults(
  defineProps<{ min?: number; max?: number; step?: number; repeatMs?: number }>(),
  { min: 1, max: 8, step: 0.5, repeatMs: 220 },
);

const zoom = defineModel<number>({ required: true });

const atMin = computed(() => zoom.value <= props.min);
const atMax = computed(() => zoom.value >= props.max);

let repeat: ReturnType<typeof setInterval> | undefined;

function nudge(direction: 1 | -1) {
  const next = zoom.value + direction * props.step;
  zoom.value = Math.min(props.max, Math.max(props.min, Number(next.toFixed(1))));
}

function stop() {
  if (repeat) clearInterval(repeat);
  repeat = undefined;
}

function run(direction: 1 | -1) {
  nudge(direction);
  stop();
  repeat = setInterval(() => nudge(direction), props.repeatMs);
  // Bound to the window, not the button: a pointer released outside the frame
  // still ends the run.
  window.addEventListener('pointerup', stop, { once: true });
  window.addEventListener('pointercancel', stop, { once: true });
}

onScopeDispose(stop);
</script>

<template>
  <div class="sk-zoom-group">
    <div class="sk-zoom-stack">
      <button
        type="button"
        class="sk-zoom"
        :data-limit="atMax || undefined"
        aria-label="Zoom camera in"
        @pointerdown="run(1)"
        @pointerup="stop"
        @pointerleave="stop"
        @keydown.enter.prevent="nudge(1)"
        @keydown.space.prevent="nudge(1)"
      >
        <Icon name="plus" size="sm" />
      </button>
      <!-- The value the two buttons move, between the two buttons. Announced on
           change: it is the only feedback a non-sighted operator gets that the
           press did anything. -->
      <output class="sk-zoom-readout" aria-live="polite">{{ zoom.toFixed(1) }}×</output>
      <button
        type="button"
        class="sk-zoom"
        :data-limit="atMin || undefined"
        aria-label="Zoom camera out"
        @pointerdown="run(-1)"
        @pointerup="stop"
        @pointerleave="stop"
        @keydown.enter.prevent="nudge(-1)"
        @keydown.space.prevent="nudge(-1)"
      >
        <Icon name="minus" size="sm" />
      </button>
    </div>
    <span class="sk-plate-label" data-tone="off">ZOOM</span>
  </div>
</template>
