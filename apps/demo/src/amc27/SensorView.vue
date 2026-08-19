<script setup lang="ts">
/**
 * AMC27 · sensor view — the direct redesign of the incumbent screenshots.
 *
 * What moved, and why:
 *
 *   · The eight floating payload chips (VIDEO, STRIKE, FOV, TRACKING, two
 *     circles, a zoom pair and a joystick) are now ONE ruled column. They were
 *     never eight decisions; they are one job — commanding a sensor — and a
 *     column with sections says so.
 *   · The magenta reticle is ink. It brightens and closes when a track locks;
 *     hue carries nothing. The track box picks up `--brand` only while locked,
 *     because "this is the thing I am holding" is a selection, not a severity.
 *   · The bitmap OSD is a quiet mono line. It says what the sensor is doing —
 *     mode, zoom, field of view, track state — and nothing about frame rate,
 *     which is a developer's concern and was the loudest text on the screen.
 *   · STRIKE was a chip the same size as the zoom buttons. Engage authority is
 *     now its own ruled section at the foot of the payload column, behind the
 *     design system's hold-to-confirm control, and it is the only alarm-level
 *     mark on the surface.
 */
import { ref, computed } from 'vue';
import { GuardedAction, Switch } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';
import { t } from './telemetry';

const props = defineProps<{ night?: boolean }>();

const sensor = ref<'EO' | 'IR' | 'FUSED'>('EO');
const tracking = ref(true);
const recording = ref(true);
const stabilise = ref(true);
const grid = ref(true);
const armedPayload = ref(false);

const trackState = computed(() => (tracking.value ? 'LOCK' : 'SEARCH'));
</script>

<template>
  <div class="a27-viewport a27-ticks">
    <!-- ── The picture ─────────────────────────────────────────────────── -->
    <div class="feed absolute inset-0" :class="[sensor === 'IR' ? 'feed-ir' : '', props.night ? 'feed-night' : '']" />

    <!-- Reference grid. The incumbent draws it at full white, which vanishes
         over a bright sky and burns over dark terrain. Drawn twice instead:
         a dark line (`--overlay`, the token that is black at fixed alpha in
         every theme) with a light line riding one pixel above it, so it holds
         over any frame the sensor happens to be showing. Low contrast on
         purpose — a reference is not a subject. -->
    <svg v-if="grid" class="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
      <g stroke="var(--overlay)" stroke-opacity="0.5" stroke-width="1">
        <line x1="33.33%" y1="0" x2="33.33%" y2="100%" />
        <line x1="66.66%" y1="0" x2="66.66%" y2="100%" />
        <line x1="0" y1="33.4%" x2="100%" y2="33.4%" />
        <line x1="0" y1="66.7%" x2="100%" y2="66.7%" />
      </g>
      <g stroke="var(--a27-ink)" stroke-opacity="0.4" stroke-width="1" transform="translate(-1 -1)">
        <line x1="33.33%" y1="0" x2="33.33%" y2="100%" />
        <line x1="66.66%" y1="0" x2="66.66%" y2="100%" />
        <line x1="0" y1="33.4%" x2="100%" y2="33.4%" />
        <line x1="0" y1="66.7%" x2="100%" y2="66.7%" />
      </g>
    </svg>

    <!-- ── OSD ─────────────────────────────────────────────────────────── -->
    <div class="pointer-events-none absolute inset-x-0 top-3 flex justify-center">
      <p class="a27-glass a27-label flex items-center gap-3 px-2.5 py-1.5" style="color: var(--a27-ink)">
        <span>{{ sensor }}</span>
        <span style="color: var(--a27-ink-3)">/</span>
        <span>ZOOM {{ t.zoom.toFixed(1) }}×</span>
        <span style="color: var(--a27-ink-3)">/</span>
        <span>FOV {{ t.fov }}°</span>
        <span style="color: var(--a27-ink-3)">/</span>
        <span>TRACK {{ trackState }}</span>
        <span style="color: var(--a27-ink-3)">/</span>
        <span>{{ stabilise ? 'STAB ON' : 'STAB OFF' }}</span>
      </p>
    </div>

    <!-- Recording marker: the shape carries the state. Top-right of the
         picture, where a camera puts it, not mixed into the button rail. -->
    <div class="a27-glass pointer-events-none absolute right-4 top-3 flex items-center gap-2 px-2.5 py-1.5">
      <span v-if="recording" class="a27-dot a27-pulse" style="background: var(--alarm)" />
      <span class="a27-label" style="color: var(--a27-ink)">{{ recording ? 'REC ' + t.elapsed : 'STANDBY' }}</span>
    </div>

    <!-- The tracked object. Part of the picture, not the UI — it stands in for
         the airframe the incumbent's sensor is holding in these screenshots. -->
    <svg
      class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      width="88"
      height="88"
      viewBox="0 0 88 88"
      aria-hidden="true"
    >
      <g fill="rgb(38 42 44 / 0.86)">
        <rect x="16" y="42" width="56" height="3.5" rx="1.5" />
        <rect x="41" y="30" width="5" height="26" rx="2" />
        <rect x="36" y="52" width="15" height="2.5" rx="1" />
      </g>
    </svg>

    <!-- ── Reticle + track box ─────────────────────────────────────────── -->
    <div class="pointer-events-none absolute left-1/2 top-1/2 h-[200px] w-[200px] -translate-x-1/2 -translate-y-1/2">
      <svg viewBox="0 0 160 160" width="200" height="200" aria-hidden="true">
        <!-- The bounding box for the tracked object. Brand only while locked:
             a selection, not a severity. -->
        <g
          :stroke="tracking ? 'var(--brand)' : 'var(--a27-ink)'"
          :stroke-opacity="tracking ? 1 : 0.6"
          stroke-width="1.5"
          fill="none"
        >
          <path
            :d="tracking
              ? 'M46 34 V26 H54 M106 26 H114 V34 M114 126 V134 H106 M54 134 H46 V126'
              : 'M34 46 V34 H46 M114 34 H126 V46 M126 114 V126 H114 M46 126 H34 V114'"
          />
        </g>
        <!-- Crosshair: ink, always, with a centre gap so the target stays
             visible. The incumbent draws a solid magenta cross through it. -->
        <g stroke="var(--a27-ink)" stroke-width="1.25" stroke-opacity="0.9">
          <line x1="80" y1="58" x2="80" y2="72" />
          <line x1="80" y1="88" x2="80" y2="102" />
          <line x1="58" y1="80" x2="72" y2="80" />
          <line x1="88" y1="80" x2="102" y2="80" />
        </g>
        <circle cx="80" cy="80" r="1.5" fill="var(--a27-ink)" />
      </svg>
      <!-- The track's readout is a chip, not raw burn-in text: brand ink on a
           bright sky frame would fail the contrast it needs to be trusted. -->
      <span
        v-if="tracking"
        class="a27-glass absolute left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap px-2 py-1"
        style="top: calc(50% + 102px); border-left: 2px solid var(--brand)"
      >
        <span class="a27-label" style="color: var(--a27-ink)">TGT-01</span>
        <span class="a27-micro">SLANT 954 M · BRG 092°</span>
      </span>
    </div>

    <!-- ── PiP: where the sensor is looking ────────────────────────────── -->
    <div class="a27-glass absolute bottom-3 left-3 overflow-hidden" style="width: 208px">
      <div class="flex items-center justify-between px-2 py-1.5" style="border-bottom: 1px solid var(--a27-line-2)">
        <span class="a27-label">Sensor footprint</span>
        <button type="button" class="a27-btn a27-btn-sm" style="border: 0" aria-label="Expand map">
          <Icon name="arrow-up-right-from-square" size="xs" />
        </button>
      </div>
      <div class="relative h-[112px]">
        <div class="map-mini absolute inset-0" />
        <svg viewBox="0 0 208 112" class="absolute inset-0 h-full w-full" aria-hidden="true">
          <!-- flown track + ownship: the view's ONE brand surface besides the lock -->
          <path
            d="M22 96 C 60 82, 74 58, 118 48 S 176 30, 192 22"
            fill="none"
            stroke="var(--brand)"
            stroke-width="1.5"
            stroke-dasharray="3 4"
          />
          <!-- the sensor's ground footprint, projected — ink, hollow -->
          <path d="M118 48 L150 78 L182 66 L152 40 Z" fill="none" stroke="var(--a27-ink)" stroke-width="1" stroke-opacity="0.8" />
          <path d="M118 48 L150 78 L182 66 L152 40 Z" fill="var(--a27-ink)" fill-opacity="0.1" />
          <g :transform="`rotate(${t.heading - 90} 118 48)`">
            <path d="M126 48 L112 41 L115 48 L112 55 Z" fill="var(--brand)" />
          </g>
        </svg>
      </div>
    </div>
  </div>

  <!-- ══ Payload column ═══════════════════════════════════════════════════
       Eight floating chips became one ruled column: what the sensor is, how
       it is pointed, what it is doing, and — alone, last, guarded — what it
       is authorised to do. -->
  <aside class="a27-rail a27-rail-right">
   <div class="a27-scroll flex-1">
    <div class="a27-sec">
      <div class="a27-sec-head">
        <span class="a27-label">Payload</span>
        <span class="a27-label" style="color: var(--a27-ink-3)">NEXTVISION RAPTOR</span>
      </div>
      <div class="a27-seg" style="width: 100%">
        <button
          v-for="s in (['EO', 'IR', 'FUSED'] as const)"
          :key="s"
          type="button"
          class="a27-seg-btn"
          style="flex: 1"
          :data-active="sensor === s"
          @click="sensor = s"
        >{{ s }}</button>
      </div>
    </div>

    <!-- Pointing. A gimbal pad instead of a joystick puck and four disembodied
         grey triangles scattered over the frame. -->
    <div class="a27-sec">
      <p class="a27-label mb-2">Gimbal</p>
      <div class="flex items-start gap-3">
        <div class="grid shrink-0" style="grid-template-columns: repeat(3, 30px); grid-template-rows: repeat(3, 30px)">
          <span />
          <button type="button" class="a27-btn a27-btn-sm" style="width: 30px; height: 30px" aria-label="Tilt up"><Icon name="chevron-up" size="xs" /></button>
          <span />
          <button type="button" class="a27-btn a27-btn-sm" style="width: 30px; height: 30px" aria-label="Pan left"><Icon name="chevron-left" size="xs" /></button>
          <button type="button" class="a27-btn a27-btn-sm" style="width: 30px; height: 30px" aria-label="Recentre"><Icon name="plus" size="xs" /></button>
          <button type="button" class="a27-btn a27-btn-sm" style="width: 30px; height: 30px" aria-label="Pan right"><Icon name="chevron-right" size="xs" /></button>
          <span />
          <button type="button" class="a27-btn a27-btn-sm" style="width: 30px; height: 30px" aria-label="Tilt down"><Icon name="chevron-down" size="xs" /></button>
          <span />
        </div>
        <div class="a27-fields min-w-0 flex-1" style="--a27-cols: 1">
          <div class="a27-field">
            <span class="a27-label">Pan</span>
            <span class="a27-field-row"><span class="a27-meas">-014</span><span class="a27-unit">°</span></span>
          </div>
          <div class="a27-field">
            <span class="a27-label">Tilt</span>
            <span class="a27-field-row"><span class="a27-meas">-032</span><span class="a27-unit">°</span></span>
          </div>
        </div>
      </div>
    </div>

    <!-- Optics -->
    <div class="a27-sec">
      <div class="a27-sec-head">
        <span class="a27-label">Optics</span>
        <span class="a27-micro">{{ t.zoom.toFixed(1) }}× · FOV {{ t.fov }}°</span>
      </div>
      <div class="flex items-center gap-2">
        <div class="a27-stack">
          <button type="button" class="a27-btn" aria-label="Zoom out"><Icon name="minus" size="xs" /></button>
          <button type="button" class="a27-btn" aria-label="Zoom in"><Icon name="plus" size="xs" /></button>
        </div>
        <div class="a27-well-box relative h-2 flex-1">
          <span class="absolute inset-y-0 left-0 block" style="width: 42%; background: var(--a27-ink); border-radius: 2px" />
        </div>
      </div>
    </div>

    <!-- Behaviour. Switches, because these are states, not commands — the
         incumbent renders them as buttons whose current value you infer from
         a colour. -->
    <div class="a27-sec">
      <p class="a27-label mb-2">Behaviour</p>
      <div class="flex flex-col gap-2.5">
        <div class="flex items-center justify-between gap-3">
          <span class="a27-name">Object track</span>
          <Switch v-model="tracking" aria-label="Object track" />
        </div>
        <div class="flex items-center justify-between gap-3">
          <span class="a27-name">Stabilisation</span>
          <Switch v-model="stabilise" aria-label="Stabilisation" />
        </div>
        <div class="flex items-center justify-between gap-3">
          <span class="a27-name">Reference grid</span>
          <Switch v-model="grid" aria-label="Reference grid" />
        </div>
        <div class="flex items-center justify-between gap-3">
          <span class="a27-name">Record</span>
          <Switch v-model="recording" aria-label="Record" />
        </div>
      </div>
    </div>

    <!-- What the sensor is looking at. The incumbent shows a range nowhere;
         it is the single most-asked question of an ISR payload. -->
    <div class="a27-sec">
      <div class="a27-sec-head">
        <span class="a27-label">Designated target</span>
        <span class="a27-label" :class="tracking ? 'a27-ink-nominal' : ''">{{ trackState }}</span>
      </div>
      <div class="a27-fields" style="--a27-cols: 2">
        <div class="a27-field">
          <span class="a27-label">Slant range</span>
          <span class="a27-field-row"><span class="a27-meas">954</span><span class="a27-unit">m</span></span>
        </div>
        <div class="a27-field">
          <span class="a27-label">Bearing</span>
          <span class="a27-field-row"><span class="a27-meas">092</span><span class="a27-unit">°</span></span>
        </div>
        <div class="a27-field">
          <span class="a27-label">Ground speed</span>
          <span class="a27-field-row"><span class="a27-meas">0.0</span><span class="a27-unit">m/s</span></span>
        </div>
        <div class="a27-field">
          <span class="a27-label">Held for</span>
          <span class="a27-field-row"><span class="a27-meas">00:47</span></span>
        </div>
      </div>
      <p class="a27-micro mt-2" style="color: var(--a27-ink-3)">
        32TMT 8874 2251 · elev 34 m · derived from laser rangefinder
      </p>
    </div>
   </div>

    <!-- ── Engage authority ────────────────────────────────────────────────
         The one alarm-level region on the surface. Its own section, at the
         foot of the column, with nothing else in it — separation is what
         makes an accidental hit hard. Two steps: authorise (a deliberate
         switch), then commit (hold). -->
    <div class="a27-sec shrink-0" style="border-top: 1px solid var(--a27-line); background: var(--a27-well)">
      <div class="a27-sec-head">
        <span class="a27-label" :class="armedPayload ? 'a27-ink-alarm' : ''">Engage authority</span>
        <span class="a27-label" style="color: var(--a27-ink-3)">ROE 4-C</span>
      </div>
      <div class="mb-2.5 flex items-center justify-between gap-3">
        <span class="a27-name">{{ armedPayload ? 'Authorised' : 'Safed' }}</span>
        <Switch v-model="armedPayload" aria-label="Engage authority" />
      </div>
      <GuardedAction
        mode="hold"
        variant="danger"
        size="md"
        :disabled="!armedPayload"
        :hold-ms="2000"
        confirm-label="Hold to commit…"
        instruction-text="Press and hold for two seconds to commit the engagement"
        class="w-full"
        @confirm="() => {}"
      >
        <Icon name="octagon-exclamation" size="xs" />
        <span class="a27-name" style="color: currentcolor">Commit strike</span>
      </GuardedAction>
      <p class="a27-micro mt-2" style="color: var(--a27-ink-3)">
        TGT-01 · 954 m · fuze FAR · CEP 1.8 m
      </p>
    </div>
  </aside>
</template>

<style scoped>
/* Simulated SENSOR IMAGERY, not UI. These gradients stand in for a live video
 * frame and a raster map tile — the same rationale that exempts a photograph
 * from the token system. Every other colour in this view resolves through a
 * `--a27-*` alias or a design-system token. */
.feed {
  background:
    /* cumulus */
    radial-gradient(14% 9% at 18% 22%, rgb(255 255 255 / 0.95), transparent 68%),
    radial-gradient(11% 7% at 26% 26%, rgb(255 255 255 / 0.8), transparent 70%),
    radial-gradient(17% 8% at 71% 17%, rgb(255 255 255 / 0.85), transparent 70%),
    radial-gradient(9% 5% at 62% 21%, rgb(255 255 255 / 0.6), transparent 72%),
    radial-gradient(20% 6% at 44% 33%, rgb(255 255 255 / 0.45), transparent 74%),
    /* haze band sitting on the horizon */
    linear-gradient(180deg, transparent 46%, rgb(226 232 236 / 0.85) 55.5%, transparent 62%),
    /* terrain bands */
    linear-gradient(
      180deg,
      rgb(122 155 186) 0%,
      rgb(163 187 205) 40%,
      rgb(196 210 216) 55%,
      rgb(126 133 124) 56%,
      rgb(104 110 96) 72%,
      rgb(78 84 72) 100%
    );
}
.feed::before {
  /* ground texture: field furrows receding toward the horizon */
  content: '';
  position: absolute;
  inset: 56% 0 0 0;
  background-image:
    repeating-linear-gradient(91deg, rgb(0 0 0 / 0.07) 0 2px, transparent 2px 34px),
    repeating-linear-gradient(178deg, rgb(0 0 0 / 0.05) 0 2px, transparent 2px 22px);
  opacity: 0.85;
}
.feed::after {
  /* sensor grain + scanlines */
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(0deg, rgb(255 255 255 / 0.02) 0 1px, transparent 1px 3px),
    radial-gradient(rgb(255 255 255 / 0.05) 0.5px, transparent 0.5px);
  background-size: 100% 3px, 4px 4px;
}
.feed-ir {
  filter: grayscale(1) contrast(1.5) brightness(0.85) invert(1);
}
/* The night exposure is scotopic: the picture drops with the chrome, and the
 * blue is pulled out of it, exactly as the darknight theme does to the UI. A
 * frame left at daylight brightness would undo the dark-adaptation the rest of
 * the console is protecting. */
.feed-night {
  filter: brightness(0.44) contrast(1.15) sepia(0.7) saturate(0.5) hue-rotate(-14deg);
}
.map-mini {
  background:
    radial-gradient(46% 46% at 62% 38%, rgb(95 106 62), transparent 70%),
    linear-gradient(160deg, rgb(74 85 50), rgb(52 62 38));
}
</style>
