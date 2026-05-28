<script setup lang="ts">
import { computed } from 'vue';

export type AlertLevel = 'alarm' | 'warning' | 'caution' | 'advisory' | 'nominal';

const props = withDefaults(
  defineProps<{
    level: AlertLevel;
    title?: string;
    description?: string;
    dismissible?: boolean;
    actionLabel?: string;
  }>(),
  {
    dismissible: false,
  },
);

defineEmits<{
  (e: 'dismiss'): void;
  (e: 'action'): void;
}>();

const bannerClass = computed(() => {
  const base = 'flex items-start gap-3 rounded-md border px-4 py-3';
  const color = {
    alarm:    'bg-alarm text-alarm border-alarm',
    warning:  'bg-warning text-warning border-warning',
    caution:  'bg-caution text-caution border-caution',
    advisory: 'bg-advisory text-advisory border-advisory',
    nominal:  'bg-nominal text-nominal border-nominal',
  }[props.level];
  return [base, color].join(' ');
});

const icon = computed(() => {
  // Maritime-style status glyphs: alarm/warning/caution use triangle exclamation,
  // advisory uses circle-i, nominal uses checkmark.
  if (['alarm', 'warning', 'caution'].includes(props.level)) {
    return 'M12 2 L22 20 L2 20 Z M12 9 L12 14 M12 17 L12 17';
  }
  if (props.level === 'advisory') {
    return 'M12 2 A10 10 0 1 0 12 22 A10 10 0 1 0 12 2 M12 8 L12 8 M12 11 L12 17';
  }
  return 'M5 12 L10 17 L20 7'; // nominal: checkmark
});
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
      <path :d="icon" />
    </svg>

    <div class="min-w-0 flex-1">
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
      class="shrink-0 rounded px-2 py-1 text-xs font-medium underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 ring-focus"
      @click="$emit('action')"
    >
      {{ actionLabel }}
    </button>

    <button
      v-if="dismissible"
      type="button"
      aria-label="Dismiss"
      class="shrink-0 rounded p-1 opacity-70 hover:opacity-100 focus-visible:outline-none focus-visible:ring-2 ring-focus"
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
