<script setup lang="ts">
/* Auterion Fleet Overview — the Suite home page, in the Deck 07b grammar.
 *
 * Four modules from the "Home Page Refactor UI" design: fleet health, the Live
 * Fleet Map, a filtered Activity Feed, and Pinned Groups + Quick Access.
 *
 * 07b devices used here, each inside its permission slip:
 *   · Numeral card — ONE per spread: the fleet-health folio. The figure is
 *     aria-hidden and restated as a sentence, so the folio is never the only
 *     carrier of the fact.
 *   · Bracket — measured facts only: the health split and the group count.
 *   · Section head — the page's one repeating rhythm marker, mono on a hairline.
 * No signal plate on this view; the shell already spends the surface's one blue.
 *
 * Colour beyond the ink ramp appears ONLY on the five-level status ladder — the
 * health bar, its legend, and the group dots. That ladder is state, not brand,
 * and is exempt from the signal budget. Links and cards are ink, never hue.
 *
 * Nothing draws in on load. The only motion is `dk-lift` on the interactive
 * cards and the map's live ping, and both collapse under reduced motion.
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

const ready = computed(() => HEALTH.find((s) => s.level === 'nominal')?.count ?? 0);
const attention = computed(() => HEALTH_TOTAL - ready.value);
</script>

<template>
  <div class="flex flex-col gap-10">
    <!-- ── Fleet health · Device 3, the one numeral card on this spread ──── -->
    <section>
      <div class="dk-numeral">
        <span class="dk-numeral-folio" aria-hidden="true">{{ HEALTH_PCT }}</span>
        <div class="bp-health-facts">
          <div class="min-w-0">
            <p class="dk-label">Fleet health</p>
            <p class="dk-value pt-1">{{ HEALTH_PCT }}% of the vehicles are healthy</p>
          </div>
          <span class="dk-bracket">
            <span>{{ ready }} ready</span>
            <span aria-hidden="true">·</span>
            <span>{{ attention }} need attention</span>
          </span>
        </div>
      </div>

      <!-- segmented bar: one span per state, width by share of the fleet -->
      <div
        class="bp-healthbar mt-4"
        role="img"
        :aria-label="`Fleet health: ${HEALTH.map((s) => `${s.label} ${s.count}`).join(', ')}`"
      >
        <span
          v-for="s in HEALTH"
          :key="s.key"
          class="bp-healthbar-seg"
          :class="`bp-bg-${s.level}`"
          :style="{ width: `${(s.count / HEALTH_TOTAL) * 100}%` }"
        />
      </div>

      <ul class="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1.5">
        <li v-for="s in HEALTH" :key="s.key" class="flex items-center gap-2">
          <span class="dk-dot" :class="`dk-dot-${s.level}`" />
          <span class="dk-label">{{ s.label }}</span>
          <span class="dk-value dk-num">{{ s.count }}</span>
        </li>
      </ul>
    </section>

    <!-- ── Map + activity ────────────────────────────────────────────────── -->
    <!-- The height goes on the grid ROW, not the section: grid-auto-rows is
         `auto`, so a fixed section height would simply be overflowed by the
         taller column. With the row pinned, both columns stretch to match and
         the feed scrolls inside its own card. -->
    <section
      class="grid grid-cols-1 gap-6 xl:grid-cols-[1.4fr_minmax(0,1fr)] xl:grid-rows-[520px]"
    >
      <div class="flex min-h-0 min-w-0 flex-col">
        <div class="dk-section">
          <h2 class="dk-label">Live fleet map</h2>
          <button type="button" class="dk-link dk-small">Open map</button>
        </div>
        <Card class="dk-card mt-4 flex min-h-0 flex-1 flex-col justify-center p-4">
          <FleetMapCard />
        </Card>
      </div>

      <div class="flex min-h-0 min-w-0 flex-col">
        <div class="dk-section">
          <h2 class="dk-label">Activity feed</h2>
          <span class="dk-bracket"><span>{{ feed.length }} events</span></span>
        </div>
        <Card class="dk-card mt-4 flex min-h-0 flex-1 flex-col px-4 pb-1 pt-4">
          <div class="dk-segment shrink-0 self-start" role="tablist" aria-label="Activity filter">
            <button
              v-for="t in ACTIVITY_TABS"
              :key="t"
              type="button"
              role="tab"
              class="dk-segment-btn"
              :aria-selected="tab === t"
              :data-active="tab === t ? 'true' : 'false'"
              @click="tab = t"
            >
              {{ t }}
            </button>
          </div>

          <ul class="bp-feed-scroll dk-divide mt-3 min-h-0 flex-1">
            <!-- Word spaces are written as explicit {{ ' ' }} interpolations:
                 Vue's whitespace:condense drops the newline between sibling
                 tags, which would fuse "unlocked" to "vehicle". -->
            <li v-for="a in feed" :key="a.id" class="bp-feed-row">
              <Icon name="drone" :size="14" class="bp-feed-glyph" />
              <div class="dk-body min-w-0">
                <span class="dk-value">{{ a.who }}</span>
                <!-- open vs closed padlock is the signal; no hue needed -->
                <Icon
                  v-if="a.lock"
                  class="bp-glyph mx-1 inline-block align-[-2px]"
                  :name="a.lock === 'locked' ? 'lock' : 'lock-open'"
                  size="sm"
                />
                <span><template v-if="!a.lock">{{ ' ' }}</template>{{ a.action }}{{ ' ' }}</span>
                <template v-if="a.flight">
                  <span class="bp-pill-status" :class="`bp-pill-${a.flight.level}`">{{ a.flight.label }}</span>
                  <span>{{ ' ' }}{{ a.tail }}</span>
                  <br >
                  <a class="dk-link dk-small" href="#" @click.prevent>
                    <Icon name="arrow-up-right-from-square" size="sm" class="align-[-2px]" />
                    {{ a.flight.code }}
                  </a>
                </template>
                <template v-else>
                  <a v-if="a.link" class="dk-link" href="#" @click.prevent>{{ a.link }}</a>
                  <span>{{ ' ' }}{{ a.tail }}</span>
                </template>
              </div>
              <span class="bp-feed-time">{{ a.when }}</span>
            </li>
            <li v-if="!feed.length" class="dk-body py-8 text-center">
              No {{ tab.toLowerCase() }} activity yet.
            </li>
          </ul>
        </Card>
      </div>
    </section>

    <!-- ── Pinned groups + quick access ──────────────────────────────────── -->
    <section class="grid grid-cols-1 gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
      <div class="flex min-w-0 flex-col">
        <div class="dk-section">
          <h2 class="dk-label">Pinned groups</h2>
          <span class="dk-bracket"><span>{{ GROUPS.length }} pinned</span></span>
        </div>
        <ul class="mt-4 flex flex-col gap-2">
          <li v-for="g in GROUPS" :key="g.id">
            <button type="button" class="dk-card dk-lift block w-full p-3 text-left">
              <div class="dk-value truncate">{{ g.name }}</div>
              <div class="flex items-center gap-2 pt-1.5">
                <span class="dk-label dk-num">{{ g.vehicles }} vehicles</span>
                <span class="flex items-center gap-1">
                  <span
                    v-for="(d, i) in g.dots"
                    :key="i"
                    class="dk-dot"
                    :class="`dk-dot-${d}`"
                  />
                </span>
              </div>
            </button>
          </li>
        </ul>
        <button type="button" class="dk-link dk-small mt-4 self-end">
          Manage groups
          <Icon name="arrow-right" size="sm" class="align-[-2px]" />
        </button>
      </div>

      <div class="min-w-0">
        <div class="dk-section">
          <h2 class="dk-label">Quick access</h2>
          <span class="dk-bracket"><span>{{ QUICK_ACCESS.length }} areas</span></span>
        </div>
        <ul class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <li v-for="q in QUICK_ACCESS" :key="q.key">
            <button type="button" class="dk-card dk-lift block h-full w-full p-4 text-left">
              <Icon :name="q.icon" size="lg" class="bp-glyph" />
              <div class="dk-value pt-4">{{ q.title }}</div>
              <p class="dk-body pt-1">{{ q.blurb }}</p>
            </button>
          </li>
        </ul>
      </div>
    </section>
  </div>
</template>
