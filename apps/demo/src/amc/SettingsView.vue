<script setup lang="ts">
import { ref } from 'vue';
import { Switch, NumberField, Button, Badge, StatusBadge } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';

const SECTIONS = [
  { key: 'general', label: 'General', icon: 'gear' },
  { key: 'safety', label: 'Flight & safety', icon: 'triangle-exclamation' },
  { key: 'camera', label: 'Camera & payload', icon: 'eye' },
  { key: 'link', label: 'Datalink', icon: 'bars' },
] as const;
const section = ref('safety');

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
</script>

<template>
  <div class="absolute inset-0 flex flex-col bg-background">
    <!-- header -->
    <div class="flex h-12 shrink-0 items-center gap-3 border-b border-border px-4">
      <Icon name="gear" size="sm" class="text-muted-foreground" />
      <span class="ix-label">AMC</span>
      <span class="text-muted-foreground/40">/</span>
      <h1 class="text-[14px] font-medium tracking-tight">Vehicle settings</h1>
      <Badge variant="secondary" size="sm" class="font-mono tabular-nums">Skyhook-01</Badge>
      <StatusBadge level="nominal" size="sm" dot class="ml-1">Connected</StatusBadge>
      <Button size="sm" class="ml-auto">Done</Button>
    </div>

    <div class="flex min-h-0 flex-1 gap-4 p-4">
      <!-- nav -->
      <nav class="ix-panel w-52 shrink-0 self-start p-3">
        <div class="ix-head mb-2">
          <span class="ix-label">SECTIONS</span>
        </div>
        <div class="space-y-0.5">
          <button
            v-for="s in SECTIONS"
            :key="s.key"
            class="ix-edge ix-lift flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-[13px] transition-colors"
            :class="section === s.key ? 'ix-active bg-secondary font-medium text-foreground' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'"
            @click="section = s.key"
          >
            <Icon :name="s.icon" size="xs" :style="section === s.key ? 'color: var(--brand)' : ''" />
            {{ s.label }}
          </button>
        </div>
      </nav>

      <!-- content -->
      <div class="min-w-0 flex-1 overflow-auto">
        <div class="mx-auto max-w-xl">
          <!-- General -->
          <template v-if="section === 'general'">
            <section class="ix-panel p-5">
              <div class="ix-head mb-1">
                <span class="ix-label">GENERAL</span>
                <span class="ml-auto ix-label-sm text-muted-foreground/70">DISPLAY &amp; READOUT</span>
              </div>
              <div class="setting">
                <div><p class="ix-label st-title">UNITS</p><p class="st-sub">Display system for telemetry</p></div>
                <div class="seg">
                  <button :class="units === 'metric' ? 'seg-on' : ''" @click="units = 'metric'">Metric</button>
                  <button :class="units === 'imperial' ? 'seg-on' : ''" @click="units = 'imperial'">Imperial</button>
                </div>
              </div>
              <div class="setting">
                <div><p class="ix-label st-title">COORDINATE FORMAT</p><p class="st-sub">Position readout</p></div>
                <div class="seg">
                  <button :class="coords === 'mgrs' ? 'seg-on' : ''" @click="coords = 'mgrs'">MGRS</button>
                  <button :class="coords === 'dd' ? 'seg-on' : ''" @click="coords = 'dd'">Lat/Lon</button>
                </div>
              </div>
              <div class="setting">
                <div><p class="ix-label st-title">KEEP SCREEN AWAKE</p><p class="st-sub">Prevent sleep during flight</p></div>
                <Switch :model-value="true" />
              </div>
            </section>
          </template>

          <!-- Flight & safety -->
          <template v-else-if="section === 'safety'">
            <section class="ix-panel p-5">
              <div class="ix-head mb-1">
                <span class="ix-label">FLIGHT &amp; SAFETY</span>
                <span class="ml-auto ix-label-sm text-muted-foreground/70">FAILSAFE ENVELOPE</span>
              </div>
              <div class="setting ix-edge ix-edge-advisory pl-3">
                <div><p class="ix-label st-title">RETURN-TO-LAUNCH ALTITUDE</p><p class="st-sub">Climb to this AGL before returning</p></div>
                <NumberField v-model="rtlAlt" :min="20" :max="200" :step="5" unit="m" class="w-32" />
              </div>
              <div class="setting ix-edge ix-edge-advisory pl-3">
                <div><p class="ix-label st-title">LINK-LOSS FAILSAFE</p><p class="st-sub">Action on datalink loss</p></div>
                <div class="seg">
                  <button :class="failsafe === 'rtl' ? 'seg-on' : ''" @click="failsafe = 'rtl'">RTL</button>
                  <button :class="failsafe === 'land' ? 'seg-on' : ''" @click="failsafe = 'land'">Land</button>
                  <button :class="failsafe === 'hold' ? 'seg-on' : ''" @click="failsafe = 'hold'">Hold</button>
                </div>
              </div>
              <div class="setting ix-edge ix-edge-warning pl-3">
                <div><p class="ix-label st-title">LOW-BATTERY RTL</p><p class="st-sub">Trigger return at this charge</p></div>
                <NumberField v-model="lowBatt" :min="10" :max="50" :step="5" unit="%" class="w-32" />
              </div>
              <div class="setting ix-edge pl-3" :class="geofence ? 'ix-edge-nominal' : 'ix-edge-caution'">
                <div><p class="ix-label st-title">GEOFENCE ENFORCEMENT</p><p class="st-sub">Block flight outside boundary</p></div>
                <Switch v-model="geofence" />
              </div>
              <div class="setting ix-edge pl-3" :class="[geofence ? 'ix-edge-nominal' : 'ix-edge-caution', !geofence ? 'opacity-40' : '']">
                <div><p class="ix-label st-title">GEOFENCE RADIUS</p><p class="st-sub">Circular boundary from home</p></div>
                <NumberField v-model="geofenceR" :min="100" :max="2000" :step="50" unit="m" class="w-32" />
              </div>
            </section>
          </template>

          <!-- Camera & payload -->
          <template v-else-if="section === 'camera'">
            <section class="ix-panel p-5">
              <div class="ix-head mb-1">
                <span class="ix-label">CAMERA &amp; PAYLOAD</span>
                <span class="ml-auto ix-label-sm text-muted-foreground/70">GIMBAL &amp; OSD</span>
              </div>
              <div class="setting">
                <div><p class="ix-label st-title">ACTIVE SENSOR</p><p class="st-sub">Primary gimbal feed</p></div>
                <div class="seg">
                  <button :class="camera === 'eo' ? 'seg-on' : ''" @click="camera = 'eo'">EO</button>
                  <button :class="camera === 'ir' ? 'seg-on' : ''" @click="camera = 'ir'">IR</button>
                  <button :class="camera === 'fusion' ? 'seg-on' : ''" @click="camera = 'fusion'">Fusion</button>
                </div>
              </div>
              <div class="setting">
                <div><p class="ix-label st-title">TELEMETRY OVERLAY</p><p class="st-sub">Burn-in OSD on feed</p></div>
                <Switch v-model="osdTelemetry" />
              </div>
              <div class="setting">
                <div><p class="ix-label st-title">TRACKING RETICLE</p><p class="st-sub">Center target brackets</p></div>
                <Switch v-model="osdReticle" />
              </div>
              <div class="setting">
                <div><p class="ix-label st-title">GRID OVERLAY</p><p class="st-sub">Rule-of-thirds guide</p></div>
                <Switch v-model="osdGrid" />
              </div>
              <div class="setting">
                <div><p class="ix-label st-title">AUTO-RECORD ON ARM</p><p class="st-sub">Start capture when armed</p></div>
                <Switch v-model="autoRecord" />
              </div>
            </section>
          </template>

          <!-- Datalink -->
          <template v-else>
            <section class="ix-panel p-5">
              <div class="ix-head mb-1">
                <span class="ix-label">DATALINK</span>
                <span class="ml-auto ix-label-sm text-muted-foreground/70">RADIO &amp; STREAM</span>
              </div>
              <div class="setting">
                <div><p class="ix-label st-title">FREQUENCY BAND</p><p class="st-sub">RC + telemetry radio</p></div>
                <div class="seg">
                  <button :class="band === '2.4' ? 'seg-on' : ''" @click="band = '2.4'">2.4 GHz</button>
                  <button :class="band === '5.8' ? 'seg-on' : ''" @click="band = '5.8'">5.8 GHz</button>
                </div>
              </div>
              <div class="setting ix-edge ix-edge-caution pl-3">
                <div><p class="ix-label st-title">RSSI WARNING THRESHOLD</p><p class="st-sub">Caution below this signal</p></div>
                <NumberField v-model="rssiWarn" :min="-110" :max="-50" :step="1" unit="dBm" class="w-36" />
              </div>
              <div class="setting">
                <div><p class="ix-label st-title">TELEMETRY RATE</p><p class="st-sub">Stream frequency</p></div>
                <NumberField v-model="telemetryHz" :min="1" :max="50" :step="1" unit="Hz" class="w-32" />
              </div>
            </section>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.setting {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid color-mix(in oklab, var(--border) 60%, transparent);
  padding: 0.85rem 0;
}
.setting:last-child { border-bottom: none; }
.st-title { color: var(--foreground); }
.st-sub { font-size: 12px; color: var(--muted-foreground); margin-top: 2px; }
.seg {
  display: inline-flex;
  gap: 2px;
  border-radius: 0.5rem;
  border: 1px solid var(--border);
  background: var(--card);
  padding: 2px;
}
.seg button {
  border-radius: 0.375rem;
  padding: 0.25rem 0.7rem;
  font-size: 12px;
  color: var(--muted-foreground);
  transition: all 0.15s;
}
.seg button.seg-on {
  background: var(--secondary);
  color: var(--foreground);
}
</style>
