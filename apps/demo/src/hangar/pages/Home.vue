<script setup lang="ts">
import { inject, ref } from 'vue';
import { Icon } from '@auxiliary/icons';
import { Gauge, Bars, Sparkline } from '@auxiliary/viz';
import Band from '../parts/Band.vue';
import Eyebrow from '../parts/Eyebrow.vue';
import Pill from '../parts/Pill.vue';
import Plate from '../parts/Plate.vue';
import SectionHead from '../parts/SectionHead.vue';
import Statement from '../parts/Statement.vue';
import {
  APPROACH,
  ARTICLES,
  CAPABILITIES,
  CAPABILITY_TILES,
  DEPLOYMENTS,
  FAQ,
  PARTNERS,
  STACK,
  TELEMETRY,
  type PageKey,
} from '../content';

const go = inject<(p: PageKey) => void>('hangar-navigate', () => {});
/* One panel open at a time; -1 is none. An accordion that can have every panel
 * open is a list with extra clicks. */
const open = ref(-1);
</script>

<template>
  <!-- ── Cover ────────────────────────────────────────────────────────── -->
  <Band exposure="ink" pad="none">
    <template #backdrop><Plate kind="swarm" :seed="4" scrim /></template>
    <div style="position: relative; min-block-size: min(100dvh, 900px); display: grid">
      <div
        class="hg-full"
        style="
          position: relative;
          display: grid;
          grid-template-rows: auto 1fr auto;
          gap: var(--spacing-8);
          padding: calc(var(--hg-nav-h) + 24px) var(--hg-gutter) clamp(32px, 5vw, 72px);
        "
      >
        <!-- The capability list sits in the third column, as the reference's
             does — it reads as a caption to the plate, not as navigation. -->
        <ul
          style="
            list-style: none;
            margin: 0;
            padding: 0;
            display: grid;
            gap: 4px;
            justify-self: start;
            margin-inline-start: 50%;
            max-width: 46ch;
          "
        >
          <li v-for="c in CAPABILITIES" :key="c" class="hg-h2" style="color: var(--hg-fg)">{{ c }}</li>
        </ul>

        <div style="align-self: end; display: grid; gap: clamp(20px, 2.5vw, 32px); max-width: 20ch">
          <h1 class="hg-display">Autonomy you can command</h1>
        </div>

        <div
          style="
            display: flex;
            flex-wrap: wrap;
            align-items: end;
            justify-content: space-between;
            gap: var(--spacing-6);
          "
        >
          <div style="display: grid; gap: 24px; max-width: 46ch">
            <p class="hg-lede" style="color: var(--hg-fg)">
              One software stack from the flight computer to the fleet. Deploy it on any airframe,
              fly it from any surface, and keep the picture when the network goes.
            </p>
            <Pill label="See the platform" style="justify-self: start" @click="go('product')" />
          </div>

          <ul
            style="list-style: none; margin: 0; padding: 0; display: flex; flex-wrap: wrap; justify-content: flex-end; gap: 10px clamp(14px, 2vw, 32px); max-width: min(100%, 46ch)"
          >
            <li v-for="p in PARTNERS" :key="p" class="hg-meta" translate="no">{{ p }}</li>
          </ul>
        </div>
      </div>
    </div>
  </Band>

  <!-- ── Statement ────────────────────────────────────────────────────── -->
  <Band exposure="ink">
    <div class="hg-col">
      <Statement
        text="Built on PX4 and MAVLink, open where it matters and hardened where it counts. Auterion turns a fleet of airframes into one software-defined system that an operator can actually command — in daylight, at night, and with the link down."
      />
      <p class="hg-body" style="margin-block-start: 32px">
        The stack runs on the vehicle, not in a datacentre you have to reach. Everything an
        operator needs to fly is on the aircraft and in their hands.
      </p>
    </div>
  </Band>

  <!-- ── Capabilities ─────────────────────────────────────────────────── -->
  <Band exposure="ink" pad="small">
    <div class="hg-full" style="margin-block-start: var(--hg-band-sm)">
      <div class="hg-tiles">
        <article v-for="t in CAPABILITY_TILES" :key="t.idx" class="hg-tile">
          <span class="hg-tile-idx">{{ t.idx }}</span>
          <h3 class="hg-tile-title">{{ t.title }}</h3>
          <p class="hg-body">{{ t.body }}</p>
        </article>
      </div>
    </div>
  </Band>

  <!-- ── Deployments ──────────────────────────────────────────────────── -->
  <Band exposure="paper" pad="none">
    <div style="padding-block-start: var(--hg-band)">
      <SectionHead
        eyebrow="Deployments"
        title="Proven in the field"
        lede="We work with operators who cannot afford a demo that only works on a desk. Each of these is a fleet flying today."
      />
    </div>

    <div class="hg-full" style="margin-block-start: clamp(40px, 5vw, 72px)">
      <div class="hg-rowlist">
        <a v-for="d in DEPLOYMENTS" :key="d.client" class="hg-row" href="#deployments">
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

    <div class="hg-full" style="padding: clamp(32px, 4vw, 56px) var(--hg-gutter) 0">
      <Pill label="All solutions" variant="ghost" @click="go('solutions')" />
    </div>
  </Band>

  <!-- ── The stack ────────────────────────────────────────────────────── -->
  <Band exposure="ink" pad="none">
    <div style="padding-block-start: var(--hg-band)">
      <SectionHead
        eyebrow="Our product"
        title="One stack, ground to air"
        lede="Five layers that assume each other exists. Buy one and it works; buy the set and the operator stops noticing where one ends."
      />
    </div>

    <div class="hg-full" style="margin-block-start: clamp(40px, 5vw, 72px)">
      <div class="hg-rowlist">
        <button v-for="s in STACK" :key="s.id" type="button" class="hg-row" @click="go('product')">
          <span class="hg-row-mark">
            <span class="hg-h3" style="display: block" translate="no">{{ s.name }}</span>
            <span class="hg-meta" style="margin-block-start: 6px; display: block">{{ s.role }}</span>
          </span>
          <span class="hg-meta">{{ s.index }}</span>
          <span>
            <span class="hg-mono">{{ s.blurb }}</span>
          </span>
          <Icon name="chevron-right" :size="18" class="hg-row-chev" aria-hidden="true" />
        </button>
      </div>
    </div>
  </Band>

  <!-- ── Telemetry ────────────────────────────────────────────────────── -->
  <Band exposure="ink" pad="none">
    <div style="padding-block-start: var(--hg-band)">
      <SectionHead
        eyebrow="Fleet statistics"
        title="Optimised for what you fly"
        lede="Suite reports the whole fleet in the terms an operations lead is actually judged on: what is ready, what flew, and whether the link held."
      />
    </div>

    <div class="hg-full" style="margin-block-start: clamp(40px, 5vw, 72px)">
      <div class="hg-cards">
        <article v-for="t in TELEMETRY" :key="t.title" class="hg-card">
          <header class="hg-card-head">
            <span class="hg-card-glyph"><Icon :name="t.icon" :size="21" aria-hidden="true" /></span>
            <h3 class="hg-card-title">{{ t.title }}</h3>
            <span class="hg-card-value">{{ t.value }}</span>
          </header>
          <p class="hg-body">{{ t.caption }}</p>

          <!-- Every chart is drawn in `currentColor`, so the viz layer inherits
               the band's exposure and the sheet stays achromatic. -->
          <div class="hg-card-viz">
            <Gauge
              v-if="t.kind === 'gauge'"
              :value="t.reading!"
              unit="%"
              :size="150"
              :thickness="10"
              color="currentColor"
              :label="t.title"
            />
            <Bars
              v-else-if="t.kind === 'bars'"
              :values="t.series!"
              :width="300"
              :height="150"
              color="currentColor"
              :label="t.title"
            />
            <Sparkline
              v-else
              :values="t.series!"
              :width="300"
              :height="120"
              area
              color="currentColor"
              :label="t.title"
            />
          </div>

          <footer class="hg-card-foot">
            <div v-for="f in t.foot" :key="f[1]">
              <p class="hg-mono" style="color: var(--hg-fg); font-size: 15px">{{ f[0] }}</p>
              <p class="hg-meta">{{ f[1] }}</p>
            </div>
          </footer>
        </article>
      </div>
    </div>
  </Band>

  <!-- ── Approach ─────────────────────────────────────────────────────── -->
  <Band exposure="paper">
    <div class="hg-split">
      <div>
        <Eyebrow label="Our approach" />
        <h2 class="hg-h1" style="margin-block-start: 22px">Built for the long deployment</h2>
      </div>
      <div style="display: grid; gap: clamp(28px, 3vw, 44px)">
        <article v-for="a in APPROACH" :key="a.idx">
          <p class="hg-meta" style="margin-block-end: 12px">{{ a.idx }}</p>
          <h3 class="hg-h3" style="margin-block-end: 10px">{{ a.title }}</h3>
          <p class="hg-body">{{ a.body }}</p>
        </article>
      </div>
    </div>
  </Band>

  <!-- ── News ─────────────────────────────────────────────────────────── -->
  <Band exposure="paper" pad="none">
    <div style="padding-block-start: var(--hg-band)">
      <SectionHead
        eyebrow="News"
        title="From the hangar"
        lede="Field notes, engineering write-ups and the occasional argument about colour."
      />
    </div>

    <div class="hg-full" style="margin-block-start: clamp(40px, 5vw, 72px)">
      <div class="hg-news">
        <a class="hg-news-lead" href="#news" @click.prevent="go('news')">
          <div style="position: relative; aspect-ratio: 16 / 10">
            <Plate :kind="ARTICLES[0]!.plate" :seed="ARTICLES[0]!.seed" scrim style="position: absolute; inset: 0" />
            <h3 class="hg-news-lead-title">{{ ARTICLES[0]!.title }}</h3>
          </div>
          <p class="hg-meta" style="margin-block-start: 24px">
            {{ ARTICLES[0]!.date }} · {{ ARTICLES[0]!.read }}
          </p>
          <p class="hg-body" style="margin-block-start: 14px">{{ ARTICLES[0]!.excerpt }}</p>
        </a>

        <div class="hg-news-side">
          <a
            v-for="a in ARTICLES.slice(1, 3)"
            :key="a.id"
            class="hg-news-item"
            href="#news"
            @click.prevent="go('news')"
          >
            <Plate :kind="a.plate" :seed="a.seed" style="aspect-ratio: 4 / 3" />
            <div>
              <h3 class="hg-news-title">{{ a.title }}</h3>
              <p class="hg-meta" style="margin-block-start: 16px">{{ a.date }} · {{ a.read }}</p>
            </div>
          </a>
          <div style="padding: clamp(20px, 2.4vw, 36px)">
            <p class="hg-mono" style="margin-block-end: 20px">Everything we have written, in one place.</p>
            <Pill label="Read the news" variant="ghost" @click="go('news')" />
          </div>
        </div>
      </div>
    </div>
  </Band>

  <!-- ── FAQ ──────────────────────────────────────────────────────────── -->
  <Band exposure="paper" pad="none">
    <div style="padding-block: var(--hg-band) 0">
      <SectionHead
        eyebrow="Questions"
        title="Asked before every procurement"
        lede="If the answer you need is not here, the fastest route is a call with an engineer rather than a form."
      />
    </div>

    <div class="hg-col" style="margin-block: clamp(40px, 5vw, 64px) var(--hg-band)">
      <div class="hg-acc">
        <div v-for="(f, i) in FAQ" :key="f.q" class="hg-acc-item">
          <h3 style="margin: 0">
            <button
              type="button"
              class="hg-acc-trigger"
              :aria-expanded="open === i"
              :aria-controls="`faq-${i}`"
              @click="open = open === i ? -1 : i"
            >
              <span>{{ f.q }}</span>
              <Icon name="plus" :size="17" class="hg-acc-mark" aria-hidden="true" />
            </button>
          </h3>
          <div v-show="open === i" :id="`faq-${i}`" class="hg-acc-panel">
            <p class="hg-body">{{ f.a }}</p>
          </div>
        </div>
      </div>
    </div>
  </Band>

  <!-- ── Close ────────────────────────────────────────────────────────── -->
  <Band exposure="ink" pad="none">
    <template #backdrop><Plate kind="contour" :seed="9" style="opacity: 0.5" /></template>
    <div>
      <div class="hg-col" style="padding-block: var(--hg-band)">
        <Eyebrow label="Get started" />
        <h2 class="hg-h1" style="margin-block: 22px 22px">Put it in an operator’s hands</h2>
        <p class="hg-lede" style="margin-block-end: 32px">
          A working deployment on your airframe, flown by your team, inside a quarter.
        </p>
        <Pill label="Talk to engineering" href="#contact" />
      </div>
    </div>
  </Band>
</template>
