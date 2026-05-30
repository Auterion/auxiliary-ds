<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue';
import { alertManager } from '@auxiliary/css/recipes';
import { cn } from '@auxiliary/css/utils';
import AlertBanner from './AlertBanner.vue';
import type { AlertModel } from '../composables/useAlertModel';

const props = withDefaults(
  defineProps<{
    /** The model from `useAlertModel()`. */
    model: AlertModel;
    /** Cap visible banners; the remainder is summarised as "+N more". */
    max?: number;
    /** Label for the per-banner acknowledge action. */
    ackLabel?: string;
    /** Label for the bulk acknowledge control. */
    ackAllLabel?: string;
    class?: HTMLAttributes['class'];
  }>(),
  {
    ackLabel: 'Acknowledge',
    ackAllLabel: 'Acknowledge all',
  },
);

const styles = alertManager();

const visible = computed(() => {
  const all = props.model.alerts.value;
  return props.max != null ? all.slice(0, props.max) : all;
});
const overflow = computed(() => props.model.alerts.value.length - visible.value.length);
const unacked = computed(() => props.model.unacknowledged.value);
</script>

<template>
  <div :class="cn(styles.root(), props.class)">
    <div v-if="unacked > 0" :class="styles.header()">
      <span :class="styles.count()" aria-live="polite">{{ unacked }} unacknowledged</span>
      <button type="button" :class="styles.ackAll()" @click="model.acknowledgeAll()">
        {{ ackAllLabel }}
      </button>
    </div>

    <!-- One polite live region owns announcements for the whole stack. Banners
         opt out of their own role="alert" (:live="false") so acknowledging or
         reordering one doesn't re-announce the entire backlog. -->
    <div :class="styles.stack()" role="log" aria-live="polite" aria-relevant="additions text">
      <div v-for="alert in visible" :key="alert.id">
        <!-- Acked state is otherwise opacity-only; name it for assistive tech. -->
        <span v-if="alert.acknowledged" class="sr-only">Acknowledged. </span>
        <AlertBanner
          :live="false"
          :level="alert.level"
          :title="alert.title"
          :description="alert.message"
          :action-label="alert.acknowledged ? undefined : ackLabel"
          :class="alert.acknowledged ? styles.acknowledged() : undefined"
          @action="model.acknowledge(alert.id)"
        />
      </div>
    </div>

    <p v-if="overflow > 0" :class="styles.overflow()">+{{ overflow }} more</p>
  </div>
</template>
