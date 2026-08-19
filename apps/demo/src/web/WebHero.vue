<!--
  The cover. Deck 07b's cover devices, in order: ghost line, display cut,
  lede, bracketed measured facts, then the actions. The plate is the opposite
  exposure of the page's material — used exactly twice per page (cover and
  proof close), which is what keeps it from becoming wallpaper.
-->
<script setup lang="ts">
import { Icon } from '@auxiliary/icons';

withDefaults(defineProps<{
  eyebrow?: string;
  title: string;
  subtitle?: string;
  primary?: string;
  secondary?: string;
  /* Measured facts already stated on this page. The bracket wraps measured
   * facts ONLY — never an opinion, never a label. */
  facts?: string;
}>(), { facts: undefined });

const emit = defineEmits<{ primary: []; secondary: [] }>();
</script>

<template>
  <section class="wb-wrap wb-block">
    <div class="dk-plate wb-cover">

      <div class="wb-cover-copy">
        <!-- Ghost line — covers and section titles only. -->
        <p v-if="eyebrow" class="dk-h2 dk-ghost">{{ eyebrow }}</p>
        <h1 class="dk-display">{{ title }}</h1>
      </div>

      <p v-if="subtitle" class="dk-body-lg wb-cover-lede">{{ subtitle }}</p>

      <span v-if="facts" class="dk-bracket">{{ facts }}</span>

      <div v-if="primary || secondary" class="wb-actions">
        <button
          v-if="primary"
          type="button"
          class="dk-cta-solid"
          @click="emit('primary')"
        >
          {{ primary }} <Icon name="arrow-right" size="xs" />
        </button>
        <button
          v-if="secondary"
          type="button"
          class="dk-cta"
          @click="emit('secondary')"
        >
          {{ secondary }}
        </button>
      </div>

      <!-- The one looping motion on the surface, and it is the module's own
           claim being kept: the strip says LIVE, so the strip runs. -->
      <div class="wb-cover-foot">
        <span class="wb-live">
          <span class="dk-dot dk-dot-nominal" />
          <span class="dk-label">Live</span>
        </span>
        <div class="wb-ticker" aria-hidden="true">
          <span class="dk-micro dk-num wb-ticker-items">
            UAV-001 · ALT 124 M · BATT 86% · RSSI −82 DBM &nbsp;&nbsp;·&nbsp;&nbsp;
            UAV-002 · ALT 88 M · BATT 71% · RSSI −76 DBM &nbsp;&nbsp;·&nbsp;&nbsp;
            UAV-003 · ALT 210 M · BATT 94% · RSSI −91 DBM &nbsp;&nbsp;·&nbsp;&nbsp;
            UGV-001 · SPD 3.2 M/S · BATT 60% · GPS LOCK &nbsp;&nbsp;·&nbsp;&nbsp;
            UAV-004 · MISSION ACTIVE · WP 14/22 · ETA 4M32S &nbsp;&nbsp;·&nbsp;&nbsp;
            UAV-001 · ALT 124 M · BATT 86% · RSSI −82 DBM &nbsp;&nbsp;·&nbsp;&nbsp;
            UAV-002 · ALT 88 M · BATT 71% · RSSI −76 DBM &nbsp;&nbsp;·&nbsp;&nbsp;
            UAV-003 · ALT 210 M · BATT 94% · RSSI −91 DBM &nbsp;&nbsp;·&nbsp;&nbsp;
            UGV-001 · SPD 3.2 M/S · BATT 60% · GPS LOCK &nbsp;&nbsp;·&nbsp;&nbsp;
            UAV-004 · MISSION ACTIVE · WP 14/22 · ETA 4M32S &nbsp;&nbsp;·&nbsp;&nbsp;
          </span>
        </div>
      </div>
    </div>
  </section>
</template>
