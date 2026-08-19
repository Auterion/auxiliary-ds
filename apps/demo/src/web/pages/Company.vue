<!--
  Hallmark · macrostructure: Editorial (portfolio deck) · tone: measured/declarative
  anchor hue: auterion blue (rationed — none on this page; the masthead mark is
  the view's only signal)
  pre-emit critique: P5 H5 E5 S5 R5 V4
-->
<script setup lang="ts">
import { inject } from 'vue';
import { Icon } from '@auxiliary/icons';
import WebHero from '../WebHero.vue';

const navigate = inject<(p: string) => void>('navigate', () => {});

const stats = [
  { value: '2017', label: 'Founded' },
  { value: '450+', label: 'Team members' },
  { value: '6', label: 'Global offices' },
  { value: '$430M', label: 'Raised' },
];

const values = [
  { name: 'Mission first', blurb: 'We build for the operator in the field, not the demo on the stage.' },
  { name: 'Open by default', blurb: 'Open standards and APIs beat walled gardens — for everyone.' },
  { name: 'Earn trust', blurb: 'Safety, security and reliability are features, never afterthoughts.' },
];

const team = [
  { initials: 'LM', name: 'Lorenz M.', role: 'CEO' },
  { initials: 'KS', name: 'Kevin S.', role: 'CTO' },
  { initials: 'AD', name: 'Aïcha D.', role: 'VP Product' },
  { initials: 'RT', name: 'Ravi T.', role: 'VP Engineering' },
  { initials: 'EN', name: 'Elin N.', role: 'VP Defense' },
  { initials: 'MO', name: 'Marco O.', role: 'VP Operations' },
];

const news = [
  { tag: 'Press', title: 'Auterion partners with allied forces on counter-UAS autonomy', date: 'May 2026' },
  { tag: 'Product', title: 'AuterionOS 4.2 brings on-device tracking to every Skynode', date: 'Apr 2026' },
  { tag: 'Company', title: 'Auterion opens new R&D center in Munich', date: 'Mar 2026' },
];
</script>

<template>
  <div>

    <!-- ╭─ Cover ────────────────────────────────────────────────────╮ -->
    <WebHero
      eyebrow="Company"
      title="Software for the robotic age."
      subtitle="We're building the open operating system that lets any organization deploy autonomous robots — safely, at scale, anywhere."
      facts="FOUNDED 2017 · 450+ TEAM · 6 OFFICES"
      primary="Join us"
      secondary="Our story"
      @primary="navigate('developers')"
      @secondary="navigate('home')"
    />

    <!-- ╭─ Header ledger ────────────────────────────────────────────╮ -->
    <section class="wb-band">
      <div class="wb-wrap wb-block-sm">
        <div class="dk-ledger wb-ledger-4">
          <div
            v-for="(s, i) in stats"
            :key="s.label"
            class="dk-ledger-cell"
            :data-align="i === stats.length - 1 ? 'end' : undefined"
          >
            <span class="dk-pointer">{{ s.label }}</span>
            <span class="wb-figure-num">{{ s.value }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ╭─ Values ───────────────────────────────────────────────────╮ -->
    <section>
      <div class="wb-wrap wb-block">
        <div class="dk-section">
          <span class="dk-label">What we believe</span>
          <span class="dk-bracket">3 PRINCIPLES</span>
        </div>
        <div class="wb-head">
          <h2 class="dk-h1">Principles that guide the work.</h2>
        </div>

        <div class="wb-grid" data-cols="3">
          <div v-for="(v, i) in values" :key="v.name" class="dk-card wb-tile">
            <span class="dk-label dk-num">{{ String(i + 1).padStart(2, '0') }}</span>
            <h3 class="dk-h2">{{ v.name }}</h3>
            <p class="dk-body">{{ v.blurb }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ╭─ Leadership ───────────────────────────────────────────────╮ -->
    <section class="wb-band wb-band-alt">
      <div class="wb-wrap wb-block">
        <div class="dk-section">
          <span class="dk-label">Leadership</span>
          <span class="dk-bracket">6 OFFICERS</span>
        </div>
        <div class="wb-head">
          <h2 class="dk-h1">The team behind the stack.</h2>
        </div>

        <div class="wb-grid" data-cols="6">
          <div v-for="t in team" :key="t.name" class="dk-card wb-tile">
            <span class="wb-initials">{{ t.initials }}</span>
            <span class="dk-value">{{ t.name }}</span>
            <span class="dk-label">{{ t.role }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- ╭─ Newsroom ─────────────────────────────────────────────────╮ -->
    <section class="wb-band">
      <div class="wb-wrap wb-block">
        <div class="dk-section">
          <span class="dk-label">Newsroom</span>
          <button type="button" class="dk-link">All news</button>
        </div>
        <div class="wb-head">
          <h2 class="dk-h1">Latest from Auterion.</h2>
        </div>

        <div class="wb-grid" data-cols="3">
          <a v-for="n in news" :key="n.title" class="dk-card dk-lift wb-tile" tabindex="0">
            <div class="wb-tile-head">
              <span class="dk-label">{{ n.tag }}</span>
              <span class="dk-label dk-num">{{ n.date }}</span>
            </div>
            <h3 class="dk-h2">{{ n.title }}</h3>
            <span class="wb-tile-foot">
              <span class="dk-label">Read</span>
              <Icon name="arrow-right" size="xs" class="wb-tile-go" />
            </span>
          </a>
        </div>
      </div>
    </section>

    <!-- ╭─ Proof close ──────────────────────────────────────────────╮ -->
    <section class="wb-band">
      <div class="wb-wrap wb-block">
        <div class="dk-plate wb-cover">
          <div class="wb-cover-copy">
            <p class="dk-h2 dk-ghost">Careers</p>
            <h2 class="dk-display">Come build the future of autonomy.</h2>
          </div>
          <p class="dk-body-lg wb-cover-lede">
            We're hiring across engineering, product, defense and operations — worldwide.
          </p>
          <div class="wb-actions">
            <button type="button" class="dk-cta-solid">
              See open roles <Icon name="arrow-right" size="xs" />
            </button>
            <button type="button" class="dk-cta" @click="navigate('home')">Back to home</button>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
