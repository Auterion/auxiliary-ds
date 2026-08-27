<script setup lang="ts">
/**
 * AMC27 · handheld — the same design system at phone scale.
 *
 * The console frames the picture; a handheld cannot afford to. At 932 × 430 a
 * command bar, two rails and an instrument strip would leave a postage stamp
 * of video, so the relationship inverts: the picture is full-bleed and the
 * controls float on it as a HUD.
 *
 * The layout borrows from mobile shooter HUDs, which solved "two thumbs, one
 * live picture, no time" before anyone tried it on a ground control station:
 *
 *   · TWO THUMB ZONES, and nothing important outside them. The device is held
 *     at its bottom corners, so every in-flight control sits within reach of
 *     one. The middle and the whole top edge are for LOOKING. Porting the
 *     desktop's left rail to a tablet is the classic failure — it puts the
 *     most-used controls where no thumb reaches.
 *   · ONE PRIMARY PER HAND, SATELLITES FANNED. The constant action is a big
 *     disc under the thumb; the occasional ones arc out from it, smaller, and
 *     collapse back when you are done. A flat grid of equal buttons would make
 *     every choice cost the same look.
 *   · DISCS, NOT PANELS. Cards stack and eat the frame; a translucent disc
 *     over the picture does not.
 *   · SHEETS FOR EVERYTHING ELSE. Anything not needed in the next two seconds
 *     — the alert history, the fleet, engage authority — rises from the bottom
 *     edge on demand and goes away again.
 *
 * One thing deliberately NOT borrowed: a shooter puts fire under the thumb,
 * permanently. Here the strike control does not exist until authority is armed
 * in the sheet, and then it is a hold. An engage control you can brush with a
 * thumb is not a design decision anyone should ship.
 *
 * Everything else is unchanged from the console — the same tokens, the same
 * reserved severity ladder, the same one-brand-colour budget, the same type
 * roles. This is the system speaking at a different scale, not a second design.
 */
import { ref, computed } from 'vue';
import { GuardedAction, Switch } from '@auxiliary/vue';
import { Icon, type IconName } from '@auxiliary/icons';
import { t, fleet, alerts, type Level } from './telemetry';

const props = defineProps<{ night?: boolean }>();

const sensor = ref<'EO' | 'IR'>('EO');
const tracking = ref(true);
const recording = ref(true);
const leftOpen = ref(true);
const sheet = ref<'closed' | 'alerts'>('closed');
const authority = ref(false);

const active = computed(() => fleet[0]!);
const battLevel = computed(() =>
  active.value.battery < 25 ? 'alarm' : active.value.battery < 40 ? 'warning' : 'nominal',
);
const latched = computed(() => alerts.filter((a) => a.latched));

/**
 * The bottom ribbon. Four measures, not the console's seven: a desk has room
 * for seven, a 430 px-tall frame does not, and these are the four an operator
 * actually flies on. The rest are one swipe away in the sheet.
 */
const ribbon = computed(() => [
  { l: 'AS', v: t.as.toFixed(1), u: 'm/s' },
  { l: 'ALT', v: String(t.agl), u: 'm' },
  { l: 'DST', v: String(t.dist), u: 'm' },
  { l: 'HDG', v: String(t.heading).padStart(3, '0'), u: '°' },
]);

/**
 * Flight commands, fanned from the left thumb. The arc opens up and to the
 * RIGHT — into the frame, never past the left edge. It stops at 102° for that
 * reason: a satellite at 120° puts half a control off the screen, which is the
 * kind of thing that only shows up once you actually look at the device.
 */
const leftFan: { a: number; icon: IconName; label: string; level?: Level }[] = [
  { a: 6, icon: 'house', label: 'RTL' },
  { a: 38, icon: 'circle-exclamation', label: 'Hold' },
  { a: 70, icon: 'arrow-right', label: 'Speed' },
  { a: 102, icon: 'triangle-exclamation', label: 'Abort', level: 'warning' },
];
</script>

<template>
  <div class="relative h-full w-full overflow-hidden">
    <!-- ── The picture ─────────────────────────────────────────────────── -->
    <div
      class="feed absolute inset-0"
      :class="[sensor === 'IR' ? 'feed-ir' : '', props.night ? 'feed-night' : '']"
    />

    <!-- Reticle. Same symbology as the console, scaled — a track box that
         means one thing on a desk cannot mean another in the field. -->
    <div class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      <svg width="132" height="132" viewBox="0 0 160 160" aria-hidden="true">
        <g
          :stroke="tracking ? 'var(--brand)' : 'var(--a27-ink)'"
          :stroke-opacity="tracking ? 1 : 0.6"
          stroke-width="2"
          fill="none"
        >
          <path
            :d="tracking
              ? 'M46 34 V26 H54 M106 26 H114 V34 M114 126 V134 H106 M54 134 H46 V126'
              : 'M34 46 V34 H46 M114 34 H126 V46 M126 114 V126 H114 M46 126 H34 V114'"
          />
        </g>
        <g stroke="var(--a27-ink)" stroke-width="1.5" stroke-opacity="0.9">
          <line x1="80" y1="58" x2="80" y2="72" />
          <line x1="80" y1="88" x2="80" y2="102" />
          <line x1="58" y1="80" x2="72" y2="80" />
          <line x1="88" y1="80" x2="102" y2="80" />
        </g>
      </svg>
    </div>

    <!-- The tracked object, part of the picture. -->
    <svg
      class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      width="72"
      height="72"
      viewBox="0 0 88 88"
      aria-hidden="true"
    >
      <g fill="rgb(38 42 44 / 0.86)">
        <rect x="16" y="42" width="56" height="3.5" rx="1.5" />
        <rect x="41" y="30" width="5" height="26" rx="2" />
        <rect x="36" y="52" width="15" height="2.5" rx="1" />
      </g>
    </svg>

    <!-- ── Top edge · look, don't touch ─────────────────────────────────── -->

    <!-- Map, top-left. Tap to swap it with the sensor feed. -->
    <button
      type="button"
      class="absolute overflow-hidden"
      style="
        left: var(--a27-hud-gap);
        top: var(--a27-hud-gap);
        width: 132px;
        height: 84px;
        border: 1px solid color-mix(in oklab, var(--foreground) 26%, transparent);
        border-radius: var(--radius-md);
      "
      aria-label="Swap to map view"
    >
      <span class="map-mini absolute inset-0" />
      <svg viewBox="0 0 132 84" class="absolute inset-0 h-full w-full" aria-hidden="true">
        <path
          d="M14 72 C 38 62, 46 44, 74 36 S 112 22, 122 16"
          fill="none"
          stroke="var(--brand)"
          stroke-width="1.5"
          stroke-dasharray="3 4"
        />
        <g :transform="`rotate(${t.heading - 90} 74 36)`">
          <path d="M81 36 L69 30 L72 36 L69 42 Z" fill="var(--brand)" />
        </g>
      </svg>
    </button>

    <!-- Sensor state, centred: what the payload is doing, nothing else. -->
    <div
      class="a27-hud-strip pointer-events-none absolute left-1/2 -translate-x-1/2"
      style="top: var(--a27-hud-gap)"
    >
      <span class="a27-label" style="color: var(--a27-ink)">{{ sensor }}</span>
      <span class="a27-label" style="color: var(--a27-ink-3)">/</span>
      <span class="a27-label" style="color: var(--a27-ink)">{{ t.zoom.toFixed(1) }}×</span>
      <span class="a27-label" style="color: var(--a27-ink-3)">/</span>
      <span class="a27-label" style="color: var(--a27-ink)">FOV {{ t.fov }}°</span>
      <span class="a27-label" style="color: var(--a27-ink-3)">/</span>
      <span class="a27-label" :style="{ color: tracking ? 'var(--brand)' : 'var(--a27-ink-2)' }">
        {{ tracking ? 'LOCK' : 'SEARCH' }}
      </span>
      <span v-if="recording" class="a27-dot a27-pulse" style="background: var(--alarm)" />
    </div>

    <!-- Aircraft state, top-right. Four facts and no fifth: which aircraft,
         armed or not, how much battery, is the link up. -->
    <div
      class="a27-hud-strip absolute"
      style="right: var(--a27-hud-gap); top: var(--a27-hud-gap)"
    >
      <span :class="`a27-ink-${active.health}`"><span class="a27-dot block" /></span>
      <span class="a27-label" style="color: var(--a27-ink)">{{ active.callsign }}</span>
      <span
        class="a27-label"
        :class="active.armed ? 'a27-ink-warning' : ''"
        style="padding-inline: 6px; border-inline: 1px solid var(--a27-line-2)"
      >{{ active.armed ? 'ARMED' : 'SAFE' }}</span>
      <span class="a27-label" :class="`a27-ink-${battLevel}`">{{ active.battery }}%</span>
      <span class="a27-label" style="color: var(--a27-ink-2)">{{ t.snr }} dB</span>
    </div>

    <!-- The one alert that is allowed to interrupt: a latched caution, as a
         tappable pill under the aircraft strip. The rest live in the sheet. -->
    <button
      v-if="latched.length"
      type="button"
      class="a27-hud-strip a27-hud-warning absolute"
      style="right: var(--a27-hud-gap); top: 58px"
      @click="sheet = 'alerts'"
    >
      <Icon name="triangle-exclamation" size="xs" />
      <span class="a27-label" style="color: currentcolor">{{ latched[0]!.text }}</span>
      <Icon name="chevron-right" size="xs" />
    </button>

    <!-- ── Bottom centre · the measures ─────────────────────────────────── -->
    <div
      class="a27-hud-strip pointer-events-none absolute left-1/2 -translate-x-1/2"
      style="bottom: var(--a27-hud-gap); gap: 14px"
    >
      <span v-for="f in ribbon" :key="f.l" class="flex items-baseline gap-1.5">
        <span class="a27-label">{{ f.l }}</span>
        <span class="a27-meas">{{ f.v }}</span>
        <span class="a27-unit">{{ f.u }}</span>
      </span>
    </div>

    <!-- ── Left thumb · flight commands ─────────────────────────────────── -->
    <div
      class="a27-fan a27-fan-dock"
      :data-open="leftOpen"
      style="left: 30px; bottom: 30px; width: var(--a27-touch-lg); height: var(--a27-touch-lg)"
    >
      <button
        v-for="c in leftFan"
        :key="c.label"
        type="button"
        class="a27-hud a27-fan-item"
        :class="c.level === 'warning' ? 'a27-hud-warning' : ''"
        :style="{ '--a27-a': `${c.a}deg` }"
        :tabindex="leftOpen ? 0 : -1"
        :aria-label="c.label"
      >
        <span class="flex flex-col items-center gap-0.5">
          <Icon :name="c.icon" size="xs" />
          <span class="a27-label" style="color: currentcolor; font-size: var(--text-2xs)">{{ c.label }}</span>
        </span>
      </button>

      <button
        type="button"
        class="a27-hud a27-hud-lg relative"
        :data-active="leftOpen"
        :aria-expanded="leftOpen"
        aria-label="Flight commands"
        @click="leftOpen = !leftOpen"
      >
        <Icon :name="leftOpen ? 'xmark' : 'bars'" size="sm" />
      </button>
    </div>

    <!-- ── Right thumb · the payload ────────────────────────────────────── -->
    <div
      class="a27-fan a27-fan-dock"
      :data-open="!authority"
      style="right: 30px; bottom: 30px; width: var(--a27-touch-xl); height: var(--a27-touch-xl)"
    >
      <button
        type="button"
        class="a27-hud a27-fan-item"
        style="--a27-a: 112deg"
        aria-label="Zoom out"
      ><Icon name="minus" size="sm" /></button>
      <button
        type="button"
        class="a27-hud a27-fan-item"
        style="--a27-a: 146deg"
        aria-label="Zoom in"
      ><Icon name="plus" size="sm" /></button>
      <button
        type="button"
        class="a27-hud a27-fan-item"
        style="--a27-a: 180deg"
        :data-active="sensor === 'IR'"
        :aria-pressed="sensor === 'IR'"
        aria-label="Infrared sensor"
        @click="sensor = sensor === 'EO' ? 'IR' : 'EO'"
      ><span class="a27-label" style="color: currentcolor">{{ sensor }}</span></button>
      <button
        type="button"
        class="a27-hud a27-fan-item"
        style="--a27-a: 78deg"
        :aria-pressed="recording"
        :aria-label="recording ? 'Stop recording' : 'Start recording'"
        @click="recording = !recording"
      >
        <!-- The SHAPE carries the state, not an ink inversion: TRACK is the
             only filled disc on the device, and two filled discs would be two
             loudest things. The live claim is the pulsing dot in the sensor
             strip, where a camera puts it. -->
        <span
          class="rec"
          :class="recording ? 'h-3 w-3 rounded-[2px]' : 'h-4 w-4 rounded-full'"
          style="background: currentcolor"
        />
      </button>

      <!-- The primary: hold the target. Under the thumb because it is the
           thing an ISR operator touches most, and because losing a track is
           the failure that costs the most to recover. -->
      <button
        type="button"
        class="a27-hud a27-hud-xl"
        :data-active="tracking"
        :aria-pressed="tracking"
        aria-label="Object track lock"
        @click="tracking = !tracking"
      >
        <span class="flex flex-col items-center gap-0.5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path d="M4 8 V4 H8 M16 4 H20 V8 M20 16 V20 H16 M8 20 H4 V16" />
            <circle cx="12" cy="12" r="2.5" />
          </svg>
          <span class="a27-label" style="color: currentcolor; font-size: var(--text-2xs)">TRACK</span>
        </span>
      </button>
    </div>

    <!-- Engage authority. The control does not exist until it is armed in the
         sheet — a strike button that lives permanently under a thumb is not a
         thing to ship, however good it looks. -->
    <!-- Arming authority COLLAPSES the optics fan and puts the strike where the
         satellites were. Zoom and sensor mode do not compete with an engagement
         for the same thumb, and the collapse is itself the confirmation that
         the payload's state changed — the operator sees the hand change shape,
         not just a colour somewhere.

         GuardedAction's root is an inline-flex `<span>`; the `class` prop lands
         on the button INSIDE it, so the positioning goes on a wrapper. Passing
         `absolute` through the prop places the button against the page. -->
    <div v-if="authority" class="absolute" style="right: 34px; bottom: 124px">
      <GuardedAction
        mode="hold"
        variant="danger"
        size="md"
        :hold-ms="2000"
        confirm-label="Hold…"
        instruction-text="Press and hold for two seconds to commit the engagement"
        class="a27-hh-strike"
        @confirm="() => {}"
      >
        <Icon name="octagon-exclamation" size="xs" />
        <span class="a27-label" style="color: currentcolor">Strike</span>
      </GuardedAction>
    </div>

    <!-- Sheet handle, bottom-left of the top zone — out of both thumb arcs. -->
    <button
      type="button"
      class="a27-hud absolute"
      style="left: var(--a27-hud-gap); top: 104px"
      aria-label="Open mission sheet"
      @click="sheet = sheet === 'closed' ? 'alerts' : 'closed'"
    >
      <Icon name="chevron-up" size="sm" />
    </button>

    <!-- ── The sheet ────────────────────────────────────────────────────── -->
    <div class="a27-sheet" :data-open="sheet !== 'closed'" :aria-hidden="sheet === 'closed'">
      <span class="a27-sheet-grab" aria-hidden="true" />
      <div class="flex items-center justify-between px-3 pb-2">
        <span class="a27-label">Alerts &amp; authority</span>
        <button type="button" class="a27-btn a27-btn-sm" aria-label="Close sheet" @click="sheet = 'closed'">
          <Icon name="xmark" size="xs" />
        </button>
      </div>

      <div class="a27-scroll px-2" style="max-height: 168px">
        <div
          v-for="a in alerts"
          :key="a.code"
          class="a27-alert a27-edge"
          :class="`a27-edge-${a.level}`"
        >
          <span class="a27-label" :class="`a27-ink-${a.level}`">{{ a.code }}</span>
          <span class="a27-micro" style="color: var(--a27-ink)">{{ a.text }}</span>
          <span class="a27-label" style="color: var(--a27-ink-3)">{{ a.at }}</span>
          <span class="a27-label" style="color: var(--a27-ink-3)">{{ a.latched ? 'LATCHED' : 'CLEARED' }}</span>
        </div>
      </div>

      <div
        class="flex items-center justify-between gap-3 px-3 py-2.5"
        style="border-top: 1px solid var(--a27-line); background: var(--a27-well)"
      >
        <span>
          <span class="a27-name block" :class="authority ? 'a27-ink-alarm' : ''">
            Engage authority · {{ authority ? 'authorised' : 'safed' }}
          </span>
          <span class="a27-label">ROE 4-C · TGT-01 · 954 M · CEP 1.8 M</span>
        </span>
        <Switch v-model="authority" aria-label="Engage authority" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Simulated SENSOR IMAGERY and map raster — photography standing in for a live
 * frame, not UI. Same exemption as the console's sensor view; every other
 * colour here resolves through a `--a27-*` alias or a design-system token. */
.feed {
  background:
    radial-gradient(14% 11% at 18% 24%, rgb(255 255 255 / 0.95), transparent 68%),
    radial-gradient(11% 8% at 26% 29%, rgb(255 255 255 / 0.8), transparent 70%),
    radial-gradient(17% 10% at 71% 18%, rgb(255 255 255 / 0.85), transparent 70%),
    radial-gradient(20% 7% at 44% 36%, rgb(255 255 255 / 0.45), transparent 74%),
    linear-gradient(180deg, transparent 46%, rgb(226 232 236 / 0.85) 56%, transparent 63%),
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
.feed::after {
  content: '';
  position: absolute;
  inset: 56% 0 0 0;
  background-image:
    repeating-linear-gradient(91deg, rgb(0 0 0 / 0.07) 0 2px, transparent 2px 34px),
    repeating-linear-gradient(178deg, rgb(0 0 0 / 0.05) 0 2px, transparent 2px 22px);
}
.feed-ir { filter: grayscale(1) contrast(1.5) brightness(0.85) invert(1); }
.feed-night { filter: brightness(0.44) contrast(1.15) sepia(0.7) saturate(0.5) hue-rotate(-14deg); }
.map-mini {
  background:
    radial-gradient(46% 46% at 62% 38%, rgb(95 106 62), transparent 70%),
    linear-gradient(160deg, rgb(74 85 50), rgb(52 62 38));
}

.rec {
  transition: width var(--duration-base) var(--ease-out),
    height var(--duration-base) var(--ease-out),
    border-radius var(--duration-base) var(--ease-out);
}
@media (prefers-reduced-motion: reduce) {
  .rec { transition: none; }
}
</style>
