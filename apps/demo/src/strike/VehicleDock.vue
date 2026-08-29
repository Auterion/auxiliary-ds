<script setup lang="ts">
/**
 * The vehicle strip along the bottom of the video view.
 *
 * Ambient chrome, reproduced from AMC rather than designed here — it is in the
 * frame because the strike rail has to survive sitting beside it, and because
 * "which aircraft am I about to fire from" is a question the view has to answer
 * without being asked. The selected card carries the ring; the rest carry a
 * white feed glyph instead of a green one.
 */
import { Icon } from '@auxiliary/icons';

defineProps<{ vehicles: readonly { id: number; mode: string; selected: boolean }[] }>();

/* `utils/vehicle.ts` truncateMode(mode, max = 8) — reproduced so the card wraps
 * where the product's does. */
function truncateMode(mode: string, max = 8) {
  return mode.length > max ? `${mode.slice(0, max - 1)}…` : mode;
}
</script>

<template>
  <div class="sk-dock">
    <div
      v-for="v in vehicles"
      :key="v.id"
      class="sk-card"
      :data-selected="v.selected || undefined"
    >
      <span class="sk-card-id">{{ v.id }}</span>
      <div class="sk-card-body">
        <span class="sk-card-name">
          Vehicle {{ v.id }}
          <span
            style="margin-left: 6px"
            :style="{ color: v.selected ? 'var(--sk-amc-armed-ink)' : 'var(--sk-amc-ink)' }"
          >
            <Icon name="eye" size="xs" />
          </span>
        </span>
        <div class="sk-card-meta">
          <span class="sk-dot" data-on />
          <span>Armed</span>
          <span class="sk-dot" />
          <span>{{ truncateMode(v.mode) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
