<!--
  Hallmark · macrostructure: Editorial (portfolio deck) · tone: measured/declarative
  anchor hue: auterion blue (rationed — none on this page; the masthead mark is
  the view's only signal)
  pre-emit critique: P5 H5 E5 S5 R5 V4
-->
<script setup lang="ts">
import { inject } from 'vue';
import { Icon, type IconName } from '@auxiliary/icons';
import WebHero from '../WebHero.vue';

const navigate = inject<(p: string) => void>('navigate', () => {});

const products: { name: string; tag: string; icon: IconName; desc: string; bullets: string[] }[] = [
  {
    name: 'Auterion Suite', tag: 'Cloud', icon: 'bars',
    desc: 'Command your entire fleet from one place. Live operations, mission history, analytics and team management — in the browser.',
    bullets: ['Real-time fleet status & telemetry', 'Mission planning and replay', 'Org, team and seat management'],
  },
  {
    name: 'Mission Control', tag: 'Ground control', icon: 'drone',
    desc: 'The field-proven ground station. Plan, fly and stream from a tablet, with day and scotopic night operation built in.',
    bullets: ['Map & gimbal-feed views', 'Guarded flight actions', 'Offline-first mission autonomy'],
  },
  {
    name: 'AuterionOS', tag: 'Vehicle OS', icon: 'gear',
    desc: 'The open operating system for autonomous vehicles. One software layer across every airframe and payload.',
    bullets: ['MAVLink-native, open APIs', 'Over-the-air updates', 'Payload & sensor framework'],
  },
  {
    name: 'Skynode', tag: 'Compute', icon: 'lock',
    desc: 'Flight-control compute, connectivity and AI acceleration in a single module — the brain that runs the stack.',
    bullets: ['Mission computer + autopilot', '4G/5G & mesh connectivity', 'NDAA-compliant hardware'],
  },
];

const comparison: { feature: string; oss: boolean; auterion: boolean }[] = [
  { feature: 'MAVLink-native flight stack', oss: true, auterion: true },
  { feature: 'Open APIs & SDK', oss: true, auterion: true },
  { feature: 'Fleet management & analytics', oss: false, auterion: true },
  { feature: 'Guarded mission operations', oss: false, auterion: true },
  { feature: 'Over-the-air updates', oss: false, auterion: true },
  { feature: 'NDAA-compliant hardware', oss: false, auterion: true },
  { feature: 'Enterprise support & SLAs', oss: false, auterion: true },
];
</script>

<template>
  <div>

    <!-- ╭─ Cover ────────────────────────────────────────────────────╮ -->
    <WebHero
      eyebrow="Products"
      title="Every layer of the autonomy stack."
      subtitle="From the flight controller to the cloud, each part is engineered to work as one system — and open enough to build on."
      facts="4 PRODUCTS · 1 STACK · 7 CAPABILITIES COMPARED"
      primary="Get started"
      secondary="Compare products"
      @primary="navigate('company')"
      @secondary="navigate('developers')"
    />

    <!-- ╭─ The platform ─────────────────────────────────────────────╮ -->
    <section class="wb-band">
      <div class="wb-wrap wb-block">
        <div class="dk-section">
          <span class="dk-label">The platform</span>
          <span class="dk-bracket">4 PRODUCTS · 12 CAPABILITIES</span>
        </div>
        <div class="wb-head">
          <h2 class="dk-h1">Four products. One stack.</h2>
        </div>

        <div class="wb-grid" data-cols="2">
          <div v-for="p in products" :key="p.name" class="dk-card dk-lift wb-tile">
            <div class="wb-tile-head">
              <span class="wb-tile-mark"><Icon :name="p.icon" size="xs" /></span>
              <span class="dk-label">{{ p.tag }}</span>
            </div>
            <h3 class="dk-h2">{{ p.name }}</h3>
            <p class="dk-body">{{ p.desc }}</p>

            <ul class="wb-list">
              <li v-for="b in p.bullets" :key="b" class="wb-list-item">
                <span class="dk-small">{{ b }}</span>
              </li>
            </ul>

            <span class="wb-tile-foot">
              <span class="dk-label">Learn more</span>
              <Icon name="arrow-right" size="xs" class="wb-tile-go" />
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- ╭─ Comparison — the ledger table ────────────────────────────╮
         A real <table>, fixed layout, marks hard right: the same column
         model every other table on the site uses. -->
    <section class="wb-band">
      <div class="wb-wrap wb-block">
        <div class="dk-section">
          <span class="dk-label">Open source vs. Auterion</span>
          <span class="dk-bracket">7 ROWS · 2 COLUMNS</span>
        </div>
        <div class="wb-head">
          <h2 class="dk-h1">Built on open. Ready for scale.</h2>
        </div>

        <div class="wb-figure-scroll">
          <table class="dk-table wb-table-wide">
            <colgroup>
              <col>
              <col class="wb-col-md">
              <col class="wb-col-md">
            </colgroup>
            <thead>
              <tr>
                <th scope="col">Feature</th>
                <th scope="col" data-align="end">Open source</th>
                <th scope="col" data-align="end">Auterion</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in comparison" :key="row.feature">
                <td data-lead="true">{{ row.feature }}</td>
                <!-- Presence is carried by weight, never by hue: the status
                     ladder is state, and "ships in the product" is not state. -->
                <td data-align="end">
                  <span class="dk-label">{{ row.oss ? 'Yes' : 'No' }}</span>
                </td>
                <td data-align="end">
                  <span class="dk-value">{{ row.auterion ? 'Yes' : 'No' }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- ╭─ Proof close ──────────────────────────────────────────────╮ -->
    <section class="wb-band">
      <div class="wb-wrap wb-block">
        <div class="dk-plate wb-cover">
          <div class="wb-cover-copy">
            <p class="dk-h2 dk-ghost">Get started</p>
            <h2 class="dk-display">See the whole platform in action.</h2>
          </div>
          <p class="dk-body-lg wb-cover-lede">
            Book a walkthrough with our team, tailored to your fleet and missions.
          </p>
          <div class="wb-actions">
            <button type="button" class="dk-cta-solid" @click="navigate('company')">
              Request a demo <Icon name="arrow-right" size="xs" />
            </button>
            <button type="button" class="dk-cta" @click="navigate('developers')">Read the docs</button>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
