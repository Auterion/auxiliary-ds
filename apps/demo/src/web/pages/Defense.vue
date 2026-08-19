<!--
  Hallmark · macrostructure: Editorial (portfolio deck) · tone: measured/declarative
  anchor hue: auterion blue (rationed — none on this page; the masthead mark is
  the view's only signal)
  pre-emit critique: P5 H5 E5 S5 R5 V4
-->
<script setup lang="ts">
import { inject } from 'vue';
import WebHero from '../WebHero.vue';
import { Icon, type IconName } from '@auxiliary/icons';

const navigate = inject<(p: string) => void>('navigate', () => {});

const trustItems = [
  { label: '30+ allied nations' },
  { label: 'AES-256 encryption' },
  { label: 'NDAA compliant' },
  { label: '0 cloud required' },
];

const capabilities: { icon: IconName; title: string; description: string }[] = [
  {
    icon: 'bars',
    title: 'Contested Environments',
    description: 'Full autonomy under GPS denial, jamming, and lost-link conditions. On-board intelligence keeps missions on task when connectivity drops.',
  },
  {
    icon: 'gear',
    title: 'On-device AI',
    description: 'Detection, tracking, and re-identification execute entirely at the edge — no cloud dependency, no round-trip latency, no single point of failure.',
  },
  {
    icon: 'lock',
    title: 'Secure Datalink',
    description: 'AES-256 end-to-end C2 and video. Spectrum-agile mesh with anti-tamper key management and zero-trust node authentication.',
  },
  {
    icon: 'circle-info',
    title: 'Open Architecture',
    description: 'Standards-based interfaces (STANAG 4586, MAVLink) enable fast integration with existing force assets and allied systems.',
  },
];

const nodes = [
  { id: 'hq',    x: 80,  y: 100, label: 'HQ',     primary: true },
  { id: 'gs1',   x: 260, y: 60,  label: 'GCS-1' },
  { id: 'gs2',   x: 260, y: 160, label: 'GCS-2' },
  { id: 'uav1',  x: 420, y: 40,  label: 'UAV-1' },
  { id: 'uav2',  x: 420, y: 110, label: 'UAV-2' },
  { id: 'ugv1',  x: 420, y: 180, label: 'UGV-1' },
];

const edges: [string, string][] = [
  ['hq', 'gs1'],
  ['hq', 'gs2'],
  ['gs1', 'uav1'],
  ['gs1', 'uav2'],
  ['gs2', 'ugv1'],
];

const facts = [
  { value: '30+', label: 'Allied nations' },
  { value: 'AES-256', label: 'Encryption standard' },
  { value: '0', label: 'Cloud required' },
];

function nodePos(id: string) {
  return nodes.find(n => n.id === id)!;
}
</script>

<template>
  <div>

    <!-- ╭─ Cover ────────────────────────────────────────────────────╮ -->
    <WebHero
      eyebrow="Defense"
      title="Autonomy for allied forces."
      subtitle="NDAA-compliant. On-device AI. Zero cloud dependency."
      facts="30+ ALLIED NATIONS · AES-256 · 0 CLOUD REQUIRED"
      primary="Request briefing"
      secondary="View documentation"
      @primary="navigate('company')"
      @secondary="navigate('developers')"
    />

    <!-- ╭─ Assurances ───────────────────────────────────────────────╮
         Ruled rows, not a ledger: these are four flat claims with no
         label/value split to hang a pointer on. -->
    <section class="wb-band">
      <div class="wb-wrap wb-block-sm">
        <div class="wb-grid" data-cols="4">
          <span v-for="item in trustItems" :key="item.label" class="wb-rule-row wb-row-lead">
            <Icon name="circle-check" size="xs" class="wb-glyph" />
            <span class="dk-value dk-num">{{ item.label }}</span>
          </span>
        </div>
      </div>
    </section>

    <!-- ╭─ Capabilities ─────────────────────────────────────────────╮ -->
    <section>
      <div class="wb-wrap wb-block">
        <div class="dk-section">
          <span class="dk-label">Capabilities</span>
          <span class="dk-bracket">4 CORE CAPABILITIES</span>
        </div>
        <div class="wb-head">
          <h2 class="dk-h1">Built for the mission.</h2>
          <p class="dk-body-lg wb-measure-text">
            Four core capabilities that make Auterion the platform of choice for autonomous defense operations.
          </p>
        </div>

        <div class="wb-grid" data-cols="2">
          <div v-for="cap in capabilities" :key="cap.title" class="dk-card dk-lift wb-tile">
            <div class="wb-tile-head">
              <span class="wb-tile-mark"><Icon :name="cap.icon" size="xs" /></span>
            </div>
            <h3 class="dk-h2">{{ cap.title }}</h3>
            <p class="dk-body">{{ cap.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ╭─ Architecture ─────────────────────────────────────────────╮ -->
    <section class="wb-band wb-band-alt">
      <div class="wb-wrap wb-block">
        <div class="dk-section">
          <span class="dk-label">Architecture</span>
          <span class="dk-bracket">1 HQ · 2 GCS · 3 VEHICLES</span>
        </div>

        <div class="wb-split wb-stack">
          <div>
            <h2 class="dk-h1">Connected from HQ to the last node.</h2>
            <p class="dk-body-lg wb-measure-text wb-stack">
              A unified command architecture linking headquarters, ground control stations, and autonomous
              vehicles — all encrypted, all sovereign.
            </p>
          </div>

          <figure class="dk-card wb-figure">
            <div class="wb-figure-bar">
              <span class="dk-label">Deployment topology</span>
              <span class="dk-bracket wb-push">6 NODES · 5 LINKS</span>
            </div>
            <div class="wb-figure-body">
              <svg viewBox="0 0 500 232" class="w-full" role="img" aria-label="Deployment network: HQ to vehicles via ground control stations">
                <g v-for="[a, b] in edges" :key="`${a}-${b}`">
                  <line
                    :x1="nodePos(a).x" :y1="nodePos(a).y"
                    :x2="nodePos(b).x" :y2="nodePos(b).y"
                    stroke="var(--dk-line)"
                    stroke-width="1.5"
                    stroke-dasharray="4 3"
                  />
                </g>

                <g v-for="n in nodes" :key="n.id">
                  <circle
                    v-if="n.primary"
                    :cx="n.x" :cy="n.y" r="22"
                    fill="none"
                    stroke="var(--dk-line)"
                    stroke-width="1"
                  />
                  <circle
                    :cx="n.x" :cy="n.y"
                    :r="n.primary ? 16 : 11"
                    :fill="n.primary ? 'var(--dk-fg)' : 'var(--dk-bg)'"
                    stroke="var(--dk-fg-3)"
                    stroke-width="1.5"
                  />
                  <text
                    :x="n.x"
                    :y="n.primary ? n.y + 38 : n.y + 26"
                    text-anchor="middle"
                    class="dk-micro"
                    :fill="n.primary ? 'var(--dk-fg)' : 'var(--dk-fg-3)'"
                  >{{ n.label }}</text>
                  <text
                    v-if="n.primary"
                    :x="n.x" :y="n.y + 3"
                    text-anchor="middle"
                    class="dk-micro"
                    fill="var(--dk-bg)"
                  >HQ</text>
                </g>
              </svg>
            </div>
          </figure>
        </div>
      </div>
    </section>

    <!-- ╭─ Measured facts ───────────────────────────────────────────╮ -->
    <section class="wb-band">
      <div class="wb-wrap wb-block-sm">
        <div class="dk-ledger">
          <div
            v-for="(f, i) in facts"
            :key="f.label"
            class="dk-ledger-cell"
            :data-align="i === facts.length - 1 ? 'end' : undefined"
          >
            <span class="dk-pointer">{{ f.label }}</span>
            <span class="wb-figure-num">{{ f.value }}</span>
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
            <h2 class="dk-display">Ready to deploy?</h2>
          </div>
          <p class="dk-body-lg wb-cover-lede">
            Defense programs are invite-only. Contact our team to discuss requirements and your operational environment.
          </p>
          <div class="wb-actions">
            <button type="button" class="dk-cta-solid" @click="navigate('company')">
              Request briefing <Icon name="arrow-right" size="xs" />
            </button>
            <button type="button" class="dk-cta" @click="navigate('developers')">View documentation</button>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
