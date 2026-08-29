<script setup lang="ts">
/**
 * AMC20 — the desktop, reproduced, with a before/after switch.
 *
 * `before` is the screenshot in the thread, drawn as faithfully as a redraw
 * gets: the teal vehicle cell, the plain white "Disarmed" in the middle of the
 * bar, the five rail discs with their detached black label pills, the video
 * placeholder, the cyan telemetry cluster and the compass.
 *
 * `after` changes exactly two things and nothing else:
 *
 *   · the centre of the top bar becomes the arm plate — the same component
 *     FlyView uses, so the two devices cannot drift apart;
 *   · right-click on the map opens the same command dial, and the rail loses
 *     the item that moved into it.
 *
 * Everything else is byte-identical between the two, which is the point. A
 * proposal that also tidies the telemetry and re-spaces the rail is a proposal
 * nobody can approve, because it cannot be told apart from a redesign.
 */
import { computed, onBeforeUnmount, ref } from 'vue';
import ArmState from '../flyview/ArmState.vue';
import CommandDial from '../flyview/CommandDial.vue';
import type { Arm, Scheme } from '../flyview/model';
import BaseMap from './BaseMap.vue';

const props = defineProps<{ mode: 'before' | 'after'; arm: Arm; scheme: Scheme }>();
const emit = defineEmits<{ (e: 'update:arm', value: Arm): void }>();

/* ── The rail ──────────────────────────────────────────────────────────────
 * Five in the incumbent. `Position & Heading Reset` is the one that leaves:
 * it is not one command but two, and both of them correct what the aircraft
 * believes rather than what it does — which is why they end up behind the
 * dial's fence rather than one disc below an instant `Mission` start.
 */
interface RailItem { key: string; label: string; d: string; leaves?: boolean }
const RAIL: RailItem[] = [
  { key: 'takeoff', label: 'VTOL Takeoff', d: 'M4 15 C 9 15, 11 8, 17 8 M13 4 l4 4 -4 4' },
  { key: 'return', label: 'Return', d: 'M11 3 v11 M6.5 9.5 L11 14 l4.5 -4.5 M4 18 h14' },
  { key: 'mission', label: 'Mission', d: 'M7 4 L17 11 L7 18 Z' },
  { key: 'reset', label: 'Position & Heading Reset', d: 'M17 4 L4 10 l6 2 2 6 Z', leaves: true },
  { key: 'poi', label: 'POI', d: 'M11 3 a5 5 0 0 1 5 5 c0 4 -5 10 -5 10 S6 12 6 8 a5 5 0 0 1 5 -5 Z M11 8 h.01' },
];
/**
 * Grouped, not flat, so the BEFORE can draw ONE box around the adjacent pair
 * rather than a box around each. The complaint in the thread is not that either
 * item is wrong — it is that they are neighbours, and a mark that circles them
 * separately says the opposite of what it is there to say.
 */
const rail = computed<{ items: RailItem[]; hazard?: boolean }[]>(() => {
  if (props.mode === 'after') {
    return RAIL.filter((r) => !r.leaves).map((r) => ({ items: [r] }));
  }
  return [
    { items: [RAIL[0]!] },
    { items: [RAIL[1]!] },
    { items: [RAIL[2]!, RAIL[3]!], hazard: true },
    { items: [RAIL[4]!] },
  ];
});

/* ── The dial ──────────────────────────────────────────────────────────────
 * On the desktop the gesture the thread asked for IS right-click, and the
 * thread also says right-click is taken by EVO. Both are shown: the dial is
 * bound to right-click here so the ask can be evaluated as asked, and it is
 * ALSO bound to press-and-hold, which is what it would ship on if EVO keeps
 * the button. The dial does not care which opens it, which is the answer to
 * give Vlad: the gesture is a binding, not a design.
 */
const dial = ref<{ x: number; y: number; at: string } | null>(null);
const canvas = ref<HTMLElement | null>(null);
const size = ref({ w: 1400, h: 819 });

const HOLD_MS = 350;
const SLOP = 10;
let timer: ReturnType<typeof setTimeout> | null = null;
let from: { x: number; y: number } | null = null;

function cancelHold() {
  if (timer) clearTimeout(timer);
  timer = null;
  from = null;
}
onBeforeUnmount(cancelHold);

function coord(x: number, y: number) {
  const lat = 47.3985 + (size.value.h / 2 - y) * 0.000018;
  const lon = 8.5486 + (x - size.value.w / 2) * 0.000026;
  return `${lat.toFixed(4)}° N  ${lon.toFixed(4)}° E`;
}

function localPoint(e: PointerEvent | MouseEvent) {
  const box = canvas.value?.getBoundingClientRect();
  if (!box) return null;
  size.value = { w: box.width, h: box.height };
  return { x: e.clientX - box.left, y: e.clientY - box.top };
}

function open(e: PointerEvent | MouseEvent) {
  const p = localPoint(e);
  if (!p) return;
  cancelHold();
  dial.value = { x: p.x, y: p.y, at: coord(p.x, p.y) };
}

function onDown(e: PointerEvent) {
  if (props.mode !== 'after') return;
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

function onContext(e: MouseEvent) {
  if (props.mode !== 'after') return;
  open(e);
}

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
const WORD: Record<Arm, string> = { safe: 'Disarmed', ground: 'Armed', air: 'Armed' };
</script>

<template>
  <div class="a20-window">
    <div class="a20-titlebar">
      <span>Auterion Mission Control</span>
      <span class="a20-titlebar-buttons">
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M2.5 7 h9" /></svg>
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><rect x="2.7" y="2.7" width="8.6" height="8.6" rx="1.4" /></svg>
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M3 3 l8 8 M11 3 l-8 8" /></svg>
      </span>
    </div>

    <div class="a20-screen">
      <!-- ══ Top bar ═══════════════════════════════════════════════════════ -->
      <header class="a20-topbar">
        <span class="a20-mark">
          <svg width="30" height="26" viewBox="0 0 30 26" aria-hidden="true">
            <path d="M2 4 L26 9 L9 22 Z" fill="none" stroke="#f2f3f4" stroke-width="1.6" stroke-linejoin="round" />
          </svg>
        </span>

        <span class="a20-vehicle">
          <span class="a20-badge">1</span>
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="1.5" aria-hidden="true">
            <circle cx="12" cy="12" r="2.6" /><path d="M6 6 l3.6 3.6 M18 6 l-3.6 3.6 M6 18 l3.6 -3.6 M18 18 l-3.6 -3.6" />
            <circle cx="4.6" cy="4.6" r="2.4" /><circle cx="19.4" cy="4.6" r="2.4" />
            <circle cx="4.6" cy="19.4" r="2.4" /><circle cx="19.4" cy="19.4" r="2.4" />
          </svg>
          <span class="leading-tight" style="font-family: var(--font-sans); font-size: 11.5px; color: #fff">
            <span class="block" style="font-weight: 500">Vehicle 1</span>
            <span class="block">VTOL - Hover</span>
            <span class="block">Ready</span>
          </span>
        </span>

        <button type="button" class="a20-drop">
          Position
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2.5 4.5 L6 8 l3.5 -3.5" /></svg>
        </button>

        <!-- ══ The centre — the one slot the arm ask is about ═══════════════
             BEFORE: a flight-mode dropdown wearing the same clothes as every
             other dropdown on the bar, with the single most consequential fact
             about the aircraft written in it in body-weight white.
             AFTER: a plate, not a control, in the same slot. -->
        <span class="flex flex-1 items-center justify-center">
          <button v-if="mode === 'before'" type="button" class="a20-drop" style="font-size: 15px">
            {{ WORD[arm] }}
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2.5 4.5 L6 8 l3.5 -3.5" /></svg>
          </button>
          <span v-else class="flex items-center gap-2.5">
            <ArmState :arm="arm" :scheme="scheme" />
            <button
              type="button"
              class="a20-drop"
              style="height: 34px; border: 1px solid #4a4d52; border-radius: var(--radius-sm); font-size: 13px"
              @click="emit('update:arm', armed ? 'safe' : 'ground')"
            >{{ armed ? 'Disarm' : 'Hold to arm' }}</button>
          </span>
        </span>

        <span class="flex items-center gap-3.5 pr-4">
          <span class="a20-chip">INS</span>
          <svg width="26" height="22" viewBox="0 0 26 22" aria-hidden="true">
            <g fill="var(--a20-cyan)"><rect x="1" y="15" width="3.4" height="6" /><rect x="6.4" y="11" width="3.4" height="10" /><rect x="11.8" y="7" width="3.4" height="14" /><rect x="17.2" y="3" width="3.4" height="18" /></g>
          </svg>
          <svg width="26" height="22" viewBox="0 0 26 22" aria-hidden="true">
            <g fill="#5a5d62"><rect x="1" y="15" width="3.4" height="6" /><rect x="6.4" y="11" width="3.4" height="10" /><rect x="11.8" y="7" width="3.4" height="14" /><rect x="17.2" y="3" width="3.4" height="18" /></g>
          </svg>
          <span class="flex items-center gap-1.5">
            <span class="a20-pct">100%</span>
            <svg width="15" height="24" viewBox="0 0 16 26" aria-hidden="true"><rect x="2" y="3" width="12" height="21" rx="2.5" fill="none" stroke="var(--a20-cyan)" stroke-width="1.6" /><rect x="4.5" y="5.5" width="7" height="16" fill="var(--a20-cyan)" /><rect x="5.5" y="0.6" width="5" height="2.2" fill="var(--a20-cyan)" /></svg>
          </span>
          <span class="flex items-center gap-1.5">
            <span class="a20-pct">93%</span>
            <svg width="15" height="24" viewBox="0 0 16 26" aria-hidden="true"><rect x="2" y="3" width="12" height="21" rx="2.5" fill="none" stroke="var(--a20-cyan)" stroke-width="1.6" /><rect x="4.5" y="7" width="7" height="14.5" fill="var(--a20-cyan)" /><rect x="5.5" y="0.6" width="5" height="2.2" fill="var(--a20-cyan)" /></svg>
          </span>
        </span>
      </header>

      <!-- ══ The map ═══════════════════════════════════════════════════════ -->
      <div
        ref="canvas"
        class="absolute inset-x-0 bottom-0"
        style="top: 56px"
        @pointerdown="onDown"
        @pointermove="onMove"
        @pointerup="cancelHold"
        @pointercancel="cancelHold"
        @pointerleave="cancelHold"
        @contextmenu.prevent="onContext"
      >
        <BaseMap />

        <!-- The mission, over the tiles. -->
        <svg viewBox="0 0 1400 819" class="absolute inset-0 h-full w-full" aria-hidden="true">
          <path
            d="M 828 352 L 928 342 L 942 404 L 846 416 Z"
            fill="#fff" fill-opacity="0.25" stroke="#fff" stroke-width="2" stroke-dasharray="7 6"
          />
          <line x1="700" y1="430" x2="895" y2="398" stroke="#c86a1e" stroke-width="3.5" />
          <circle cx="700" cy="430" r="16" fill="#2e9e4f" stroke="#fff" stroke-width="2.5" />
          <text x="700" y="435" text-anchor="middle" font-family="var(--font-sans)" font-size="13" font-weight="600" fill="#fff">1</text>
          <circle cx="895" cy="398" r="14" fill="#e08a2b" stroke="#fff" stroke-width="2.5" />
          <text x="895" y="403" text-anchor="middle" font-family="var(--font-sans)" font-size="12" font-weight="600" fill="#fff">2</text>

          <!-- Ownship. -->
          <g transform="translate(872 470)">
            <circle r="28" fill="#141517" />
            <path d="M0 -14 L12 -7 L12 7 L0 14 L-12 7 L-12 -7 Z" fill="none" stroke="#7c8087" stroke-width="1.6" />
            <path d="M-4 -22 L-26 6 L-4 0 L14 8 Z" fill="#2f7fe0" stroke="#fff" stroke-width="1.2" transform="rotate(20)" />
          </g>
        </svg>

        <!-- The rail. -->
        <div class="a20-rail">
          <div
            v-for="(g, gi) in rail"
            :key="gi"
            class="a20-rail-group"
            :class="g.hazard ? 'a20-hazard-pair' : undefined"
          >
            <div v-for="r in g.items" :key="r.key" class="a20-rail-row">
              <button type="button" class="a20-disc" :aria-label="r.label">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <path :d="r.d" :fill="r.key === 'mission' ? 'currentColor' : 'none'" />
                </svg>
              </button>
              <span class="a20-tag">{{ r.label }}</span>
            </div>
          </div>
        </div>

        <!-- The collapse chevron on the left edge. -->
        <button
          type="button"
          class="a20-disc absolute"
          style="left: 300px; top: 380px; width: 40px; height: 40px"
          aria-label="Collapse panel"
        >
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M10 3 L5 8 l5 5" /></svg>
        </button>

        <!-- Bottom-left: the two tool discs and the video placeholder. -->
        <div class="absolute flex flex-col gap-2.5" style="left: 18px; bottom: 18px">
          <button type="button" class="a20-disc" aria-label="Add vehicle">
            <svg width="21" height="21" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M2 4 L19 8 L7 17 Z" /><path d="M16 15 h6 M19 12 v6" /></svg>
          </button>
          <button type="button" class="a20-disc" aria-label="Toggle map layers">
            <svg width="21" height="21" viewBox="0 0 22 22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M2 7 L11 3 l9 4 -9 4 Z" /><path d="M2 14 l9 4 9 -4" /><path d="M3 19 L19 3" /></svg>
          </button>
        </div>

        <div class="a20-video">
          <span>WAITING FOR VIDEO</span>
          <svg class="absolute" style="right: 10px; top: 10px" width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M6 2 H2 v4 M10 14 h4 v-4 M2 2 l5 5 M14 14 l-5 -5" /></svg>
          <span class="absolute" style="left: 10px; bottom: 8px; letter-spacing: 0.1em">&laquo;&laquo;&laquo;</span>
          <svg class="absolute" style="right: 10px; bottom: 10px" width="16" height="14" viewBox="0 0 18 15" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><rect x="1" y="1" width="12" height="9" rx="1" /><rect x="5" y="5" width="12" height="9" rx="1" /></svg>
        </div>

        <!-- Bottom-right: the telemetry cluster and the compass. -->
        <div class="absolute flex items-end gap-2.5" style="right: 18px; bottom: 18px">
          <div class="flex flex-col gap-1.5" style="width: 320px">
            <div class="a20-panel flex items-center gap-3 px-3 py-2">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><circle cx="8" cy="9" r="5.6" /><path d="M8 6 v3 M6 1.4 h4" /></svg>
              <span class="a20-key">0m 0s</span>
              <span style="flex: 1; border-left: 1px solid #34363a; height: 15px" />
              <svg width="18" height="14" viewBox="0 0 20 14" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M1 4 h11 a2.5 2.5 0 1 0 -2.5 -2.5 M1 9 h14 a2.5 2.5 0 1 1 -2.5 2.5" /></svg>
              <span class="a20-key">-</span>
              <span class="a20-unit-2">m/s</span>
              <svg width="12" height="14" viewBox="0 0 12 14" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M6 12 V2 M2.5 5.5 L6 2 l3.5 3.5" /></svg>
            </div>
            <div class="a20-panel grid grid-cols-2">
              <span class="flex items-center gap-2 px-3 py-2" style="border-right: 1px solid #34363a">
                <span class="a20-key">AS</span><span class="a20-meas">0</span><span class="a20-unit-2">m/s</span>
              </span>
              <span class="flex items-center gap-2 px-3 py-2">
                <span class="a20-key">VS</span><span class="a20-meas">-0.1</span><span class="a20-unit-2">m/s</span>
              </span>
              <span class="flex items-center gap-2 px-3 py-2" style="border-right: 1px solid #34363a; border-top: 1px solid #34363a">
                <span class="a20-key">GS</span><span class="a20-meas">0</span><span class="a20-unit-2">m/s</span>
              </span>
              <span class="flex items-center gap-2 px-3 py-2" style="border-top: 1px solid #34363a">
                <span class="a20-key">&lsaquo; HGT &rsaquo;</span><span class="a20-meas">-0.1</span><span class="a20-unit-2">m</span>
              </span>
            </div>
            <div class="flex gap-1.5">
              <span class="a20-panel flex items-center gap-2 px-3 py-2">
                <span class="a20-key">LRF:</span><span class="a20-key">0.0m</span>
                <svg width="17" height="12" viewBox="0 0 18 12" fill="none" stroke="var(--a20-cyan)" stroke-width="1.4" aria-hidden="true"><path d="M1 2 v8 M17 2 v8 M1 6 h16" /><rect x="6" y="3" width="6" height="6" /></svg>
              </span>
              <span class="a20-panel flex items-center gap-2 px-3 py-2">
                <span class="a20-key">THR</span><span class="a20-key">0%</span>
              </span>
              <span class="a20-panel flex items-center gap-2 px-3 py-2">
                <span class="a20-key">DST</span><span class="a20-key">0 m</span>
              </span>
            </div>
          </div>

          <div class="a20-panel" style="border-radius: var(--radius-full); padding: 6px">
            <svg width="118" height="118" viewBox="0 0 118 118" aria-hidden="true">
              <circle cx="59" cy="59" r="55" fill="#141517" />
              <path d="M 59 8 A 51 51 0 0 1 106 40" fill="none" stroke="#e6e8ea" stroke-width="5" />
              <path d="M 12 40 A 51 51 0 0 1 59 8" fill="none" stroke="#e6e8ea" stroke-width="5" />
              <circle cx="59" cy="59" r="30" fill="none" stroke="#4a4d52" stroke-width="1" />
              <path d="M59 40 L69 74 L59 66 L49 74 Z" fill="#fff" />
              <g font-family="var(--font-sans)" font-size="10" fill="#c9cdd2">
                <text x="19" y="62" text-anchor="middle">W</text>
                <text x="99" y="62" text-anchor="middle">E</text>
                <text x="59" y="106" text-anchor="middle">S</text>
              </g>
              <g font-family="var(--font-mono)" font-size="10" fill="var(--a20-cyan)">
                <text x="59" y="8" text-anchor="middle">0</text>
                <text x="112" y="62" text-anchor="middle">0</text>
              </g>
              <text x="59" y="86" text-anchor="middle" font-family="var(--font-mono)" font-size="11" fill="#e6e8ea">357°</text>
              <text x="59" y="24" text-anchor="middle" font-family="var(--font-sans)" font-size="9.5" fill="#e0b23a">H</text>
            </svg>
          </div>
        </div>

        <!-- What the dial issued. -->
        <div
          v-if="issued"
          class="a20-panel absolute flex items-center gap-2.5 px-3.5 py-2.5"
          style="left: 50%; top: 16px; transform: translateX(-50%)"
        >
          <span class="a20-key" style="letter-spacing: 0.1em; color: var(--a20-ink-2)">COMMANDED</span>
          <span class="a20-key">{{ issued }}</span>
        </div>

        <!-- The dial. Right-click, or press-and-hold. -->
        <CommandDial
          v-if="dial"
          :x="dial.x"
          :y="dial.y"
          :width="size.w"
          :height="size.h"
          :at="dial.at"
          subject="VEHICLE 1"
          @command="onCommand"
          @close="dial = null"
        />
      </div>
    </div>
  </div>
</template>
