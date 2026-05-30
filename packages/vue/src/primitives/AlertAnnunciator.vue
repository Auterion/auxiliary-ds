<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { alertManager } from '@auxiliary/css/recipes';
import { cn } from '@auxiliary/css/utils';
import StatusBadge from './StatusBadge.vue';
import { STATUS_LABELS } from './status-glyphs';
import type { AlertModel } from '../composables/useAlertModel';

const props = withDefaults(
  defineProps<{
    /** The model from `useAlertModel()`. */
    model: AlertModel;
    /** Resting label when there are no alerts. */
    nominalLabel?: string;
    /** Stable accessible name for the control's action. */
    actionLabel?: string;
    class?: HTMLAttributes['class'];
  }>(),
  {
    nominalLabel: 'All nominal',
    actionLabel: 'View alerts',
  },
);

defineEmits<{ (e: 'select'): void }>();

const styles = alertManager();

const highest = computed(() => props.model.highest.value);
const count = computed(() => props.model.alerts.value.length);
const countLabel = computed(() => `${count.value} ${count.value === 1 ? 'alert' : 'alerts'}`);

// Mirrors the summary into a polite live region so escalation / count changes
// reach assistive tech without stealing focus. The button's name stays stable
// (the action), so the same control isn't announced as two unrelated things.
const liveText = computed(() =>
  highest.value ? `${STATUS_LABELS[highest.value.level]}, ${countLabel.value}` : props.nominalLabel,
);
</script>

<template>
  <span :class="cn('relative inline-flex items-center', props.class)">
    <button type="button" :class="styles.annunciator()" :aria-label="actionLabel" @click="$emit('select')">
      <template v-if="highest">
        <!-- StatusBadge carries the level via glyph + color; the count sits beside
             it so severity is never conveyed by color alone. -->
        <StatusBadge :level="highest.level" />
        <span :class="styles.annunciatorCount()">{{ countLabel }}</span>
      </template>
      <StatusBadge v-else level="nominal">{{ nominalLabel }}</StatusBadge>
    </button>
    <span class="sr-only" aria-live="polite">{{ liveText }}</span>
  </span>
</template>
