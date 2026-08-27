<script setup lang="ts">
/**
 * AMC27 · tablet — the HUD.
 *
 * The console and the handheld both FRAME the picture. This one frames
 * nothing. It is built on the conventions that mobile shooter HUDs settled on
 * — Call of Duty Mobile and its neighbours — because they solved "one live
 * world, two thumbs, no time to look away" before anyone tried it on a ground
 * control station.
 *
 * The conventions, and what each becomes on a GCS:
 *
 *   SHOOTER                          AMC27 TABLET
 *   the world, full-bleed         →  the tactical MAP, full-bleed
 *   minimap in its corner         →  the SENSOR FEED in its corner (tap to swap)
 *   faction / score / timer, TL   →  mission, aircraft, waypoint progress, TL
 *   context buttons, TR           →  the latched alert, and only while latched
 *   scorestreaks down one edge    →  flight commands down the left edge
 *   movement stick, BL            →  gimbal slew, the one always-under-a-thumb
 *   fire stack, BR                →  track · zoom · record · STRIKE, vertical
 *   ammo + health, bottom-centre  →  payload state + the flight measures
 *   scoreboard / loadout overlay  →  fleet · alerts · plan, full-screen
 *
 * Size is the hierarchy, exactly as it is there: the stick and the commit are
 * huge, the primaries are 66 px, the secondaries 54 px, and nothing goes below
 * the 44 px gloved-hand floor. Everything is veiled at one opacity so the map
 * stays readable through all of it at once.
 *
 * What is NOT borrowed. A game HUD spends colour freely because nothing on it
 * is a claim about safety. This surface keeps the reserved five-level ladder,
 * the one-brand-colour budget and mono tabular measures — and it does not put
 * fire permanently under a thumb: the strike control does not exist until
 * authority is armed, which is the same context-sensitivity a shooter uses for
 * "cancel grenade", pointed at something that matters more.
 */
import { ref, computed } from 'vue';
import { GuardedAction, StatusBadge } from '@auxiliary/vue';
import { Icon, type IconName } from '@auxiliary/icons';
import TabletSheet from './TabletSheet.vue';
import { t, fleet, alerts, plan, ownship, tracks, type Level } from './telemetry';

const props = defineProps<{ night?: boolean }>();

/* ── State ───────────────────────────────────────────────────────────────── */
type Menu = 'none' | 'vehicle' | 'mission' | 'emergency';
type Panel = 'none' | 'fleet' | 'alerts' | 'plan';

const menu = ref<Menu>('none');
const panel = ref<Panel>('none');
const selected = ref('v1');

/** Which layer is the world. Tapping the corner window swaps them — the
 *  minimap's "tap to expand" convention, made two-way. */
const world = ref<'map' | 'sensor'>('map');
const sensor = ref<'EO' | 'IR'>('EO');
const tracking = ref(true);
const recording = ref(true);
const authority = ref(false);

const active = computed(() => fleet.find((v) => v.id === selected.value) ?? fleet[0]!);
const latched = computed(() => alerts.filter((a) => a.latched));
const battLevel = computed<Level>(() =>
  active.value.battery < 25 ? 'alarm' : active.value.battery < 40 ? 'warning' : 'nominal',
);

function swapWorld() {
  world.value = world.value === 'map' ? 'sensor' : 'map';
}

/* ── Content ─────────────────────────────────────────────────────────────── */

/**
 * The left edge. A shooter stacks scorestreaks here — earned abilities you fire
 * off when the moment comes, each showing its own readiness. These are the
 * incumbent's six left-rail circles, and they behave the same way: one tap,
 * each carrying the value it currently holds.
 */
const streaks: { key: string; icon: IconName; label: string; value: string }[] = [
  { key: 'rtl', icon: 'house', label: 'RTL', value: `${t.home} m` },
  { key: 'hold', icon: 'circle-exclamation', label: 'Hold', value: 'Loiter' },
  { key: 'approach', icon: 'arrow-down', label: 'Appr', value: '30°' },
  { key: 'fuze', icon: 'triangle-exclamation', label: 'Fuze', value: 'FAR' },
  { key: 'pose', icon: 'arrow-up-right-from-square', label: 'Pose', value: 'Reset' },
];

const missionMenu: { icon: IconName; label: string; hint: string }[] = [
  { icon: 'arrow-up', label: 'Start mission', hint: 'From waypoint 1' },
  { icon: 'circle-exclamation', label: 'Pause at waypoint', hint: 'Hold at WP 7' },
  { icon: 'arrow-right', label: 'Resume', hint: 'Continue to WP 8' },
  { icon: 'arrow-up-right-from-square', label: 'Upload plan', hint: 'Revision 4 · CRC 0x8F2A' },
  { icon: 'magnifying-glass', label: 'Verify on aircraft', hint: 'Last verified 14:09' },
];

const emergency: { icon: IconName; label: string; hint: string; level: Level }[] = [
  { icon: 'house', label: 'Return to launch', hint: 'Climb to 60 m, fly home, land', level: 'advisory' },
  { icon: 'arrow-down', label: 'Land here', hint: 'Descend at current position', level: 'caution' },
  { icon: 'circle-exclamation', label: 'Hold position', hint: 'Loiter until commanded', level: 'advisory' },
];

/** The bottom-centre readout — the ammo-and-health row. */
const vitals = computed(() => [
  { l: 'AS', v: t.as.toFixed(1), u: 'm/s' },
  { l: 'ALT', v: String(t.agl), u: 'm' },
  { l: 'DST', v: String(t.dist), u: 'm' },
  { l: 'HDG', v: String(t.heading).padStart(3, '0'), u: '°' },
]);

const planPath = plan.map((p) => `${p.x},${p.y}`).join(' ');
const flownPath = plan.slice(0, 7).map((p) => `${p.x},${p.y}`).join(' ');
</script>

<template>
  <div class="a27-tablet-screen">
    <!-- ══ The world ════════════════════════════════════════════════════════
         Full-bleed, edge to edge, nothing docked over it. On a GCS the world
         is the tactical picture, so the map is the ground layer and the sensor
         feed is the corner window — the exact inverse of the desktop console,
         and the reason this device reads as a HUD rather than a shrunk app. -->
    <div class="absolute inset-0">
      <template v-if="world === 'map'">
        <div class="terrain absolute inset-0" />
        <svg viewBox="0 0 1000 620" class="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice">
          <path
            d="M70 560 L70 140 L560 90 L930 160 L930 560 Z"
            fill="var(--a27-ink)" fill-opacity="0.03"
            stroke="var(--a27-ink)" stroke-opacity="0.35" stroke-width="1.5" stroke-dasharray="10 6"
          />
          <polyline :points="planPath" fill="none" stroke="var(--a27-ink)" stroke-opacity="0.5" stroke-width="1.5" stroke-dasharray="6 5" />
          <polyline :points="flownPath" fill="none" stroke="var(--brand)" stroke-width="2.5" />
          <g v-for="p in plan" :key="p.n" :transform="`translate(${p.x} ${p.y})`">
            <rect
              x="-10" y="-10" width="20" height="20" rx="3"
              :transform="p.kind === 'LOITER' ? 'rotate(45)' : undefined"
              fill="var(--background)" fill-opacity="0.85" stroke="var(--a27-ink)" stroke-width="1.5"
            />
            <text y="4" text-anchor="middle" font-family="var(--font-mono)" font-size="11" font-weight="600" fill="var(--a27-ink)">{{ p.n }}</text>
          </g>
          <g v-for="tr in tracks" :key="tr.id" :transform="`translate(${tr.x} ${tr.y})`">
            <circle r="11" fill="none" :stroke="tr.hostile ? 'var(--alarm)' : 'var(--a27-ink)'" stroke-width="1.5" :stroke-opacity="tr.hostile ? 1 : 0.7" />
            <circle r="2.5" :fill="tr.hostile ? 'var(--alarm)' : 'var(--a27-ink)'" />
            <text x="16" y="4" font-family="var(--font-mono)" font-size="11" letter-spacing="0.06em" :fill="tr.hostile ? 'var(--alarm-emphasis)' : 'var(--a27-ink-2)'">{{ tr.id }}</text>
          </g>
          <!-- Ownship: the one mark that must win at a glance. -->
          <g :transform="`translate(${ownship.x} ${ownship.y})`">
            <line :transform="`rotate(${ownship.hdg - 90})`" x1="0" y1="0" x2="58" y2="0" stroke="var(--brand)" stroke-width="1.5" stroke-dasharray="3 3" />
            <g :transform="`rotate(${ownship.hdg - 90})`">
              <path d="M18 0 L-11 -11 L-6 0 L-11 11 Z" fill="var(--brand)" stroke="var(--background)" stroke-width="1" />
            </g>
            <text x="0" y="-22" text-anchor="middle" font-family="var(--font-mono)" font-size="11" letter-spacing="0.06em" fill="var(--a27-ink)">HAWK 01 · {{ t.agl }} M</text>
          </g>
        </svg>
      </template>

      <template v-else>
        <div class="feed absolute inset-0" :class="[sensor === 'IR' ? 'feed-ir' : '', props.night ? 'feed-night' : '']" />
        <svg
          class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          width="88" height="88" viewBox="0 0 88 88" aria-hidden="true"
        >
          <g fill="rgb(38 42 44 / 0.86)">
            <rect x="16" y="42" width="56" height="3.5" rx="1.5" />
            <rect x="41" y="30" width="5" height="26" rx="2" />
            <rect x="36" y="52" width="15" height="2.5" rx="1" />
          </g>
        </svg>
        <div class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <svg width="220" height="220" viewBox="0 0 160 160" aria-hidden="true">
            <g
              :stroke="tracking ? 'var(--brand)' : 'var(--a27-ink)'"
              :stroke-opacity="tracking ? 1 : 0.6" stroke-width="2" fill="none"
            >
              <path
                :d="tracking
                  ? 'M46 34 V26 H54 M106 26 H114 V34 M114 126 V134 H106 M54 134 H46 V126'
                  : 'M34 46 V34 H46 M114 34 H126 V46 M126 114 V126 H114 M46 126 H34 V114'"
              />
            </g>
            <g stroke="var(--a27-ink)" stroke-width="1.5" stroke-opacity="0.9">
              <line x1="80" y1="58" x2="80" y2="72" /><line x1="80" y1="88" x2="80" y2="102" />
              <line x1="58" y1="80" x2="72" y2="80" /><line x1="88" y1="80" x2="102" y2="80" />
            </g>
          </svg>
        </div>
      </template>
    </div>

    <!-- ══ Top-left · identity, score, timer ════════════════════════════════
         A shooter puts the faction, the score and the clock here. A GCS puts
         which mission, which aircraft, and how far through the plan it is. -->
    <div class="absolute flex items-start gap-2" style="left: var(--a27-hud-pad); top: var(--a27-hud-pad)">
      <button
        type="button"
        class="a27-hud-card flex items-center gap-2.5 px-3"
        style="height: var(--a27-act-lg)"
        :data-active="menu === 'vehicle'"
        :aria-pressed="menu === 'vehicle'"
        :aria-expanded="menu === 'vehicle'"
        @click="menu = menu === 'vehicle' ? 'none' : 'vehicle'"
      >
        <span :class="`a27-ink-${active.health}`"><span class="a27-dot block" /></span>
        <span class="text-left leading-tight">
          <span class="a27-name block" style="font-size: 13.5px">{{ active.callsign }}</span>
          <span class="a27-label">{{ active.armed ? 'ARMED' : 'SAFE' }} · {{ active.mode }}</span>
        </span>
        <Icon name="chevron-down" size="xs" style="color: var(--a27-ink-3)" />
      </button>

      <div class="a27-hud-card flex items-center gap-4 px-3.5" style="height: var(--a27-act-lg)">
        <span class="leading-tight">
          <span class="a27-label block">MISSION · WP 7/9</span>
          <span class="a27-meas mt-1 block">{{ t.elapsed }} <span class="a27-unit">elapsed</span></span>
        </span>
        <span class="leading-tight" style="border-left: 1px solid var(--a27-line-2); padding-left: 14px">
          <span class="a27-label block">BATTERY</span>
          <span class="a27-meas mt-1 block" :class="`a27-ink-${battLevel}`">{{ active.battery }}%</span>
        </span>
        <span class="leading-tight" style="border-left: 1px solid var(--a27-line-2); padding-left: 14px">
          <span class="a27-label block">LINK</span>
          <span class="a27-meas mt-1 block">{{ t.snr }} <span class="a27-unit">dB</span></span>
        </span>
      </div>

      <!-- The small tertiary controls a shooter keeps for chat and settings.
           Here: the three overlays, and the mission menu. -->
      <div class="flex gap-1.5">
        <button
          type="button"
          class="a27-act a27-act-sm"
          :data-active="menu === 'mission'"
          :aria-pressed="menu === 'mission'"
          aria-label="Mission menu"
          @click="menu = menu === 'mission' ? 'none' : 'mission'"
        ><Icon name="gear" size="xs" /></button>
        <button type="button" class="a27-act a27-act-sm" aria-label="Fleet" @click="panel = 'fleet'; menu = 'none'">
          <Icon name="users" size="xs" />
        </button>
        <button type="button" class="a27-act a27-act-sm relative" aria-label="Alerts" @click="panel = 'alerts'; menu = 'none'">
          <Icon name="bell" size="xs" />
          <span
            v-if="latched.length"
            class="absolute right-0 top-0 grid h-3.5 w-3.5 place-items-center rounded-full"
            style="background: var(--caution); color: var(--caution-foreground); font-family: var(--font-mono); font-size: var(--text-2xs); font-weight: 600"
          >{{ latched.length }}</span>
        </button>
        <button type="button" class="a27-act a27-act-sm" aria-label="Mission plan" @click="panel = 'plan'; menu = 'none'">
          <Icon name="bars" size="xs" />
        </button>
      </div>
    </div>

    <!-- ══ Top-right · the corner window ════════════════════════════════════
         The minimap slot, inverted: whatever is NOT the world sits here, and
         tapping swaps the two. One control, no mode to remember. -->
    <div class="absolute" style="right: var(--a27-hud-pad); top: var(--a27-hud-pad)">
      <button
        type="button"
        class="a27-hud-card relative block overflow-hidden"
        style="width: 268px; height: 152px; padding: 0"
        :aria-label="world === 'map' ? 'Swap to sensor feed' : 'Swap to map'"
        @click="swapWorld"
      >
        <template v-if="world === 'map'">
          <div class="feed absolute inset-0" :class="[sensor === 'IR' ? 'feed-ir' : '', props.night ? 'feed-night' : '']" />
          <svg viewBox="0 0 268 152" class="absolute inset-0 h-full w-full" aria-hidden="true">
            <g :stroke="tracking ? 'var(--brand)' : 'var(--a27-ink)'" stroke-width="1.5" fill="none">
              <path d="M116 62 V54 H124 M144 54 H152 V62 M152 90 V98 H144 M124 98 H116 V90" />
            </g>
            <g stroke="var(--a27-ink)" stroke-width="1.25" stroke-opacity="0.9">
              <line x1="134" y1="66" x2="134" y2="72" /><line x1="134" y1="80" x2="134" y2="86" />
              <line x1="118" y1="76" x2="124" y2="76" /><line x1="144" y1="76" x2="150" y2="76" />
            </g>
          </svg>
        </template>
        <template v-else>
          <div class="terrain absolute inset-0" />
          <svg viewBox="0 0 268 152" class="absolute inset-0 h-full w-full" aria-hidden="true">
            <path d="M26 130 C 74 110, 92 76, 152 62 S 228 38, 250 28" fill="none" stroke="var(--brand)" stroke-width="1.5" stroke-dasharray="3 4" />
            <g :transform="`rotate(${t.heading - 90} 152 62)`">
              <path d="M162 62 L146 54 L150 62 L146 70 Z" fill="var(--brand)" />
            </g>
          </svg>
        </template>

        <span
          class="absolute inset-x-0 top-0 flex items-center justify-between px-2.5 py-1.5"
          style="background: linear-gradient(var(--overlay), transparent)"
        >
          <span class="a27-label" style="color: var(--a27-ink)">
            {{ world === 'map' ? `${sensor} · ${t.zoom.toFixed(1)}×` : 'MAP · 200 m' }}
          </span>
          <Icon name="arrow-up-right-from-square" size="xs" style="color: var(--a27-ink)" />
        </span>
      </button>

      <!-- Context-sensitive, exactly as a shooter uses this corner: present
           only while there is something latched to be present about. -->
      <button
        v-if="latched.length"
        type="button"
        class="a27-hud-card a27-act-warning mt-2 flex w-full items-center gap-2.5 px-3"
        style="height: var(--a27-act-md); border-radius: var(--radius-md)"
        @click="panel = 'alerts'"
      >
        <Icon name="triangle-exclamation" size="xs" />
        <span class="a27-label min-w-0 flex-1 text-left" style="color: currentcolor; overflow: hidden; text-overflow: ellipsis">
          {{ latched[0]!.text }}
        </span>
        <Icon name="chevron-right" size="xs" />
      </button>

      <!-- Emergency. Warning-level and unmistakable, but never alarm: the alarm
           step is reserved for engagement, and a set of recovery options is not
           the same claim as a weapon release. -->
      <button
        type="button"
        class="a27-hud-card a27-act-warning mt-2 flex w-full items-center justify-center gap-2.5"
        style="height: var(--a27-act-md); border-radius: var(--radius-md)"
        :aria-expanded="menu === 'emergency'"
        @click="menu = menu === 'emergency' ? 'none' : 'emergency'"
      >
        <Icon name="triangle-exclamation" size="xs" />
        <span class="a27-label" style="color: currentcolor">EMERGENCY</span>
      </button>
    </div>

    <!-- ══ Left edge · the streak stack ═════════════════════════════════════
         A shooter's earned abilities live here, each showing its own state.
         These are the incumbent's six left-rail circles — one tap, and each
         carrying the value it currently holds instead of hiding it. -->
    <div
      class="absolute flex flex-col gap-2.5"
      style="left: var(--a27-hud-pad); top: 48%; transform: translateY(-50%)"
    >
      <button
        v-for="c in streaks"
        :key="c.key"
        type="button"
        class="a27-act a27-act-lg"
      >
        <Icon :name="c.icon" size="sm" />
        <span class="a27-act-label">{{ c.label }}</span>
        <span class="a27-act-label" style="opacity: 0.65">{{ c.value }}</span>
      </button>
    </div>

    <!-- ══ Bottom-left · the stick ══════════════════════════════════════════
         The movement joystick's slot, and its job: the one control that is
         under a thumb the whole flight. Here that is gimbal slew, so it is the
         largest thing on the device. -->
    <div class="absolute" style="left: var(--a27-hud-pad); bottom: var(--a27-hud-pad)">
      <div class="mb-2.5 flex gap-2">
        <button
          type="button"
          class="a27-act a27-act-md"
          :data-active="sensor === 'IR'"
          :aria-pressed="sensor === 'IR'"
          aria-label="Infrared sensor"
          @click="sensor = sensor === 'EO' ? 'IR' : 'EO'"
        ><span class="a27-act-label">{{ sensor }}</span></button>
        <button type="button" class="a27-act a27-act-md" aria-label="Recentre gimbal">
          <Icon name="plus" size="xs" />
          <span class="a27-act-label">Centre</span>
        </button>
        <button type="button" class="a27-act a27-act-md" aria-label="Snap to target">
          <Icon name="eye" size="xs" />
          <span class="a27-act-label">Snap</span>
        </button>
      </div>

      <div class="a27-joy" role="group" aria-label="Gimbal slew">
        <span class="a27-joy-tick" style="left: 50%; top: 9px; transform: translateX(-50%)"><Icon name="chevron-up" size="xs" /></span>
        <span class="a27-joy-tick" style="left: 50%; bottom: 9px; transform: translateX(-50%)"><Icon name="chevron-down" size="xs" /></span>
        <span class="a27-joy-tick" style="left: 9px; top: 50%; transform: translateY(-50%)"><Icon name="chevron-left" size="xs" /></span>
        <span class="a27-joy-tick" style="right: 9px; top: 50%; transform: translateY(-50%)"><Icon name="chevron-right" size="xs" /></span>
        <span class="a27-joy-nub" />
      </div>
      <p class="mt-2 flex justify-center gap-4">
        <span class="a27-label">PAN -014°</span>
        <span class="a27-label">TILT -032°</span>
      </p>
    </div>

    <!-- ══ Bottom-centre · ammo and health ══════════════════════════════════
         The weapon-and-vitals row. On a GCS: what the payload is doing, and
         the four measures an operator flies on. Mono, tabular, fixed slots —
         a number changing width never nudges its neighbour. -->
    <div
      class="a27-hud-card absolute flex items-stretch"
      style="left: 50%; bottom: var(--a27-hud-pad); transform: translateX(-50%)"
    >
      <span class="flex items-center gap-3 px-4 py-2.5" style="border-right: 1px solid var(--a27-line-2)">
        <Icon name="eye" size="sm" :style="{ color: tracking ? 'var(--brand)' : 'var(--a27-ink-2)' }" />
        <span class="leading-tight">
          <span class="a27-name block">{{ sensor }} · {{ tracking ? 'TGT-01 LOCK' : 'SEARCH' }}</span>
          <span class="a27-label">{{ t.zoom.toFixed(1) }}× · FOV {{ t.fov }}° · SLANT 954 M</span>
        </span>
      </span>
      <span
        v-for="f in vitals"
        :key="f.l"
        class="flex flex-col justify-center px-4 py-2.5"
        style="border-right: 1px solid var(--a27-line-2)"
      >
        <span class="a27-label">{{ f.l }}</span>
        <span class="mt-1 flex items-baseline gap-1">
          <span class="a27-meas a27-meas-lg">{{ f.v }}</span>
          <span class="a27-unit">{{ f.u }}</span>
        </span>
      </span>
      <span v-if="recording" class="flex items-center gap-2 px-4">
        <span class="a27-dot a27-pulse" style="background: var(--alarm)" />
        <span class="a27-label">REC {{ t.elapsed }}</span>
      </span>
    </div>

    <!-- ══ Bottom-right · the action stack ══════════════════════════════════
         The fire column: ONE vertical stack, biggest at the bottom where the
         thumb rests, exactly as a shooter arranges fire / aim / crouch / jump.
         Track is the constant action, so it takes the bottom and the largest
         step. Zoom and record sit above it at the secondary step.

         Then a gap, and the two consequential controls at the TOP of the
         column — the furthest point in it from a resting thumb. That is the
         one place this deliberately departs from the reference: a shooter puts
         fire under the thumb permanently, and a ground control station must
         not. The commit is also context-sensitive, appearing only once
         authority is armed in the fleet overlay. -->
    <div
      class="absolute flex flex-col items-center gap-2.5"
      style="right: var(--a27-hud-pad); bottom: var(--a27-hud-pad)"
    >
      <div v-if="authority" class="a27-guard-block">
        <GuardedAction
          mode="hold"
          variant="danger"
          size="lg"
          :hold-ms="2000"
          confirm-label="Hold…"
          instruction-text="Press and hold for two seconds to commit the engagement"
          class="a27-tb-strike"
          @confirm="() => {}"
        >
          <span class="flex flex-col items-center gap-0.5">
            <Icon name="octagon-exclamation" size="sm" />
            <span class="a27-act-label">Strike</span>
          </span>
        </GuardedAction>
      </div>

      <div class="a27-guard-block">
        <GuardedAction
          mode="hold"
          variant="secondary"
          size="md"
          confirm-label="Hold…"
          class="a27-abort a27-tb-abort"
          @confirm="() => {}"
        >
          <span class="flex flex-col items-center gap-0.5">
            <Icon name="triangle-exclamation" size="xs" />
            <span class="a27-act-label">Abort</span>
          </span>
        </GuardedAction>
      </div>

      <!-- The separation between the consequential pair above and the
           everyday controls below. One control-width of nothing. -->
      <span class="block" style="height: var(--a27-act-md)" aria-hidden="true" />

      <button
        type="button"
        class="a27-act a27-act-md"
        :aria-pressed="recording"
        :aria-label="recording ? 'Stop recording' : 'Start recording'"
        @click="recording = !recording"
      >
        <span
          class="rec"
          :class="recording ? 'h-3 w-3 rounded-[2px]' : 'h-4 w-4 rounded-full'"
          style="background: currentcolor"
        />
        <span class="a27-act-label">Rec</span>
      </button>
      <button type="button" class="a27-act a27-act-md" aria-label="Zoom out"><Icon name="minus" size="sm" /></button>
      <button type="button" class="a27-act a27-act-md" aria-label="Zoom in"><Icon name="plus" size="sm" /></button>

      <button
        type="button"
        class="a27-act a27-act-xl"
        :data-active="tracking"
        :aria-pressed="tracking"
        aria-label="Object track lock"
        @click="tracking = !tracking"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path d="M4 8 V4 H8 M16 4 H20 V8 M20 16 V20 H16 M8 20 H4 V16" />
          <circle cx="12" cy="12" r="2.5" />
        </svg>
        <span class="a27-act-label">Track</span>
      </button>
    </div>

    <!-- ══ Overlays ═════════════════════════════════════════════════════════ -->

    <button
      v-if="menu !== 'none'"
      type="button"
      class="a27-scrim"
      :class="menu === 'emergency' ? '' : 'a27-scrim-light'"
      aria-label="Dismiss menu"
      @click="menu = 'none'"
    />

    <div v-if="menu === 'vehicle'" class="a27-menu" style="left: var(--a27-hud-pad); top: 90px">
      <div class="a27-menu-head"><p class="a27-label">Select aircraft</p></div>
      <button
        v-for="v in fleet"
        :key="v.id"
        type="button"
        class="a27-menu-row a27-edge"
        :class="`a27-edge-${v.health}`"
        :data-active="v.id === selected"
        :aria-pressed="v.id === selected"
        @click="selected = v.id; menu = 'none'"
      >
        <span :class="`a27-ink-${v.health}`"><span class="a27-dot block" /></span>
        <span class="min-w-0">
          <span class="a27-name block">{{ v.callsign }}</span>
          <span class="a27-label">{{ v.type }} · {{ v.battery }}% · {{ v.note }}</span>
        </span>
        <Icon v-if="v.id === selected" name="check" size="xs" style="color: var(--brand)" />
      </button>
      <button type="button" class="a27-menu-row" @click="panel = 'fleet'; menu = 'none'">
        <Icon name="users" size="sm" style="color: var(--a27-ink-2)" />
        <span class="a27-name">All aircraft…</span>
        <Icon name="chevron-right" size="xs" style="color: var(--a27-ink-3)" />
      </button>
    </div>

    <div v-if="menu === 'mission'" class="a27-menu" style="left: 470px; top: 90px">
      <div class="a27-menu-head"><p class="a27-label">Mission · revision 4</p></div>
      <button
        v-for="m in missionMenu"
        :key="m.label"
        type="button"
        class="a27-menu-row"
        @click="menu = 'none'"
      >
        <Icon :name="m.icon" size="sm" style="color: var(--a27-ink-2)" />
        <span class="min-w-0">
          <span class="a27-name block">{{ m.label }}</span>
          <span class="a27-label">{{ m.hint }}</span>
        </span>
        <Icon name="chevron-right" size="xs" style="color: var(--a27-ink-3)" />
      </button>
    </div>

    <div v-if="menu === 'emergency'" class="a27-actions">
      <div class="a27-menu-head flex items-center justify-between">
        <span class="a27-name">Emergency</span>
        <StatusBadge level="warning" variant="outline" size="sm">{{ active.callsign }}</StatusBadge>
      </div>
      <button
        v-for="e in emergency"
        :key="e.label"
        type="button"
        class="a27-menu-row a27-edge"
        :class="`a27-edge-${e.level}`"
        @click="menu = 'none'"
      >
        <Icon :name="e.icon" size="sm" :class="`a27-ink-${e.level}`" />
        <span class="min-w-0">
          <span class="a27-name block">{{ e.label }}</span>
          <span class="a27-label">{{ e.hint }}</span>
        </span>
        <Icon name="chevron-right" size="xs" style="color: var(--a27-ink-3)" />
      </button>
      <div class="a27-edge a27-edge-alarm p-3.5" style="background: var(--a27-well)">
        <p class="a27-name a27-ink-alarm">Terminate flight</p>
        <p class="a27-label mt-1">MOTORS OFF · IRREVERSIBLE · AIRCRAFT WILL BE LOST</p>
        <div class="a27-guard-block mt-2.5">
          <GuardedAction
            mode="hold"
            variant="danger"
            size="lg"
            :hold-ms="2500"
            confirm-label="Hold to terminate…"
            instruction-text="Press and hold for two and a half seconds to terminate the flight"
            @confirm="menu = 'none'"
          >
            <Icon name="octagon-exclamation" size="sm" />
            <span class="a27-name" style="color: currentcolor">Terminate</span>
          </GuardedAction>
        </div>
      </div>
      <button type="button" class="a27-menu-row" style="justify-items: center" @click="menu = 'none'">
        <span /><span class="a27-name text-center">Cancel</span><span />
      </button>
    </div>

    <!-- Engage authority lives with the fleet overlay, two-handed and away
         from the thumbs — the same reason a shooter puts loadout changes on a
         separate screen and not on the HUD. -->
    <TabletSheet
      :panel="panel"
      :selected="selected"
      :authority="authority"
      @select="(id) => (selected = id)"
      @authority="(v) => (authority = v)"
      @close="panel = 'none'"
    />
  </div>
</template>

<style scoped>
/* Simulated SENSOR IMAGERY and map raster — photography standing in for a live
 * frame, not UI. Same exemption the console's views carry; every other colour
 * resolves through a `--a27-*` alias or a design-system token. */
.feed {
  background:
    radial-gradient(14% 10% at 18% 22%, rgb(255 255 255 / 0.95), transparent 68%),
    radial-gradient(11% 7% at 26% 27%, rgb(255 255 255 / 0.8), transparent 70%),
    radial-gradient(17% 9% at 71% 17%, rgb(255 255 255 / 0.85), transparent 70%),
    radial-gradient(20% 6% at 44% 34%, rgb(255 255 255 / 0.45), transparent 74%),
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
.terrain {
  background:
    radial-gradient(38% 42% at 66% 30%, rgb(108 118 74 / 0.85), transparent 68%),
    radial-gradient(30% 34% at 24% 66%, rgb(88 100 66 / 0.8), transparent 70%),
    radial-gradient(46% 30% at 50% 96%, rgb(62 78 92 / 0.75), transparent 72%),
    linear-gradient(150deg, rgb(58 66 46), rgb(40 47 36) 55%, rgb(32 38 34));
}
.terrain::after {
  content: '';
  position: absolute;
  inset: 0;
  background-image:
    repeating-linear-gradient(58deg, rgb(255 255 255 / 0.035) 0 1px, transparent 1px 26px),
    repeating-linear-gradient(148deg, rgb(0 0 0 / 0.06) 0 1px, transparent 1px 34px);
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
