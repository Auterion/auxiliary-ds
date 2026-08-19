<!--
  Hallmark · macrostructure: Editorial (portfolio deck) · tone: measured/declarative
  anchor hue: auterion blue (rationed — ONE chapter divider on this page)
  pre-emit critique: P5 H5 E5 S5 R5 V4
-->
<script setup lang="ts">
import { inject } from 'vue';
import { Icon, type IconName } from '@auxiliary/icons';
import WebHero from '../WebHero.vue';

const navigate = inject<(p: string) => void>('navigate', () => {});

const logos = ['GovTech', 'NATO', 'Quantum Systems', 'Nokia', 'Skydio', 'US DoD'];

const products: { name: string; icon: IconName; blurb: string; to: string }[] = [
  { name: 'Auterion Suite', icon: 'bars', blurb: 'Fleet, operations and analytics for your entire program — in the cloud.', to: 'products' },
  { name: 'Mission Control', icon: 'drone', blurb: 'Field-proven ground control. Map, gimbal and mission, on any tablet.', to: 'products' },
  { name: 'AuterionOS', icon: 'gear', blurb: 'The open operating system powering autonomous vehicles at the edge.', to: 'developers' },
  { name: 'Skynode', icon: 'lock', blurb: 'Flight-control compute and connectivity that runs the whole stack.', to: 'products' },
];

const steps = [
  { n: '01', title: 'Build', blurb: 'Write apps against the open SDK and simulate every mission before it flies.' },
  { n: '02', title: 'Deploy', blurb: 'Ship over-the-air to any Skynode-powered vehicle, across any airframe.' },
  { n: '03', title: 'Command', blurb: 'Run the whole fleet from the cloud — live telemetry, missions and analytics.' },
];

const stats = [
  { value: '2M+', label: 'Flight hours' },
  { value: '10,000+', label: 'Vehicles deployed' },
  { value: '60+', label: 'Countries' },
  { value: '99.9%', label: 'Fleet uptime' },
];
</script>

<template>
  <div>

    <!-- ╭─ Cover ────────────────────────────────────────────────────╮ -->
    <WebHero
      eyebrow="AuterionOS 4.2 is now available"
      title="The operating system for autonomous robotics."
      subtitle="One software platform to build, deploy and command intelligent drones at scale — from the flight controller to the fleet."
      facts="2M+ FLIGHT HOURS · 10,000+ VEHICLES · 60+ COUNTRIES"
      primary="Get started"
      secondary="Watch the demo"
      @primary="navigate('products')"
      @secondary="navigate('developers')"
    />

    <!-- ╭─ Trust ────────────────────────────────────────────────────╮
         A ruled row, not a carousel: a logo marquee is an entrance
         animation wearing a suit, and nothing in this grammar draws in. -->
    <section class="wb-band">
      <div class="wb-wrap wb-block-sm">
        <div class="dk-section">
          <span class="dk-label">Trusted by</span>
          <span class="dk-bracket">6 PROGRAMS · 60+ COUNTRIES</span>
        </div>
        <div class="wb-logos">
          <span v-for="l in logos" :key="l" class="wb-logo dk-label">{{ l }}</span>
        </div>
      </div>
    </section>

    <!-- ╭─ Platform ─────────────────────────────────────────────────╮ -->
    <section class="wb-band">
      <div class="wb-wrap wb-block">
        <div class="dk-section">
          <span class="dk-label">The platform</span>
          <span class="dk-bracket">4 PRODUCTS · 1 STACK</span>
        </div>
        <div class="wb-head">
          <h2 class="dk-h1">One stack, silicon to fleet.</h2>
          <p class="dk-body-lg wb-measure-text">
            Every layer is built to work together — and open enough to build on.
          </p>
        </div>

        <div class="wb-grid" data-cols="2">
          <button
            v-for="p in products"
            :key="p.name"
            type="button"
            class="dk-card dk-lift wb-tile"
            @click="navigate(p.to)"
          >
            <div class="wb-tile-head">
              <span class="wb-tile-mark"><Icon :name="p.icon" size="xs" /></span>
            </div>
            <h3 class="dk-h2">{{ p.name }}</h3>
            <p class="dk-body">{{ p.blurb }}</p>
            <span class="wb-tile-foot">
              <span class="dk-label">Explore</span>
              <Icon name="arrow-right" size="xs" class="wb-tile-go" />
            </span>
          </button>
        </div>
      </div>
    </section>

    <!-- ╭─ How it works ─────────────────────────────────────────────╮ -->
    <section class="wb-band">
      <div class="wb-wrap wb-block">
        <div class="dk-section">
          <span class="dk-label">How it works</span>
          <span class="dk-bracket">3 STEPS</span>
        </div>
        <div class="wb-head">
          <h2 class="dk-h1">From idea to autonomy.</h2>
        </div>

        <div class="wb-grid" data-cols="3">
          <div v-for="s in steps" :key="s.n" class="dk-card wb-tile">
            <span class="dk-label dk-num">Step {{ s.n }}</span>
            <h3 class="dk-h2">{{ s.title }}</h3>
            <p class="dk-body">{{ s.blurb }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ╭─ Numbers ──────────────────────────────────────────────────╮
         The page's ONE chapter divider, and the second (and last) blue
         surface in the view after the masthead mark. -->
    <section class="wb-band">
      <div class="wb-wrap wb-block">
        <div class="dk-plate-signal wb-cover">
          <div class="wb-cover-copy">
            <p class="dk-label">Numbers that matter</p>
            <h2 class="dk-h1">Proven in the field, not the deck.</h2>
          </div>
          <div class="wb-metrics" data-cols="4">
            <div v-for="s in stats" :key="s.label" class="wb-metric">
              <span class="wb-figure-num">{{ s.value }}</span>
              <span class="dk-label">{{ s.label }}</span>
            </div>
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
            <h2 class="dk-display">Build the autonomous future.</h2>
          </div>
          <p class="dk-body-lg wb-cover-lede">
            Trusted across defense, enterprise and public safety. See what one stack can do for your fleet.
          </p>
          <div class="wb-actions">
            <button type="button" class="dk-cta-solid" @click="navigate('products')">
              Get started <Icon name="arrow-right" size="xs" />
            </button>
            <button type="button" class="dk-cta" @click="navigate('developers')">Read the docs</button>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
