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

const industries: { name: string; icon: IconName; blurb: string; to?: string }[] = [
  { name: 'Defense', icon: 'triangle-exclamation', blurb: 'ISR, force protection and tactical autonomy for allied forces.', to: 'defense' },
  { name: 'Public Safety', icon: 'bell', blurb: 'First-responder situational awareness, search-and-rescue and incident command.' },
  { name: 'Energy & Utilities', icon: 'gear', blurb: 'Automated inspection of grids, pipelines, wind and solar at scale.' },
  { name: 'Construction', icon: 'house', blurb: 'Photogrammetry, progress tracking and volumetric site mapping.' },
  { name: 'Logistics', icon: 'arrow-up-right-from-square', blurb: 'BVLOS delivery networks with fleet routing and airspace integration.' },
  { name: 'Agriculture', icon: 'drone', blurb: 'Crop scouting, spraying and yield analytics across large operations.' },
];

const caseStats = [
  { value: '70%', label: 'Faster inspection' },
  { value: '12k', label: 'Flights per year' },
  { value: '9', label: 'Regions covered' },
];

const pylonRows = [37, 77, 117, 157, 197];
const pylonCols = [40, 100, 160, 220, 280];
</script>

<template>
  <div>

    <!-- ╭─ Cover ────────────────────────────────────────────────────╮ -->
    <WebHero
      eyebrow="Solutions"
      title="Built for every operation."
      subtitle="Defense, energy, logistics, public safety. Same platform. Configured for each."
      facts="6 SECTORS · 1 PLATFORM"
      primary="Find your solution"
      secondary="Talk to an expert"
      @primary="navigate('company')"
      @secondary="navigate('company')"
    />

    <!-- ╭─ Industries ───────────────────────────────────────────────╮ -->
    <section class="wb-band">
      <div class="wb-wrap wb-block">
        <div class="dk-section">
          <span class="dk-label">Industries</span>
          <span class="dk-bracket">6 SECTORS</span>
        </div>
        <div class="wb-head">
          <h2 class="dk-h1">Every sector. One platform.</h2>
        </div>

        <div class="wb-grid" data-cols="3">
          <button
            v-for="ind in industries"
            :key="ind.name"
            type="button"
            class="dk-card dk-lift wb-tile"
            @click="ind.to && navigate(ind.to)"
          >
            <div class="wb-tile-head">
              <span class="wb-tile-mark"><Icon :name="ind.icon" size="xs" /></span>
            </div>
            <h3 class="dk-h2">{{ ind.name }}</h3>
            <p class="dk-body">{{ ind.blurb }}</p>
            <span v-if="ind.to" class="wb-tile-foot">
              <span class="dk-label">Open</span>
              <Icon name="arrow-right" size="xs" class="wb-tile-go" />
            </span>
          </button>
        </div>
      </div>
    </section>

    <!-- ╭─ Case study ───────────────────────────────────────────────╮ -->
    <section class="wb-band wb-band-alt">
      <div class="wb-wrap wb-block">
        <div class="dk-section">
          <span class="dk-label">Case study · Energy &amp; utilities</span>
          <span class="dk-bracket">40,000 KM · 12K FLIGHTS · 9 REGIONS</span>
        </div>

        <div class="wb-split wb-stack" data-lead="wide">
          <div>
            <h2 class="dk-h1">Inspecting 40,000 km of grid, autonomously.</h2>
            <p class="dk-body-lg wb-measure-text wb-stack">
              A national utility replaced manual line inspection with an Auterion-powered fleet —
              cutting inspection time by 70% and flagging faults before they became outages.
            </p>

            <div class="dk-ledger wb-stack">
              <div
                v-for="(s, i) in caseStats"
                :key="s.label"
                class="dk-ledger-cell"
                :data-align="i === caseStats.length - 1 ? 'end' : undefined"
              >
                <span class="dk-pointer">{{ s.label }}</span>
                <span class="wb-figure-num">{{ s.value }}</span>
              </div>
            </div>
          </div>

          <!-- Flight-path figure. Ink for geometry, the ladder for the one
               thing that is genuinely a state: the detected fault. -->
          <figure class="dk-card wb-figure">
            <div class="wb-figure-bar">
              <span class="dk-label">Inspection flight path</span>
              <span class="dk-bracket wb-push">1 FAULT</span>
            </div>
            <div class="wb-figure-body">
              <svg viewBox="0 0 320 226" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full" role="img" aria-label="Lawnmower inspection path over a power-grid section, with one detected fault">
                <g stroke="var(--dk-line)" stroke-width="1" stroke-dasharray="4 3">
                  <line v-for="y in pylonRows" :key="`h${y}`" x1="40" :y1="y + 3" x2="280" :y2="y + 3" />
                  <line v-for="x in pylonCols" :key="`v${x}`" :x1="x" y1="40" :x2="x" y2="200" />
                </g>

                <polyline
                  points="40,50 280,50 280,70 40,70 40,90 280,90 280,110 40,110 40,130 280,130 280,150 40,150 40,170 280,170 280,190 40,190"
                  stroke="var(--dk-fg-3)"
                  stroke-width="1.5"
                  fill="none"
                  stroke-linejoin="round"
                />

                <g fill="var(--dk-fg-2)">
                  <template v-for="y in pylonRows" :key="`r${y}`">
                    <rect v-for="x in pylonCols" :key="`p${x}-${y}`" :x="x - 3" :y="y" width="6" height="6" rx="1" />
                  </template>
                </g>

                <circle cx="160" cy="130" r="7" fill="none" stroke="var(--alarm)" stroke-width="1.5" />
                <circle cx="160" cy="130" r="2" fill="var(--alarm)" />
                <circle cx="280" cy="50" r="4" fill="var(--dk-fg)" />

                <line x1="40" y1="214" x2="60" y2="214" stroke="var(--dk-fg-3)" stroke-width="1.5" />
                <text x="66" y="218" class="dk-micro" fill="var(--dk-fg-3)">FLIGHT PATH</text>
                <circle cx="160" cy="214" r="4" fill="none" stroke="var(--alarm)" stroke-width="1.5" />
                <text x="170" y="218" class="dk-micro" fill="var(--dk-fg-3)">FAULT DETECTED</text>
              </svg>
            </div>
          </figure>
        </div>
      </div>
    </section>

    <!-- ╭─ Quote ────────────────────────────────────────────────────╮ -->
    <section class="wb-band">
      <div class="wb-wrap wb-block">
        <figure class="wb-narrow-col">
          <blockquote class="wb-quote">
            "We went from scheduling inspections in weeks to launching them in minutes.
            The whole fleet runs on one stack."
          </blockquote>
          <figcaption class="wb-quote-by">
            <span class="wb-initials">AR</span>
            <span>
              <span class="dk-value">Anna Roth</span>
              <span class="dk-small block">Head of Grid Ops, Nordic Power</span>
            </span>
          </figcaption>
        </figure>
      </div>
    </section>

    <!-- ╭─ Proof close ──────────────────────────────────────────────╮ -->
    <section class="wb-band">
      <div class="wb-wrap wb-block">
        <div class="dk-plate wb-cover">
          <div class="wb-cover-copy">
            <p class="dk-h2 dk-ghost">Get started</p>
            <h2 class="dk-display">Find your solution.</h2>
          </div>
          <p class="dk-body-lg wb-cover-lede">
            Tell us about your operation and we'll map the right configuration.
          </p>
          <div class="wb-actions">
            <button type="button" class="dk-cta-solid" @click="navigate('company')">
              Talk to our team <Icon name="arrow-right" size="xs" />
            </button>
            <button type="button" class="dk-cta" @click="navigate('products')">Explore the platform</button>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>
