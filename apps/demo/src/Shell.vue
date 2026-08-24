<script setup lang="ts">
import { ref } from 'vue';
import SuiteApp from './suite/SuiteApp.vue';
import MissionControl from './amc/MissionControl.vue';
import DeviceConsole from './os/DeviceConsole.vue';
import Site from './web/Site.vue';
import Brand from './brand/Brand.vue';
import PatternStudio from './pattern/PatternStudio.vue';
import Gallery from './App.vue';

type View = 'suite' | 'amc' | 'os' | 'web' | 'brand' | 'pattern' | 'gallery';
const view = ref<View>('brand');

const PAGES: { key: View; label: string }[] = [
  { key: 'brand', label: 'Brand' },
  { key: 'pattern', label: 'Pattern' },
  { key: 'web', label: 'auterion.com' },
  { key: 'suite', label: 'Suite' },
  { key: 'amc', label: 'Mission Control' },
  { key: 'os', label: 'AuterionOS' },
  { key: 'gallery', label: 'Gallery' },
];
</script>

<template>
  <Brand v-if="view === 'brand'" />
  <PatternStudio v-else-if="view === 'pattern'" />
  <SuiteApp v-else-if="view === 'suite'" />
  <MissionControl v-else-if="view === 'amc'" />
  <DeviceConsole v-else-if="view === 'os'" />
  <Site v-else-if="view === 'web'" />
  <Gallery v-else />

  <!-- floating page switcher — always dark glass, regardless of page theme -->
  <div
    data-theme="dark"
    class="fixed bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-0.5 rounded-full border border-border bg-card/80 p-1 shadow-2xl backdrop-blur-md"
  >
    <button
      v-for="p in PAGES"
      :key="p.key"
      type="button"
      class="rounded-full px-3.5 py-1.5 text-[12px] font-medium transition-colors"
      :class="view === p.key ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground'"
      @click="view = p.key"
    >
      {{ p.label }}
    </button>
  </div>
</template>
