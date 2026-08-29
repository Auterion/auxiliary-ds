<script setup lang="ts">
import { ref } from 'vue';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@auxiliary/vue';
import Band from '../parts/Band.vue';
import Pill from '../parts/Pill.vue';
import Plate from '../parts/Plate.vue';
import SectionHead from '../parts/SectionHead.vue';
import Statement from '../parts/Statement.vue';
import { CAPABILITY_TILES, STACK } from '../content';

/* The stack is a set, so the page holds one layer at a time rather than
 * scrolling five spec tables. The first is open because a page that opens
 * closed makes the reader work to see it has content at all.
 *
 * The DS `Tabs` rather than a hand-rolled tablist: it is built on Reka UI and
 * so brings roving tabindex, arrow-key and Home/End navigation, which the
 * hand-written version this replaced did not have at all — it had the ARIA
 * attributes of a tablist and the keyboard behaviour of a row of buttons. */
const active = ref(STACK[0]!.id);

const PLATE_FOR: Record<string, 'halftone' | 'contour' | 'scan' | 'orbit' | 'swarm'> = {
  skynode: 'halftone',
  os: 'scan',
  control: 'orbit',
  suite: 'contour',
  nemyx: 'swarm',
};

const INTEGRATIONS = [
  'PX4', 'MAVLink 2', 'ROS 2', 'RTSP', 'ONVIF', 'MAVSDK',
  'GeoTIFF', 'KML', 'STANAG 4586', 'Link 16', 'MQTT', 'S3',
];
</script>

<template>
  <!-- ── Hero ─────────────────────────────────────────────────────────── -->
  <Band exposure="paper" pad="none">
    <div style="padding-block: calc(var(--hg-nav-h) + var(--hg-band)) var(--hg-band-sm)">
      <SectionHead
        eyebrow="Product"
        title="One stack, ground to air"
        lede="Five layers, each useful alone and designed to assume the others exist. The operator should not be able to tell where one ends."
      />
    </div>

    <div class="hg-full" style="padding-inline: var(--hg-gutter)">
      <div class="hg-strip" style="padding-inline: 0">
        <Plate v-for="(k, i) in (['swarm', 'orbit', 'contour', 'halftone'] as const)" :key="k" :kind="k" :seed="i * 5 + 2" />
      </div>
    </div>
  </Band>

  <!-- ── Statement ────────────────────────────────────────────────────── -->
  <Band exposure="paper">
    <div class="hg-col">
      <Statement
        text="A vehicle is not a product, it is a runtime. Auterion ships the compute, the operating system and the operator surfaces as one contract, so a capability you buy this year reaches a fleet you bought last year."
      />
    </div>
  </Band>

  <!-- ── The layers ───────────────────────────────────────────────────── -->
  <Band exposure="ink" pad="none">
    <div style="padding-block-start: var(--hg-band)">
      <SectionHead eyebrow="The layers" title="Pick the one you need" />
    </div>

    <div class="hg-full" style="margin-block-start: clamp(40px, 5vw, 64px); padding-inline: var(--hg-gutter)">
      <!-- Tabs, not an accordion: five short specs compared against each other
           is a switch, and stacking them would hide the comparison. -->
      <Tabs v-model="active" orientation="horizontal">
        <TabsList
          class="hg-tabslist"
          aria-label="Platform layers"
        >
          <TabsTrigger
            v-for="s in STACK"
            :key="s.id"
            :value="s.id"
            class="hg-tab"
          >
            <span class="hg-meta" style="color: inherit">{{ s.index }}</span>
            <span translate="no">{{ s.name }}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent
          v-for="s in STACK"
          :key="s.id"
          :value="s.id"
          class="hg-layer"
        >
          <div>
            <p class="hg-meta">{{ s.role }}</p>
            <h3 class="hg-h1" style="margin-block: 16px 20px" translate="no">{{ s.name }}</h3>
            <p class="hg-lede" style="margin-block-end: 32px">{{ s.blurb }}</p>
            <dl class="hg-specs">
              <div v-for="[k, v] in s.specs" :key="k" class="hg-spec">
                <dt class="hg-meta">{{ k }}</dt>
                <dd class="hg-mono" style="margin: 0; color: var(--hg-fg)">{{ v }}</dd>
              </div>
            </dl>
          </div>
          <!-- One plate per layer, chosen so five panels do not read as one
               texture repeated five times. -->
          <Plate
            :kind="PLATE_FOR[s.id] ?? 'halftone'"
            :seed="s.id.length * 7 + 2"
            style="aspect-ratio: 4 / 3; align-self: start"
          />
        </TabsContent>
      </Tabs>
    </div>
  </Band>

  <!-- ── Why it holds ─────────────────────────────────────────────────── -->
  <Band exposure="ink" pad="small">
    <div class="hg-full">
      <div class="hg-tiles">
        <article v-for="t in CAPABILITY_TILES" :key="t.idx" class="hg-tile">
          <span class="hg-tile-idx">{{ t.idx }}</span>
          <h3 class="hg-tile-title">{{ t.title }}</h3>
          <p class="hg-body">{{ t.body }}</p>
        </article>
      </div>
    </div>
  </Band>

  <!-- ── Integrations ─────────────────────────────────────────────────── -->
  <Band exposure="paper" pad="none">
    <div style="padding-block-start: var(--hg-band)">
      <SectionHead
        eyebrow="Integrations"
        title="Speaks what you already run"
        lede="Open protocols first. If your ground station, your catalogue or your analytics already exist, the stack meets them rather than replacing them."
      />
    </div>

    <div class="hg-full" style="margin-block-start: clamp(40px, 5vw, 64px)">
      <ul
        style="list-style: none; margin: 0; padding: 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); border-block-start: 1px solid var(--hg-line)"
      >
        <li
          v-for="i in INTEGRATIONS"
          :key="i"
          class="hg-mono"
          translate="no"
          style="display: grid; place-items: center; min-block-size: 108px; border-inline-start: 1px solid var(--hg-line); border-block-end: 1px solid var(--hg-line); color: var(--hg-fg); font-size: 14px"
        >
          {{ i }}
        </li>
      </ul>
    </div>

    <div class="hg-full" style="padding: clamp(32px, 4vw, 56px) var(--hg-gutter) var(--hg-band)">
      <Pill label="Read the docs" href="#docs" variant="ghost" icon="arrow-up-right-from-square" />
    </div>
  </Band>
</template>
