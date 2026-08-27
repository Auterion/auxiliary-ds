<script setup lang="ts">
/* AuterionSuite, compressed. The sidebar IA is the shipped one — Fleet
 * management over Vehicles / Flights / Assets / Compliance, then Operations —
 * because a frame drawn from imagination proves nothing about whether a shared
 * bar survives contact with a real surface. */
import { Icon } from '@auxiliary/icons';

const NAV = [
  { cat: null, items: [{ label: 'Overview', icon: 'house' as const, current: true }] },
  {
    cat: 'Fleet management',
    items: [
      { label: 'Vehicles', icon: 'drone' as const, current: false },
      { label: 'Flights', icon: 'arrow-up-right-from-square' as const, current: false },
      { label: 'Assets', icon: 'bars' as const, current: false },
      { label: 'Compliance', icon: 'lock' as const, current: false },
    ],
  },
  { cat: 'Operations', items: [{ label: 'Control Tower', icon: 'eye' as const, current: false }] },
];

/* Sorties per week, last twelve. Static — the panel is a specimen. */
const SERIES = [38, 44, 41, 52, 49, 61, 58, 66, 62, 71, 69, 78];
const PEAK = Math.max(...SERIES);
</script>

<template>
  <div class="ec-body">
    <div class="ec-side">
      <template v-for="(group, gi) in NAV" :key="gi">
        <p v-if="group.cat" class="ec-navcat">{{ group.cat }}</p>
        <p
          v-for="item in group.items"
          :key="item.label"
          class="ec-nav"
          :aria-current="item.current ? 'page' : undefined"
        >
          <Icon :name="item.icon" :size="13" aria-hidden="true" />
          {{ item.label }}
        </p>
      </template>
    </div>

    <div class="ec-main">
      <div class="ec-kpis">
        <div class="ec-kpi">
          <p class="ec-kpi-l">Flights this month</p>
          <p class="ec-kpi-v">695</p>
          <p class="ec-kpi-d" style="color: var(--nominal-emphasis)">+75% vs. July</p>
        </div>
        <div class="ec-kpi">
          <p class="ec-kpi-l">Vehicles</p>
          <p class="ec-kpi-v">1&thinsp;667</p>
          <p class="ec-kpi-d" style="color: var(--muted-foreground)">of 10&thinsp;000 seats</p>
        </div>
        <div class="ec-kpi">
          <p class="ec-kpi-l">Airborne now</p>
          <p class="ec-kpi-v">12</p>
          <p class="ec-kpi-d" style="color: var(--muted-foreground)">updated 4 s ago</p>
        </div>
      </div>

      <div class="ec-panel" style="padding: 12px 14px">
        <p class="ec-kpi-l" style="margin-bottom: 10px">Sorties per week</p>
        <svg
          viewBox="0 0 240 48"
          preserveAspectRatio="none"
          style="display: block; width: 100%; height: 48px; color: var(--foreground)"
          role="img"
          aria-label="Sorties per week, twelve weeks, rising from 38 to 78"
        >
          <rect
            v-for="(v, i) in SERIES"
            :key="i"
            :x="i * 20 + 3"
            :y="48 - (v / PEAK) * 44"
            width="14"
            :height="(v / PEAK) * 44"
            fill="currentColor"
            :opacity="i === SERIES.length - 1 ? 0.6 : 0.3"
          />
        </svg>
      </div>
    </div>
  </div>
</template>
