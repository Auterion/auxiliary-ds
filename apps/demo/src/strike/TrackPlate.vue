<script setup lang="ts">
/**
 * TRACK — a camera plate whose brackets close as it engages.
 *
 * The four states are one continuous gesture: the corner brackets start wide
 * and open, then step inward 4.5 → 10.5 → 14.5 → 21.5 as the control moves
 * from unavailable to locked. The aperture closing IS the state, so the plate
 * reads at a glance, in glare, and to an operator who cannot separate the blue
 * from the grey.
 *
 *   Disabled  wide brackets, one diagonal void line, no interaction
 *   Enabled   brackets inset, crosshair live — pick a target in the feed
 *   Armed     brackets tighter; the feed takes a crosshair cursor
 *   Engaged   inverted plate, dashed inner box, tightest brackets — locked,
 *             and pressing again releases (releasing is reversible, so it
 *             carries no guard)
 *
 * Unlike Strike this control never guards: track is recoverable, and putting a
 * hold on a recoverable action just teaches operators to sit on buttons.
 */
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    state?: 'disabled' | 'enabled' | 'armed' | 'engaged';
    reason?: string;
    size?: number;
  }>(),
  { state: 'enabled', reason: 'NO FEED LOCK', size: 56 },
);

defineEmits<{ click: [] }>();

/** Corner brackets, generated from the inset so the ladder is visible as data. */
function brackets(inset: number, arm: number) {
  const a = inset + 0.5;
  const b = 56 - inset - 0.5;
  return [
    `M${a} ${a}h${arm}`,
    `M${a} ${a}v${arm}`,
    `M${b} ${a}h-${arm}`,
    `M${b} ${a}v${arm}`,
    `M${a} ${b}h${arm}`,
    `M${a} ${b}v-${arm}`,
    `M${b} ${b}h-${arm}`,
    `M${b} ${b}v-${arm}`,
  ].join('');
}

/** The aperture ladder — the whole state model, in four numbers. */
const APERTURE = {
  disabled: brackets(4, 9),
  enabled: brackets(10, 9),
  armed: brackets(14, 8),
  engaged: brackets(21, 6),
} as const;

const CROSS = 'M28 24v8M24 28h8';
const CROSS_TIGHT = 'M28 25v6M25 28h6';

const LABELS = {
  disabled: 'TRACK',
  enabled: 'TRACK',
  armed: 'PICK',
  engaged: 'TRACKING',
} as const;

const label = computed(() => LABELS[props.state]);
const engaged = computed(() => props.state === 'engaged');

const ARIA = {
  disabled: 'Track — unavailable',
  enabled: 'Track — arm target selection',
  armed: 'Cancel target selection',
  engaged: 'Tracking — release track',
} as const;
</script>

<template>
  <!-- Same reasoning as the octagon: unavailable means out of the tab order,
       with the reason on the face instead of inside a tooltip. -->
  <div
    v-if="state === 'disabled'"
    class="sk-plate"
    data-control="track"
    aria-disabled="true"
    :title="reason"
  >
    <svg :width="size" :height="size" viewBox="0 0 56 56" style="opacity: 0.34" aria-hidden="true">
      <rect
        x="0.5"
        y="0.5"
        width="55"
        height="55"
        fill="var(--sk-plate-fill)"
        fill-opacity="0.4"
        stroke="var(--sk-plate-ink-off)"
        stroke-width="1"
      />
      <path :d="APERTURE.disabled" fill="none" stroke="var(--sk-plate-ink-off)" stroke-width="1" />
      <line x1="10" y1="46" x2="46" y2="10" stroke="var(--sk-plate-ink-off)" stroke-width="1" />
    </svg>
    <span class="sk-plate-label" data-tone="off">{{ label }}</span>
    <span class="sk-plate-reason">{{ reason }}</span>
  </div>

  <button
    v-else
    type="button"
    class="sk-plate"
    data-control="track"
    :aria-label="ARIA[state]"
    :aria-pressed="engaged"
    @click="$emit('click')"
  >
    <svg :width="size" :height="size" viewBox="0 0 56 56" aria-hidden="true">
      <rect
        x="0.5"
        y="0.5"
        width="55"
        height="55"
        :fill="engaged ? 'var(--sk-track)' : 'var(--sk-plate-fill)'"
        :fill-opacity="engaged ? 1 : state === 'armed' ? 0.9 : 0.72"
        :stroke="
          engaged
            ? 'var(--sk-track)'
            : state === 'armed'
              ? 'var(--sk-plate-line-strong)'
              : 'var(--sk-plate-line)'
        "
        stroke-width="1"
      />
      <!-- Engaged inverts, so everything inside it draws in the plate's own
           foreground rather than the surface's. -->
      <rect
        v-if="engaged"
        x="17.5"
        y="17.5"
        width="21"
        height="21"
        fill="none"
        stroke="var(--sk-track-on)"
        stroke-width="1.4"
        stroke-dasharray="4 3"
      />
      <path
        :d="APERTURE[state]"
        fill="none"
        :stroke="engaged ? 'var(--sk-track-on)' : 'var(--sk-plate-ink)'"
        :stroke-width="engaged ? 1.6 : 1.4"
      />
      <path
        :d="engaged ? CROSS_TIGHT : CROSS"
        fill="none"
        :stroke="engaged ? 'var(--sk-track-on)' : 'var(--sk-plate-ink)'"
        stroke-width="1.4"
      />
    </svg>
    <span class="sk-plate-label">{{ label }}</span>
  </button>
</template>
