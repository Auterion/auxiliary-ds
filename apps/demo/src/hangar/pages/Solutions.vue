<script setup lang="ts">
import { inject } from 'vue';
import { Icon } from '@auxiliary/icons';
import Band from '../parts/Band.vue';
import Pill from '../parts/Pill.vue';
import Plate from '../parts/Plate.vue';
import SectionHead from '../parts/SectionHead.vue';
import Statement from '../parts/Statement.vue';
import { DEPLOYMENTS, SECTORS, type PageKey } from '../content';

const go = inject<(p: PageKey) => void>('hangar-navigate', () => {});
</script>

<template>
  <!-- ── Hero ─────────────────────────────────────────────────────────── -->
  <Band exposure="ink" pad="none">
    <template #backdrop><Plate kind="orbit" :seed="6" style="opacity: 0.55" /></template>
    <div>
      <div style="padding-block: calc(var(--hg-nav-h) + var(--hg-band)) var(--hg-band)">
        <SectionHead
          eyebrow="Solutions"
          title="Four industries, one operator model"
          lede="The mission changes; the way a person commands a fleet does not. Every sector below runs the same stack with a different payload and a different set of rules."
        />
      </div>
    </div>
  </Band>

  <!-- ── Sectors ──────────────────────────────────────────────────────── -->
  <Band
    v-for="(s, i) in SECTORS"
    :key="s.id"
    :exposure="i % 2 === 0 ? 'paper' : 'ink'"
    pad="none"
  >
    <div
      class="hg-full"
      style="display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); align-items: stretch"
    >
      <!-- The plate alternates side with the exposure, so scanning the page
           produces a rhythm rather than four identical rows. -->
      <Plate
        :kind="s.plate"
        :seed="i * 7 + 3"
        :style="{ order: i % 2 === 0 ? 1 : 0, minBlockSize: 'clamp(320px, 42vw, 560px)' }"
      />
      <div style="display: grid; align-content: center; gap: 22px; padding: clamp(32px, 5vw, 80px) var(--hg-gutter)">
        <p class="hg-meta">{{ s.idx }} · {{ s.name }}</p>
        <h2 class="hg-h1">{{ s.title }}</h2>
        <p class="hg-lede">{{ s.body }}</p>
        <ul style="list-style: none; margin: 8px 0 0; padding: 0; display: grid; gap: 0; border-block-start: 1px solid var(--hg-line)">
          <li
            v-for="p in s.points"
            :key="p"
            class="hg-mono"
            style="display: flex; gap: 12px; align-items: baseline; padding-block: 12px; border-block-end: 1px solid var(--hg-line); color: var(--hg-fg)"
          >
            <Icon name="check" :size="13" aria-hidden="true" style="flex: none; color: var(--hg-fg-3)" />
            <span>{{ p }}</span>
          </li>
        </ul>
      </div>
    </div>
  </Band>

  <!-- ── Statement ────────────────────────────────────────────────────── -->
  <Band exposure="ink">
    <div class="hg-col">
      <Statement
        text="A programme is not won by the airframe. It is won by whether the people flying it can be trained in a week, whether the fleet can be updated without a depot visit, and whether the picture survives the moment the network does not."
      />
    </div>
  </Band>

  <!-- ── Deployments ──────────────────────────────────────────────────── -->
  <Band exposure="paper" pad="none">
    <div style="padding-block-start: var(--hg-band)">
      <SectionHead eyebrow="Deployments" title="Flying today" />
    </div>

    <div class="hg-full" style="margin-block-start: clamp(40px, 5vw, 64px)">
      <div class="hg-rowlist">
        <a v-for="d in DEPLOYMENTS" :key="d.client" class="hg-row" href="#deployment">
          <span class="hg-row-mark hg-h3" translate="no">{{ d.client }}</span>
          <span class="hg-meta">{{ d.year }}</span>
          <span>
            <span class="hg-row-title" style="display: block">{{ d.title }}</span>
            <span class="hg-mono">{{ d.body }}</span>
          </span>
          <Icon name="chevron-right" :size="18" class="hg-row-chev" aria-hidden="true" />
        </a>
      </div>
    </div>

    <div class="hg-full" style="padding: clamp(32px, 4vw, 56px) var(--hg-gutter) var(--hg-band)">
      <Pill label="See the platform" variant="ghost" @click="go('product')" />
    </div>
  </Band>
</template>
