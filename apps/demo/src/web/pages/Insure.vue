/* Hallmark · macrostructure: Workbench · tone: clean-professional · anchor: white+blue-accent */
<script setup lang="ts">
import { computed, inject } from 'vue';
import { Button } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';
import Sparkline from '../../suite/Sparkline.vue';

const navigate = inject<(p: string) => void>('navigate', () => {});

/* Deterministic pseudo-series so the mocks render identically every load. */
function series(seed: number, n: number, base: number, amp: number): number[] {
  let v = base,
    a = seed;
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    a = (a * 1103515245 + 12345) & 0x7fffffff;
    v = Math.max(1, v + (a / 0x7fffffff - 0.46) * amp);
    out.push(Math.round(v));
  }
  return out;
}

/* ── Status ladder → tokens (the reserved severity ladder) ───────────── */
type Level = 'nominal' | 'caution' | 'warning' | 'alarm';
const token: Record<Level, string> = {
  nominal: 'var(--nominal)',
  caution: 'var(--caution)',
  warning: 'var(--warning)',
  alarm: 'var(--alarm)',
};
const tint = (t: string, pct = 14) => `color-mix(in oklab, ${t} ${pct}%, transparent)`;
/* Risk score 0–100 (higher = worse) → ladder level. */
function riskLevel(score: number): Level {
  if (score >= 70) return 'alarm';
  if (score >= 45) return 'warning';
  if (score >= 25) return 'caution';
  return 'nominal';
}

/* ── Panel 1 · Fleet risk overview ───────────────────────────────────── */
const kpis: { label: string; value: string; delta: string; good: boolean }[] = [
  { label: 'Fleet safety score', value: '94', delta: '+2 pt', good: true },
  { label: 'Insured airframes', value: '142', delta: '+6', good: true },
  { label: 'Open claims', value: '3', delta: '−2', good: true },
  { label: 'Avg premium · /mo', value: '€184', delta: '−6%', good: true },
];

const riskTrend = series(42, 90, 38, 7);

const bands: { label: string; count: number; level: Level }[] = [
  { label: 'Low', count: 86, level: 'nominal' },
  { label: 'Moderate', count: 38, level: 'caution' },
  { label: 'Elevated', count: 13, level: 'warning' },
  { label: 'High', count: 5, level: 'alarm' },
];
const insured = bands.reduce((s, b) => s + b.count, 0);
const donut = computed(() => {
  const R = 54,
    C = 2 * Math.PI * R;
  let offset = 0;
  return bands.map((b) => {
    const frac = b.count / insured;
    const seg = { ...b, dash: frac * C, gap: C - frac * C, off: -offset * C, color: token[b.level] };
    offset += frac;
    return seg;
  });
});

const mini: { label: string; value: string; delta: string; good: boolean; spark: number[]; variant: 'line' | 'bar' }[] = [
  { label: 'Flight hours · 30d', value: '4,820', delta: '+9%', good: true, spark: series(7, 24, 30, 9), variant: 'line' },
  { label: 'Incidents / 1k h', value: '0.7', delta: '−0.2', good: true, spark: series(3, 24, 12, 7), variant: 'line' },
  { label: 'Geofence breaches', value: '5', delta: '−3', good: true, spark: series(11, 16, 8, 6), variant: 'bar' },
];

/* ── Panel 2 · Incidents & claims ────────────────────────────────────── */
const incidents: { id: string; airframe: string; type: string; sev: Level; date: string; status: string; payout: string }[] = [
  { id: 'INC-2041', airframe: 'Condor-04', type: 'Datalink loss · RTL', sev: 'alarm', date: '02 Jun', status: 'Paid', payout: '€12,400' },
  { id: 'INC-2038', airframe: 'Raven-03', type: 'Hard landing', sev: 'warning', date: '28 May', status: 'Approved', payout: '€4,200' },
  { id: 'INC-2035', airframe: 'Osprey-01', type: 'Payload damage', sev: 'caution', date: '21 May', status: 'Triaged', payout: '€1,150' },
  { id: 'INC-2030', airframe: 'Falcon-07', type: 'Geofence breach', sev: 'warning', date: '14 May', status: 'Closed', payout: '—' },
  { id: 'INC-2026', airframe: 'Merlin-02', type: 'Weather abort', sev: 'caution', date: '09 May', status: 'Closed', payout: '—' },
];

const claimTypes: { label: string; count: number; level: Level }[] = [
  { label: 'Collision / contact', count: 14, level: 'alarm' },
  { label: 'Flyaway / link loss', count: 9, level: 'warning' },
  { label: 'Payload damage', count: 7, level: 'caution' },
  { label: 'Weather', count: 5, level: 'caution' },
  { label: 'GPS / nav degraded', count: 4, level: 'nominal' },
];
const claimMax = Math.max(...claimTypes.map((c) => c.count));

const funnel: { stage: string; n: number }[] = [
  { stage: 'Reported', n: 39 },
  { stage: 'Triaged', n: 31 },
  { stage: 'Approved', n: 22 },
  { stage: 'Paid', n: 18 },
];
const funnelMax = Math.max(...funnel.map((f) => f.n));

/* ── Panel 3 · Airframe risk leaderboard ─────────────────────────────── */
const fleet: { id: string; model: string; hours: string; risk: number; incidents: number; premium: string; spark: number[] }[] = [
  { id: 'Condor-04', model: 'Skynode X', hours: '612', risk: 78, incidents: 4, premium: '€312', spark: series(91, 18, 30, 12) },
  { id: 'Raven-03', model: 'Skynode S', hours: '988', risk: 54, incidents: 2, premium: '€236', spark: series(57, 18, 24, 9) },
  { id: 'Falcon-07', model: 'Skynode', hours: '1,204', risk: 41, incidents: 1, premium: '€198', spark: series(33, 18, 20, 7) },
  { id: 'Osprey-01', model: 'Skynode X', hours: '742', risk: 33, incidents: 1, premium: '€184', spark: series(18, 18, 18, 6) },
  { id: 'Merlin-02', model: 'Skynode', hours: '1,560', risk: 18, incidents: 0, premium: '€152', spark: series(5, 18, 14, 5) },
];
</script>

<template>
  <div class="overflow-x-clip" style="background: var(--background)">

    <!-- ── PAGE HEADER (compact, dashboard-led — not a marketing hero) ── -->
    <section class="border-b border-border">
      <div class="mx-auto max-w-6xl px-6 pb-12 pt-16 md:pt-20">
        <p class="font-mono text-[11px] uppercase tracking-[0.14em]" style="color: var(--brand)">Auterion Insure</p>
        <div class="mt-3 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <h1 class="max-w-2xl text-4xl font-medium leading-[1.05] md:text-5xl" style="color: var(--foreground)">
            Underwrite your fleet on <span style="color: var(--brand)">live flight data.</span>
          </h1>
          <p class="max-w-sm text-[15px] leading-relaxed text-muted-foreground">
            Risk scoring, claims and premiums in one console — priced from the telemetry your airframes already stream.
          </p>
        </div>
        <!-- meta strip -->
        <div class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">
          <span class="flex items-center gap-2">
            <span class="h-1.5 w-1.5 rounded-full" style="background: var(--nominal)" />
            Underwriting period · Q2 2026
          </span>
          <span>142 airframes insured</span>
          <span>Carrier · Auterion Re</span>
        </div>
      </div>
    </section>

    <!-- ════════ LAYOUT 1 · RISK OVERVIEW ════════ -->
    <section class="mx-auto max-w-6xl px-6 pt-16">
      <div class="mb-5 flex items-baseline justify-between">
        <h2 class="text-[15px] font-medium tracking-tight" style="color: var(--foreground)">Risk overview</h2>
        <span class="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Layout · 01</span>
      </div>

      <div class="overflow-hidden rounded-2xl border border-border shadow-sm" style="background: var(--card)">
        <!-- toolbar -->
        <div class="flex items-center gap-3 border-b border-border px-5 py-3">
          <span class="flex items-center gap-2">
            <span class="h-2 w-2 rounded-full animate-pulse" style="background: var(--nominal)" />
            <span class="font-mono text-[11px] uppercase tracking-[0.12em]" style="color: var(--foreground)">Fleet risk · live</span>
          </span>
          <span class="ml-auto font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Region · EU-Central</span>
        </div>

        <!-- KPI row -->
        <div class="grid grid-cols-2 gap-px md:grid-cols-4" style="background: var(--border)">
          <div v-for="k in kpis" :key="k.label" class="px-5 py-6" style="background: var(--card)">
            <p class="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{{ k.label }}</p>
            <p class="mt-2 text-4xl font-medium tabular-nums tracking-tight" style="color: var(--foreground)">{{ k.value }}</p>
            <p class="mt-1 font-mono text-[11px] tabular-nums" :style="`color: ${k.good ? 'var(--nominal)' : 'var(--alarm)'}`">{{ k.delta }}</p>
          </div>
        </div>

        <!-- chart + donut -->
        <div class="grid grid-cols-1 gap-px border-t border-border lg:grid-cols-3" style="background: var(--border)">
          <!-- area chart -->
          <div class="px-5 py-6 lg:col-span-2" style="background: var(--card)">
            <div class="flex items-baseline justify-between">
              <p class="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Fleet risk index · 90 days</p>
              <p class="font-mono text-[11px] tabular-nums" style="color: var(--nominal)">−14% vs prior</p>
            </div>
            <div class="relative mt-5 h-[160px]">
              <div
                v-for="g in [0, 1, 2, 3]"
                :key="g"
                class="absolute inset-x-0 border-t border-border/60"
                :style="`top: ${(g / 3) * 100}%`"
              />
              <Sparkline :data="riskTrend" stroke="var(--brand)" :width="800" :height="160" class="relative" />
            </div>
            <div class="mt-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground/70">
              <span>Mar</span><span>Apr</span><span>May</span><span>Jun</span>
            </div>
          </div>

          <!-- exposure donut -->
          <div class="flex flex-col px-5 py-6" style="background: var(--card)">
            <p class="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Exposure by risk band</p>
            <div class="mt-4 flex items-center gap-5">
              <svg viewBox="0 0 140 140" class="h-[120px] w-[120px] shrink-0 -rotate-90">
                <circle cx="70" cy="70" r="54" fill="none" stroke="var(--muted)" stroke-width="14" />
                <circle
                  v-for="s in donut"
                  :key="s.label"
                  cx="70"
                  cy="70"
                  r="54"
                  fill="none"
                  :stroke="s.color"
                  stroke-width="14"
                  :stroke-dasharray="`${s.dash} ${s.gap}`"
                  :stroke-dashoffset="s.off"
                />
                <text x="70" y="66" text-anchor="middle" class="rotate-90" style="transform-origin: 70px 70px; font: 600 26px var(--font-sans); fill: var(--foreground)" >{{ insured }}</text>
                <text x="70" y="84" text-anchor="middle" class="rotate-90" style="transform-origin: 70px 70px; font: 500 9px var(--font-mono); letter-spacing: 0.1em; fill: var(--muted-foreground)">INSURED</text>
              </svg>
              <ul class="flex-1 space-y-2">
                <li v-for="b in bands" :key="b.label" class="flex items-center gap-2 text-[12px]">
                  <span class="h-2 w-2 rounded-full" :style="`background: ${token[b.level]}`" />
                  <span style="color: var(--foreground)">{{ b.label }}</span>
                  <span class="ml-auto font-mono tabular-nums text-muted-foreground">{{ b.count }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- mini stats with sparklines -->
        <div class="grid grid-cols-1 gap-px border-t border-border sm:grid-cols-3" style="background: var(--border)">
          <div v-for="m in mini" :key="m.label" class="px-5 py-5" style="background: var(--card)">
            <div class="flex items-baseline justify-between">
              <p class="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{{ m.label }}</p>
              <p class="font-mono text-[11px] tabular-nums" :style="`color: ${m.good ? 'var(--nominal)' : 'var(--alarm)'}`">{{ m.delta }}</p>
            </div>
            <p class="mt-1 text-2xl font-medium tabular-nums tracking-tight" style="color: var(--foreground)">{{ m.value }}</p>
            <div class="mt-3 h-9" style="color: var(--brand)">
              <Sparkline :data="m.spark" :variant="m.variant" :width="240" :height="36" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════ LAYOUT 2 · INCIDENTS & CLAIMS ════════ -->
    <section class="mx-auto max-w-6xl px-6 pt-20">
      <div class="mb-5 flex items-baseline justify-between">
        <h2 class="text-[15px] font-medium tracking-tight" style="color: var(--foreground)">Claims &amp; incidents</h2>
        <span class="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Layout · 02</span>
      </div>

      <div class="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <!-- incidents table -->
        <div class="overflow-hidden rounded-2xl border border-border shadow-sm lg:col-span-2" style="background: var(--card)">
          <div class="flex items-center gap-3 border-b border-border px-5 py-3">
            <span class="font-mono text-[11px] uppercase tracking-[0.12em]" style="color: var(--foreground)">Recent incidents</span>
            <span class="ml-auto font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Last 30 days</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full min-w-[560px] border-collapse text-left">
              <thead>
                <tr class="border-b border-border" style="background: var(--muted)">
                  <th class="px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Ref</th>
                  <th class="px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Airframe</th>
                  <th class="px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Cause</th>
                  <th class="px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Status</th>
                  <th class="px-5 py-2.5 text-right font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Payout</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in incidents" :key="r.id" class="border-b border-border last:border-0">
                  <td class="px-5 py-3 font-mono text-[12px] tabular-nums" style="color: var(--foreground)">{{ r.id }}</td>
                  <td class="px-5 py-3">
                    <div class="flex items-center gap-2">
                      <span class="h-1.5 w-1.5 rounded-full" :style="`background: ${token[r.sev]}`" />
                      <span class="text-[13px]" style="color: var(--foreground)">{{ r.airframe }}</span>
                    </div>
                    <span class="font-mono text-[10px] uppercase tracking-[0.08em] text-muted-foreground/70">{{ r.date }}</span>
                  </td>
                  <td class="px-5 py-3 text-[13px] text-muted-foreground">{{ r.type }}</td>
                  <td class="px-5 py-3">
                    <span class="inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em]" :style="`color: ${token[r.sev]}; background: ${tint(token[r.sev])}`">{{ r.status }}</span>
                  </td>
                  <td class="px-5 py-3 text-right font-mono text-[12px] tabular-nums" style="color: var(--foreground)">{{ r.payout }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- breakdown + funnel -->
        <div class="flex flex-col gap-5">
          <!-- claim type bars -->
          <div class="rounded-2xl border border-border p-5 shadow-sm" style="background: var(--card)">
            <p class="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Claims by cause · 12 mo</p>
            <ul class="mt-4 space-y-3">
              <li v-for="c in claimTypes" :key="c.label">
                <div class="flex items-center justify-between text-[12px]">
                  <span style="color: var(--foreground)">{{ c.label }}</span>
                  <span class="font-mono tabular-nums text-muted-foreground">{{ c.count }}</span>
                </div>
                <div class="mt-1.5 h-1.5 w-full overflow-hidden rounded-full" style="background: var(--muted)">
                  <div class="h-full rounded-full" :style="`width: ${(c.count / claimMax) * 100}%; background: ${token[c.level]}`" />
                </div>
              </li>
            </ul>
          </div>

          <!-- claims funnel -->
          <div class="rounded-2xl border border-border p-5 shadow-sm" style="background: var(--card)">
            <p class="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Claims pipeline</p>
            <ul class="mt-4 space-y-2.5">
              <li v-for="f in funnel" :key="f.stage" class="flex items-center gap-3">
                <span class="w-16 shrink-0 font-mono text-[11px] uppercase tracking-[0.06em] text-muted-foreground">{{ f.stage }}</span>
                <div class="h-6 flex-1 overflow-hidden rounded" style="background: var(--muted)">
                  <div class="flex h-full items-center justify-end rounded pr-2" :style="`width: ${(f.n / funnelMax) * 100}%; background: color-mix(in oklab, var(--brand) 16%, var(--card))`">
                    <span class="font-mono text-[11px] tabular-nums" style="color: var(--brand)">{{ f.n }}</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- ════════ LAYOUT 3 · AIRFRAME RISK LEADERBOARD ════════ -->
    <section class="mx-auto max-w-6xl px-6 pb-20 pt-20">
      <div class="mb-5 flex items-baseline justify-between">
        <h2 class="text-[15px] font-medium tracking-tight" style="color: var(--foreground)">Airframe risk leaderboard</h2>
        <span class="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Layout · 03</span>
      </div>

      <div class="overflow-hidden rounded-2xl border border-border shadow-sm" style="background: var(--card)">
        <div class="flex items-center gap-3 border-b border-border px-5 py-3">
          <span class="font-mono text-[11px] uppercase tracking-[0.12em]" style="color: var(--foreground)">Ranked by risk score</span>
          <span class="ml-auto font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Higher = more exposure</span>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full min-w-[680px] border-collapse text-left">
            <thead>
              <tr class="border-b border-border" style="background: var(--muted)">
                <th class="px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Airframe</th>
                <th class="px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Flight hrs</th>
                <th class="px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Risk score</th>
                <th class="px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">90-day trend</th>
                <th class="px-5 py-2.5 text-center font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Claims</th>
                <th class="px-5 py-2.5 text-right font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground">Premium /mo</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="r in fleet" :key="r.id" class="border-b border-border last:border-0">
                <td class="px-5 py-3.5">
                  <p class="font-mono text-[13px] tabular-nums" style="color: var(--foreground)">{{ r.id }}</p>
                  <p class="text-[11px] text-muted-foreground">{{ r.model }}</p>
                </td>
                <td class="px-5 py-3.5 font-mono text-[12px] tabular-nums text-muted-foreground">{{ r.hours }} h</td>
                <td class="px-5 py-3.5">
                  <div class="flex items-center gap-2.5">
                    <div class="h-1.5 w-20 overflow-hidden rounded-full" style="background: var(--muted)">
                      <div class="h-full rounded-full" :style="`width: ${r.risk}%; background: ${token[riskLevel(r.risk)]}`" />
                    </div>
                    <span class="font-mono text-[12px] tabular-nums" :style="`color: ${token[riskLevel(r.risk)]}`">{{ r.risk }}</span>
                  </div>
                </td>
                <td class="px-5 py-3.5">
                  <div class="h-7 w-28" :style="`color: ${token[riskLevel(r.risk)]}`">
                    <Sparkline :data="r.spark" :width="120" :height="28" />
                  </div>
                </td>
                <td class="px-5 py-3.5 text-center font-mono text-[12px] tabular-nums text-muted-foreground">{{ r.incidents }}</td>
                <td class="px-5 py-3.5 text-right font-mono text-[13px] tabular-nums" style="color: var(--foreground)">{{ r.premium }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p class="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.1em] text-muted-foreground/60">
        Representative interface · sample data · Auterion Insure
      </p>
    </section>

    <!-- ── CTA band ── -->
    <section class="border-t border-border" style="background: var(--card)">
      <div class="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-16 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 class="text-3xl font-medium" style="color: var(--foreground)">Price your fleet in a week.</h2>
          <p class="mt-2 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            Connect telemetry, set coverage, and let underwriting follow the data — not a static spreadsheet.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <button
            class="cta-btn inline-flex items-center gap-2 rounded-lg px-6 py-3 text-[14px] font-medium"
            style="background: var(--brand); color: var(--brand-foreground)"
            @click="navigate('company')"
          >
            Request a quote
            <Icon name="arrow-right" size="xs" />
          </button>
          <Button variant="ghost" size="md" class="gap-2 text-[14px]" @click="navigate('fleet')">See fleet ops</Button>
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
