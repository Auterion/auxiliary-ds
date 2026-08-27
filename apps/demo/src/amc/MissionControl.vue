<script setup lang="ts">
/**
 * AMC · the tablet GCS stage.
 *
 * ONE attribute drives BOTH layers. `.dk` keys its palette off [data-theme],
 * exactly as the DS semantic tokens do, so the deck grammar and Card / Switch /
 * StatusBadge can never re-resolve out of step. `day` / `night` is NOT a second
 * mode axis — it is [data-theme], mapped onto the two operational themes:
 * `dark` for daylight use, `darknight` for the scotopic low-blue exposure.
 */
import { computed, ref } from 'vue';
import MapView from './MapView.vue';
import CameraView from './CameraView.vue';
import SettingsView from './SettingsView.vue';
import InteropView from './InteropView.vue';
import './amc.css';

type Layout = 'map' | 'camera' | 'interop' | 'settings';

const mode = ref<'day' | 'night'>('day');
const layout = ref<Layout>('interop');
const theme = computed(() => (mode.value === 'day' ? 'dark' : 'darknight'));

const TITLES: Record<Layout, string> = {
  map: 'MAP',
  camera: 'GIMBAL FEED',
  interop: 'STANAG 4817 · CATL REPORTING',
  settings: 'SETTINGS',
};
</script>

<template>
  <!-- The stage is presentation chrome, not product: always the ink exposure,
       and the only place on this surface carrying the display cut. -->
  <div
    data-theme="dark"
    class="dk amc-root amc-stage flex min-h-dvh w-full items-center justify-center overflow-hidden p-6"
  >
    <div class="amc-caption">
      <p class="dk-h2">Auterion Mission Control</p>
      <p class="dk-label mt-1.5">TABLET GCS · {{ TITLES[layout] }}</p>
    </div>

    <div class="amc-controls">
      <div class="amc-control-group">
        <span class="dk-label">View</span>
        <div class="dk-segment">
          <button
            v-for="opt in (['map', 'camera', 'interop', 'settings'] as const)"
            :key="opt"
            type="button"
            class="dk-segment-btn"
            :data-active="layout === opt"
            :aria-pressed="layout === opt"
            :aria-current="layout === opt ? 'page' : undefined"
            @click="layout = opt"
          >{{ opt }}</button>
        </div>
      </div>
      <div class="amc-control-group">
        <span class="dk-label">Mode</span>
        <div class="dk-segment">
          <button
            v-for="opt in (['day', 'night'] as const)"
            :key="opt"
            type="button"
            class="dk-segment-btn"
            :data-active="mode === opt"
            :aria-pressed="mode === opt"
            @click="mode = opt"
          >{{ opt }}</button>
        </div>
      </div>
    </div>

    <!-- iPad (landscape). Hairline, not a drop shadow — the stage falloff is
         what separates the device from the desk. -->
    <div class="amc-bezel">
      <span class="amc-lens" aria-hidden="true" />
      <div
        :data-theme="theme"
        data-register="operational"
        class="dk amc-root amc-screen"
      >
        <MapView v-if="layout === 'map'" :mode="mode" />
        <CameraView v-else-if="layout === 'camera'" :mode="mode" />
        <InteropView v-else-if="layout === 'interop'" />
        <SettingsView v-else />
      </div>
    </div>
  </div>
</template>
