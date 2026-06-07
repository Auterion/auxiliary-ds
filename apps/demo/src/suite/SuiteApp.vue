<script setup lang="ts">
import { computed, ref } from 'vue';
import { StatusBadge, TelemetryValue, Avatar, AvatarFallback, Badge, Button } from '@auxiliary/vue';
import { Icon, type IconName } from '@auxiliary/icons';
import Sparkline from './Sparkline.vue';
import Overview from './Overview.vue';
import Settings from './Settings.vue';
import Operations from './Operations.vue';
import Teams from './Teams.vue';
import Alerts from './Alerts.vue';
import { VEHICLES, NAV, FLEET_SUMMARY, type Vehicle } from './data';

const theme = ref<'dark' | 'light'>('dark');
const register = ref<'operational' | 'expressive'>('operational');
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

// 8-column table grid, shared by header + rows.
const COLS = '44px minmax(180px,1.6fr) 92px 136px 132px 104px minmax(116px,1fr) 104px';

/** Battery level → semantic color var. */
function batteryColor(pct: number): string {
  if (pct < 20) return 'var(--alarm)';
  if (pct < 35) return 'var(--warning)';
  if (pct < 55) return 'var(--caution)';
  return 'var(--nominal)';
}
function rssiLabel(rssi: number | null): string {
  return rssi === null ? '—' : `${rssi} dBm`;
}
</script>

<template>
  <div
    :data-theme="theme"
    :data-register="register"
    class="suite-root flex h-dvh w-full overflow-hidden bg-background text-foreground"
  >
    <!-- ╭─ Console rail ──────────────────────────────────────────╮ -->
    <aside class="flex w-60 shrink-0 flex-col border-r border-border bg-card">
      <!-- System mark + org -->
      <div class="flex items-center gap-2.5 border-b border-border px-4 py-3.5">
        <div
          class="flex h-8 w-8 items-center justify-center rounded-lg"
          style="background: linear-gradient(140deg, var(--brand), color-mix(in oklab, var(--brand) 60%, black)); color: var(--brand-foreground)"
        >
          <Icon name="drone" size="sm" />
        </div>
        <div class="flex min-w-0 flex-col">
          <span class="truncate text-[13px] font-semibold tracking-tight leading-tight">Auterion Suite</span>
          <span class="ix-label-sm">FLEET CONSOLE</span>
        </div>
      </div>

      <!-- Search command pill -->
      <div class="px-3 pt-3">
        <button
          type="button"
          class="flex w-full items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5 text-[13px] text-muted-foreground transition-colors hover:bg-secondary"
        >
          <Icon name="magnifying-glass" size="xs" />
          <span class="flex-1 text-left">Search</span>
          <kbd class="ix-kbd">K</kbd>
        </button>
      </div>

      <!-- Nav group -->
      <nav class="flex flex-1 flex-col gap-0.5 px-3 pt-4">
        <span class="ix-label px-2 pb-1.5">FLEET OPS</span>
        <button
          v-for="item in NAV"
          :key="item.key"
          type="button"
          class="ix-edge group relative flex h-9 items-center gap-2.5 rounded-lg pl-2.5 pr-2 text-[13px] transition-colors"
          :class="
            activeNav === item.key
              ? 'ix-active bg-secondary font-medium text-foreground'
              : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
          "
          :aria-label="item.label"
          :aria-current="activeNav === item.key ? 'page' : undefined"
          @click="activeNav = item.key"
        >
          <Icon
            :name="item.icon"
            size="sm"
            :class="activeNav === item.key ? 'text-[var(--brand)]' : ''"
          />
          <span class="truncate">{{ item.label }}</span>
        </button>
      </nav>

      <!-- System status block -->
      <div class="border-t border-border px-3 py-3">
        <div class="rounded-lg border border-border bg-card px-3 py-2.5">
          <div class="flex items-center justify-between">
            <span class="flex items-center gap-1.5">
              <span class="ix-live h-1.5 w-1.5 rounded-full" style="background: var(--nominal)" />
              <span class="ix-label">LINK NOMINAL</span>
            </span>
            <span class="font-mono text-[11px] tabular-nums text-muted-foreground">12 ms</span>
          </div>
          <div class="mt-1.5 flex items-center justify-between">
            <span class="ix-label-sm">BUILD</span>
            <span class="font-mono text-[11px] tabular-nums text-muted-foreground">v4.2.1·9f3a</span>
          </div>
        </div>

        <div class="mt-2.5 flex items-center gap-2.5 px-1">
          <Avatar size="sm">
            <AvatarFallback>OV</AvatarFallback>
          </Avatar>
          <div class="flex min-w-0 flex-col">
            <span class="truncate text-[13px] font-medium leading-tight">Oz Vahid</span>
            <span class="truncate text-[11px] text-muted-foreground">Flight operations</span>
          </div>
          <Icon name="ellipsis" size="xs" class="ml-auto text-muted-foreground" />
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
      <header
        class="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur"
      >
        <Icon name="drone" size="sm" class="text-muted-foreground" />
        <span class="ix-label">SUITE</span>
        <span class="text-muted-foreground/40">/</span>
        <h1 class="text-[14px] font-medium tracking-tight">Fleet</h1>

        <div class="mx-1 h-5 w-px bg-border" />

        <button
          type="button"
          class="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-[13px] text-foreground transition-colors hover:bg-secondary"
        >
          <Icon name="bars" size="xs" class="text-muted-foreground" />
          All vehicles
          <Icon name="chevron-down" size="xs" class="text-muted-foreground" />
        </button>
        <span class="font-mono text-[12px] tabular-nums text-muted-foreground">{{ filtered.length }}<span class="text-muted-foreground/50">/{{ FLEET_SUMMARY.total }}</span></span>

        <div class="ml-auto flex items-center gap-2">
          <span class="ix-label hidden lg:inline">
            {{ FLEET_SUMMARY.flying }} FLYING · {{ FLEET_SUMMARY.attention }} ATTN
          </span>

          <label class="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5">
            <Icon name="magnifying-glass" size="xs" class="text-muted-foreground" />
            <input
              v-model="search"
              placeholder="Search fleet…"
              class="w-36 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground"
            />
          </label>

          <!-- theme quick toggle -->
          <div class="flex items-center gap-0.5 rounded-lg border border-border bg-card p-0.5">
            <button
              type="button"
              class="rounded-md px-2 py-1 text-[12px] transition-colors"
              :class="theme === 'dark' ? 'bg-secondary text-foreground' : 'text-muted-foreground'"
              @click="theme = 'dark'"
            >
              Dark
            </button>
            <button
              type="button"
              class="rounded-md px-2 py-1 text-[12px] transition-colors"
              :class="theme === 'light' ? 'bg-secondary text-foreground' : 'text-muted-foreground'"
              @click="theme = 'light'"
            >
              Light
            </button>
          </div>

          <Button size="sm" class="gap-2">
            <Icon name="plus" size="xs" />
            New vehicle
            <kbd class="ix-kbd">N</kbd>
          </Button>
        </div>
      </header>

      <!-- Body: table + detail -->
      <div class="flex min-h-0 flex-1 gap-4 p-4">
        <!-- Table -->
        <section class="ix-panel flex min-w-0 flex-1 flex-col overflow-hidden">
          <div class="ix-head shrink-0 px-4 pt-3.5">
            <span class="ix-label">FLEET ROSTER</span>
            <span class="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">{{ filtered.length }} UNITS</span>
          </div>

          <div class="min-h-0 flex-1 overflow-auto">
          <!-- Column header -->
          <div
            class="sticky top-0 z-10 grid items-center gap-3 border-b border-border bg-card/95 px-4 py-2.5 backdrop-blur"
            :style="{ gridTemplateColumns: COLS }"
          >
            <span class="ix-label text-right">#</span>
            <span class="ix-label">CALLSIGN</span>
            <span class="ix-label">TYPE</span>
            <span class="ix-label">STATUS</span>
            <span class="ix-label">BATTERY</span>
            <span class="ix-label">LINK</span>
            <span class="ix-label">SITE</span>
            <span class="ix-label text-right">LAST SEEN</span>
          </div>

          <!-- Rows -->
          <button
            v-for="v in filtered"
            :key="v.id"
            type="button"
            class="ix-edge ix-lift group relative grid items-center gap-3 border-b border-border/60 px-4 py-2.5 text-left hover:bg-secondary/40"
            :class="selectedId === v.id ? 'ix-active bg-secondary/70' : ''"
            :style="{ gridTemplateColumns: COLS }"
            @click="selectedId = v.id"
          >
            <span class="text-right font-mono text-[13px] tabular-nums text-muted-foreground">{{ v.id }}</span>

            <span class="flex min-w-0 flex-col">
              <span class="truncate text-[14px] font-medium text-foreground">{{ v.callsign }}</span>
              <span class="truncate text-[12px] text-muted-foreground">{{ v.model }}</span>
            </span>

            <Badge variant="secondary" size="sm" class="justify-self-start">{{ v.type }}</Badge>

            <StatusBadge :level="v.status.level" size="sm" dot>{{ v.status.label }}</StatusBadge>

            <span class="flex items-center gap-2">
              <span class="h-1.5 w-12 overflow-hidden rounded-full bg-border">
                <span class="block h-full rounded-full" :style="{ width: `${v.battery}%`, background: batteryColor(v.battery) }" />
              </span>
              <span class="font-mono text-[13px] tabular-nums text-foreground">{{ v.battery }}%</span>
            </span>

            <span class="font-mono text-[13px] tabular-nums" :class="v.rssi === null || v.rssi < -90 ? 'text-[var(--alarm)]' : 'text-muted-foreground'">
              {{ rssiLabel(v.rssi) }}
            </span>

            <span class="flex min-w-0 items-center gap-1.5">
              <span class="text-[14px] leading-none">{{ v.site.flag }}</span>
              <span class="truncate text-[13px] text-foreground">{{ v.site.name }}</span>
            </span>

            <span class="flex items-center justify-end gap-1.5">
              <span v-if="v.live" class="h-1.5 w-1.5 rounded-full" style="background: var(--advisory)" />
              <span class="font-mono text-[12px] tabular-nums text-muted-foreground">{{ v.lastSeen }}</span>
            </span>

            <!-- hover toolbar -->
            <span
              class="pointer-events-none absolute right-3 top-1/2 z-10 flex -translate-y-1/2 items-center gap-1 opacity-0 transition-opacity group-hover:pointer-events-auto group-hover:opacity-100"
            >
              <span class="flex items-center gap-1 rounded-lg border border-border bg-card p-0.5 shadow-lg">
                <span class="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground">
                  <Icon name="eye" size="xs" />
                </span>
                <span class="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground">
                  <Icon name="magnifying-glass" size="xs" />
                </span>
                <span class="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground">
                  <Icon name="ellipsis" size="xs" />
                </span>
              </span>
            </span>
          </button>
          </div>
        </section>

        <!-- Detail panel -->
        <aside class="ix-panel flex w-[368px] shrink-0 flex-col overflow-auto">
          <div class="ix-head px-4 pt-3.5">
            <span class="ix-label">UNIT DETAIL</span>
            <span class="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">#{{ selected.id }}</span>
          </div>

          <!-- identity -->
          <div class="flex items-start gap-3 px-4 pb-4 pt-4">
            <div class="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-secondary text-foreground">
              <Icon name="drone" size="md" />
            </div>
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-2">
                <span class="truncate text-[16px] font-semibold tracking-tight">{{ selected.callsign }}</span>
                <Badge variant="outline" size="sm">+2</Badge>
              </div>
              <span class="font-mono text-[12px] tabular-nums text-muted-foreground">{{ selected.serial }}</span>
            </div>
            <span v-if="selected.live" class="flex items-center gap-1.5 rounded-full border border-border bg-card px-2 py-0.5">
              <span class="ix-live h-1.5 w-1.5 rounded-full" style="background: var(--advisory)" />
              <span class="ix-label-sm">LIVE</span>
            </span>
          </div>

          <!-- status pills -->
          <div class="flex flex-wrap items-center gap-2 px-4 pb-4">
            <StatusBadge :level="selected.status.level" size="sm" dot>{{ selected.status.label }}</StatusBadge>
            <StatusBadge :level="selected.battery >= 35 ? 'nominal' : 'warning'" variant="outline" size="sm">
              {{ selected.battery >= 35 ? 'Healthy' : 'Battery low' }}
            </StatusBadge>
            <span class="ml-auto flex items-center gap-1.5 text-[12px] text-muted-foreground">
              <Avatar size="sm"><AvatarFallback>{{ selected.operator.initials }}</AvatarFallback></Avatar>
              {{ selected.operator.name }}
            </span>
          </div>

          <!-- assignment -->
          <div class="px-4 py-4">
            <div class="ix-head mb-3">
              <span class="ix-label">ASSIGNMENT</span>
            </div>
            <dl class="space-y-2.5">
              <div
v-for="row in [
                { icon: 'drone', label: 'Model', value: selected.model },
                { icon: 'arrow-up', label: 'Firmware', value: selected.firmware },
                { icon: 'users', label: 'Team', value: selected.team },
                { icon: 'house', label: 'Site', value: `${selected.site.flag} ${selected.site.name}` },
                { icon: 'circle-info', label: 'Commissioned', value: selected.commissioned },
              ]" :key="row.label" class="grid grid-cols-[20px_92px_1fr] items-center gap-2">
                <Icon :name="(row.icon as IconName)" size="xs" class="text-muted-foreground" />
                <dt class="text-[13px] text-muted-foreground">{{ row.label }}</dt>
                <dd class="truncate text-right text-[13px] font-medium text-foreground">{{ row.value }}</dd>
              </div>
              <div class="grid grid-cols-[20px_92px_1fr] items-center gap-2">
                <Icon name="copy" size="xs" class="text-muted-foreground" />
                <dt class="text-[13px] text-muted-foreground">Serial</dt>
                <dd class="flex items-center justify-end gap-1.5 font-mono text-[13px] text-foreground">
                  {{ selected.serial }}
                  <Icon name="copy" size="xs" class="text-muted-foreground" />
                </dd>
              </div>
            </dl>
          </div>

          <div class="mx-4 border-t border-border" />

          <!-- runtime metrics -->
          <div class="px-4 py-4">
            <div class="ix-head mb-3">
              <span class="ix-label">RUNTIME METRICS</span>
              <span class="ml-auto font-mono text-[11px] tabular-nums text-muted-foreground">48 PT</span>
            </div>

            <div class="space-y-4">
              <div>
                <div class="mb-1 flex items-baseline justify-between">
                  <span class="ix-label">BATTERY</span>
                  <TelemetryValue :value="selected.battery" unit="%" size="md" />
                </div>
                <div class="ix-grid rounded-md">
                  <Sparkline :data="selected.metrics.battery" :stroke="batteryColor(selected.battery)" :height="40" />
                </div>
              </div>

              <div>
                <div class="mb-1 flex items-baseline justify-between">
                  <span class="ix-label">LINK RSSI</span>
                  <TelemetryValue :value="selected.rssi ?? 0" unit="dBm" size="md" />
                </div>
                <div class="ix-grid rounded-md">
                  <Sparkline :data="selected.metrics.rssi" stroke="color-mix(in oklab, var(--foreground) 80%, transparent)" :height="40" />
                </div>
              </div>

              <div>
                <div class="mb-1 flex items-baseline justify-between">
                  <span class="ix-label">CPU USAGE</span>
                  <TelemetryValue :value="selected.cpu" unit="%" size="md" />
                </div>
                <div class="ix-grid rounded-md">
                  <Sparkline :data="selected.metrics.cpu" variant="bar" stroke="color-mix(in oklab, var(--foreground) 80%, transparent)" :height="40" />
                </div>
              </div>

              <div>
                <div class="mb-1 flex items-baseline justify-between">
                  <span class="ix-label">REQUESTS</span>
                  <TelemetryValue :value="24" unit="/s" :precision="0" size="md" />
                </div>
                <div class="ix-grid rounded-md">
                  <Sparkline :data="selected.metrics.requests" variant="bar" stroke="color-mix(in oklab, var(--foreground) 80%, transparent)" :height="40" />
                </div>
              </div>
            </div>
          </div>

          <div class="mx-4 border-t border-border" />

          <!-- zones -->
          <div class="px-4 py-4">
            <div class="ix-head mb-3">
              <span class="ix-label">AVAILABILITY ZONES</span>
            </div>
            <div class="flex flex-wrap gap-1.5">
              <span class="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2 py-1 text-[12px]">
                <span class="text-[13px] leading-none">{{ selected.site.flag }}</span>
                {{ selected.site.code }}
              </span>
              <span class="flex items-center rounded-lg border border-border bg-card px-2 py-1 text-[12px] text-muted-foreground">
                +{{ selected.zones }} zones
              </span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<style scoped>
.suite-root {
  background-image: radial-gradient(color-mix(in oklab, var(--foreground) 6%, transparent) 1px, transparent 1px);
  background-size: 22px 22px;
}
</style>
