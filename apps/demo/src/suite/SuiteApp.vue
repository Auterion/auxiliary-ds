<script setup lang="ts">
import { computed, ref } from 'vue';
import { StatusBadge, TelemetryValue, Avatar, AvatarFallback, Badge, Progress } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';
import Sparkline from './Sparkline.vue';
import Overview from './Overview.vue';
import Settings from './Settings.vue';
import Operations from './Operations.vue';
import Teams from './Teams.vue';
import Alerts from './Alerts.vue';
import { VEHICLES, NAV, FLEET_SUMMARY, type Vehicle } from './data';

type Level = 'alarm' | 'warning' | 'caution' | 'advisory' | 'nominal';

// One attribute drives both layers: [data-theme] re-resolves the DS semantic
// tokens (Card, StatusBadge, Progress) and the --dk-* palette together, so they
// cannot drift apart. Never a second mode attribute.
const theme = ref<'dark' | 'light'>('dark');
const register = ref<'operational' | 'expressive'>('operational');

// Brand-accent identity — orthogonal to theme/register. It governs the DS
// components' brand fill, which is the only blue this surface does not author
// itself. Default is `mono` (brand aliased to the foreground) so the shipped
// view spends its signal budget exactly once, on the rail's identity plate;
// `ultramarine` is an explicit opt-in that resolves through the deck's own
// signal step, so even then no hue enters that isn't already in the ladder.
const accent = ref<'ultramarine' | 'mono'>('mono');
const accentVars = computed(() =>
  accent.value === 'mono'
    ? '--brand: var(--dk-fg); --brand-foreground: var(--dk-bg); --ring: var(--dk-fg)'
    : '--brand: var(--dk-signal); --brand-foreground: var(--dk-on-signal); --ring: var(--dk-signal)',
);
const activeNav = ref('overview');
const selectedId = ref('1');
const search = ref('');

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase();
  if (!q) return VEHICLES;
  return VEHICLES.filter((v) =>
    [v.callsign, v.model, v.site.name, v.team, v.status.label].some((s) => s.toLowerCase().includes(q)),
  );
});
const selected = computed<Vehicle>(() => VEHICLES.find((v) => v.id === selectedId.value) ?? VEHICLES[0]!);

// Ledger-table column widths. `.dk-table` is `table-layout: fixed`, so these
// are declared once, in one place, and hold identically in every block that
// reuses them — an empty string means "take what is left" (the callsign).
const COL_W = ['28px', '', '120px', '100px', '76px', '120px', '80px'];

/** Battery level → the reserved operational severity ladder. */
function batteryLevel(pct: number): Level {
  if (pct < 20) return 'alarm';
  if (pct < 35) return 'warning';
  if (pct < 55) return 'caution';
  return 'nominal';
}
function batteryColor(pct: number): string {
  return `var(--${batteryLevel(pct)})`;
}
function rssiLabel(rssi: number | null): string {
  return rssi === null ? '—' : `${rssi} dBm`;
}

// Detail-panel fields, pointer-labelled. Values hard right, numerals tabular.
const assignment = computed(() => [
  { label: 'MODEL', value: selected.value.model },
  { label: 'FIRMWARE', value: selected.value.firmware },
  { label: 'TEAM', value: selected.value.team },
  { label: 'SITE', value: `${selected.value.site.flag} ${selected.value.site.name}` },
  { label: 'COMMISSIONED', value: selected.value.commissioned },
  { label: 'SERIAL', value: selected.value.serial },
]);

const metrics = computed(() => [
  {
    label: 'BATTERY', value: selected.value.battery, unit: '%', precision: undefined,
    data: selected.value.metrics.battery, variant: 'line' as const,
    stroke: batteryColor(selected.value.battery),
  },
  {
    label: 'LINK RSSI', value: selected.value.rssi ?? 0, unit: 'dBm', precision: undefined,
    data: selected.value.metrics.rssi, variant: 'line' as const, stroke: 'var(--dk-fg-2)',
  },
  {
    label: 'CPU USAGE', value: selected.value.cpu, unit: '%', precision: undefined,
    data: selected.value.metrics.cpu, variant: 'bar' as const, stroke: 'var(--dk-fg-2)',
  },
  {
    label: 'REQUESTS', value: 24, unit: '/s', precision: 0,
    data: selected.value.metrics.requests, variant: 'bar' as const, stroke: 'var(--dk-fg-2)',
  },
]);
</script>

<template>
  <div
    :data-theme="theme"
    :data-register="register"
    :style="accentVars"
    class="dk flex h-dvh w-full overflow-hidden"
  >
    <!-- ╭─ Console rail ──────────────────────────────────────────╮ -->
    <aside class="ix-hair-r flex w-60 shrink-0 flex-col">
      <!-- Identity — the ONE signal plate this view is allowed. -->
      <div class="ix-hair-b flex items-center gap-2.5 px-4 py-3.5">
        <span class="dk-plate-signal flex h-8 w-8 shrink-0 items-center justify-center">
          <Icon name="drone" size="sm" />
        </span>
        <span class="flex min-w-0 flex-col gap-0.5">
          <span class="dk-value truncate">Auterion Suite</span>
          <span class="dk-label">FLEET CONSOLE</span>
        </span>
      </div>

      <!-- Search command well -->
      <div class="px-3 pt-3">
        <button type="button" class="dk-cta w-full">
          <Icon name="magnifying-glass" size="xs" class="ix-ink-3" />
          <span class="flex-1 text-left">Search</span>
          <kbd class="ix-kbd">K</kbd>
        </button>
      </div>

      <!-- Nav group -->
      <nav class="flex flex-1 flex-col gap-0.5 px-3 pt-5">
        <span class="dk-label px-2.5 pb-2">FLEET OPS</span>
        <button
          v-for="item in NAV"
          :key="item.key"
          type="button"
          class="dk-nav-item"
          :data-active="activeNav === item.key"
          :aria-label="item.label"
          :aria-current="activeNav === item.key ? 'page' : undefined"
          @click="activeNav = item.key"
        >
          <Icon :name="item.icon" size="sm" />
          <span class="truncate text-[13px]">{{ item.label }}</span>
        </button>
      </nav>

      <!-- System status block -->
      <div class="ix-hair-t px-3 py-3">
        <div class="dk-card px-3 py-2.5">
          <div class="flex items-center justify-between gap-2">
            <span class="flex items-center gap-1.5">
              <span class="dk-dot dk-dot-nominal" />
              <span class="dk-label">LINK NOMINAL</span>
            </span>
            <span class="dk-label dk-num">12 MS</span>
          </div>
          <div class="mt-2 flex items-center justify-between gap-2">
            <span class="dk-label">BUILD</span>
            <span class="dk-label dk-num">V4.2.1·9F3A</span>
          </div>
        </div>

        <div class="mt-3 flex items-center gap-2.5 px-1">
          <Avatar size="sm">
            <AvatarFallback>OV</AvatarFallback>
          </Avatar>
          <span class="flex min-w-0 flex-col">
            <span class="dk-value truncate">Oz Vahid</span>
            <span class="dk-label truncate">FLIGHT OPERATIONS</span>
          </span>
          <Icon name="ellipsis" size="xs" class="ix-ink-3 ml-auto" />
        </div>
      </div>
    </aside>

    <!-- ╭─ Main column ───────────────────────────────────────────╮ -->
    <Overview v-if="activeNav === 'overview'" v-model:theme="theme" />
    <Settings v-else-if="activeNav === 'settings'" v-model:theme="theme" />
    <Operations v-else-if="activeNav === 'operations'" v-model:theme="theme" />
    <Teams v-else-if="activeNav === 'teams'" v-model:theme="theme" />
    <Alerts v-else-if="activeNav === 'alerts'" v-model:theme="theme" />
    <div v-else class="flex min-w-0 flex-1 flex-col">
      <!-- Topbar -->
      <header class="ix-hair-b flex h-14 shrink-0 items-center gap-3 px-4">
        <Icon name="drone" size="sm" class="ix-ink-3" />
        <span class="dk-label">SUITE / FLEET</span>

        <div class="ml-auto flex items-center gap-2">
          <label class="dk-cta">
            <Icon name="magnifying-glass" size="xs" class="ix-ink-3" />
            <input v-model="search" class="ix-input w-36" placeholder="Search fleet…" />
          </label>

          <!-- brand-accent quick toggle (mono vs ultramarine) -->
          <div class="hidden md:block">
            <div class="dk-segment">
              <button
                type="button"
                class="dk-segment-btn"
                :data-active="accent === 'mono'"
                @click="accent = 'mono'"
              >
                Mono
              </button>
              <button
                type="button"
                class="dk-segment-btn"
                :data-active="accent === 'ultramarine'"
                @click="accent = 'ultramarine'"
              >
                Ultra
              </button>
            </div>
          </div>

          <!-- theme quick toggle -->
          <div class="dk-segment">
            <button
              v-for="t in (['dark', 'light'] as const)"
              :key="t"
              type="button"
              class="dk-segment-btn"
              :data-active="theme === t"
              @click="theme = t"
            >
              {{ t }}
            </button>
          </div>

          <button type="button" class="dk-cta-solid">
            <Icon name="plus" size="xs" />
            New vehicle
            <kbd class="ix-kbd">N</kbd>
          </button>
        </div>
      </header>

      <!-- Body -->
      <div class="flex min-h-0 flex-1 flex-col gap-4 p-4">
        <!-- Case header: display title + the header ledger that tops it. -->
        <div class="shrink-0">
          <div class="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
            <div class="min-w-0">
              <h1 class="dk-h1">Fleet</h1>
              <p class="dk-body dk-ghost">Every airframe on the books, reported live.</p>
            </div>
            <span class="dk-bracket">
              {{ FLEET_SUMMARY.total }} UNITS · {{ FLEET_SUMMARY.flying }} FLYING ·
              {{ FLEET_SUMMARY.attention }} ATTN
            </span>
          </div>

          <div class="dk-ledger mt-3" style="--dk-ledger-cols: 4">
            <div class="dk-ledger-cell">
              <span class="dk-label">FLEET</span>
              <span class="dk-value dk-num">{{ FLEET_SUMMARY.total }} units</span>
            </div>
            <div class="dk-ledger-cell">
              <span class="dk-label">IN FLIGHT</span>
              <span class="dk-value dk-num">{{ FLEET_SUMMARY.flying }} airborne</span>
            </div>
            <div class="dk-ledger-cell">
              <span class="dk-label">NEEDS ATTENTION</span>
              <span class="dk-value dk-num">{{ FLEET_SUMMARY.attention }} units</span>
            </div>
            <div class="dk-ledger-cell" data-align="end">
              <span class="dk-label">SHOWN</span>
              <span class="dk-value dk-num">{{ filtered.length }} / {{ FLEET_SUMMARY.total }}</span>
            </div>
          </div>
        </div>

        <!-- Roster + unit detail -->
        <div class="flex min-h-0 flex-1 gap-4">
          <!-- Ledger table -->
          <section class="dk-card flex min-w-0 flex-1 flex-col overflow-hidden">
            <div class="dk-section shrink-0 px-4 pt-3.5">
              <span class="dk-label">FLEET ROSTER</span>
              <span class="dk-bracket">{{ filtered.length }} UNITS</span>
            </div>

            <div class="min-h-0 flex-1 overflow-auto px-4">
              <table class="dk-table">
                <colgroup>
                  <col v-for="(w, i) in COL_W" :key="i" :style="w ? { width: w } : undefined" />
                </colgroup>
                <thead>
                  <tr class="ix-sticky">
                    <th scope="col" data-align="end"><span class="dk-pointer">#</span></th>
                    <th scope="col"><span class="dk-pointer">CALLSIGN</span></th>
                    <th scope="col"><span class="dk-pointer">STATUS</span></th>
                    <th scope="col" data-align="end"><span class="dk-pointer">BATTERY</span></th>
                    <th scope="col" data-align="end"><span class="dk-pointer">LINK</span></th>
                    <th scope="col"><span class="dk-pointer">SITE</span></th>
                    <th scope="col" data-align="end"><span class="dk-pointer">LAST SEEN</span></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="v in filtered"
                    :key="v.id"
                    class="ix-tr"
                    :data-selected="selectedId === v.id"
                    @click="selectedId = v.id"
                  >
                    <td class="ix-ink-3" data-align="end">
                      <span class="dk-num">{{ v.id }}</span>
                    </td>
                    <td data-lead="true">
                      <button
                        type="button"
                        class="block w-full truncate text-left"
                        :aria-pressed="selectedId === v.id"
                        @click.stop="selectedId = v.id"
                      >
                        {{ v.callsign }}
                      </button>
                      <span class="dk-small block truncate font-normal">
                        {{ v.model }} · {{ v.type }}
                      </span>
                    </td>
                    <td>
                      <StatusBadge :level="v.status.level" size="sm" dot>{{ v.status.label }}</StatusBadge>
                    </td>
                    <td data-align="end">
                      <span class="flex items-center justify-end gap-2">
                        <Progress :value="v.battery" :level="batteryLevel(v.battery)" class="h-0.5 w-8" />
                        <span class="dk-num">{{ v.battery }}%</span>
                      </span>
                    </td>
                    <td :class="v.rssi === null || v.rssi < -90 ? 'dk-ink-alarm' : ''" data-align="end">
                      <span class="dk-num">{{ rssiLabel(v.rssi) }}</span>
                    </td>
                    <td>
                      <span class="flex min-w-0 items-center gap-1.5">
                        <span class="leading-none">{{ v.site.flag }}</span>
                        <span class="truncate">{{ v.site.name }}</span>
                      </span>
                    </td>
                    <td data-align="end">
                      <span class="flex items-center justify-end gap-1.5">
                        <span v-if="v.live" class="dk-dot dk-dot-advisory" />
                        <span class="dk-num">{{ v.lastSeen }}</span>
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <!-- Unit detail -->
          <aside class="dk-card flex w-[344px] shrink-0 flex-col overflow-auto">
            <div class="dk-section px-4 pt-3.5">
              <span class="dk-label">UNIT DETAIL</span>
              <span class="dk-label dk-num">#{{ selected.id }}</span>
            </div>

            <!-- identity -->
            <div class="flex items-start gap-3 px-4 py-4">
              <span class="dk-inset flex h-11 w-11 shrink-0 items-center justify-center">
                <Icon name="drone" size="md" />
              </span>
              <div class="min-w-0 flex-1">
                <div class="flex items-center gap-2">
                  <span class="dk-h2 truncate">{{ selected.callsign }}</span>
                  <Badge variant="outline" size="sm">+2</Badge>
                </div>
                <span class="dk-label dk-num">{{ selected.serial }}</span>
              </div>
              <span v-if="selected.live" class="flex shrink-0 items-center gap-1.5 pt-1.5">
                <span class="dk-dot dk-dot-advisory" />
                <span class="dk-label">LIVE</span>
              </span>
            </div>

            <!-- status -->
            <div class="flex flex-wrap items-center gap-2 px-4 pb-4">
              <StatusBadge :level="selected.status.level" size="sm" dot>{{ selected.status.label }}</StatusBadge>
              <StatusBadge :level="selected.battery >= 35 ? 'nominal' : 'warning'" variant="outline" size="sm">
                {{ selected.battery >= 35 ? 'Healthy' : 'Battery low' }}
              </StatusBadge>
              <span class="ml-auto flex items-center gap-1.5">
                <Avatar size="sm"><AvatarFallback>{{ selected.operator.initials }}</AvatarFallback></Avatar>
                <span class="dk-small">{{ selected.operator.name }}</span>
              </span>
            </div>

            <!-- assignment: pointer-labelled fields, values hard right -->
            <div class="px-4 pb-4">
              <div class="dk-section mb-1">
                <span class="dk-label">ASSIGNMENT</span>
              </div>
              <dl class="dk-divide">
                <div
                  v-for="row in assignment"
                  :key="row.label"
                  class="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4 py-2.5"
                >
                  <dt class="dk-pointer">{{ row.label }}</dt>
                  <dd class="dk-value dk-num truncate text-right">{{ row.value }}</dd>
                </div>
              </dl>
            </div>

            <hr class="dk-rule mx-4" />

            <!-- runtime metrics -->
            <div class="px-4 py-4">
              <div class="dk-section mb-3">
                <span class="dk-label">RUNTIME METRICS</span>
                <span class="dk-bracket">48 PT</span>
              </div>

              <div class="space-y-4">
                <div v-for="m in metrics" :key="m.label">
                  <div class="mb-1.5 flex items-baseline justify-between gap-2">
                    <span class="dk-label">{{ m.label }}</span>
                    <TelemetryValue :value="m.value" :unit="m.unit" :precision="m.precision" size="md" />
                  </div>
                  <div class="ix-grid">
                    <Sparkline :data="m.data" :variant="m.variant" :stroke="m.stroke" :height="40" />
                  </div>
                </div>
              </div>
            </div>

            <hr class="dk-rule mx-4" />

            <!-- zones -->
            <div class="px-4 py-4">
              <div class="dk-section mb-3">
                <span class="dk-label">AVAILABILITY ZONES</span>
              </div>
              <div class="flex flex-wrap gap-1.5">
                <span class="dk-inset flex items-center gap-1.5 px-2 py-1">
                  <span class="leading-none">{{ selected.site.flag }}</span>
                  <span class="dk-label dk-num">{{ selected.site.code }}</span>
                </span>
                <span class="dk-inset flex items-center px-2 py-1">
                  <span class="dk-label dk-num">+{{ selected.zones }} ZONES</span>
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  </div>
</template>
