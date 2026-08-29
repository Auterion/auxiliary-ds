<script setup lang="ts">
import { inject } from 'vue';
import Band from '../parts/Band.vue';
import Eyebrow from '../parts/Eyebrow.vue';
import Pill from '../parts/Pill.vue';
import Plate from '../parts/Plate.vue';
import SectionHead from '../parts/SectionHead.vue';
import Statement from '../parts/Statement.vue';
import { COMPANY_NUMBERS, OFFICES, PRINCIPLES, type PageKey } from '../content';

const go = inject<(p: PageKey) => void>('hangar-navigate', () => {});
</script>

<template>
  <!-- ── Hero ─────────────────────────────────────────────────────────── -->
  <Band exposure="paper" pad="none">
    <div style="padding-block: calc(var(--hg-nav-h) + var(--hg-band)) var(--hg-band-sm)">
      <SectionHead
        eyebrow="Company"
        title="Building the software layer for autonomy"
        lede="Auterion exists because the hardest part of a drone programme was never the drone. It was everything that has to be true before a person will trust one over a live scene."
      />
    </div>

    <!-- The reference runs a full-bleed photographic marquee here. This runs
         plates: no stock, and nothing pretending to be a place we have been. -->
    <div class="hg-full" style="padding-inline: var(--hg-gutter)">
      <div class="hg-strip" style="padding-inline: 0">
        <Plate v-for="(k, i) in (['contour', 'swarm', 'halftone', 'orbit', 'scan'] as const)" :key="k" :kind="k" :seed="i * 3 + 1" />
      </div>
    </div>
  </Band>

  <!-- ── Statement ────────────────────────────────────────────────────── -->
  <Band exposure="paper">
    <div class="hg-col">
      <Statement
        text="We build the operating system, the mission computer and the operator surfaces for autonomous vehicles — and we keep them open, because an operator who cannot leave is not a customer."
      />
    </div>
  </Band>

  <!-- ── Numbers ──────────────────────────────────────────────────────── -->
  <Band exposure="ink" pad="small">
    <div class="hg-full">
      <ul
        style="list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); border-block-start: 1px solid var(--hg-line)"
      >
        <li
          v-for="[value, label] in COMPANY_NUMBERS"
          :key="label"
          style="padding: clamp(28px, 3vw, 48px); border-inline-start: 1px solid var(--hg-line); border-block-end: 1px solid var(--hg-line)"
        >
          <p class="hg-num" style="color: var(--hg-fg)">{{ value }}</p>
          <p class="hg-meta" style="margin-block-start: 14px">{{ label }}</p>
        </li>
      </ul>
    </div>
  </Band>

  <!-- ── Principles ───────────────────────────────────────────────────── -->
  <Band exposure="ink">
    <div class="hg-split">
      <div>
        <Eyebrow label="What we hold" />
        <h2 class="hg-h1" style="margin-block-start: 22px">Three positions we will not trade</h2>
      </div>
      <div style="display: grid; gap: clamp(28px, 3vw, 44px)">
        <article v-for="p in PRINCIPLES" :key="p.idx">
          <p class="hg-meta" style="margin-block-end: 12px">{{ p.idx }}</p>
          <h3 class="hg-h3" style="margin-block-end: 10px">{{ p.title }}</h3>
          <p class="hg-body">{{ p.body }}</p>
        </article>
      </div>
    </div>
  </Band>

  <!-- ── Offices ──────────────────────────────────────────────────────── -->
  <Band exposure="paper" pad="none">
    <div style="padding-block-start: var(--hg-band)">
      <SectionHead
        eyebrow="Where we are"
        title="Four sites, one timezone problem"
        lede="Engineering in Zurich, defence programmes in Arlington, integration in Munich, manufacturing in Salt Lake City."
      />
    </div>

    <div class="hg-full" style="margin-block-start: clamp(40px, 5vw, 64px)">
      <div class="hg-rowlist">
        <div v-for="[city, role] in OFFICES" :key="city" class="hg-row" style="cursor: default; grid-template-columns: 1fr 2fr auto">
          <span class="hg-h3" translate="no">{{ city }}</span>
          <span class="hg-mono">{{ role }}</span>
          <span class="hg-meta">//{{ String(OFFICES.findIndex((o) => o[0] === city) + 1).padStart(2, '0') }}</span>
        </div>
      </div>
    </div>

    <div class="hg-full" style="padding: clamp(32px, 4vw, 56px) var(--hg-gutter) var(--hg-band)">
      <Pill label="Open roles" variant="ghost" @click="go('careers')" />
    </div>
  </Band>
</template>
