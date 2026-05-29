<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { alertBanner } from '@auxiliary/css/recipes';
import { cn } from '@auxiliary/css/utils';
import { STATUS_GLYPHS, STATUS_LABELS, type StatusKind } from './status-glyphs';

export type AlertLevel = StatusKind;

const props = withDefaults(
  defineProps<{
    level: AlertLevel;
    title?: string;
    description?: string;
    dismissible?: boolean;
    actionLabel?: string;
    class?: HTMLAttributes['class'];
  }>(),
  {
    dismissible: false,
  },
);

defineEmits<{
  (e: 'dismiss'): void;
  (e: 'action'): void;
}>();

const bannerClass = computed(() => cn(alertBanner({ level: props.level }), props.class));

// Per-level glyph (grayscale-distinct shape) + the level word, shared with
// StatusBadge so the two stay in lockstep. The glyph is decorative; the sr-only
// label is what carries the level to assistive tech.
const glyph = computed(() => STATUS_GLYPHS[props.level]);
const srLabel = computed(() => STATUS_LABELS[props.level]);
</script>

<template>
  <div :class="bannerClass" role="alert">
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="mt-0.5 shrink-0"
      aria-hidden="true"
    >
      <path :d="glyph" />
    </svg>

    <div class="min-w-0 flex-1">
      <!-- Announces the severity to assistive tech (and in grayscale) regardless
           of whether a title/description is supplied. Never color-only. -->
      <span class="sr-only">{{ srLabel }}</span>
      <div v-if="title || $slots.title" class="font-medium">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="description || $slots.default" class="mt-0.5 text-sm opacity-90">
        <slot>{{ description }}</slot>
      </div>
    </div>

    <button
      v-if="actionLabel"
      type="button"
      class="shrink-0 rounded px-2 py-1 text-xs font-medium underline-offset-2 hover:underline active:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 ring-ring"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </button>

    <button
      v-if="dismissible"
      type="button"
      aria-label="Dismiss"
      class="shrink-0 rounded p-1 opacity-70 hover:opacity-100 active:bg-foreground/10 focus-visible:outline-none focus-visible:ring-2 ring-ring"
      @click="$emit('dismiss')"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    </button>
  </div>
</template>
