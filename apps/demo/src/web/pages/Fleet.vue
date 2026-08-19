<!--
  Hallmark · macrostructure: Editorial (portfolio deck) · tone: measured/declarative
  anchor hue: auterion blue (rationed — none on this page; the masthead mark is
  the view's only signal. The five-level status ladder is exempt: it is state.)
  pre-emit critique: P5 H5 E5 S5 R5 V4
-->
<script setup lang="ts">
import { inject } from 'vue';
import { Icon, type IconName } from '@auxiliary/icons';
import WebHero from '../WebHero.vue';

const navigate = inject<(p: string) => void>('navigate', () => {});

const kpis: { label: string; value: string; delta: string }[] = [
  { label: 'Active vehicles', value: '142', delta: '+8 today' },
  { label: 'Missions in flight', value: '37', delta: '+12%' },
  { label: 'Avg. uptime', value: '99.2%', delta: '+0.4pt' },
  { label: 'Open incidents', value: '3', delta: '−2' },
];

type Status = 'nominal' | 'caution' | 'alarm';
const fleet: { id: string; model: string; mission: string; battery: number; alt: string; status: Status }[] = [
  { id: 'UAV-001', model: 'Skynode', mission: 'Perimeter sweep', battery: 86, alt: '124 m', status: 'nominal' },
  { id: 'UAV-002', model: 'Skynode S', mission: 'Pipeline inspect', battery: 71, alt: '88 m', status: 'nominal' },
  { id: 'UAV-003', model: 'Skynode X', mission: 'Search grid B', battery: 24, alt: '210 m', status: 'caution' },
  { id: 'UGV-001', model: 'Skynode', mission: 'Convoy escort', battery: 60, alt: '—', status: 'nominal' },
  { id: 'UAV-004', model: 'Skynode', mission: 'Relay hold', battery: 9, alt: '156 m', status: 'alarm' },
];

const statusLabel: Record<Status, string> = { nominal: 'Nominal', caution: 'Caution', alarm: 'Alarm' };

const features: { name: string; icon: IconName; desc: string }[] = [
  { name: 'Live fleet map', icon: 'drone', desc: 'Every vehicle, payload and mission on one map — streamed in real time from the edge.' },
  { name: 'Mission replay', icon: 'bars', desc: 'Scrub any past flight with full telemetry, video and event timeline for review and audit.' },
  { name: 'Fleet analytics', icon: 'gear', desc: 'Utilisation, uptime and maintenance trends across your whole fleet, exportable to your stack.' },
];

/* Battery reads the reserved severity ladder — state, never brand. */
function batteryLevel(b: number): Status {
  if (b <= 15) return 'alarm';
  if (b <= 30) return 'caution';
  return 'nominal';
}
</script>

<template>
  <div>

    <!-- ╭─ Cover ────────────────────────────────────────────────────╮ -->
    <WebHero
      eyebrow="Fleet operations"
      title="Your whole fleet, one pane of glass."
      subtitle="Command live operations, replay missions and track fleet health across every vehicle and team — from the browser."
      facts="142 VEHICLES · 37 IN FLIGHT · 99.2% UPTIME"
      primary="Start a trial"
      secondary="Book a demo"
      @primary="navigate('company')"
      @secondary="navigate('company')"
    />

    <!-- ╭─ Header ledger ────────────────────────────────────────────╮
         The KPIs top the case layout. Deltas carry no hue: a trend is not
         a state, and the ladder is reserved for state. -->
    <section class="wb-band">
      <div class="wb-wrap wb-block-sm">
        <div class="dk-ledger wb-ledger-4">
          <div
            v-for="(k, i) in kpis"
            :key="k.label"
            class="dk-ledger-cell"
            :data-align="i === kpis.length - 1 ? 'end' : undefined"
          >
            <span class="dk-pointer">{{ k.label }}</span>
            <span class="wb-figure-num">{{ k.value }}</span>
            <span class="dk-label dk-num">{{ k.delta }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ╭─ Live operations panel ────────────────────────────────────╮ -->
    <section>
      <div class="wb-wrap wb-block">
        <div class="dk-section">
          <span class="dk-label">Live operations</span>
          <span class="dk-bracket">5 VEHICLES · REGION EU-CENTRAL</span>
        </div>

        <div class="dk-card wb-figure wb-stack">
          <div class="wb-figure-bar">
            <span class="wb-live">
              <span class="dk-dot dk-dot-nominal" />
              <span class="dk-label">Streaming</span>
            </span>
            <span class="dk-label wb-push">Region · EU-Central</span>
          </div>

          <div class="wb-figure-body wb-figure-scroll">
            <table class="dk-table wb-table-wide">
              <colgroup>
                <col class="wb-col-md">
                <col class="wb-col-md">
                <col>
                <col class="wb-col-lg">
                <col class="wb-col-sm">
                <col class="wb-col-md">
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">Vehicle</th>
                  <th scope="col">Module</th>
                  <th scope="col">Mission</th>
                  <th scope="col">Battery</th>
                  <th scope="col" data-align="end">Alt</th>
                  <th scope="col" data-align="end">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in fleet" :key="row.id">
                  <td data-lead="true" class="dk-num">{{ row.id }}</td>
                  <td>{{ row.model }}</td>
                  <td>{{ row.mission }}</td>
                  <td>
                    <span class="flex items-center gap-2">
                      <span class="wb-bar">
                        <span
                          class="wb-bar-fill"
                          :class="`wb-bar-${batteryLevel(row.battery)}`"
                          :style="{ width: `${row.battery}%` }"
                        />
                      </span>
                      <span class="dk-label dk-num">{{ row.battery }}%</span>
                    </span>
                  </td>
                  <td data-align="end" class="dk-num">{{ row.alt }}</td>
                  <td data-align="end">
                    <span class="wb-status" :class="`dk-ink-${row.status}`">
                      <span class="dk-dot" :class="`dk-dot-${row.status}`" />
                      {{ statusLabel[row.status] }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <p class="dk-caption">Representative interface · Auterion Suite</p>
      </div>
    </section>

    <!-- ╭─ Built for operators ──────────────────────────────────────╮ -->
    <section class="wb-band wb-band-alt">
      <div class="wb-wrap wb-block">
        <div class="dk-section">
          <span class="dk-label">Built for operators</span>
          <span class="dk-bracket">3 CAPABILITIES</span>
        </div>
        <div class="wb-head">
          <h2 class="dk-h1">From a single drone to a fleet of thousands.</h2>
        </div>

        <div class="wb-grid" data-cols="3">
          <div v-for="f in features" :key="f.name" class="dk-card dk-lift wb-tile">
            <div class="wb-tile-head">
              <span class="wb-tile-mark"><Icon :name="f.icon" size="xs" /></span>
            </div>
            <h3 class="dk-h2">{{ f.name }}</h3>
            <p class="dk-body">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ╭─ Proof close ──────────────────────────────────────────────╮ -->
    <section class="wb-band">
      <div class="wb-wrap wb-block">
        <div class="dk-plate wb-cover">
          <div class="wb-cover-copy">
            <p class="dk-h2 dk-ghost">Get started</p>
            <h2 class="dk-display">See your fleet in Auterion Suite.</h2>
          </div>
          <p class="dk-body-lg wb-cover-lede">
            Connect your first vehicle in minutes. No rip-and-replace — Suite works with the hardware you already fly.
          </p>
          <div class="wb-actions">
            <button type="button" class="dk-cta-solid" @click="navigate('company')">
              Start a trial <Icon name="arrow-right" size="xs" />
            </button>
            <button type="button" class="dk-cta" @click="navigate('products')">Explore products</button>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
