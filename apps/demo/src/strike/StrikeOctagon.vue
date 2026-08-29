<script setup lang="ts">
/**
 * STRIKE — the octagon, committed by press-and-hold.
 *
 * The octagon is the one silhouette a person arrives already carrying: it means
 * stop and think, and it means it before any label is read, at any size, in any
 * language. Nothing else in a video view is an octagon, so the most consequential
 * control in the surface cannot be mistaken for the one next to it.
 *
 * Every state is carried by SHAPE first and pigment second, because pigment is
 * exactly what the operating environment takes away:
 *
 *   Disabled  a single diagonal void line — no other state has one
 *   Default   octagon outline, faint inner octagon, hollow interior
 *   Holding   the perimeter traces clockwise from 12 o'clock over the guard;
 *             ARC LENGTH IS THE PROGRESS, readable with no colour at all
 *   Sent      the only fully-filled state; the reticle inverts
 *
 * The glyph inside is a RETICLE, not an arrow. An arrow says "down"; a reticle
 * says "this point, this target" — the same thing the track plate's brackets
 * and the lock box on the feed are saying, so the three read as one system.
 *
 * The caller owns the guard (`useHold`) so the same control can be driven live
 * or frozen at a chosen progress for the guidelines panel.
 */
import { computed } from 'vue';
import type { HoldPhase } from './useHold';

const props = withDefaults(
  defineProps<{
    /** `disabled` is a fourth state, not a modifier — it has its own silhouette. */
    state?: HoldPhase | 'disabled';
    /** 0–1. Only read while holding. */
    progress?: number;
    /** Why it is unavailable. Rendered under the label; never a tooltip alone. */
    reason?: string;
    /**
     * Lay an opaque scrim inside the silhouette. Required over video: the
     * interior fill is 6% at rest, which on a bright frame leaves the reticle
     * competing with whatever the sensor happens to be pointed at.
     */
    scrim?: boolean;
    size?: number;
    /** Guard length, in seconds — the accessible name has to state it. */
    guardSeconds?: number;
    /**
     * Put the label above the glyph. In the stacked cluster strike sits on top
     * of track, so its label goes on the outside of the pair — see
     * `_strike.css`. Purely presentational: the DOM order is unchanged, so a
     * screen reader still reads glyph-then-label either way.
     */
    labelAbove?: boolean;
  }>(),
  {
    state: 'idle',
    progress: 0,
    reason: 'NO TARGET',
    scrim: false,
    size: 64,
    guardSeconds: 1.5,
    labelAbove: false,
  },
);

const emit = defineEmits<{ holdstart: []; holdend: [] }>();

const OUTER = '32,3 42,3 61,22 61,42 42,61 22,61 3,42 3,22 22,3';
const INNER = '32,10 39,10 54,25 54,39 39,54 25,54 10,39 10,25 25,10';
/* Reticle: ring, four ticks, centre pip. */
const RETICLE =
  'M32 21a11 11 0 1 0 0 22 11 11 0 1 0 0-22M32 16v7M32 41v7M16 32h7M41 32h7'
  + 'M32 30.2a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 1 1 0-3.6';

const disabled = computed(() => props.state === 'disabled');

/** Interior fill: 6% resting, 24% under the hold, solid on commit. */
const fill = computed(() =>
  props.state === 'sent' ? 1 : props.state === 'holding' ? 0.24 : 0.06,
);

/**
 * The base outline steps back to 16% while the trace runs, so the arc leads and
 * the operator reads progress rather than an outline that got thicker.
 */
const outlineOpacity = computed(() => (props.state === 'holding' ? 0.16 : 1));

/** The inner ring is the resting state's own mark; it clears once a hold runs. */
const innerOpacity = computed(() => (props.state === 'idle' ? 0.34 : 0));

/** `pathLength=100`, so the offset is just the percentage still to go. */
const dash = computed(() =>
  props.state === 'sent' ? 0 : 100 - Math.round(Math.min(1, Math.max(0, props.progress)) * 100),
);

const label = computed(() =>
  props.state === 'sent' ? 'SENT' : props.state === 'holding' ? 'HOLD' : 'STRIKE',
);
</script>

<template>
  <!-- Disabled is a div, not a disabled button: a control that cannot be
       pressed should not be in the tab order at all, and the reason renders
       on the face rather than hiding in a title attribute. -->
  <div
    v-if="disabled"
    class="sk-plate"
    data-control="strike"
    :data-label="labelAbove ? 'above' : undefined"
    aria-disabled="true"
    :title="reason"
  >
    <svg :width="size" :height="size" viewBox="0 0 64 64" style="opacity: 0.55" aria-hidden="true">
      <polygon
        :points="OUTER"
        fill="var(--sk-plate-fill)"
        fill-opacity="0.4"
        stroke="var(--sk-plate-ink-off)"
        stroke-width="1"
      />
      <line x1="12" y1="52" x2="52" y2="12" stroke="var(--sk-plate-ink-off)" stroke-width="1" />
      <path :d="RETICLE" fill="none" stroke="var(--sk-plate-ink-off)" stroke-width="1.6" />
    </svg>
    <span class="sk-plate-label" data-tone="off">STRIKE</span>
    <span class="sk-plate-reason">{{ reason }}</span>
  </div>

  <button
    v-else
    type="button"
    class="sk-plate"
    data-control="strike"
    :data-label="labelAbove ? 'above' : undefined"
    :aria-label="`Strike — press and hold ${guardSeconds} seconds`"
    @pointerdown="emit('holdstart')"
    @pointerup="emit('holdend')"
    @pointerleave="emit('holdend')"
    @pointercancel="emit('holdend')"
    @keydown.space.prevent="emit('holdstart')"
    @keydown.enter.prevent="emit('holdstart')"
    @keyup.space.prevent="emit('holdend')"
    @keyup.enter.prevent="emit('holdend')"
    @blur="emit('holdend')"
  >
    <svg :width="size" :height="size" viewBox="0 0 64 64" aria-hidden="true">
      <!-- Scrim: over video only. Cuts the frame out from under the control so
           the silhouette is read against a known black, not against terrain. -->
      <polygon v-if="scrim" :points="OUTER" fill="rgb(0 0 0 / 0.72)" />
      <!-- Interior + outline -->
      <polygon
        :points="OUTER"
        fill="var(--sk-strike)"
        :fill-opacity="fill"
        stroke="var(--sk-strike)"
        stroke-width="1.6"
        :stroke-opacity="outlineOpacity"
      />
      <!-- The resting inner ring. -->
      <polygon
        :points="INNER"
        fill="none"
        stroke="var(--sk-strike)"
        stroke-width="1"
        :opacity="innerOpacity"
      />
      <!-- The guard, drawn as arc length. -->
      <polygon
        :points="OUTER"
        fill="none"
        stroke="var(--sk-strike)"
        stroke-width="2.4"
        pathLength="100"
        stroke-dasharray="100"
        :stroke-dashoffset="dash"
      />
      <path
        :d="RETICLE"
        fill="none"
        :stroke="state === 'sent' ? 'var(--sk-strike-on)' : 'var(--sk-strike)'"
        stroke-width="2"
      />
    </svg>
    <span class="sk-plate-label" data-tone="strike">{{ label }}</span>
  </button>
</template>
