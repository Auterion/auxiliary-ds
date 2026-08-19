<!--
  Hallmark · macrostructure: Editorial (portfolio deck) worn by a workbench
  tone: measured/declarative · anchor hue: auterion blue (rationed — none on
  this page; the masthead mark is the view's only signal. The five-level status
  ladder is exempt throughout: risk is state, not brand.)
  pre-emit critique: P5 H5 E5 S5 R5 V4
-->
<script setup lang="ts">
import { computed, inject } from 'vue';
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

/* ── The reserved severity ladder ─────────────────────────────────────── */
type Level = 'nominal' | 'caution' | 'warning' | 'alarm';

/* Risk score 0–100 (higher = worse) → ladder level. */
function riskLevel(score: number): Level {
  if (score >= 70) return 'alarm';
  if (score >= 45) return 'warning';
  if (score >= 25) return 'caution';
  return 'nominal';
}

/* ── Panel 1 · Fleet risk overview ───────────────────────────────────── */
const kpis: { label: string; value: string; delta: string }[] = [
  { label: 'Fleet safety score', value: '94', delta: '+2 pt' },
  { label: 'Insured airframes', value: '142', delta: '+6' },
  { label: 'Open claims', value: '3', delta: '−2' },
  { label: 'Avg premium · /mo', value: '€184', delta: '−6%' },
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
    const seg = { ...b, dash: frac * C, gap: C - frac * C, off: -offset * C };
    offset += frac;
    return seg;
  });
});

const mini: { label: string; value: string; delta: string; spark: number[]; variant: 'line' | 'bar' }[] = [
  { label: 'Flight hours · 30d', value: '4,820', delta: '+9%', spark: series(7, 24, 30, 9), variant: 'line' },
  { label: 'Incidents / 1k h', value: '0.7', delta: '−0.2', spark: series(3, 24, 12, 7), variant: 'line' },
  { label: 'Geofence breaches', value: '5', delta: '−3', spark: series(11, 16, 8, 6), variant: 'bar' },
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

const header = [
  { label: 'Underwriting period', value: 'Q2 2026' },
  { label: 'Airframes insured', value: '142' },
  { label: 'Carrier', value: 'Auterion Re' },
];
</script>

<template>
  <div>

    <!-- ╭─ Page head — dashboard-led, not a marketing cover ─────────╮ -->
    <section>
      <div class="wb-wrap wb-block">
        <div class="dk-section">
          <span class="dk-label">Auterion Insure</span>
          <span class="dk-bracket">142 AIRFRAMES · Q2 2026</span>
        </div>
        <div class="wb-head">
          <h1 class="dk-display">Underwrite your fleet on live flight data.</h1>
          <p class="dk-body-lg wb-measure-text">
            Risk scoring, claims and premiums in one console — priced from the telemetry your airframes already stream.
          </p>
        </div>

        <!-- Header ledger — tops the case layout below. -->
        <div class="dk-ledger">
          <div
            v-for="(h, i) in header"
            :key="h.label"
            class="dk-ledger-cell"
            :data-align="i === header.length - 1 ? 'end' : undefined"
          >
            <span class="dk-pointer">{{ h.label }}</span>
            <span class="dk-value dk-num">{{ h.value }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ╭─ 01 · Risk overview ───────────────────────────────────────╮ -->
    <section>
      <div class="wb-wrap wb-block-sm">
        <div class="dk-section">
          <span class="dk-label">Risk overview</span>
          <span class="dk-bracket">LAYOUT 01 · 90 DAYS</span>
        </div>

        <div class="dk-card wb-figure wb-stack">
          <div class="wb-figure-bar">
            <span class="wb-live">
              <span class="dk-dot dk-dot-nominal" />
              <span class="dk-label">Fleet risk · live</span>
            </span>
            <span class="dk-label wb-push">Region · EU-Central</span>
          </div>

          <!-- KPI strip -->
          <div class="wb-metrics" data-cols="4">
            <div v-for="k in kpis" :key="k.label" class="wb-metric">
              <span class="dk-pointer">{{ k.label }}</span>
              <span class="wb-figure-num">{{ k.value }}</span>
              <span class="dk-label dk-num">{{ k.delta }}</span>
            </div>
          </div>

          <!-- Trend + exposure -->
          <div class="wb-metrics" data-cols="3">
            <div class="wb-metric wb-span-2">
              <div class="flex items-baseline justify-between gap-4">
                <span class="dk-pointer">Fleet risk index · 90 days</span>
                <span class="dk-label dk-num">−14% vs prior</span>
              </div>
              <Sparkline :data="riskTrend" :width="800" :height="150" class="wb-spark" />
              <div class="flex justify-between">
                <span v-for="m in ['Mar','Apr','May','Jun']" :key="m" class="dk-micro">{{ m }}</span>
              </div>
            </div>

            <div class="wb-metric">
              <span class="dk-pointer">Exposure by risk band</span>
              <div class="flex items-center gap-4">
                <svg viewBox="0 0 140 140" class="wb-donut -rotate-90" role="img" aria-label="Insured airframes by risk band">
                  <circle cx="70" cy="70" r="54" fill="none" stroke="var(--dk-line)" stroke-width="12" />
                  <circle
                    v-for="s in donut"
                    :key="s.label"
                    cx="70"
                    cy="70"
                    r="54"
                    fill="none"
                    :stroke="`var(--${s.level})`"
                    stroke-width="12"
                    :stroke-dasharray="`${s.dash} ${s.gap}`"
                    :stroke-dashoffset="s.off"
                  />
                </svg>
                <ul class="flex-1">
                  <li v-for="b in bands" :key="b.label" class="wb-rule-row">
                    <span class="wb-status" :class="`dk-ink-${b.level}`">
                      <span class="dk-dot" :class="`dk-dot-${b.level}`" />
                      {{ b.label }}
                    </span>
                    <span class="dk-label dk-num">{{ b.count }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- Mini series -->
          <div class="wb-metrics" data-cols="3">
            <div v-for="m in mini" :key="m.label" class="wb-metric">
              <div class="flex items-baseline justify-between gap-4">
                <span class="dk-pointer">{{ m.label }}</span>
                <span class="dk-label dk-num">{{ m.delta }}</span>
              </div>
              <span class="wb-figure-num">{{ m.value }}</span>
              <Sparkline :data="m.spark" :variant="m.variant" :width="240" :height="34" class="wb-spark" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ╭─ 02 · Claims & incidents ──────────────────────────────────╮ -->
    <section>
      <div class="wb-wrap wb-block-sm">
        <div class="dk-section">
          <span class="dk-label">Claims &amp; incidents</span>
          <span class="dk-bracket">LAYOUT 02 · 39 REPORTED · 18 PAID</span>
        </div>

        <div class="wb-split wb-stack" data-lead="wide">
          <!-- Incidents ledger table -->
          <div class="dk-card wb-figure">
            <div class="wb-figure-bar">
              <span class="dk-label">Recent incidents</span>
              <span class="dk-label wb-push">Last 30 days</span>
            </div>
            <div class="wb-figure-body wb-figure-scroll">
              <table class="dk-table wb-table-wide">
                <colgroup>
                  <col class="wb-col-md">
                  <col class="wb-col-md">
                  <col>
                  <col class="wb-col-sm">
                  <col class="wb-col-md">
                </colgroup>
                <thead>
                  <tr>
                    <th scope="col">Ref</th>
                    <th scope="col">Airframe</th>
                    <th scope="col">Cause</th>
                    <th scope="col">Status</th>
                    <th scope="col" data-align="end">Payout</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="r in incidents" :key="r.id">
                    <td data-lead="true" class="dk-num">{{ r.id }}</td>
                    <!-- The dot carries the severity hue; the airframe name is
                         not a severity label, so it stays on the ink ramp. -->
                    <td>
                      <span class="flex items-center gap-2">
                        <span class="dk-dot" :class="`dk-dot-${r.sev}`" />
                        <span class="dk-value">{{ r.airframe }}</span>
                      </span>
                      <span class="dk-micro block">{{ r.date }}</span>
                    </td>
                    <td>{{ r.type }}</td>
                    <td><span class="dk-label">{{ r.status }}</span></td>
                    <td data-align="end" class="dk-num">{{ r.payout }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div class="flex flex-col gap-4">
            <!-- Claims by cause -->
            <div class="dk-card wb-figure">
              <div class="wb-figure-bar">
                <span class="dk-label">Claims by cause · 12 mo</span>
              </div>
              <div class="wb-figure-body">
                <ul>
                  <li v-for="c in claimTypes" :key="c.label" class="wb-rule-row wb-row-bar">
                    <span class="dk-small">{{ c.label }}</span>
                    <span class="wb-bar">
                      <span class="wb-bar-fill" :class="`wb-bar-${c.level}`" :style="{ width: `${(c.count / claimMax) * 100}%` }" />
                    </span>
                    <span class="dk-label dk-num">{{ c.count }}</span>
                  </li>
                </ul>
              </div>
            </div>

            <!-- Claims pipeline -->
            <div class="dk-card wb-figure">
              <div class="wb-figure-bar">
                <span class="dk-label">Claims pipeline</span>
              </div>
              <div class="wb-figure-body">
                <ul>
                  <li v-for="f in funnel" :key="f.stage" class="wb-rule-row wb-row-stage">
                    <span class="dk-label">{{ f.stage }}</span>
                    <span class="wb-bar">
                      <span class="wb-bar-fill wb-bar-ink" :style="{ width: `${(f.n / funnelMax) * 100}%` }" />
                    </span>
                    <span class="dk-label dk-num">{{ f.n }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- ╭─ 03 · Airframe risk leaderboard ───────────────────────────╮ -->
    <section>
      <div class="wb-wrap wb-block-sm">
        <div class="dk-section">
          <span class="dk-label">Airframe risk leaderboard</span>
          <span class="dk-bracket">LAYOUT 03 · 5 AIRFRAMES</span>
        </div>

        <div class="dk-card wb-figure wb-stack">
          <div class="wb-figure-bar">
            <span class="dk-label">Ranked by risk score</span>
            <span class="dk-label wb-push">Higher = more exposure</span>
          </div>
          <div class="wb-figure-body wb-figure-scroll">
            <table class="dk-table wb-table-wide">
              <colgroup>
                <col class="wb-col-lg">
                <col class="wb-col-sm">
                <col class="wb-col-lg">
                <col>
                <col class="wb-col-xs">
                <col class="wb-col-md">
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">Airframe</th>
                  <th scope="col" data-align="end">Flight hrs</th>
                  <th scope="col">Risk score</th>
                  <th scope="col">90-day trend</th>
                  <th scope="col" data-align="end">Claims</th>
                  <th scope="col" data-align="end">Premium /mo</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in fleet" :key="r.id">
                  <td data-lead="true">
                    <span class="dk-num">{{ r.id }}</span>
                    <span class="dk-micro block">{{ r.model }}</span>
                  </td>
                  <td data-align="end" class="dk-num">{{ r.hours }} h</td>
                  <td>
                    <span class="flex items-center gap-2">
                      <span class="wb-bar">
                        <span class="wb-bar-fill" :class="`wb-bar-${riskLevel(r.risk)}`" :style="{ width: `${r.risk}%` }" />
                      </span>
                      <span class="dk-label dk-num" :class="`dk-ink-${riskLevel(r.risk)}`">{{ r.risk }}</span>
                    </span>
                  </td>
                  <td>
                    <Sparkline :data="r.spark" :width="120" :height="26" class="wb-spark" :class="`dk-ink-${riskLevel(r.risk)}`" />
                  </td>
                  <td data-align="end" class="dk-num">{{ r.incidents }}</td>
                  <td data-align="end" class="dk-num">{{ r.premium }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <p class="dk-caption">Representative interface · sample data · Auterion Insure</p>
      </div>
    </section>

    <!-- ╭─ Proof close ──────────────────────────────────────────────╮ -->
    <section class="wb-band">
      <div class="wb-wrap wb-block">
        <div class="dk-plate wb-cover">
          <div class="wb-cover-copy">
            <p class="dk-h2 dk-ghost">Auterion Insure</p>
            <h2 class="dk-display">Price your fleet in a week.</h2>
          </div>
          <p class="dk-body-lg wb-cover-lede">
            Connect telemetry, set coverage, and let underwriting follow the data — not a static spreadsheet.
          </p>
          <div class="wb-actions">
            <button type="button" class="dk-cta-solid" @click="navigate('company')">
              Request a quote <Icon name="arrow-right" size="xs" />
            </button>
            <button type="button" class="dk-cta" @click="navigate('fleet')">See fleet ops</button>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
