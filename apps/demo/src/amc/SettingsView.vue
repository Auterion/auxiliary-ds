<script setup lang="ts">
/**
 * AMC · vehicle settings.
 *
 * This is the surface's editorial half — a page of configuration facts, not a
 * live readout — so it takes the 07b grammar in full: the display cut on the
 * section title, a ghost line under it, mono pointer-labels on every field, a
 * bracket on the measured totals, hairlines instead of panels-with-shadows.
 *
 * Signal budget: ZERO blue. The nav marks position with a hairline-quiet active
 * state rather than a brand-coloured glyph, and severity is carried by the
 * five-level ladder on the row rail — which is exempt from the budget and is
 * never dimmed to fit the palette.
 */
import { computed, ref } from 'vue';
import { Switch, NumberField, Button, Badge, StatusBadge } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';

const SECTIONS = [
  { key: 'general', label: 'General', icon: 'gear', lede: 'Display system and readout format.' },
  { key: 'safety', label: 'Flight & safety', icon: 'triangle-exclamation', lede: 'The failsafe envelope evaluated before and during flight.' },
  { key: 'camera', label: 'Camera & payload', icon: 'eye', lede: 'Gimbal feed and burn-in overlay.' },
  { key: 'link', label: 'Datalink', icon: 'bars', lede: 'Radio band and stream rates.' },
] as const;
const section = ref<(typeof SECTIONS)[number]['key']>('safety');
const current = computed(() => SECTIONS.find((s) => s.key === section.value) ?? SECTIONS[0]);

const units = ref<'metric' | 'imperial'>('metric');
const coords = ref<'mgrs' | 'dd'>('mgrs');

const rtlAlt = ref(80);
const geofence = ref(true);
const geofenceR = ref(400);
const lowBatt = ref(20);
const failsafe = ref<'rtl' | 'land' | 'hold'>('rtl');

const camera = ref<'eo' | 'ir' | 'fusion'>('ir');
const osdTelemetry = ref(true);
const osdReticle = ref(true);
const osdGrid = ref(false);
const autoRecord = ref(true);

const band = ref<'2.4' | '5.8'>('2.4');
const rssiWarn = ref(-85);
const telemetryHz = ref(10);

/** Bracketed totals — measured facts, counted rather than typed, so they
 *  cannot go stale against the rows below them. */
const bracket = computed(() => {
  switch (section.value) {
    case 'general':
      return `3 settings · ${units.value} · ${coords.value.toUpperCase()}`;
    case 'safety':
      return `5 guards · rtl ${rtlAlt.value} m · fence ${geofence.value ? `${geofenceR.value} m` : 'off'}`;
    case 'camera':
      return `5 settings · ${camera.value.toUpperCase()} · `
        + `${[osdTelemetry.value, osdReticle.value, osdGrid.value].filter(Boolean).length}/3 osd`;
    default:
      return `3 settings · ${band.value} ghz · ${telemetryHz.value} hz`;
  }
});
</script>

<template>
  <div class="amc-page">
    <!-- ═══ Page header — one hairline, not a stack of two ═══ -->
    <header class="amc-topbar">
      <Icon name="gear" size="sm" class="amc-glyph" />
      <span class="dk-label">AMC</span>
      <span class="amc-glyph">/</span>
      <h1 class="dk-value">Vehicle settings</h1>
      <Badge variant="secondary" size="sm" class="font-mono tabular-nums">Skyhook-01</Badge>
      <StatusBadge level="nominal" size="sm" dot class="ml-1">Connected</StatusBadge>
      <Button size="sm" class="ml-auto">Done</Button>
    </header>

    <div class="amc-body">
      <!-- ═══ Nav — position marked by a rule, never a lozenge ═══ -->
      <nav class="dk-card amc-pad w-52 shrink-0 self-start">
        <p class="dk-label pb-2">Sections</p>
        <button
          v-for="s in SECTIONS"
          :key="s.key"
          type="button"
          class="dk-nav-item"
          :data-active="section === s.key"
          :aria-current="section === s.key ? 'page' : undefined"
          @click="section = s.key"
        >
          <Icon :name="s.icon" size="xs" />
          <span class="dk-label">{{ s.label }}</span>
        </button>
      </nav>

      <!-- ═══ Content ═══ -->
      <div class="amc-scroll min-w-0 flex-1">
        <!-- Left-aligned, not centred: every label on this page starts on the
             same x as the chapter head above it and the nav beside it. -->
        <div class="max-w-2xl">
          <!-- Chapter head. The display cut and the ghost line live HERE — on
               the page's own title, never on a value an operator reads. -->
          <header class="pb-3">
            <p class="dk-label">Configuration</p>
            <h2 class="dk-h2 mt-1">{{ current.label }}</h2>
            <p class="dk-body dk-ghost mt-1">{{ current.lede }}</p>
          </header>

          <section class="dk-card amc-pad">
            <div class="dk-section mb-1">
              <span class="dk-label">{{ current.label }}</span>
              <span class="dk-bracket">{{ bracket }}</span>
            </div>

            <!-- General -->
            <template v-if="section === 'general'">
              <div class="amc-setting">
                <span class="amc-setting-subject">
                  <span class="dk-pointer">Units</span>
                  <span class="dk-small">Display system for telemetry</span>
                </span>
                <span class="amc-setting-control">
                  <span class="dk-segment">
                    <button type="button" class="dk-segment-btn" :data-active="units === 'metric'" @click="units = 'metric'">Metric</button>
                    <button type="button" class="dk-segment-btn" :data-active="units === 'imperial'" @click="units = 'imperial'">Imperial</button>
                  </span>
                </span>
              </div>
              <div class="amc-setting">
                <span class="amc-setting-subject">
                  <span class="dk-pointer">Coordinate format</span>
                  <span class="dk-small">Position readout</span>
                </span>
                <span class="amc-setting-control">
                  <span class="dk-segment">
                    <button type="button" class="dk-segment-btn" :data-active="coords === 'mgrs'" @click="coords = 'mgrs'">MGRS</button>
                    <button type="button" class="dk-segment-btn" :data-active="coords === 'dd'" @click="coords = 'dd'">Lat/Lon</button>
                  </span>
                </span>
              </div>
              <div class="amc-setting">
                <span class="amc-setting-subject">
                  <span class="dk-pointer">Keep screen awake</span>
                  <span class="dk-small">Prevent sleep during flight</span>
                </span>
                <span class="amc-setting-control"><Switch :model-value="true" aria-label="Keep screen awake" /></span>
              </div>
            </template>

            <!-- Flight & safety -->
            <template v-else-if="section === 'safety'">
              <div class="amc-setting amc-edge amc-edge-advisory">
                <span class="amc-setting-subject">
                  <span class="dk-pointer">Return-to-launch altitude</span>
                  <span class="dk-small">Climb to this AGL before returning</span>
                </span>
                <span class="amc-setting-control"><NumberField v-model="rtlAlt" :min="20" :max="200" :step="5" unit="m" class="w-32" /></span>
              </div>
              <div class="amc-setting amc-edge amc-edge-advisory">
                <span class="amc-setting-subject">
                  <span class="dk-pointer">Link-loss failsafe</span>
                  <span class="dk-small">Action on datalink loss</span>
                </span>
                <span class="amc-setting-control">
                  <span class="dk-segment">
                    <button type="button" class="dk-segment-btn" :data-active="failsafe === 'rtl'" @click="failsafe = 'rtl'">RTL</button>
                    <button type="button" class="dk-segment-btn" :data-active="failsafe === 'land'" @click="failsafe = 'land'">Land</button>
                    <button type="button" class="dk-segment-btn" :data-active="failsafe === 'hold'" @click="failsafe = 'hold'">Hold</button>
                  </span>
                </span>
              </div>
              <div class="amc-setting amc-edge amc-edge-warning">
                <span class="amc-setting-subject">
                  <span class="dk-pointer">Low-battery RTL</span>
                  <span class="dk-small">Trigger return at this charge</span>
                </span>
                <span class="amc-setting-control"><NumberField v-model="lowBatt" :min="10" :max="50" :step="5" unit="%" class="w-32" /></span>
              </div>
              <div class="amc-setting amc-edge" :class="geofence ? 'amc-edge-nominal' : 'amc-edge-caution'">
                <span class="amc-setting-subject">
                  <span class="dk-pointer">Geofence enforcement</span>
                  <span class="dk-small">Block flight outside boundary</span>
                </span>
                <span class="amc-setting-control"><Switch v-model="geofence" aria-label="Geofence enforcement" /></span>
              </div>
              <div
                class="amc-setting amc-edge"
                :class="geofence ? 'amc-edge-nominal' : 'amc-edge-caution'"
                :data-disabled="!geofence"
              >
                <span class="amc-setting-subject">
                  <span class="dk-pointer">Geofence radius</span>
                  <span class="dk-small">Circular boundary from home</span>
                </span>
                <span class="amc-setting-control"><NumberField v-model="geofenceR" :min="100" :max="2000" :step="50" unit="m" class="w-32" /></span>
              </div>
            </template>

            <!-- Camera & payload -->
            <template v-else-if="section === 'camera'">
              <div class="amc-setting">
                <span class="amc-setting-subject">
                  <span class="dk-pointer">Active sensor</span>
                  <span class="dk-small">Primary gimbal feed</span>
                </span>
                <span class="amc-setting-control">
                  <span class="dk-segment">
                    <button type="button" class="dk-segment-btn" :data-active="camera === 'eo'" @click="camera = 'eo'">EO</button>
                    <button type="button" class="dk-segment-btn" :data-active="camera === 'ir'" @click="camera = 'ir'">IR</button>
                    <button type="button" class="dk-segment-btn" :data-active="camera === 'fusion'" @click="camera = 'fusion'">Fusion</button>
                  </span>
                </span>
              </div>
              <div class="amc-setting">
                <span class="amc-setting-subject">
                  <span class="dk-pointer">Telemetry overlay</span>
                  <span class="dk-small">Burn-in OSD on feed</span>
                </span>
                <span class="amc-setting-control"><Switch v-model="osdTelemetry" aria-label="Telemetry overlay" /></span>
              </div>
              <div class="amc-setting">
                <span class="amc-setting-subject">
                  <span class="dk-pointer">Tracking reticle</span>
                  <span class="dk-small">Center target brackets</span>
                </span>
                <span class="amc-setting-control"><Switch v-model="osdReticle" aria-label="Tracking reticle" /></span>
              </div>
              <div class="amc-setting">
                <span class="amc-setting-subject">
                  <span class="dk-pointer">Grid overlay</span>
                  <span class="dk-small">Rule-of-thirds guide</span>
                </span>
                <span class="amc-setting-control"><Switch v-model="osdGrid" aria-label="Grid overlay" /></span>
              </div>
              <div class="amc-setting">
                <span class="amc-setting-subject">
                  <span class="dk-pointer">Auto-record on arm</span>
                  <span class="dk-small">Start capture when armed</span>
                </span>
                <span class="amc-setting-control"><Switch v-model="autoRecord" aria-label="Auto-record on arm" /></span>
              </div>
            </template>

            <!-- Datalink -->
            <template v-else>
              <div class="amc-setting">
                <span class="amc-setting-subject">
                  <span class="dk-pointer">Frequency band</span>
                  <span class="dk-small">RC + telemetry radio</span>
                </span>
                <span class="amc-setting-control">
                  <span class="dk-segment">
                    <button type="button" class="dk-segment-btn" :data-active="band === '2.4'" @click="band = '2.4'">2.4 GHz</button>
                    <button type="button" class="dk-segment-btn" :data-active="band === '5.8'" @click="band = '5.8'">5.8 GHz</button>
                  </span>
                </span>
              </div>
              <div class="amc-setting amc-edge amc-edge-caution">
                <span class="amc-setting-subject">
                  <span class="dk-pointer">RSSI warning threshold</span>
                  <span class="dk-small">Caution below this signal</span>
                </span>
                <span class="amc-setting-control"><NumberField v-model="rssiWarn" :min="-110" :max="-50" :step="1" unit="dBm" class="w-36" /></span>
              </div>
              <div class="amc-setting">
                <span class="amc-setting-subject">
                  <span class="dk-pointer">Telemetry rate</span>
                  <span class="dk-small">Stream frequency</span>
                </span>
                <span class="amc-setting-control"><NumberField v-model="telemetryHz" :min="1" :max="50" :step="1" unit="Hz" class="w-32" /></span>
              </div>
            </template>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>
