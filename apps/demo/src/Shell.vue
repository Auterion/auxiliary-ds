<script setup lang="ts">
import { ref } from 'vue';
import SuiteApp from './suite/SuiteApp.vue';
import MissionControl from './amc/MissionControl.vue';
import Amc27 from './amc27/Amc27.vue';
import DeviceConsole from './os/DeviceConsole.vue';
import Site from './web/Site.vue';
import Brand from './brand/Brand.vue';
import PatternStudio from './pattern/PatternStudio.vue';
import Console from './console/Console.vue';
import TokenModel from './tokens/TokenModel.vue';
import DirectionStudio from './direction/DirectionStudio.vue';
import StrikeStudio from './strike/StrikeStudio.vue';
import FlyView from './flyview/FlyView.vue';
import Amc20 from './amc20/Amc20.vue';
import EcoStudio from './eco/EcoStudio.vue';
import Hangar from './hangar/Hangar.vue';
import Gallery from './App.vue';

type View =
  | 'suite'
  | 'amc'
  | 'amc27'
  | 'os'
  | 'web'
  | 'brand'
  | 'pattern'
  | 'console'
  | 'tokens'
  | 'direction'
  | 'strike'
  | 'flyview'
  | 'amc20'
  | 'eco'
  | 'hangar'
  | 'gallery';
const view = ref<View>('brand');

const PAGES: { key: View; label: string }[] = [
  { key: 'brand', label: 'Brand' },
  { key: 'pattern', label: 'Pattern' },
  { key: 'console', label: 'Console' },
  { key: 'tokens', label: 'Tokens' },
  { key: 'direction', label: 'Direction' },
  { key: 'strike', label: 'Strike' },
  { key: 'flyview', label: 'FlyView' },
  { key: 'amc20', label: 'AMC20' },
  { key: 'eco', label: 'Ecosystem' },
  { key: 'web', label: 'auterion.com' },
  { key: 'hangar', label: 'Hangar' },
  { key: 'suite', label: 'Suite' },
  { key: 'amc', label: 'Mission Control' },
  { key: 'amc27', label: 'AMC27' },
  { key: 'os', label: 'AuterionOS' },
  { key: 'gallery', label: 'Gallery' },
];
</script>

<template>
  <Brand v-if="view === 'brand'" />
  <PatternStudio v-else-if="view === 'pattern'" />
  <Console v-else-if="view === 'console'" />
  <TokenModel v-else-if="view === 'tokens'" />
  <DirectionStudio v-else-if="view === 'direction'" />
  <StrikeStudio v-else-if="view === 'strike'" />
  <FlyView v-else-if="view === 'flyview'" />
  <Amc20 v-else-if="view === 'amc20'" />
  <EcoStudio v-else-if="view === 'eco'" />
  <Hangar v-else-if="view === 'hangar'" />
  <SuiteApp v-else-if="view === 'suite'" />
  <MissionControl v-else-if="view === 'amc'" />
  <Amc27 v-else-if="view === 'amc27'" />
  <DeviceConsole v-else-if="view === 'os'" />
  <Site v-else-if="view === 'web'" />
  <Gallery v-else />

  <!-- floating page switcher — always dark glass, regardless of page theme -->
  <!-- `flex-wrap` + a viewport-bounded max-width, because this is the demo's
       ONLY navigation and it is `position: fixed`: a fixed element's overflow
       cannot be reached by the page scrollbar, so at 320px the row measured
       977px and sat at left:-329 with five of its twelve destinations
       permanently off-screen. Wrapping keeps every destination reachable
       without adding a scroll affordance that would itself need a cue. The
       radius steps to `rounded-3xl` so a two-row pill still reads as one
       object rather than a stadium with a flat middle.

       Centred with `inset-x-4 mx-auto w-fit` rather than `left-1/2` +
       `-translate-x-1/2`: a fixed element positioned at `left: 50%` gets only
       HALF the viewport as its available width, so it wrapped to two rows on a
       1440px desktop where one row fits comfortably. -->
  <div
    data-theme="dark"
    class="fixed inset-x-4 bottom-4 z-50 mx-auto flex w-fit max-w-[calc(100vw-2rem)] flex-wrap items-center justify-center gap-0.5 rounded-3xl border border-border bg-card/80 p-1 shadow-2xl backdrop-blur-md"
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
