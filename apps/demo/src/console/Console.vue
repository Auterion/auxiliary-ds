<script setup lang="ts">
/* Hallmark · macrostructure: Editorial (portfolio deck) · tone: measured/declarative
 *
 * "Auterion Suite" — the fleet home page from the Home Page Refactor UI design,
 * now speaking the Deck 07b portfolio grammar (`_deck07b.css`, namespace `dk-`).
 *
 * The LAYOUT is still the design's; the language is 07b's: hue-265 ink ramp,
 * grotesque speaks / mono measures, hairlines instead of shadows, nothing drawn
 * in on load. The old page-local blueprint (`.bp-*`) has been retired down to the
 * handful of devices 07b has no answer for — see the header of `_console.css`.
 *
 * ONE mode attribute: `[data-theme]` on the same element as `.dk`. That makes the
 * DS semantic tokens (Card, StatusBadge, Switch, Avatar) and the `--dk-*` palette
 * re-resolve together, so they cannot drift out of step. The old `[data-skin]`
 * third skin is gone — its whole point was the ink ramp, and the ink ramp is now
 * the grammar's default material.
 *
 * Signal budget: blue appears ONCE on this shell — the brand mark, a partner
 * tile, never state. The Store view spends the surface's second and last one.
 *
 * The rail collapses below `lg` into a scrollable strip so the console is usable
 * at 320px without a horizontal scrollbar.
 */
import { computed, ref } from 'vue';
import { Icon } from '@auxiliary/icons';
import OverviewView from './OverviewView.vue';
import FleetView from './FleetView.vue';
import AlertsView from './AlertsView.vue';
import TeamView from './TeamView.vue';
import StoreView from './StoreView.vue';
import SettingsView from './SettingsView.vue';
import { HEALTH_TOTAL, NAV_MAIN, NAV_UTILITY, SITES } from './data';
import './_console.css';

type ViewKey = 'overview' | 'fleet' | 'operations' | 'manufacturer' | 'store' | 'settings';

const view = ref<ViewKey>('overview');

/* The mode axis is the design system's own. `.dk` maps light/sunlight onto the
 * paper exposure and dark/darknight onto the ink one, so all four DS themes land
 * somewhere deliberate and every component in the page re-resolves with them. */
type Theme = 'light' | 'sunlight' | 'dark' | 'darknight';
const theme = ref<Theme>('light');
const THEMES: { key: Theme; label: string }[] = [
  { key: 'light', label: 'Light' },
  { key: 'sunlight', label: 'Sunlight' },
  { key: 'dark', label: 'Dark' },
  { key: 'darknight', label: 'Darknight' },
];

const HEADINGS: Record<ViewKey, { title: string; sub: string }> = {
  overview: { title: 'Auterion Fleet Overview', sub: 'Fleet health, activity and quick access.' },
  fleet: { title: 'Fleet Management', sub: 'Every vehicle, its state and who is flying it.' },
  operations: { title: 'Operations', sub: 'Conditions in the field needing a decision.' },
  manufacturer: { title: 'Manufacturer', sub: 'Operators, roles and site assignments.' },
  store: { title: 'Store', sub: 'Payloads, spares and software add-ons.' },
  settings: { title: 'Settings', sub: 'Workspace preferences and defaults.' },
};
const heading = computed(() => HEADINGS[view.value]);

const VIEWS = {
  overview: OverviewView,
  fleet: FleetView,
  operations: AlertsView,
  manufacturer: TeamView,
  store: StoreView,
  settings: SettingsView,
} as const;

function go(key: string) {
  view.value = key as ViewKey;
}
</script>

<template>
  <div :data-theme="theme" class="dk bp-shell flex min-h-screen antialiased">
    <!-- ── Navigation rail (≥ lg) ────────────────────────────────────────── -->
    <aside class="bp-sidebar hidden w-[248px] shrink-0 flex-col lg:flex">
      <!-- brand lockup. The mark is the surface's ONE signal plate: a partner
           tile in 07b's sense — whose workspace this is — never a state. -->
      <div class="flex items-center gap-3 px-5 py-4">
        <span class="dk-plate-signal bp-brand-mark" aria-hidden="true">
          <Icon name="drone" :size="15" />
        </span>
        <span class="dk-value flex-1 truncate">
          Auterion<span class="font-normal">Suite</span>
        </span>
        <button type="button" class="bp-icon-btn" aria-label="Collapse navigation">
          <Icon name="bars" size="sm" />
        </button>
      </div>

      <!-- org switcher -->
      <div class="px-3 pb-3">
        <button type="button" class="dk-cta w-full justify-start">
          <Icon name="house" size="sm" class="bp-glyph" />
          <span class="flex-1 text-left">Auterion</span>
          <Icon name="chevron-down" size="sm" class="bp-glyph" />
        </button>
      </div>

      <!-- primary nav -->
      <nav class="flex flex-col gap-0.5 px-3" aria-label="Main">
        <button
          v-for="item in NAV_MAIN"
          :key="item.key"
          type="button"
          class="dk-nav-item"
          :data-active="view === item.key ? 'true' : 'false'"
          :aria-current="view === item.key ? 'page' : undefined"
          @click="go(item.key)"
        >
          <Icon :name="item.icon" size="sm" class="shrink-0" />
          <span class="dk-label flex-1 text-left">{{ item.label }}</span>
          <Icon v-if="item.expandable" name="chevron-down" size="sm" class="shrink-0" />
        </button>
      </nav>

      <!-- utility nav + user, pinned bottom -->
      <div class="mt-auto flex flex-col gap-0.5 px-3 pb-2">
        <button
          v-for="item in NAV_UTILITY"
          :key="item.key"
          type="button"
          class="dk-nav-item"
          :data-active="view === item.key ? 'true' : 'false'"
          @click="item.key === 'settings' && go('settings')"
        >
          <Icon :name="item.icon" size="sm" class="shrink-0" />
          <span class="dk-label flex-1 text-left">{{ item.label }}</span>
        </button>
      </div>
      <div class="bp-sidebar-user flex items-center gap-3 px-5 py-3">
        <Icon name="user" size="sm" class="shrink-0" />
        <span class="dk-value flex-1 truncate">Mariana Ferreira</span>
        <button type="button" class="bp-icon-btn" aria-label="Sign out">
          <Icon name="arrow-right" size="sm" />
        </button>
      </div>
    </aside>

    <!-- ── Content canvas ────────────────────────────────────────────────── -->
    <main class="min-w-0 flex-1">
      <!-- Sticky header. The ledger is the last row in it and its hairline is
           the header's boundary — one rule, not a ledger rule stacked on a
           header rule. -->
      <header class="bp-header px-4 pt-5 sm:px-6 lg:px-8 xl:px-10">
        <div class="flex flex-wrap items-start justify-between gap-x-8 gap-y-4">
          <div class="min-w-0">
            <h1 class="dk-h1 truncate">{{ heading.title }}</h1>
            <p class="dk-body pt-2">{{ heading.sub }}</p>
          </div>
          <div class="flex flex-wrap items-center justify-end gap-2">
            <div class="dk-segment" role="group" aria-label="Colour theme">
              <button
                v-for="t in THEMES"
                :key="t.key"
                type="button"
                class="dk-segment-btn"
                :data-active="theme === t.key ? 'true' : 'false'"
                :aria-pressed="theme === t.key"
                @click="theme = t.key"
              >
                {{ t.label }}
              </button>
            </div>
            <button type="button" class="dk-cta">
              <Icon name="arrow-up-right-from-square" size="sm" />
              <span class="hidden sm:inline">Export</span>
            </button>
            <button type="button" class="dk-cta-solid">
              <Icon name="plus" size="sm" />
              Add vehicle
            </button>
          </div>
        </div>

        <!-- rail replacement below lg -->
        <nav class="bp-topbar mt-4" aria-label="Main">
          <button
            v-for="item in NAV_MAIN"
            :key="item.key"
            type="button"
            class="dk-nav-item"
            :data-active="view === item.key ? 'true' : 'false'"
            :aria-current="view === item.key ? 'page' : undefined"
            @click="go(item.key)"
          >
            <Icon :name="item.icon" size="sm" class="shrink-0" />
            <span class="dk-label">{{ item.label }}</span>
          </button>
        </nav>

        <!-- Device 2 · header ledger. Tops the case layout, carries the facts
             that hold for every view: who is looking, at what, at what size. -->
        <div class="dk-ledger">
          <div class="dk-ledger-cell">
            <span class="dk-label">Operator</span>
            <span class="dk-value truncate">Mariana Ferreira</span>
          </div>
          <div class="dk-ledger-cell">
            <span class="dk-label">Workspace</span>
            <span class="dk-value truncate">Auterion Field Ops</span>
          </div>
          <div class="dk-ledger-cell" data-align="end">
            <span class="dk-label">Tracked</span>
            <span class="dk-bracket">
              <span>{{ HEALTH_TOTAL }} vehicles</span>
              <span aria-hidden="true">·</span>
              <span>{{ SITES.length }} sites</span>
            </span>
          </div>
        </div>
      </header>

      <!-- pb-28 clears the demo Shell's floating page switcher -->
      <div class="px-4 pb-28 pt-8 sm:px-6 lg:px-8 xl:px-10">
        <component :is="VIEWS[view]" />
      </div>
    </main>
  </div>
</template>
