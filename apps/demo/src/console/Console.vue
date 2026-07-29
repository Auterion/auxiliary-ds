<script setup lang="ts">
/* Hallmark · macrostructure: Workbench (product console) · tone: utilitarian
 *
 * "Auterion Suite" — the fleet home page from the Home Page Refactor UI design:
 * a navigation sidebar against a fluid content canvas, with the fleet-health
 * bar, live map, activity feed, pinned groups and quick access.
 *
 * The LAYOUT is the design's; the palette is the console's own neutral scheme —
 * so the whole surface, sidebar included, flips with `data-theme`, re-resolving
 * BOTH the semantic tokens (Card, Switch, StatusBadge) and the `.bp-*` vars so
 * the two layers stay in step. Colour is reserved for the status ladder.
 *
 * The rail collapses below `lg` into a scrollable chip strip so the console is
 * usable at 320px without a horizontal scrollbar.
 */
import { computed, ref } from 'vue';
import { Icon } from '@auxiliary/icons';
import OverviewView from './OverviewView.vue';
import FleetView from './FleetView.vue';
import AlertsView from './AlertsView.vue';
import TeamView from './TeamView.vue';
import StoreView from './StoreView.vue';
import SettingsView from './SettingsView.vue';
import { NAV_MAIN, NAV_UTILITY } from './data';
import './_console.css';

type ViewKey = 'overview' | 'fleet' | 'operations' | 'manufacturer' | 'store' | 'settings';

const view = ref<ViewKey>('overview');

/* Three skins. `ink` is NOT a design-system theme name, so the element keeps
 * data-theme="dark" (Card / StatusBadge / Switch resolve their semantic tokens
 * from that) while [data-skin] drives the page-local `.bp-*` palette. */
type Skin = 'light' | 'dark' | 'ink';
const skin = ref<Skin>('light');
const dsTheme = computed(() => (skin.value === 'ink' ? 'dark' : skin.value));
const SKINS: { key: Skin; label: string }[] = [
  { key: 'light', label: 'Light' },
  { key: 'dark', label: 'Dark' },
  { key: 'ink', label: 'Ink' },
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
  <div :data-theme="dsTheme" :data-skin="skin" class="bp-shell bp-root font-sans antialiased flex min-h-screen">
    <!-- ── Navigation sidebar (rail ≥ lg) ────────────────────────────────── -->
    <aside class="bp-sidebar hidden w-[256px] shrink-0 flex-col lg:flex">
      <!-- brand lockup -->
      <div class="flex h-[61px] items-center gap-3 px-5">
        <Icon class="bp-ink-1" name="drone" :size="20" />
        <span class="bp-ink-1 flex-1 text-[15px] tracking-[-0.2px]">
          <span class="font-semibold">Auterion</span><span class="font-light">Suite</span>
        </span>
        <button type="button" class="bp-icon-btn bp-focus" aria-label="Collapse navigation">
          <Icon name="bars" size="sm" />
        </button>
      </div>

      <!-- org switcher -->
      <div class="px-5 pb-3">
        <button type="button" class="bp-org bp-focus">
          <Icon class="bp-nav-ico" name="house" size="sm" />
          <span class="flex-1 text-left text-[13px] font-medium">Auterion</span>
          <Icon class="bp-nav-ico" name="chevron-down" size="sm" />
        </button>
      </div>

      <!-- primary nav -->
      <nav class="flex flex-col gap-0.5 px-3" aria-label="Main">
        <button
          v-for="item in NAV_MAIN"
          :key="item.key"
          type="button"
          class="bp-nav-item bp-focus"
          :data-active="view === item.key ? 'true' : 'false'"
          :aria-current="view === item.key ? 'page' : undefined"
          @click="go(item.key)"
        >
          <Icon class="bp-nav-ico" :name="item.icon" size="sm" />
          <span class="flex-1 text-left text-[13px] font-medium">{{ item.label }}</span>
          <Icon v-if="item.expandable" class="bp-nav-ico" name="chevron-down" size="sm" />
        </button>
      </nav>

      <!-- utility nav + user, pinned bottom -->
      <div class="mt-auto flex flex-col gap-0.5 px-3 pb-2">
        <button
          v-for="item in NAV_UTILITY"
          :key="item.key"
          type="button"
          class="bp-nav-item bp-focus"
          :data-active="view === item.key ? 'true' : 'false'"
          @click="item.key === 'settings' && go('settings')"
        >
          <Icon class="bp-nav-ico" :name="item.icon" size="sm" />
          <span class="flex-1 text-left text-[13px] font-medium">{{ item.label }}</span>
        </button>
      </div>
      <div class="bp-sidebar-user flex items-center gap-2 px-5 py-3">
        <Icon class="bp-nav-ico" name="user" size="sm" />
        <span class="bp-ink-1 flex-1 truncate text-[13px] font-medium">Mariana Ferreira</span>
        <button type="button" class="bp-icon-btn bp-focus" aria-label="Sign out">
          <Icon name="arrow-right" size="sm" />
        </button>
      </div>
    </aside>

    <!-- ── Content canvas — fluid ────────────────────────────────────────── -->
    <main class="min-w-0 flex-1">
      <!-- sticky header: title + the page's action set, all on one control scale -->
      <header class="bp-header px-4 pb-4 pt-5 sm:px-6 lg:px-8 xl:px-10">
        <div class="flex flex-wrap items-start justify-between gap-x-4 gap-y-3">
          <div class="min-w-0">
            <h1 class="bp-ink-1 truncate text-[22px] font-semibold leading-tight sm:text-[24px]">
              {{ heading.title }}
            </h1>
            <p class="bp-ink-2 pt-1 text-[13px] leading-4">{{ heading.sub }}</p>
          </div>
          <div class="flex shrink-0 items-center gap-2">
            <!-- skin switcher — inline glyphs: the curated icon set has no
                 sun/moon/contrast marks, and adding three icons to a shared
                 package for one demo page would be the wrong trade -->
            <div class="bp-segment" role="group" aria-label="Colour skin">
              <button
                v-for="s in SKINS"
                :key="s.key"
                type="button"
                class="bp-segment-btn bp-focus"
                :data-active="skin === s.key ? 'true' : 'false'"
                :aria-pressed="skin === s.key"
                :title="s.label"
                @click="skin = s.key"
              >
                <svg
                  v-if="s.key === 'light'"
                  width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                </svg>
                <svg
                  v-else-if="s.key === 'dark'"
                  width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"
                >
                  <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
                </svg>
                <svg
                  v-else
                  width="15" height="15" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" stroke-width="2" aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 3a9 9 0 0 1 0 18Z" fill="currentColor" stroke="none" />
                </svg>
                <span class="sr-only">{{ s.label }}</span>
              </button>
            </div>
            <button type="button" class="bp-cta bp-focus">
              <Icon name="arrow-up-right-from-square" size="sm" />
              <span class="hidden sm:inline">Export</span>
            </button>
            <button type="button" class="bp-pill bp-focus">
              <Icon name="plus" size="sm" />
              Add vehicle
            </button>
          </div>
        </div>

        <!-- rail replacement below lg -->
        <nav class="bp-topbar mt-3" aria-label="Main">
          <button
            v-for="item in NAV_MAIN"
            :key="item.key"
            type="button"
            class="bp-nav-item bp-focus"
            :data-active="view === item.key ? 'true' : 'false'"
            :aria-current="view === item.key ? 'page' : undefined"
            @click="go(item.key)"
          >
            <Icon class="bp-nav-ico" :name="item.icon" size="sm" />
            <span class="text-[13px] font-medium">{{ item.label }}</span>
          </button>
        </nav>
      </header>

      <!-- pb-28 clears the demo Shell's floating page switcher -->
      <div class="px-4 pb-28 pt-6 sm:px-6 lg:px-8 xl:px-10">
        <!-- keyed so each view replays the `rise` entrance -->
        <component :is="VIEWS[view]" :key="view" />
      </div>
    </main>
  </div>
</template>
