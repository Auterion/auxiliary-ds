<script setup lang="ts">
/**
 * FlyView, in situ — the AMC27 tablet with the two asks built into it.
 *
 * A control sheet proves a control is coherent with itself. Only a frame proves
 * it is coherent with the eleven other things already on the screen, which is
 * where an arm indicator goes wrong: it looks unmissable on a white page and
 * then ships next to a caution chip, a track box and a battery bar that were
 * all already competing for the same red.
 *
 * The map is the whole screen — the tablet's thesis, unchanged from AMC27 —
 * and everything here overlays it.
 */
import { computed, onBeforeUnmount, ref } from 'vue';
import { GuardedAction } from '@auxiliary/vue';
import { Icon } from '@auxiliary/icons';
import ArmState from './ArmState.vue';
import CommandDial from './CommandDial.vue';
import { RAIL, type Arm, type Scheme } from './model';
import { plan, ownship, t, tracks } from '../amc27/telemetry';

const props = defineProps<{ arm: Arm; scheme: Scheme }>();
const emit = defineEmits<{ (e: 'update:arm', value: Arm): void }>();

/* ── The dial ──────────────────────────────────────────────────────────── */

const dial = ref<{ x: number; y: number; at: string } | null>(null);
const screen = ref<HTMLElement | null>(null);
const size = ref({ w: 1194, h: 834 });

/** The press-and-hold that opens it. 350 ms is the shortest interval that is
 *  reliably not a tap; a 10 px slop lets a gloved thumb hold still. */
const HOLD_MS = 350;
const SLOP = 10;
let timer: ReturnType<typeof setTimeout> | null = null;
let from: { x: number; y: number } | null = null;

function cancelHold() {
  if (timer) clearTimeout(timer);
  timer = null;
  from = null;
}

/** Map the press to a coordinate, in the notation the rest of AMC uses. */
function coord(x: number, y: number) {
  const lat = 47.3769 + (size.value.h / 2 - y) * 0.00004;
  const lon = 8.5417 + (x - size.value.w / 2) * 0.00006;
  return `${lat.toFixed(4)}° N  ${lon.toFixed(4)}° E`;
}

function localPoint(e: PointerEvent | MouseEvent) {
  const box = screen.value?.getBoundingClientRect();
  if (!box) return null;
  size.value = { w: box.width, h: box.height };
  return { x: e.clientX - box.left, y: e.clientY - box.top };
}

function onDown(e: PointerEvent) {
  // Only a press on the map itself opens the dial. A press that started on a
  // HUD control is that control's press, not the map's.
  if ((e.target as HTMLElement).closest('button, input, [role="menu"]')) return;
  const p = localPoint(e);
  if (!p) return;
  from = p;
  timer = setTimeout(() => {
    dial.value = { x: p.x, y: p.y, at: coord(p.x, p.y) };
    timer = null;
  }, HOLD_MS);
}

function onMove(e: PointerEvent) {
  if (!from || !timer) return;
  const p = localPoint(e);
  if (!p) return;
  if (Math.abs(p.x - from.x) > SLOP || Math.abs(p.y - from.y) > SLOP) cancelHold();
}

/** The desktop shortcut to the same dial. Kept because the studio is looked at
 *  with a mouse; the tablet build needs only the hold. */
function onContext(e: MouseEvent) {
  const p = localPoint(e);
  if (!p) return;
  cancelHold();
  dial.value = { x: p.x, y: p.y, at: coord(p.x, p.y) };
}

onBeforeUnmount(cancelHold);

/* ── Command feedback ──────────────────────────────────────────────────────
 * A command that leaves no trace is a command the operator has to remember
 * issuing. One line, at the top edge, for eight seconds.
 */
const issued = ref<string | null>(null);
let clear: ReturnType<typeof setTimeout> | null = null;

function onCommand(p: { key: string; label: string; value?: string }) {
  issued.value = p.value ? `${p.label} — ${p.value}` : p.label;
  if (clear) clearTimeout(clear);
  clear = setTimeout(() => (issued.value = null), 8000);
}
onBeforeUnmount(() => clear && clearTimeout(clear));

/* ── Arm ───────────────────────────────────────────────────────────────── */

const armed = computed(() => props.arm !== 'safe');
/** Disarming is the safe direction, so it carries no guard. Arming does. */
function toggleArm() {
  emit('update:arm', armed.value ? 'safe' : 'ground');
}

const planPath = plan.map((p) => `${p.x},${p.y}`).join(' ');
const flownPath = plan.slice(0, 7).map((p) => `${p.x},${p.y}`).join(' ');

const vitals = [
  { l: 'AS', v: t.as.toFixed(1), u: 'm/s' },
  { l: 'ALT', v: String(t.agl), u: 'm' },
  { l: 'DST', v: String(t.dist), u: 'm' },
  { l: 'HDG', v: String(t.heading).padStart(3, '0'), u: '°' },
];
</script>

<template>
  <div
    ref="screen"
    class="fv-screen"
    @pointerdown="onDown"
    @pointermove="onMove"
    @pointerup="cancelHold"
    @pointercancel="cancelHold"
    @pointerleave="cancelHold"
    @contextmenu.prevent="onContext"
  >
    <!-- ══ The world ═══════════════════════════════════════════════════════ -->
    <div class="absolute inset-0">
      <div class="terrain absolute inset-0" />
      <svg viewBox="0 0 1000 620" class="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <polyline :points="planPath" fill="none" stroke="var(--fv-ink)" stroke-opacity="0.5" stroke-width="1.5" stroke-dasharray="6 5" />
        <polyline :points="flownPath" fill="none" stroke="var(--brand)" stroke-width="2.5" />
        <g v-for="p in plan" :key="p.n" :transform="`translate(${p.x} ${p.y})`">
          <rect
            x="-10" y="-10" width="20" height="20" rx="3"
            :transform="p.kind === 'LOITER' ? 'rotate(45)' : undefined"
            fill="var(--background)" fill-opacity="0.85" stroke="var(--fv-ink)" stroke-width="1.5"
          />
          <text y="4" text-anchor="middle" font-family="var(--font-mono)" font-size="11" font-weight="600" fill="var(--fv-ink)">{{ p.n }}</text>
        </g>
        <g v-for="tr in tracks" :key="tr.id" :transform="`translate(${tr.x} ${tr.y})`">
          <circle r="11" fill="none" :stroke="tr.hostile ? 'var(--alarm-emphasis)' : 'var(--fv-ink)'" stroke-width="1.5" :stroke-opacity="tr.hostile ? 1 : 0.7" />
          <circle r="2.5" :fill="tr.hostile ? 'var(--alarm-emphasis)' : 'var(--fv-ink)'" />
          <text x="16" y="4" font-family="var(--font-mono)" font-size="11" letter-spacing="0.06em" :fill="tr.hostile ? 'var(--alarm-emphasis)' : 'var(--fv-ink-2)'">{{ tr.id }}</text>
        </g>
        <g :transform="`translate(${ownship.x} ${ownship.y})`">
          <line :transform="`rotate(${ownship.hdg - 90})`" x1="0" y1="0" x2="58" y2="0" stroke="var(--brand)" stroke-width="1.5" stroke-dasharray="3 3" />
          <g :transform="`rotate(${ownship.hdg - 90})`">
            <path d="M18 0 L-11 -11 L-6 0 L-11 11 Z" fill="var(--brand)" stroke="var(--background)" stroke-width="1" />
          </g>
          <text x="0" y="-22" text-anchor="middle" font-family="var(--font-mono)" font-size="11" letter-spacing="0.06em" fill="var(--fv-ink)">HAWK 01 · {{ t.agl }} M</text>
        </g>
      </svg>
    </div>

    <!-- ══ Top bar ═════════════════════════════════════════════════════════
         The thread asks for arm state "displayed prominently in the Top Bar",
         so the plate takes the first slot on the bar — ahead of the callsign,
         because it is the fact that decides whether it is safe to walk toward
         the aircraft, and every other fact here is subordinate to that. -->
    <div class="absolute flex items-start gap-2" style="left: var(--fv-pad); top: var(--fv-pad)">
      <ArmState :arm="arm" :scheme="scheme" />

      <div class="fv-hud-card flex items-center gap-4 px-3.5" style="height: 46px">
        <span class="leading-tight">
          <span class="fv-label block">HAWK 01</span>
          <span class="fv-meas mt-1 block">WP 7/9</span>
        </span>
        <span class="leading-tight" style="border-left: 1px solid var(--fv-line-2); padding-left: 14px">
          <span class="fv-label block">BATTERY</span>
          <span class="fv-meas mt-1 block">64%</span>
        </span>
        <span class="leading-tight" style="border-left: 1px solid var(--fv-line-2); padding-left: 14px">
          <span class="fv-label block">LINK</span>
          <span class="fv-meas mt-1 block">{{ t.snr }} <span class="fv-unit">dB</span></span>
        </span>
      </div>

      <!-- The ACTUATOR, kept apart from the indicator and shaped nothing like
           it. Arming is guarded; disarming is the safe direction and is not. -->
      <div v-if="!armed" class="fv-guard-block">
        <GuardedAction
          mode="hold"
          variant="secondary"
          size="sm"
          :hold-ms="1500"
          confirm-label="Hold&hellip;"
          instruction-text="Press and hold for one and a half seconds to arm the aircraft"
          class="fv-guard-warning"
          style="height: 46px"
          @confirm="toggleArm"
        >
          <span class="fv-act-label">Hold to arm</span>
        </GuardedAction>
      </div>
      <button
        v-else
        type="button"
        class="fv-hud-card px-3.5"
        style="height: 46px"
        @click="toggleArm"
      >
        <span class="fv-act-label">Disarm</span>
      </button>
    </div>

    <!-- ══ Top-right · what the dial just did ══════════════════════════════ -->
    <div class="absolute flex flex-col items-end gap-2" style="right: var(--fv-pad); top: var(--fv-pad)">
      <div class="fv-hud-card flex items-center gap-2.5 px-3.5" style="height: 46px">
        <Icon name="circle-info" size="xs" style="color: var(--fv-ink-3)" />
        <span class="fv-label">PRESS AND HOLD THE MAP</span>
      </div>
      <div v-if="issued" class="fv-hud-card flex items-center gap-2.5 px-3.5 py-2.5">
        <Icon name="check" size="xs" class="fv-ink-nominal" />
        <span class="leading-tight">
          <span class="fv-label block">COMMANDED</span>
          <span class="fv-name mt-0.5 block">{{ issued }}</span>
        </span>
      </div>
    </div>

    <!-- ══ Left edge · the rail, cut to three ══════════════════════════════
         The thread's conclusion was "use now only 3 modes, everything else we
         can control from keyboard". The other three left with the dial, which
         is where a command you had to think about now lives. -->
    <div
      class="absolute flex flex-col gap-2.5"
      style="left: var(--fv-pad); top: 50%; transform: translateY(-50%)"
    >
      <button v-for="c in RAIL" :key="c.key" type="button" class="fv-act fv-act-lg">
        <span class="fv-act-label">{{ c.label }}</span>
        <span class="fv-act-label" style="opacity: 0.65">{{ c.value }}</span>
      </button>
    </div>

    <!-- ══ Bottom-centre · the measures ════════════════════════════════════ -->
    <div
      class="fv-hud-card absolute flex items-stretch"
      style="left: 50%; bottom: var(--fv-pad); transform: translateX(-50%)"
    >
      <span
        v-for="f in vitals"
        :key="f.l"
        class="flex flex-col justify-center px-4 py-2.5"
        style="border-right: 1px solid var(--fv-line-2)"
      >
        <span class="fv-label">{{ f.l }}</span>
        <span class="mt-1 flex items-baseline gap-1">
          <span class="fv-meas fv-meas-lg">{{ f.v }}</span>
          <span class="fv-unit">{{ f.u }}</span>
        </span>
      </span>
      <span class="flex items-center gap-3 px-4 py-2.5">
        <Icon name="eye" size="sm" style="color: var(--brand)" />
        <span class="leading-tight">
          <span class="fv-name block">EO · TGT-01 LOCK</span>
          <span class="fv-label">{{ t.zoom.toFixed(1) }}× · FOV {{ t.fov }}°</span>
        </span>
      </span>
    </div>

    <!-- ══ Bottom-right · the everyday actions ═════════════════════════════ -->
    <div class="absolute flex flex-col items-center gap-2.5" style="right: var(--fv-pad); bottom: var(--fv-pad)">
      <button type="button" class="fv-act" aria-label="Zoom out"><Icon name="minus" size="sm" /></button>
      <button type="button" class="fv-act" aria-label="Zoom in"><Icon name="plus" size="sm" /></button>
      <button type="button" class="fv-act fv-act-lg" aria-label="Recentre on aircraft">
        <Icon name="drone" size="sm" />
        <span class="fv-act-label">Centre</span>
      </button>
    </div>

    <!-- ══ The dial ════════════════════════════════════════════════════════ -->
    <CommandDial
      v-if="dial"
      :x="dial.x"
      :y="dial.y"
      :width="size.w"
      :height="size.h"
      :at="dial.at"
      subject="HAWK 01"
      @command="onCommand"
      @close="dial = null"
    />
  </div>
</template>

<style scoped>
/* Simulated map raster — imagery standing in for a live tile layer, not UI.
 * The same exemption `amc27/TabletView.vue` takes, for the same reason; every
 * other colour on this surface resolves through a `--fv-*` alias or a token. */
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
</style>
