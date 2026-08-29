<script setup lang="ts">
import { computed, ref } from 'vue';
import { Icon } from '@auxiliary/icons';
import Band from '../parts/Band.vue';
import Pill from '../parts/Pill.vue';
import Plate from '../parts/Plate.vue';
import SectionHead from '../parts/SectionHead.vue';
import Statement from '../parts/Statement.vue';
import { BENEFITS, ROLES } from '../content';

/* Filtering is a real affordance on a roles list, and the counts come from the
 * data rather than being typed — a filter chip that says a number the list
 * cannot produce is the failure this whole sheet is built to avoid. */
const teams = computed(() => ['All', ...new Set(ROLES.map((r) => r.team))]);
const team = ref('All');
const shown = computed(() => (team.value === 'All' ? ROLES : ROLES.filter((r) => r.team === team.value)));
const countFor = (t: string) => (t === 'All' ? ROLES.length : ROLES.filter((r) => r.team === t).length);
</script>

<template>
  <!-- ── Hero ─────────────────────────────────────────────────────────── -->
  <Band exposure="ink" pad="none">
    <template #backdrop><Plate kind="scan" :seed="12" style="opacity: 0.4" /></template>
    <div>
      <div style="padding-block: calc(var(--hg-nav-h) + var(--hg-band)) var(--hg-band)">
        <SectionHead
          eyebrow="Careers"
          title="Work that ends up in a cold field"
          lede="We build for people who cannot restart the app and try again. If that constraint sounds like the interesting part rather than the annoying part, we should talk."
        />
      </div>
    </div>
  </Band>

  <!-- ── Statement ────────────────────────────────────────────────────── -->
  <Band exposure="paper">
    <div class="hg-col">
      <Statement
        text="Nobody here ships a feature they have never watched someone use. Every engineer flies, every designer stands in the field, and the review that matters happens with gloves on rather than in a pull request."
      />
    </div>
  </Band>

  <!-- ── Benefits ─────────────────────────────────────────────────────── -->
  <Band exposure="paper" pad="small">
    <div class="hg-full">
      <div class="hg-tiles">
        <article v-for="b in BENEFITS" :key="b.idx" class="hg-tile">
          <span class="hg-tile-idx">{{ b.idx }}</span>
          <h3 class="hg-tile-title">{{ b.title }}</h3>
          <p class="hg-body">{{ b.body }}</p>
        </article>
      </div>
    </div>
  </Band>

  <!-- ── Open roles ───────────────────────────────────────────────────── -->
  <Band exposure="ink" pad="none">
    <div style="padding-block-start: var(--hg-band)">
      <SectionHead eyebrow="Open roles" :title="`${ROLES.length} positions open`" />
    </div>

    <div class="hg-full" style="margin-block-start: clamp(32px, 4vw, 48px); padding-inline: var(--hg-gutter)">
      <div role="group" aria-label="Filter roles by team" style="display: flex; flex-wrap: wrap; gap: 8px">
        <button
          v-for="t in teams"
          :key="t"
          type="button"
          class="hg-mono"
          :aria-pressed="team === t"
          style="display: inline-flex; align-items: center; gap: 8px; padding: 8px 14px; border-radius: var(--radius-full); cursor: pointer; border: 1px solid var(--hg-line); background: none; color: var(--hg-fg-2)"
          :style="{
            borderColor: team === t ? 'var(--hg-fg)' : 'var(--hg-line)',
            color: team === t ? 'var(--hg-bg)' : 'var(--hg-fg-2)',
            background: team === t ? 'var(--hg-fg)' : 'transparent',
          }"
          @click="team = t"
        >
          <span>{{ t }}</span>
          <span style="opacity: 0.6">{{ countFor(t) }}</span>
        </button>
      </div>
    </div>

    <div class="hg-full" style="margin-block-start: clamp(28px, 3vw, 40px)">
      <div class="hg-rowlist">
        <a v-for="r in shown" :key="r.ref" class="hg-row" href="#apply" style="grid-template-columns: 1fr 2fr 1fr auto">
          <span class="hg-meta">{{ r.ref }}</span>
          <span>
            <span class="hg-row-title" style="display: block; margin-block-end: 8px">{{ r.title }}</span>
            <span class="hg-mono">{{ r.team }}</span>
          </span>
          <span class="hg-mono" style="color: var(--hg-fg)">
            {{ r.location }}<br /><span style="color: var(--hg-fg-3)">{{ r.type }}</span>
          </span>
          <Icon name="chevron-right" :size="18" class="hg-row-chev" aria-hidden="true" />
        </a>
      </div>

      <!-- A filter that can return nothing must say so; an empty list that just
           renders as a rule is a bug the reader has to diagnose. -->
      <p v-if="!shown.length" class="hg-mono" style="padding: clamp(32px, 4vw, 56px) var(--hg-gutter)">
        No open roles on this team right now. Try “All”, or send us something anyway.
      </p>
    </div>

    <div class="hg-full" style="padding: clamp(32px, 4vw, 56px) var(--hg-gutter) var(--hg-band)">
      <Pill label="Send an open application" href="#apply" />
    </div>
  </Band>
</template>
