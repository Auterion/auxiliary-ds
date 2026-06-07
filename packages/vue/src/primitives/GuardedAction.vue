<script setup lang="ts">
import { computed, ref, onBeforeUnmount, useId, type HTMLAttributes } from 'vue';
import { guardedAction, button, type GuardedActionVariants } from '@auxiliary/css/recipes';
import { cn } from '@auxiliary/css/utils';

/**
 * GuardedAction — a deliberately hard-to-misfire control for irreversible
 * operational commands (arm/disarm, RTL, payload release). ROADMAP §6i / Phase 6.3.
 *
 * Three guard modes:
 *  - `hold`    press and hold for `holdMs`; releasing early cancels.
 *  - `double`  activate, then activate again within `doubleMs` to confirm.
 *  - `confirm` activate to reveal an inline Confirm / Cancel pair.
 *
 * `confirm` is the ONLY "go" signal — consumers wire the dangerous action to it,
 * never to a plain click. A single Enter/Space tap can never fire it in `hold`
 * mode (keydown/keyup are intercepted and the synthetic click is prevented).
 *
 * It does not modify Button; it reuses Button's variant/size vocabulary via the
 * recipe so the look stays consistent (component pattern 1). Progress is driven
 * by JS state, not a CSS transition, so it advances identically under
 * `prefers-reduced-motion`.
 */
const props = withDefaults(
  defineProps<{
    /** Guard interaction. Default `hold`. */
    mode?: 'hold' | 'double' | 'confirm';
    /** Hold duration in ms (hold mode). Default 1500. */
    holdMs?: number;
    /** Window in ms for the second activation (double mode). Default 2000. */
    doubleMs?: number;
    /** Reuses Button's variant vocabulary. Default `danger` (these are dangerous). */
    variant?: GuardedActionVariants['variant'];
    /** Shared register-flex size scale (sm | md | lg). */
    size?: GuardedActionVariants['size'];
    /** Label shown once armed / holding (e.g. "Hold to ARM", "Confirm ARM"). */
    confirmLabel?: string;
    /** Label for the Cancel button in confirm mode. Override with the specific action context (e.g. "Abort"). Default: "Cancel". */
    cancelText?: string;
    /** Screen-reader instruction text (aria-describedby). Overrides the mode-derived default so operators can write "Press and hold to ARM" instead of the generic phrase. */
    instructionText?: string;
    disabled?: boolean;
    loading?: boolean;
    class?: HTMLAttributes['class'];
  }>(),
  {
    mode: 'hold',
    holdMs: 1500,
    doubleMs: 2000,
    variant: 'danger',
    size: 'md',
    disabled: false,
    loading: false,
  },
);

const emit = defineEmits<{
  /** The guarded action fired — do the real work here. */
  (e: 'confirm'): void;
  /** Hold released early, double-window lapsed, or cancelled. */
  (e: 'cancel'): void;
  /** Hold progress, 0..1 (hold mode). */
  (e: 'progress', fraction: number): void;
}>();

const armed = ref(false); // double/confirm: first step taken
const holding = ref(false); // hold: in progress
const progress = ref(0); // 0..1
const announce = ref(''); // assertive milestone text

const instructionId = useId();
const isDisabled = computed(() => props.disabled || props.loading);

const styles = computed(() =>
  guardedAction({
    variant: props.variant,
    size: props.size,
    armed: armed.value || holding.value,
  }),
);
const rootClass = computed(() => cn(styles.value.root(), props.class));

const instruction = computed(() => {
  if (props.instructionText) return props.instructionText;
  if (props.mode === 'double') return 'Activate twice to confirm';
  if (props.mode === 'confirm') return 'Activate, then confirm';
  return 'Press and hold to confirm';
});

// --- timers (cleared on unmount) ----------------------------------------- //
let holdTimer: ReturnType<typeof setTimeout> | null = null;
let doubleTimer: ReturnType<typeof setTimeout> | null = null;
let rafId: number | null = null;
let holdStart = 0;

function clearHoldTimers() {
  if (holdTimer) {
    clearTimeout(holdTimer);
    holdTimer = null;
  }
  if (rafId != null && typeof cancelAnimationFrame !== 'undefined') {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

// Visual-only progress loop. Completion is driven by the setTimeout below, so
// behaviour is deterministic and unaffected by reduced motion / rAF throttling.
function tick() {
  if (!holding.value) return;
  const frac = Math.min(1, (Date.now() - holdStart) / props.holdMs);
  progress.value = frac;
  emit('progress', frac);
  if (frac < 1 && typeof requestAnimationFrame !== 'undefined') {
    rafId = requestAnimationFrame(tick);
  }
}

// --- hold mode ----------------------------------------------------------- //
function startHold() {
  if (isDisabled.value || holding.value) return;
  holding.value = true;
  progress.value = 0;
  announce.value = 'Hold to confirm';
  emit('progress', 0);
  holdStart = Date.now();
  holdTimer = setTimeout(completeHold, props.holdMs);
  if (typeof requestAnimationFrame !== 'undefined') rafId = requestAnimationFrame(tick);
}

function completeHold() {
  clearHoldTimers();
  holding.value = false;
  progress.value = 1;
  announce.value = 'Confirmed';
  emit('progress', 1);
  emit('confirm');
}

function cancelHold() {
  if (!holding.value) return; // already completed or never started
  clearHoldTimers();
  holding.value = false;
  progress.value = 0;
  announce.value = 'Cancelled';
  emit('cancel');
}

// --- double / confirm modes ---------------------------------------------- //
function activate() {
  if (isDisabled.value) return;
  if (props.mode === 'double') {
    if (!armed.value) {
      armed.value = true;
      announce.value = 'Press again to confirm';
      doubleTimer = setTimeout(disarm, props.doubleMs);
    } else {
      if (doubleTimer) {
        clearTimeout(doubleTimer);
        doubleTimer = null;
      }
      armed.value = false;
      announce.value = 'Confirmed';
      emit('confirm');
    }
  } else if (props.mode === 'confirm' && !armed.value) {
    armed.value = true;
    announce.value = 'Confirm or cancel';
  }
}

function disarm() {
  if (doubleTimer) {
    clearTimeout(doubleTimer);
    doubleTimer = null;
  }
  if (!armed.value) return;
  armed.value = false;
  announce.value = 'Cancelled';
  emit('cancel');
}

function confirmFromRow() {
  armed.value = false;
  announce.value = 'Confirmed';
  emit('confirm');
}

// --- event handlers ------------------------------------------------------ //
function onPointerdown() {
  if (props.mode === 'hold') startHold();
}
function onPointerEnd() {
  if (props.mode === 'hold') cancelHold();
}
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    if (props.mode === 'hold') cancelHold();
    else disarm();
    return;
  }
  if (props.mode === 'hold' && (e.key === ' ' || e.key === 'Enter')) {
    e.preventDefault(); // suppress the synthetic click / page scroll
    if (!e.repeat) startHold();
  }
}
function onKeyup(e: KeyboardEvent) {
  if (props.mode === 'hold' && (e.key === ' ' || e.key === 'Enter')) {
    e.preventDefault();
    cancelHold();
  }
}
function onClick(e: MouseEvent) {
  if (props.mode === 'hold') {
    e.preventDefault(); // never confirm via a click in hold mode
    return;
  }
  activate();
}

onBeforeUnmount(() => {
  clearHoldTimers();
  if (doubleTimer) clearTimeout(doubleTimer);
});

const confirmBtn = button({ variant: 'danger', size: 'sm' });
const cancelBtn = button({ variant: 'secondary', size: 'sm' });
</script>

<template>
  <span class="relative inline-flex items-center gap-2">
    <button
      type="button"
      :class="rootClass"
      :disabled="isDisabled"
      :aria-describedby="instructionId"
      :aria-pressed="mode === 'double' ? armed : undefined"
      :aria-expanded="mode === 'confirm' ? armed : undefined"
      @pointerdown="onPointerdown"
      @pointerup="onPointerEnd"
      @pointerleave="onPointerEnd"
      @pointercancel="onPointerEnd"
      @keydown="onKeydown"
      @keyup="onKeyup"
      @click="onClick"
      @blur="onPointerEnd"
    >
      <span
        v-if="holding"
        :class="styles.fill()"
        :style="{ width: progress * 100 + '%' }"
        aria-hidden="true"
      />
      <span :class="styles.label()">
        <template v-if="(holding || armed) && confirmLabel">{{ confirmLabel }}</template>
        <slot v-else />
      </span>
    </button>

    <!-- confirm mode: inline Confirm / Cancel revealed once armed -->
    <span v-if="mode === 'confirm' && armed" :class="styles.confirmRow()">
      <button type="button" :class="confirmBtn" @click="confirmFromRow">
        {{ confirmLabel ?? 'Confirm' }}
      </button>
      <button type="button" :class="cancelBtn" @click="disarm">{{ cancelText ?? 'Cancel' }}</button>
    </span>

    <!-- AT-only: pollable progress during a hold -->
    <span
      v-if="holding"
      role="progressbar"
      :aria-valuemin="0"
      :aria-valuemax="100"
      :aria-valuenow="Math.round(progress * 100)"
      aria-label="Hold to confirm progress"
      class="sr-only"
    />
    <!-- AT-only: assertive milestone announcements -->
    <span role="status" aria-live="assertive" class="sr-only">{{ announce }}</span>
    <!-- AT-only: static instruction referenced by aria-describedby -->
    <span :id="instructionId" class="sr-only">{{ instruction }}</span>
  </span>
</template>
