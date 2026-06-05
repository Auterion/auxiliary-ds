<script setup lang="ts">
import { ref } from 'vue';
import MapView from './MapView.vue';
import CameraView from './CameraView.vue';
import SettingsView from './SettingsView.vue';
import './amc.css';

const mode = ref<'day' | 'night'>('day');
const layout = ref<'map' | 'camera' | 'settings'>('camera');
const theme = () => (mode.value === 'day' ? 'dark' : 'darknight');
</script>

<template>
  <div class="amc-stage flex min-h-dvh w-full items-center justify-center overflow-hidden p-6">
    <div class="pointer-events-none absolute left-8 top-8 z-10 select-none">
      <p class="text-[13px] font-medium text-white/90">Auterion Mission Control</p>
      <p class="ix-label mt-1 text-white/45">TABLET GCS · {{ layout === 'camera' ? 'GIMBAL FEED' : layout === 'map' ? 'MAP' : 'SETTINGS' }}</p>
    </div>

    <div data-theme="dark" class="absolute right-8 top-8 z-10 flex items-end gap-3">
      <div class="flex flex-col items-end gap-1">
        <span class="ix-label-sm text-white/40">VIEW</span>
        <div class="flex items-center gap-0.5 rounded-full border border-border bg-card/70 p-1 backdrop-blur">
          <button
            v-for="opt in (['map', 'camera', 'settings'] as const)"
            :key="opt"
            type="button"
            class="ix-label rounded-full px-3 py-1.5 transition-colors"
            :class="layout === opt ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'"
            @click="layout = opt"
          >
            {{ opt }}
          </button>
        </div>
      </div>
      <div class="flex flex-col items-end gap-1">
        <span class="ix-label-sm text-white/40">MODE</span>
        <div class="flex items-center gap-0.5 rounded-full border border-border bg-card/70 p-1 backdrop-blur">
          <button
            v-for="opt in (['day', 'night'] as const)"
            :key="opt"
            type="button"
            class="ix-label rounded-full px-3 py-1.5 transition-colors"
            :class="mode === opt ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'"
            @click="mode = opt"
          >
            {{ opt }}
          </button>
        </div>
      </div>
    </div>

    <!-- iPad (landscape) -->
    <div class="relative rounded-[34px] bg-black p-3 shadow-2xl ring-1 ring-white/10">
      <span class="absolute left-1/2 top-[18px] z-10 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-white/15" />
      <div
        :data-theme="theme()"
        data-register="operational"
        class="relative h-[760px] w-[1160px] overflow-hidden rounded-[22px] text-foreground"
      >
        <MapView v-if="layout === 'map'" :mode="mode" />
        <CameraView v-else-if="layout === 'camera'" :mode="mode" />
        <SettingsView v-else />
      </div>
    </div>
  </div>
</template>

<style scoped>
.amc-stage {
  position: relative;
  background: radial-gradient(80% 60% at 50% 0%, #1b1f24 0%, #0b0d10 60%, #050608 100%);
}
</style>
