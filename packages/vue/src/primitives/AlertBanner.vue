<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { alertBanner } from '@auxiliary/css/recipes';
import { cn } from '@auxiliary/css/utils';
import { STATUS_GLYPHS, STATUS_LABELS, type StatusLevel } from './status-glyphs';


const props = withDefaults(
  defineProps<{
    level: StatusLevel;
    title?: string;
    description?: string;
    dismissible?: boolean;
    actionLabel?: string;
    /**
     * Whether this banner is its own assertive live region (`role="alert"`).
     * Default `true` (a standalone banner announces itself). Set `false` when a
     * parent owns a single live region for a managed stack (e.g. `<AlertManager>`),
     * so acknowledging/reordering one banner doesn't re-announce the whole backlog.
     */
    live?: boolean;
    class?: HTMLAttributes['class'];
  }>(),
  {
    dismissible: false,
    live: true,
  },
);

defineEmits<{
  (e: 'dismiss'): void;
  (e: 'action'): void;
}>();

const styles = computed(() => alertBanner({ level: props.level }));
const bannerClass = computed(() => cn(styles.value.root(), props.class));

// Per-level glyph (grayscale-distinct shape) + the level word, shared with
// StatusBadge so the two stay in lockstep. The glyph is decorative; the sr-only
// label is what carries the level to assistive tech.
const glyph = computed(() => STATUS_GLYPHS[props.level]);
const srLabel = computed(() => STATUS_LABELS[props.level]);
</script>

<template>
  <div :class="bannerClass" :role="live ? 'alert' : undefined">
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      :class="styles.icon()"
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
      :class="styles.action()"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </button>

    <button
      v-if="dismissible"
      type="button"
      aria-label="Dismiss"
      :class="styles.dismiss()"
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
