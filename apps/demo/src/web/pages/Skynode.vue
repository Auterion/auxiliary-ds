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

const specs: { label: string; value: string; unit?: string }[] = [
  { label: 'Compute', value: '275', unit: 'TOPS AI' },
  { label: 'Mass', value: '199', unit: 'grams' },
  { label: 'Power draw', value: '<15', unit: 'watts' },
  { label: 'Connectivity', value: '4G / 5G', unit: '+ mesh' },
];

const capabilities: { name: string; icon: IconName; desc: string }[] = [
  {
    name: 'Mission computer + autopilot',
    icon: 'gear',
    desc: 'A flight controller and a Linux mission computer on one module — no separate companion board, no integration tax.',
  },
  {
    name: 'On-board AI acceleration',
    icon: 'drone',
    desc: 'Run detection, tracking and obstacle avoidance at the edge. Inference stays on the vehicle when the link drops.',
  },
  {
    name: 'Secure by design',
    icon: 'lock',
    desc: 'Secure boot, encrypted storage and signed over-the-air updates. NDAA-compliant, built for contested environments.',
  },
  {
    name: 'Always connected',
    icon: 'bars',
    desc: 'Integrated 4G/5G and mesh radios keep telemetry and video flowing — with automatic failover between links.',
  },
];

const variants: { name: string; tag: string; blurb: string; specs: string[]; featured?: boolean }[] = [
  {
    name: 'Skynode S',
    tag: 'Compact',
    blurb: 'The smallest full-stack module. For sub-2 kg airframes and tight payload budgets.',
    specs: ['140 g', '100 TOPS', '4G + mesh', 'IP54'],
  },
  {
    name: 'Skynode',
    tag: 'Flagship',
    featured: true,
    blurb: 'The field-proven standard. Powers thousands of vehicles across defense and enterprise.',
    specs: ['199 g', '275 TOPS', '5G + mesh', 'IP67'],
  },
  {
    name: 'Skynode X',
    tag: 'Heavy compute',
    blurb: 'Maximum AI throughput for multi-sensor autonomy and on-board fusion.',
    specs: ['320 g', '500 TOPS', '5G + mesh', 'IP67'],
  },
];

const compliance = ['NDAA Section 848', 'Blue UAS framework', 'AES-256 storage', 'Secure boot', 'MAVLink-native'];
</script>

<template>
  <div>

    <!-- ╭─ Cover ────────────────────────────────────────────────────╮ -->
    <WebHero
      eyebrow="Skynode"
      title="The brain that runs the stack."
      subtitle="Flight control, mission compute, AI acceleration and connectivity — in a single 199-gram module. The hardware foundation behind every Auterion vehicle."
      facts="199 G · 275 TOPS · &lt;15 W · IP67"
      primary="Request a unit"
      secondary="Read the datasheet"
      @primary="navigate('company')"
      @secondary="navigate('developers')"
    />

    <!-- ╭─ Header ledger ────────────────────────────────────────────╮
         The spec strip IS the header ledger: it tops the case layout, its
         columns are the page's alignment, and the measured column runs
         hard right. -->
    <section class="wb-band">
      <div class="wb-wrap wb-block-sm">
        <div class="dk-ledger wb-ledger-4">
          <div
            v-for="(s, i) in specs"
            :key="s.label"
            class="dk-ledger-cell"
            :data-align="i === specs.length - 1 ? 'end' : undefined"
          >
            <span class="dk-pointer">{{ s.label }}</span>
            <span class="wb-figure-num">{{ s.value }}</span>
            <span v-if="s.unit" class="dk-label">{{ s.unit }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ╭─ What's inside ────────────────────────────────────────────╮ -->
    <section>
      <div class="wb-wrap wb-block">
        <div class="dk-section">
          <span class="dk-label">What's inside</span>
          <span class="dk-bracket">4 SUBSYSTEMS · 1 MODULE</span>
        </div>
        <div class="wb-head">
          <h2 class="dk-h1">One module. The whole vehicle.</h2>
          <p class="dk-body-lg wb-measure-text">
            Everything that used to take a rack of boards and weeks of integration now fits in the palm of your hand.
          </p>
        </div>

        <div class="wb-grid" data-cols="2">
          <div v-for="c in capabilities" :key="c.name" class="dk-card dk-lift wb-tile">
            <div class="wb-tile-head">
              <span class="wb-tile-mark"><Icon :name="c.icon" size="xs" /></span>
            </div>
            <h3 class="dk-h2">{{ c.name }}</h3>
            <p class="dk-body">{{ c.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ╭─ The family ───────────────────────────────────────────────╮ -->
    <section class="wb-band wb-band-alt">
      <div class="wb-wrap wb-block">
        <div class="dk-section">
          <span class="dk-label">The family</span>
          <span class="dk-bracket">3 MODULES · 140–320 G</span>
        </div>
        <div class="wb-head">
          <h2 class="dk-h1">Pick the module that fits your airframe.</h2>
        </div>

        <div class="wb-grid" data-cols="3">
          <div
            v-for="v in variants"
            :key="v.name"
            class="dk-card dk-lift wb-tile"
            :data-featured="v.featured ? 'true' : undefined"
          >
            <div class="wb-tile-head">
              <span class="dk-label">{{ v.tag }}</span>
              <span v-if="v.featured" class="dk-label">Most deployed</span>
            </div>
            <h3 class="dk-h2">{{ v.name }}</h3>
            <p class="dk-body">{{ v.blurb }}</p>

            <ul class="wb-list">
              <li v-for="sp in v.specs" :key="sp" class="wb-list-item">
                <span class="dk-small dk-num">{{ sp }}</span>
              </li>
            </ul>

            <span class="wb-tile-foot">
              <button type="button" class="dk-cta dk-cta-sm" @click="navigate('company')">
                Configure <Icon name="arrow-right" size="xs" />
              </button>
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- ╭─ Compliance ───────────────────────────────────────────────╮ -->
    <section class="wb-band">
      <div class="wb-wrap wb-block-sm">
        <div class="dk-section">
          <span class="dk-label">Trusted &amp; compliant</span>
          <span class="dk-bracket">5 STANDARDS</span>
        </div>
        <div class="wb-grid" data-cols="3">
          <span v-for="c in compliance" :key="c" class="wb-rule-row wb-row-lead">
            <Icon name="lock" size="xs" class="wb-glyph" />
            <span class="dk-value">{{ c }}</span>
          </span>
        </div>
      </div>
    </section>

    <!-- ╭─ Proof close ──────────────────────────────────────────────╮ -->
    <section class="wb-band">
      <div class="wb-wrap wb-block">
        <div class="dk-plate wb-cover">
          <div class="wb-cover-copy">
            <p class="dk-h2 dk-ghost">Get started</p>
            <h2 class="dk-display">Build your vehicle on Skynode.</h2>
          </div>
          <p class="dk-body-lg wb-cover-lede">
            Tell us about your airframe and mission. We'll help you spec the right module and get you flying.
          </p>
          <div class="wb-actions">
            <button type="button" class="dk-cta-solid" @click="navigate('company')">
              Request a unit <Icon name="arrow-right" size="xs" />
            </button>
            <button type="button" class="dk-cta" @click="navigate('developers')">Read the docs</button>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
