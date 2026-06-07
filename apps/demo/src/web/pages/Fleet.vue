/* Hallmark · macrostructure: Swiss-Minimal · tone: clean-professional · anchor: white+blue-accent */
<script setup lang="ts">
import { inject } from 'vue';
import { Button } from '@auxiliary/vue';
import { Icon, type IconName } from '@auxiliary/icons';
import WebHero from '../WebHero.vue';

const navigate = inject<(p: string) => void>('navigate', () => {});

const kpis: { label: string; value: string; delta: string; up: boolean }[] = [
  { label: 'Active vehicles', value: '142', delta: '+8 today', up: true },
  { label: 'Missions in flight', value: '37', delta: '+12%', up: true },
  { label: 'Avg. uptime', value: '99.2%', delta: '+0.4pt', up: true },
  { label: 'Open incidents', value: '3', delta: '−2', up: false },
];

type Status = 'nominal' | 'caution' | 'alarm';
const fleet: { id: string; model: string; mission: string; battery: number; alt: string; status: Status }[] = [
  { id: 'UAV-001', model: 'Skynode', mission: 'Perimeter sweep', battery: 86, alt: '124 m', status: 'nominal' },
  { id: 'UAV-002', model: 'Skynode S', mission: 'Pipeline inspect', battery: 71, alt: '88 m', status: 'nominal' },
  { id: 'UAV-003', model: 'Skynode X', mission: 'Search grid B', battery: 24, alt: '210 m', status: 'caution' },
  { id: 'UGV-001', model: 'Skynode', mission: 'Convoy escort', battery: 60, alt: '—', status: 'nominal' },
  { id: 'UAV-004', model: 'Skynode', mission: 'Relay hold', battery: 9, alt: '156 m', status: 'alarm' },
];

const statusToken: Record<Status, string> = {
  nominal: 'var(--nominal)',
  caution: 'var(--caution)',
  alarm: 'var(--alarm)',
};
const statusLabel: Record<Status, string> = { nominal: 'Nominal', caution: 'Caution', alarm: 'Alarm' };

const features: { name: string; icon: IconName; desc: string }[] = [
  { name: 'Live fleet map', icon: 'drone', desc: 'Every vehicle, payload and mission on one map — streamed in real time from the edge.' },
  { name: 'Mission replay', icon: 'bars', desc: 'Scrub any past flight with full telemetry, video and event timeline for review and audit.' },
  { name: 'Fleet analytics', icon: 'gear', desc: 'Utilisation, uptime and maintenance trends across your whole fleet, exportable to your stack.' },
];

function batteryColor(b: number): string {
  if (b <= 15) return 'var(--alarm)';
  if (b <= 30) return 'var(--caution)';
  return 'var(--nominal)';
}
</script>

<template>
  <div class="overflow-x-clip" style="background: var(--background)">

    <!-- 1. HERO -->
    <WebHero
      eyebrow="Fleet operations"
      title="Your whole fleet, one pane of glass."
      subtitle="Command live operations, replay missions and track fleet health across every vehicle and team — from the browser."
      primary="Start a trial"
      secondary="Book a demo"
      @primary="navigate('company')"
      @secondary="navigate('company')"
    />

    <!-- 2. DASHBOARD MOCK -->
    <section class="mx-auto max-w-6xl px-6 py-20">
      <div class="overflow-hidden rounded-2xl border border-border shadow-sm" style="background: var(--card)">

        <!-- toolbar -->
        <div class="flex items-center gap-3 border-b border-border px-5 py-3">
          <span class="flex items-center gap-2">
            <span class="h-2 w-2 rounded-full animate-pulse" style="background: var(--nominal)" />
            <span class="font-mono text-[11px] uppercase tracking-[0.12em]" style="color: var(--foreground)">Live operations</span>
          </span>
          <span class="ml-auto font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Region · EU-Central</span>
        </div>

        <!-- KPI row -->
        <div class="grid grid-cols-2 gap-px md:grid-cols-4" style="background: var(--border)">
          <div v-for="k in kpis" :key="k.label" class="px-5 py-6" style="background: var(--card)">
            <p class="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{{ k.label }}</p>
            <p class="mt-2 text-4xl font-medium tabular-nums tracking-tight" style="color: var(--foreground)">{{ k.value }}</p>
            <p
              class="mt-1 font-mono text-[11px] tabular-nums"
              :style="`color: ${k.up ? 'var(--nominal)' : 'var(--muted-foreground)'}`"
            >{{ k.delta }}</p>
          </div>
        </div>

        <!-- fleet table -->
        <div class="overflow-x-auto border-t border-border">
          <table class="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr class="border-b border-border" style="background: var(--muted)">
                <th class="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Vehicle</th>
                <th class="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Module</th>
                <th class="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Mission</th>
                <th class="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Battery</th>
                <th class="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Alt</th>
                <th class="px-5 py-3 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in fleet" :key="row.id" class="border-b border-border last:border-0">
                <td class="px-5 py-3.5 font-mono text-[13px] tabular-nums" style="color: var(--foreground)">{{ row.id }}</td>
                <td class="px-5 py-3.5 text-[13px] text-muted-foreground">{{ row.model }}</td>
                <td class="px-5 py-3.5 text-[13px]" style="color: var(--foreground)">{{ row.mission }}</td>
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-2">
                    <div class="h-1.5 w-16 overflow-hidden rounded-full" style="background: var(--muted)">
                      <div class="h-full rounded-full" :style="`width: ${row.battery}%; background: ${batteryColor(row.battery)}`" />
                    </div>
                    <span class="font-mono text-[12px] tabular-nums text-muted-foreground">{{ row.battery }}%</span>
                  </div>
                </td>
                <td class="px-5 py-3.5 font-mono text-[12px] tabular-nums text-muted-foreground">{{ row.alt }}</td>
                <td class="px-5 py-3.5">
                  <span
                    class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em]"
                    :style="`color: ${statusToken[row.status]}; background: color-mix(in oklab, ${statusToken[row.status]} 14%, transparent)`"
                  >
                    <span class="h-1.5 w-1.5 rounded-full" :style="`background: ${statusToken[row.status]}`" />
                    {{ statusLabel[row.status] }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p class="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground/60">
        Representative interface · Auterion Suite
      </p>
    </section>

    <!-- 3. FEATURES -->
    <section class="border-t border-border" style="background: var(--card)">
      <div class="mx-auto max-w-6xl px-6 py-24">
        <div class="mb-12 max-w-2xl">
          <p class="font-mono text-[11px] uppercase tracking-[0.12em]" style="color: var(--brand)">Built for operators</p>
          <h2 class="mt-3 text-4xl font-medium" style="color: var(--foreground)">
            From a single drone to a <span style="color: var(--brand)">fleet of thousands.</span>
          </h2>
        </div>
        <div class="grid gap-5 md:grid-cols-3">
          <div
            v-for="f in features"
            :key="f.name"
            class="rounded-xl border border-border p-7 transition-shadow hover:shadow-md"
            style="background: var(--background)"
          >
            <div
              class="mb-5 flex h-11 w-11 items-center justify-center rounded-lg"
              style="background: color-mix(in oklab, var(--brand) 12%, var(--card))"
            >
              <Icon :name="f.icon" size="sm" style="color: var(--brand)" />
            </div>
            <h3 class="text-[18px] font-medium" style="color: var(--foreground)">{{ f.name }}</h3>
            <p class="mt-2.5 text-[14px] leading-relaxed text-muted-foreground">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. CTA -->
    <section class="border-t border-border" style="background: var(--background)">
      <div class="mx-auto max-w-2xl px-6 py-24 text-center">
        <p class="font-mono text-[11px] uppercase tracking-[0.12em]" style="color: var(--brand)">Get started</p>
        <h2 class="mt-3 text-4xl font-medium" style="color: var(--foreground)">
          See your fleet in Auterion Suite.
        </h2>
        <p class="mx-auto mt-4 max-w-md text-[16px] leading-relaxed text-muted-foreground">
          Connect your first vehicle in minutes. No rip-and-replace — Suite works with the hardware you already fly.
        </p>
        <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            class="cta-btn inline-flex items-center gap-2 rounded-lg px-6 py-3 text-[14px] font-medium"
            style="background: var(--brand); color: var(--brand-foreground)"
            @click="navigate('company')"
          >
            Start a trial
            <Icon name="arrow-right" size="xs" />
          </button>
          <Button variant="ghost" size="md" class="gap-2 text-[14px]" @click="navigate('products')">
            Explore products
          </Button>
        </div>
      </div>
    </section>

  </div>
</template>

<style scoped>
.cta-btn:hover {
  background: color-mix(in oklab, var(--brand) 88%, black) !important;
}

.cta-btn:focus-visible {
  outline: 2px solid var(--brand);
  outline-offset: 2px;
}
</style>
