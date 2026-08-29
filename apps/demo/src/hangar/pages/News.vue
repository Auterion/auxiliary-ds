<script setup lang="ts">
import { computed, ref } from 'vue';
import Band from '../parts/Band.vue';
import Eyebrow from '../parts/Eyebrow.vue';
import Pill from '../parts/Pill.vue';
import Plate from '../parts/Plate.vue';
import SectionHead from '../parts/SectionHead.vue';
import { ARTICLES } from '../content';

const kinds = computed(() => ['All', ...new Set(ARTICLES.map((a) => a.kind))]);
const kind = ref('All');
const list = computed(() => (kind.value === 'All' ? ARTICLES : ARTICLES.filter((a) => a.kind === kind.value)));

/* The lead is the newest article that survives the filter, not a hardcoded
 * index — otherwise filtering to a category whose newest piece is third would
 * feature something that is not in the list below it. */
const lead = computed(() => list.value[0]);
const rest = computed(() => list.value.slice(1));
</script>

<template>
  <!-- ── Hero ─────────────────────────────────────────────────────────── -->
  <Band exposure="paper" pad="none">
    <div style="padding-block: calc(var(--hg-nav-h) + var(--hg-band)) var(--hg-band-sm)">
      <SectionHead
        eyebrow="News"
        title="From the hangar"
        lede="Field notes, engineering write-ups, and the occasional argument about colour. Written by the people who shipped the thing."
      />
    </div>

    <div class="hg-full" style="padding-inline: var(--hg-gutter); margin-block-end: clamp(28px, 3vw, 40px)">
      <div role="group" aria-label="Filter articles by category" style="display: flex; flex-wrap: wrap; gap: 8px">
        <button
          v-for="k in kinds"
          :key="k"
          type="button"
          class="hg-mono"
          :aria-pressed="kind === k"
          style="padding: 8px 14px; border-radius: var(--radius-full); cursor: pointer; border: 1px solid var(--hg-line); background: none"
          :style="{
            borderColor: kind === k ? 'var(--hg-fg)' : 'var(--hg-line)',
            color: kind === k ? 'var(--hg-bg)' : 'var(--hg-fg-2)',
            background: kind === k ? 'var(--hg-fg)' : 'transparent',
          }"
          @click="kind = k"
        >
          {{ k }}
        </button>
      </div>
    </div>
  </Band>

  <!-- ── Lead ─────────────────────────────────────────────────────────── -->
  <Band exposure="paper" pad="none">
    <a
      v-if="lead"
      class="hg-full"
      href="#article"
      style="display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(0, 1fr); align-items: stretch; text-decoration: none; color: inherit; border-block: 1px solid var(--hg-line)"
    >
      <div style="position: relative; min-block-size: clamp(280px, 34vw, 460px)">
        <Plate :kind="lead.plate" :seed="lead.seed" style="position: absolute; inset: 0" />
      </div>
      <div style="display: grid; align-content: center; gap: 18px; padding: clamp(28px, 4vw, 56px) var(--hg-gutter)">
        <p class="hg-meta">{{ lead.kind }} · {{ lead.date }} · {{ lead.read }}</p>
        <h2 class="hg-h2">{{ lead.title }}</h2>
        <p class="hg-lede">{{ lead.excerpt }}</p>
        <span class="hg-mono" style="color: var(--hg-fg)">Read the piece →</span>
      </div>
    </a>
  </Band>

  <!-- ── Grid ─────────────────────────────────────────────────────────── -->
  <Band exposure="paper" pad="none">
    <div class="hg-full">
      <ul
        style="list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr))"
      >
        <li v-for="a in rest" :key="a.id" style="border-inline-start: 1px solid var(--hg-line); border-block-end: 1px solid var(--hg-line)">
          <a
            href="#article"
            style="display: grid; gap: 18px; padding: clamp(20px, 2.4vw, 32px); text-decoration: none; color: inherit; block-size: 100%; align-content: start"
          >
            <Plate :kind="a.plate" :seed="a.seed" style="aspect-ratio: 16 / 10" />
            <p class="hg-meta">{{ a.kind }} · {{ a.date }}</p>
            <h3 class="hg-news-title">{{ a.title }}</h3>
            <p class="hg-body">{{ a.excerpt }}</p>
            <p class="hg-meta" style="margin-block-start: auto">{{ a.read }}</p>
          </a>
        </li>
      </ul>

      <p v-if="!list.length" class="hg-mono" style="padding: clamp(32px, 4vw, 56px) var(--hg-gutter)">
        Nothing filed under this category yet.
      </p>
    </div>
  </Band>

  <!-- ── Subscribe ────────────────────────────────────────────────────── -->
  <Band exposure="ink" pad="none">
    <template #backdrop><Plate kind="halftone" :seed="21" style="opacity: 0.4" /></template>
    <div>
      <div class="hg-col" style="padding-block: var(--hg-band)">
        <Eyebrow label="Get it early" />
        <h2 class="hg-h1" style="margin-block: 22px">Field notes, once a month</h2>
        <p class="hg-lede" style="margin-block-end: 32px">
          What we shipped, what broke, and what the operators told us afterwards. No product
          announcements dressed as insight.
        </p>
        <form style="display: flex; flex-wrap: wrap; gap: 10px" @submit.prevent>
          <label for="hg-email" class="hg-meta" style="flex-basis: 100%">Work email</label>
          <input
            id="hg-email"
            type="email"
            name="email"
            autocomplete="email"
            spellcheck="false"
            placeholder="you@organisation.gov…"
            style="flex: 1 1 260px; min-inline-size: 0; padding: 13px 16px; font-family: var(--font-mono); font-size: 13px; color: var(--hg-fg); background: transparent; border: 1px solid var(--hg-line); border-radius: var(--radius-xs)"
          />
          <Pill label="Subscribe" icon="arrow-right" />
        </form>
      </div>
    </div>
  </Band>
</template>
