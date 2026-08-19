<script setup lang="ts">
/**
 * AMC27 — a redesign of the Auterion Mission Control desktop GCS.
 *
 * The incumbent (see `_amc27.css` for the full read) is a video with controls
 * scattered on top of it: six unrelated control shapes, seven saturated hues
 * used decoratively, developer telemetry burned into the frame in a bitmap
 * face, and a strike command the same size as a zoom button.
 *
 * AMC27's thesis in one line: **frame the picture, budget the colour, and give
 * consequence its own weight.**
 *
 *   · FRAME — an opaque command bar, two docked rails and an instrument strip,
 *     all on one grid. The video keeps a genuinely clear centre. Only two
 *     things float on the picture, and both belong to it.
 *   · BUDGET — ink carries structure. The reserved five-level ladder carries
 *     severity and nothing else. `--brand` is spent on ownship and selection.
 *     No hue on this surface is decorative.
 *   · WEIGHT — arm state and engage authority are the only heavy marks, and
 *     the irreversible ones sit behind the design system's guarded control.
 *
 * Everything resolves through Auxiliary tokens: the same file renders in all
 * four themes (light · dark · sunlight · darknight) and in both registers,
 * because nothing here hard-codes a colour or a control height. The stage
 * switcher exists to show exactly that.
 */
import { ref, computed } from 'vue';
import CommandBar from './CommandBar.vue';
import MissionRail from './MissionRail.vue';
import SensorView from './SensorView.vue';
import MapView from './MapView.vue';
import PlanView from './PlanView.vue';
import InstrumentStrip from './InstrumentStrip.vue';
import HandheldView from './HandheldView.vue';
import TabletView from './TabletView.vue';
import './_amc27.css';

type View = 'sensor' | 'map' | 'plan';
type Device = 'console' | 'tablet' | 'handheld';
type Theme = 'dark' | 'darknight' | 'sunlight' | 'light';

const device = ref<Device>('console');
const view = ref<View>('sensor');
const theme = ref<Theme>('dark');
const notes = ref(false);
const selected = ref('v1');

const THEME_LABEL: Record<Theme, string> = {
  dark: 'Dark',
  darknight: 'Night',
  sunlight: 'Sunlight',
  light: 'Light',
};

const VIEW_TITLE: Record<View, string> = {
  sensor: 'SENSOR · EO/IR PAYLOAD',
  map: 'TACTICAL MAP',
  plan: 'MISSION PLAN',
};

/** The night exposure also warms the sensor picture, as an IR-cut filter does. */
const night = computed(() => theme.value === 'darknight');

/**
 * Design notes. Presentation chrome for this demo only — never product. Keyed
 * to the sensor view, which is the one the incumbent screenshots show.
 */
const NOTES: { n: number; x: string; y: string; head: string; body: string }[] = [
  {
    n: 1,
    x: '25%',
    y: '2.7%',
    head: 'The fleet, once',
    body: 'The incumbent shows the same vehicles twice — a dropdown top-left and two cards floating at the bottom of the video — and marks the selected one with a saturated orange fill that reads as a caution. One row of slots; selection is a brand rule; health is a ladder dot.',
  },
  {
    n: 2,
    x: '8%',
    y: '13%',
    head: 'A command is one object',
    body: 'The incumbent draws a naked grey circle and, unattached beside it, a black box holding the words. Rejoined: glyph, name, and the current value underneath — "Approach 30°" is a setting, so the 30° belongs on the second line, not in the button label.',
  },
  {
    n: 3,
    x: '8%',
    y: '58%',
    head: 'Alerts became a list',
    body: 'DEGRADED was magenta bitmap text burned into the frame with no level, no time and nowhere to acknowledge it. Here it is a caution, at 14:21:48, latched, in a list that survives being looked away from.',
  },
  {
    n: 4,
    x: '50%',
    y: '5%',
    head: 'The OSD is not a debug console',
    body: 'FPS and Z were the loudest text on screen, in three colours and a pixel face. The line now says what the sensor is doing — mode, zoom, field of view, track state, stabilisation — in one quiet mono row with a legibility shadow.',
  },
  {
    n: 5,
    x: '50%',
    y: '47%',
    head: 'Hue carries nothing here',
    body: 'The magenta reticle is ink. The track box takes brand only while locked, because "the thing I am holding" is a selection. State is carried by weight and by the bracket closing, which survives a colour-blind operator and a washed-out screen.',
  },
  {
    n: 6,
    x: '92.5%',
    y: '22%',
    head: 'Eight chips, one column',
    body: 'VIDEO, STRIKE, FOV, TRACKING, two circles, a zoom pair and a joystick were never eight decisions — they are one job. A ruled column: what the sensor is, how it is pointed, what it is doing, what it may do.',
  },
  {
    n: 7,
    x: '92.5%',
    y: '86%',
    head: 'Consequence gets weight',
    body: 'STRIKE was a chip the size of the zoom buttons. Engage authority now owns the foot of the column alone, in two deliberate steps — authorise, then hold to commit — using the design system’s guarded control. The only alarm-level region on the surface.',
  },
  {
    n: 8,
    x: '38%',
    y: '94%',
    head: 'The instruments get the wide edge',
    body: 'Attitude, heading, six speeds and altitudes were stacked into the busiest corner of the video in three type sizes and four hues. They now hold the full bottom edge on one baseline, and the compass rose is a tape — same pixels, four more facts, and it reads left-to-right like everything else.',
  },
];

/** The tablet's own notes. Positioned against the device, not the console. */
const TB_NOTES: { n: number; x: string; y: string; head: string; body: string }[] = [
  {
    n: 1,
    x: '50%',
    y: '46%',
    head: 'The map IS the screen',
    body: 'Not a pane inside a frame — the whole surface, edge to edge. That is the move that makes this a HUD rather than a shrunk desktop app. The sensor feed and the map trade places: whichever is not the world sits in the corner window, and one tap swaps them.',
  },
  {
    n: 2,
    x: '86%',
    y: '13%',
    head: 'The minimap slot, inverted',
    body: 'A shooter puts a small map in the corner of the world and lets you tap it to expand. Here the world is already the map, so the corner holds the sensor feed instead — same slot, same gesture, opposite content. No mode to remember: the corner always shows what you are not looking at.',
  },
  {
    n: 3,
    x: '10%',
    y: '9%',
    head: 'Faction, score, timer',
    body: 'A shooter fills the top-left with who you are and how the match stands. Translated: which aircraft (tap for the fleet menu), how far through the plan, elapsed, battery, link. The four small discs beside it are the tertiary controls a HUD keeps small — mission menu, and the three overlays.',
  },
  {
    n: 4,
    x: '13.5%',
    y: '43%',
    head: 'Scorestreaks became flight commands',
    body: 'A shooter stacks earned abilities down an edge, each showing its own readiness, fired with one tap. That is exactly the incumbent\'s six left-rail circles — except each one now carries the value it currently holds ("APPR 30°", "FUZE FAR") instead of hiding it in a detached black box.',
  },
  {
    n: 5,
    x: '16%',
    y: '89%',
    head: 'The stick',
    body: 'The movement joystick\'s slot and its job: the one control under a thumb the entire flight. On a GCS that is gimbal slew, so it is the largest thing on the device at 148 px. Size is the hierarchy here, exactly as it is in the reference — nothing is the same size as anything else unless it matters the same amount.',
  },
  {
    n: 6,
    x: '50%',
    y: '96%',
    head: 'Ammo and health',
    body: 'The bottom-centre row a shooter gives to weapon, ammo and vitals. Here: what the payload is doing, then the four measures an operator flies on — airspeed, altitude, distance, heading — mono and tabular in fixed slots, so a number changing width never nudges its neighbour.',
  },
  {
    n: 7,
    x: '86%',
    y: '92%',
    head: 'The fire column',
    body: 'One vertical stack, biggest at the bottom where the thumb rests. Track is the constant action, so it takes the bottom and the largest step; zoom and record sit above it, smaller. Then a full control-width of nothing, and the consequential pair at the TOP — the furthest point in the column from a resting thumb.',
  },
  {
    n: 8,
    x: '86%',
    y: '38%',
    head: 'Context-sensitive, both ways',
    body: 'A shooter shows "cancel grenade" only while a grenade is cooking. Here the alert pill exists only while something is latched, and the strike control does not exist at all until authority is armed in the fleet overlay — a two-handed act you step out of the HUD to perform. That is the one place this departs from the reference on purpose: a game puts fire permanently under the thumb, and a ground control station must not.',
  },
];

/** The handheld's own notes. Positioned against the device, not the console. */
const HH_NOTES: { n: number; x: string; y: string; head: string; body: string }[] = [
  {
    n: 1,
    x: '13%',
    y: '78%',
    head: 'Left thumb · commands',
    body: 'The console\'s command rail runs down the left EDGE, which on a held device is exactly where no thumb reaches. Here the commands fan from a single disc inside the left grip: closed by default, four satellites when open, and the abort carries the warning rail it carries everywhere else.',
  },
  {
    n: 2,
    x: '88%',
    y: '78%',
    head: 'Right thumb · one primary',
    body: 'Track lock is the biggest control on the device because it is the one an ISR operator touches most, and losing a track costs the most to recover. Zoom, sensor and record arc around it, smaller and further out — a flat grid would price every choice the same.',
  },
  {
    n: 3,
    x: '50%',
    y: '48%',
    head: 'The middle is for looking',
    body: 'Nothing tappable sits in the centre or along the top. That is the picture, and on a handheld the picture is most of the product. The reticle and the track box are the same symbology as the console — a bracket that means one thing on a desk cannot mean another in the field.',
  },
  {
    n: 4,
    x: '43%',
    y: '4%',
    head: 'Strips, not bars',
    body: 'The console\'s command bar becomes three floating strips: what the payload is doing (centre), which aircraft and how it is (right), and the map (left). None of them reserves height from the frame; all of them are still mono, tabular and token-resolved.',
  },
  {
    n: 5,
    x: '88%',
    y: '17%',
    head: 'One alert may interrupt',
    body: 'Only a latched alert earns a place on the picture, as a tappable warning pill. The rest live in the sheet. The incumbent had the opposite policy: burn the loudest one into the video in magenta, and offer no list at all.',
  },
  {
    n: 6,
    x: '6%',
    y: '32%',
    head: 'Sheets carry the rest',
    body: 'Alert history, the fleet and engage authority rise from the bottom edge on demand. Everything that is not needed in the next two seconds is one tap away rather than permanently spending frame.',
  },
  {
    n: 7,
    x: '78%',
    y: '67%',
    head: 'The strike control does not exist yet',
    body: 'Authority is armed in the sheet — a deliberate, two-handed act — and only then does a hold-to-commit pill appear in the right thumb zone. A shooter puts fire permanently under the thumb; a ground control station must not.',
  },
  {
    n: 8,
    x: '50%',
    y: '92%',
    head: 'Four measures, not seven',
    body: 'The console\'s instrument strip carries seven facts because a desk has room for seven. The handheld carries the four an operator flies on — airspeed, altitude, distance, heading — and the rest are a swipe away. Same type roles, same tabular mono, same slots.',
  },
];

const legend = computed(() => {
  if (device.value === 'handheld') return HH_NOTES;
  if (device.value === 'tablet') return TB_NOTES;
  return view.value === 'sensor' ? NOTES : [];
});
</script>

<template>
  <div :data-theme="theme" class="a27 a27-stage">
    <!-- ── Stage chrome (not product) ─────────────────────────────────── -->
    <div class="a27-caption">
      <p class="a27-name" style="font-size: 15px">Auterion Mission Control · AMC27</p>
      <p class="a27-label mt-1.5">
        {{ device === 'console' ? 'DESKTOP GCS · ' + VIEW_TITLE[view]
          : device === 'tablet' ? 'TABLET GCS · FULL SURFACE'
          : 'HANDHELD GCS · SENSOR' }}
        · {{ THEME_LABEL[theme] }}
      </p>
    </div>

    <div class="a27-controls">
      <div class="a27-control-group">
        <span class="a27-label">Device</span>
        <div class="a27-seg">
          <button
            v-for="d in (['console', 'tablet', 'handheld'] as const)"
            :key="d"
            type="button"
            class="a27-seg-btn"
            :data-active="device === d"
            @click="device = d"
          >{{ d }}</button>
        </div>
      </div>
      <div v-if="device === 'console'" class="a27-control-group">
        <span class="a27-label">View</span>
        <div class="a27-seg">
          <button
            v-for="v in (['sensor', 'map', 'plan'] as const)"
            :key="v"
            type="button"
            class="a27-seg-btn"
            :data-active="view === v"
            :aria-current="view === v ? 'page' : undefined"
            @click="view = v"
          >{{ v }}</button>
        </div>
      </div>
      <div class="a27-control-group">
        <span class="a27-label">Theme</span>
        <div class="a27-seg">
          <button
            v-for="th in (['dark', 'darknight', 'sunlight', 'light'] as const)"
            :key="th"
            type="button"
            class="a27-seg-btn"
            :data-active="theme === th"
            @click="theme = th"
          >{{ THEME_LABEL[th] }}</button>
        </div>
      </div>
      <div class="a27-control-group">
        <span class="a27-label">Rationale</span>
        <div class="a27-seg">
          <button type="button" class="a27-seg-btn" :data-active="!notes" @click="notes = false">off</button>
          <button type="button" class="a27-seg-btn" :data-active="notes" @click="notes = true">notes</button>
        </div>
      </div>
    </div>

    <!-- ── The tablet ─────────────────────────────────────────────────── -->
    <div
      v-if="device === 'tablet'"
      data-register="operational"
      class="a27-tablet a27-device"
      style="border-radius: 30px; padding: 16px"
    >
      <TabletView :night="night" />

      <template v-if="notes">
        <span
          v-for="n in TB_NOTES"
          :key="n.n"
          class="a27-note"
          :style="{ left: n.x, top: n.y }"
        >{{ n.n }}</span>
      </template>
    </div>

    <!-- ── The handheld ───────────────────────────────────────────────── -->
    <div v-else-if="device === 'handheld'" class="relative">
      <div class="a27-handheld a27-device">
        <div data-register="operational" class="a27-device-screen">
          <HandheldView :night="night" />
        </div>
      </div>

      <template v-if="notes">
        <span
          v-for="n in HH_NOTES"
          :key="n.n"
          class="a27-note"
          :style="{ left: n.x, top: n.y }"
        >{{ n.n }}</span>
      </template>
    </div>

    <!-- ── The console ────────────────────────────────────────────────── -->
    <div v-else class="relative">
      <div data-register="operational" class="a27-console">
        <CommandBar :selected="selected" @select="(id) => (selected = id)" />

        <main class="a27-main" :class="view === 'plan' ? 'a27-main-wide' : ''">
          <template v-if="view === 'plan'">
            <PlanView />
          </template>
          <template v-else>
            <MissionRail />
            <SensorView v-if="view === 'sensor'" :night="night" />
            <MapView v-else />
          </template>
        </main>

        <InstrumentStrip />
      </div>

      <!-- Annotation markers. Sensor view only — they describe that redesign. -->
      <template v-if="notes && view === 'sensor'">
        <span v-for="n in NOTES" :key="n.n" class="a27-note" :style="{ left: n.x, top: n.y }">{{ n.n }}</span>
      </template>
    </div>

    <!-- ── Rationale legend ───────────────────────────────────────────── -->
    <div v-if="notes && legend.length" class="grid gap-x-8 gap-y-5" style="grid-template-columns: repeat(4, 300px)">
      <div v-for="n in legend" :key="n.n" class="a27-legend-row">
        <span class="a27-legend-n">{{ n.n }}</span>
        <span>
          <span class="a27-name block">{{ n.head }}</span>
          <span class="a27-micro mt-1 block" style="line-height: 1.55">{{ n.body }}</span>
        </span>
      </div>
    </div>

    <p v-else class="a27-micro" style="max-width: 900px; text-align: center; color: var(--a27-ink-3)">
      <span v-if="device === 'tablet'">
        The tablet frames nothing: the tactical map is the whole screen and everything else
        overlays it, on the conventions mobile shooter HUDs settled on — world as background,
        minimap in its corner (inverted here to the sensor feed), streaks down one edge, stick
        bottom-left, fire column bottom-right, vitals bottom-centre, full-screen overlays for
        anything you step out of the fight to do. Same tokens and same reserved ladder as the
        other two devices. Switch <em>Rationale → notes</em> to see what each decision is doing.
      </span>
      <span v-else-if="device === 'handheld'">
        The handheld runs the same tokens, the same reserved severity ladder and the same
        one-brand-colour budget as the console — but inverts the frame: full-bleed picture,
        two thumb zones, fanned satellites, sheets for everything that can wait.
        Switch <em>Rationale → notes</em> to see what each decision is doing.
      </span>
      <span v-else>
        Every colour, radius, control height and duration on this console resolves through Auxiliary
        tokens — which is why the same markup renders in all four themes and in the operational
        register without a fork. Switch <em>Rationale → notes</em> on the sensor view to see what
        changed against the incumbent, and why.
      </span>
    </p>
  </div>
</template>
