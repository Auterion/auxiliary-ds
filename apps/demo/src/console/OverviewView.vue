<script setup lang="ts">
/* Auterion Fleet Overview — the Suite home page.
 *
 * Four modules from the "Home Page Refactor UI" design: a fleet-health bar with a
 * status legend, the Live Fleet Map, a tabbed Activity Feed, and Pinned Groups +
 * Quick Access. Layout follows the design; the palette is the console's own —
 * colour appears ONLY on the five-level status ladder (health bar, legend, group
 * dots). Links, pins and group tiles are ink, not hue.
 *
 * Motion: each module carries `bp-rise` with a stagger index, so the page
 * assembles top-down on mount rather than snapping in. Interactive cards use
 * `bp-lift`. Both collapse under prefers-reduced-motion.
 */
import { computed, ref } from 'vue';
import { Card } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';
import FleetMapCard from './FleetMapCard.vue';
import {
  ACTIVITY,
  ACTIVITY_TABS,
  GROUPS,
  HEALTH,
  HEALTH_PCT,
  HEALTH_TOTAL,
  QUICK_ACCESS,
  type ActivityTab,
} from './data';

const tab = ref<ActivityTab>('All');
const feed = computed(() =>
  tab.value === 'All' ? ACTIVITY : ACTIVITY.filter((a) => a.tab === tab.value),
);
</script>

<template>
  <div class="flex flex-col gap-8">
    <!-- ── Fleet health ──────────────────────────────────────────────────── -->
    <section class="bp-rise" style="--i: 0">
      <div class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <p class="text-[13px]">
          <span class="bp-ink-1 text-[20px] font-semibold tabular">{{ HEALTH_PCT }}%</span>
          <span class="bp-ink-2"> of the Vehicles are Healthy</span>
        </p>
        <ul class="flex flex-wrap items-center gap-x-4 gap-y-1">
          <li v-for="s in HEALTH" :key="s.key" class="flex items-center gap-1.5">
            <span class="bp-dot" :class="`bp-dot-${s.level}`" />
            <span class="bp-ink-2 text-[12px]">{{ s.label }}</span>
            <span class="bp-ink-1 text-[12px] font-medium tabular">{{ s.count }}</span>
          </li>
        </ul>
      </div>
      <!-- segmented bar: one span per state, width by share of the fleet -->
      <div
        class="bp-healthbar mt-2.5"
        role="img"
        :aria-label="`Fleet health: ${HEALTH.map((s) => `${s.label} ${s.count}`).join(', ')}`"
      >
        <span
          v-for="(s, i) in HEALTH"
          :key="s.key"
          class="bp-healthbar-seg"
          :class="`bp-bg-${s.level}`"
          :style="{ width: `${(s.count / HEALTH_TOTAL) * 100}%`, animationDelay: `${i * 60}ms` }"
        />
      </div>
    </section>

    <!-- ── Map + activity ────────────────────────────────────────────────── -->
    <!-- The height goes on the grid ROW, not the section: grid-auto-rows is
         `auto`, so a fixed section height would simply be overflowed by the
         taller column. With the row pinned, both columns stretch to match and
         the feed scrolls inside its own card. -->
    <section
      class="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_minmax(0,1fr)] xl:grid-rows-[520px]"
    >
      <div class="bp-rise flex min-h-0 min-w-0 flex-col" style="--i: 1">
        <div class="bp-section-head">
          <h2 class="bp-ink-1 text-[14px] font-semibold">Live Fleet Map</h2>
          <button type="button" class="bp-link bp-focus text-[12px]">Open map</button>
        </div>
        <Card class="bp-card flex min-h-0 flex-1 flex-col justify-center p-4">
          <FleetMapCard />
        </Card>
      </div>

      <div class="bp-rise flex min-h-0 min-w-0 flex-col" style="--i: 2">
        <div class="bp-section-head">
          <h2 class="bp-ink-1 text-[14px] font-semibold">Activity Feed</h2>
          <span class="bp-ink-3 text-[12px] tabular">{{ feed.length }} events</span>
        </div>
        <Card class="bp-card flex min-h-0 flex-1 flex-col px-4 pb-1 pt-1">
          <div class="bp-tabs shrink-0" role="tablist" aria-label="Activity filter">
            <button
              v-for="t in ACTIVITY_TABS"
              :key="t"
              type="button"
              role="tab"
              class="bp-tab bp-focus"
              :aria-selected="tab === t"
              :data-active="tab === t ? 'true' : 'false'"
              @click="tab = t"
            >
              {{ t }}
            </button>
          </div>

          <ul class="bp-divide bp-feed-scroll min-h-0 flex-1">
            <!-- Word spaces are written as explicit {{ ' ' }} interpolations:
                 Vue's whitespace:condense drops the newline between sibling
                 tags, which would fuse "unlocked" to "vehicle". -->
            <li v-for="a in feed" :key="a.id" class="bp-feed-row">
              <span class="bp-tile bp-tile-sm rounded-full">
                <Icon name="drone" :size="14" />
              </span>
              <div class="min-w-0 text-[13px] leading-5">
                <span class="bp-ink-1 font-medium">{{ a.who }}</span>
                <!-- open vs closed padlock is the signal; no hue needed -->
                <Icon
                  v-if="a.lock"
                  class="bp-ink-3 mx-1 inline-block align-[-2px]"
                  :name="a.lock === 'locked' ? 'lock' : 'lock-open'"
                  size="sm"
                />
                <span class="bp-ink-2"><template v-if="!a.lock">{{ ' ' }}</template>{{ a.action }}{{ ' ' }}</span>
                <template v-if="a.flight">
                  <span class="bp-pill-status" :class="`bp-pill-${a.flight.level}`">{{ a.flight.label }}</span>
                  <span class="bp-ink-2">{{ ' ' }}{{ a.tail }}</span>
                  <br >
                  <a class="bp-link" href="#" @click.prevent>
                    <Icon name="arrow-up-right-from-square" size="sm" class="align-[-2px]" />
                    {{ a.flight.code }}
                  </a>
                </template>
                <template v-else>
                  <a v-if="a.link" class="bp-link" href="#" @click.prevent>{{ a.link }}</a>
                  <span class="bp-ink-2">{{ ' ' }}{{ a.tail }}</span>
                </template>
              </div>
              <span class="bp-feed-time">{{ a.when }}</span>
            </li>
            <li v-if="!feed.length" class="bp-ink-3 py-8 text-center text-[13px]">
              No {{ tab.toLowerCase() }} activity yet.
            </li>
          </ul>
        </Card>
      </div>
    </section>

    <!-- ── Pinned groups + quick access ──────────────────────────────────── -->
    <section class="grid grid-cols-1 gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
      <div class="bp-rise flex min-w-0 flex-col" style="--i: 3">
        <div class="bp-section-head">
          <h2 class="bp-ink-1 text-[14px] font-semibold">Pinned Groups</h2>
          <span class="bp-ink-3 text-[12px] tabular">{{ GROUPS.length }}</span>
        </div>
        <ul class="flex flex-col gap-2">
          <li v-for="g in GROUPS" :key="g.id">
            <button type="button" class="bp-card bp-group bp-lift bp-focus p-3">
              <div class="flex items-center gap-3">
                <span class="bp-group-tile"><Icon name="drone" :size="16" /></span>
                <div class="min-w-0 flex-1">
                  <div class="bp-ink-1 truncate text-[13px] font-medium">{{ g.name }}</div>
                  <div class="flex items-center gap-1.5 pt-0.5">
                    <span class="bp-ink-3 text-[12px] tabular">{{ g.vehicles }} vehicles</span>
                    <span class="flex items-center gap-1">
                      <span
                        v-for="(d, i) in g.dots"
                        :key="i"
                        class="bp-dot !h-1.5 !w-1.5"
                        :class="`bp-dot-${d}`"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </button>
          </li>
        </ul>
        <button type="button" class="bp-link bp-focus mt-3 self-end text-[13px]">
          Manage Groups
          <Icon name="arrow-right" size="sm" class="align-[-2px]" />
        </button>
      </div>

      <div class="bp-rise min-w-0" style="--i: 4">
        <div class="bp-section-head">
          <h2 class="bp-ink-1 text-[14px] font-semibold">Quick Access</h2>
        </div>
        <ul class="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <li v-for="q in QUICK_ACCESS" :key="q.key">
            <button type="button" class="bp-card bp-quick bp-lift bp-focus h-full p-4">
              <span class="bp-tile"><Icon :name="q.icon" size="lg" /></span>
              <div class="bp-ink-1 pt-3 text-[14px] font-semibold">{{ q.title }}</div>
              <p class="bp-ink-2 pt-1 text-[13px] leading-[1.45]">{{ q.blurb }}</p>
            </button>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
