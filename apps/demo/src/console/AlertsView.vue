<script setup lang="ts">
/* Alerts — the one module where the status ladder leads. Uses the real
 * StatusBadge primitive in its `outline` variant, whose *-emphasis inks are
 * contrast-gated (>=4.5:1 vs both background and card, every theme) — so the
 * severity reads in every theme without shouting on an otherwise ink page.
 * Level is never colour-only: the badge ships a per-level glyph and an
 * always-present visually-hidden level label.
 *
 * The rows are `dk-row` on fixed grid slots, so the timestamp and the trailing
 * action end on one x however long the detail line runs. */
import { computed, reactive } from 'vue';
import { Card, StatusBadge } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';
import { ALERTS } from './data';

const rows = reactive(ALERTS.map((a) => ({ ...a })));
const openCount = computed(() => rows.filter((r) => !r.acked).length);
</script>

<template>
  <Card class="dk-card p-5">
    <div class="dk-section">
      <h2 class="dk-label">Active alerts</h2>
      <span class="dk-bracket">
        <span>{{ openCount }} unacknowledged</span>
        <span aria-hidden="true">·</span>
        <span>{{ rows.length }} total</span>
      </span>
    </div>

    <div class="flex justify-end py-4">
      <button type="button" class="dk-cta dk-cta-sm" @click="rows.forEach((r) => (r.acked = true))">
        Acknowledge all
      </button>
    </div>

    <ul class="flex flex-col gap-0.5">
      <li
        v-for="a in rows"
        :key="a.id"
        class="dk-row bp-alert-row"
        :data-active="!a.acked ? 'true' : 'false'"
      >
        <StatusBadge :level="a.level" variant="outline" size="sm" class="mt-0.5 shrink-0">
          {{ a.level }}
        </StatusBadge>
        <div class="min-w-0">
          <div class="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <span class="dk-value">{{ a.title }}</span>
            <span class="dk-label">{{ a.vehicle }}</span>
          </div>
          <div class="dk-body">{{ a.detail }}</div>
        </div>
        <!-- Time and action share ONE grid slot. With a `1fr` middle track that
             slot is flush to the row's right edge, so the timestamps and the
             actions each end on one x no matter how wide either is. -->
        <div class="flex shrink-0 flex-col items-end gap-2">
          <span class="dk-label">{{ a.when }}</span>
          <button
            v-if="!a.acked"
            type="button"
            class="dk-cta dk-cta-sm"
            @click="a.acked = true"
          >
            Acknowledge
          </button>
          <span v-else class="dk-label flex items-center gap-1.5">
            <Icon name="check" size="sm" />
            Acked
          </span>
        </div>
      </li>
    </ul>
  </Card>
</template>
