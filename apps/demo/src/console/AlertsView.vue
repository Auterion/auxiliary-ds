<script setup lang="ts">
/* Alerts — the one module where the status ladder leads. Uses the real
 * StatusBadge primitive in its `outline` variant, whose *-emphasis inks are
 * contrast-gated (>=4.5:1 vs both background and card, every theme) — so the
 * severity reads in light and dark without shouting on a neutral page.
 * Level is never color-only: the badge ships a per-level glyph and an
 * always-present visually-hidden level label. */
import { computed, reactive } from 'vue';
import { Card, StatusBadge } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';
import { ALERTS } from './data';

const rows = reactive(ALERTS.map((a) => ({ ...a })));
const openCount = computed(() => rows.filter((r) => !r.acked).length);
</script>

<template>
  <Card class="bp-card p-5">
    <div class="flex items-center justify-between pb-3">
      <div>
        <h2 class="bp-ink-1 text-[14px] font-semibold">Active alerts</h2>
        <p class="bp-ink-2 pt-0.5 text-[13px]">
          {{ openCount }} unacknowledged · {{ rows.length }} total
        </p>
      </div>
      <button type="button" class="bp-cta bp-cta-sm bp-focus" @click="rows.forEach((r) => (r.acked = true))">
        Acknowledge all
      </button>
    </div>

    <ul class="flex flex-col gap-0.5">
      <li
        v-for="a in rows"
        :key="a.id"
        class="bp-row !items-start"
        :data-active="!a.acked ? 'true' : 'false'"
      >
        <StatusBadge :level="a.level" variant="outline" size="sm" class="mt-0.5 shrink-0">
          {{ a.level }}
        </StatusBadge>
        <div class="min-w-0 flex-1">
          <div class="flex items-center gap-2">
            <span class="bp-ink-1 text-[14px] font-medium">{{ a.title }}</span>
            <span class="bp-chip">{{ a.vehicle }}</span>
          </div>
          <div class="bp-ink-2 text-[13px] leading-4">{{ a.detail }}</div>
        </div>
        <span class="bp-ink-3 shrink-0 pt-0.5 text-[12px]">{{ a.when }}</span>
        <button
          v-if="!a.acked"
          type="button"
          class="bp-cta bp-cta-sm bp-focus"
          @click="a.acked = true"
        >
          Acknowledge
        </button>
        <span v-else class="bp-ink-3 flex h-6 shrink-0 items-center gap-1 text-[12px]">
          <Icon name="check" size="sm" />
          Acked
        </span>
      </li>
    </ul>
  </Card>
</template>
