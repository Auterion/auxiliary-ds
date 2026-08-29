<script setup lang="ts">
/* Hallmark · macrostructure: Editorial (portfolio deck) worn by a design-review doc
 * tone: measured/declarative
 *
 * "SW-3136 — Strike + track control cluster." The chosen design and the
 * guidelines that pin it down, ported from the Claude Design doc
 * "SW-3136 Final".
 *
 * AMC's Dragon Strike control today is a red button that reads STRIKING. The
 * problem was never the red — it is that the control is still a button, in a
 * row of buttons, firing on one press. Three exploration turns moved state out
 * of pigment and into shape, because pigment is exactly what sunlight,
 * night-vision and colour-vision loss take away. What survived:
 *
 *   · Strike is the one OCTAGON in the UI — the universally pre-loaded "stop
 *     and think" silhouette — committed only by a 1.5 s press-and-hold whose
 *     perimeter trace IS the progress.
 *   · Track is a square camera plate whose brackets close as it engages.
 *     Releasing it carries no guard: releasing is the safe direction.
 *   · Both live in ONE right-edge rail ordered by consequence, with a hairline
 *     fence separating weapon from sensor.
 *
 * Two panels, because a control sheet proves a control is coherent with itself
 * and only an in-situ frame proves it is coherent with the twelve other things
 * already on the screen — which is where strike controls actually go wrong.
 *
 * On the two palettes in play — and why that split is deliberate — see the
 * header of `_strike.css`.
 */
import { computed, ref } from 'vue';
import { Icon } from '@auxiliary/icons';
import StrikeOctagon from './StrikeOctagon.vue';
import TargetLock from './TargetLock.vue';
import TrackPlate from './TrackPlate.vue';
import VehicleDock from './VehicleDock.vue';
import VideoStage from './VideoStage.vue';
import ZoomStepper from './ZoomStepper.vue';
import { HOLD_MS, SENT_MS, useHold } from './useHold';
import { useTargeting } from './useTargeting';
import './_strike.css';

/* ── Page mode ─────────────────────────────────────────────────────────────
 * The doc's own axis. `.dk` maps light/sunlight onto paper and dark/darknight
 * onto ink, on the SAME element the DS semantic tokens key off, so chrome and
 * components re-resolve together. Defaults to dark: this is a video view. */
type Theme = 'light' | 'sunlight' | 'dark' | 'darknight';
const theme = ref<Theme>('dark');
const THEMES: { key: Theme; label: string }[] = [
  { key: 'light', label: 'Light' },
  { key: 'sunlight', label: 'Sunlight' },
  { key: 'dark', label: 'Dark' },
  { key: 'darknight', label: 'Darknight' },
];

/* ── The one place a control size is decided ───────────────────────────────
 * Size ranks consequence. These three numbers drive the SVGs, the CSS and the
 * guidelines that measure them, so a spec line cannot go stale against the
 * specimen it describes. */
const PLATE = { strike: 64, track: 56, zoom: 48 } as const;
const plateVars = `--sk-plate-strike: ${PLATE.strike}px; --sk-plate-zoom: ${PLATE.zoom}px`;

const GUARD_S = HOLD_MS / 1000;
const ZOOM = { min: 1, max: 8, step: 0.5 } as const;

/* ── The live frame ───────────────────────────────────────────────────────*/

const t = useTargeting();

/* Zoom lives in the rail, so the OSD's FOV has to move with it or the frame is
 * reporting a lens it no longer has. 98° at 1× is the wide end that puts the
 * artboard's 49° at its 2.0× resting zoom. */
const FOV_AT_1X = 98;
const zoom = ref(2);
const fov = computed(() => Math.round(FOV_AT_1X / zoom.value));

/* ── The guidelines panel ─────────────────────────────────────────────────*/

/* Its own theme axis, scoped to the panel: the question it asks is whether a
 * control whose state is carried by SHAPE survives a theme, not what the doc
 * around it looks like. Only the three operational themes — a strike control
 * has no business being specified against a light desk theme. */
type PanelTheme = 'dark' | 'darknight' | 'sunlight';
const panelTheme = ref<PanelTheme>('dark');
const PANEL_THEMES: PanelTheme[] = ['dark', 'darknight', 'sunlight'];

/** The "try it" octagon in the state sheet, driven live like the rail's own. */
const demo = useHold();

/** Frozen mid-hold, for the HOLDING cell of the state set. */
const HOLDING_SAMPLE = 0.62;

const STRIKE_STATES = ['DISABLED', 'DEFAULT', 'HOLDING', 'SENT', 'TRY IT'] as const;

const TRACK_STATES = [
  { state: 'disabled', caption: 'DISABLED' },
  { state: 'enabled', caption: 'ENABLED' },
  { state: 'armed', caption: 'ENABLED · ARMED' },
  { state: 'engaged', caption: 'ENGAGED' },
] as const;

/* The bracket ladder, read off `TrackPlate`'s own APERTURE map so the prose
 * cannot drift from the specimen sitting above it. */
const INSETS = { disabled: 4, enabled: 10, armed: 14, engaged: 21 } as const;

const SPEC = [
  {
    state: 'Default',
    treatment:
      'Octagon outline 1.6 px, faint inner octagon at 34%, reticle mark; over video, a 72% black '
      + 'scrim fills the octagon',
    label: 'STRIKE',
    cue: 'Octagon silhouette; unfilled interior',
  },
  {
    state: 'Holding',
    treatment:
      `Perimeter traces clockwise from 12 o'clock over ${GUARD_S} s; interior at 24%; outline `
      + 'drops to 16% so the trace leads; release before full cancels instantly',
    label: 'HOLD',
    cue: 'Arc length is the progress — readable with no colour at all',
  },
  {
    state: 'Sent',
    treatment:
      `Full fill for ${SENT_MS} ms, then back to Default; the reticle inverts; the track lock `
      + 'persists so repeat strikes need no re-pick',
    label: 'SENT',
    cue: 'Only fully filled state',
  },
  {
    state: 'Disabled',
    treatment:
      'Outline to muted at 1 px, 55% opacity, single diagonal void line; reason line renders '
      + 'beneath',
    label: 'STRIKE',
    cue: 'The diagonal — no other state has one',
  },
  {
    state: 'Track states',
    treatment:
      `Disabled: brackets inset ${INSETS.disabled} + diagonal, 34%. Enabled: brackets inset `
      + `${INSETS.enabled}, centre cross. Armed: brackets inset ${INSETS.armed}, ring border; the `
      + `feed cursor becomes a reticle. Engaged: solid primary plate, brackets inset `
      + `${INSETS.engaged}, dashed lock ring; tap releases — no guard, releasing is the safe `
      + 'direction',
    label: 'TRACK / PICK / TRACKING',
    cue: 'Bracket inset is the state; the label changes at every step',
  },
  {
    state: 'Rail',
    treatment:
      `One right-edge column, ordered by consequence: strike ${PLATE.strike} px (label above), `
      + `track ${PLATE.track} px, hairline fence, vertical zoom stepper ${PLATE.zoom} px (tap `
      + `steps ${ZOOM.step}×, hold runs, segments dim at ${ZOOM.min.toFixed(1)}× / `
      + `${ZOOM.max.toFixed(1)}×)`,
    label: '—',
    cue: 'Size ranks consequence; the fence separates weapon from sensor',
  },
] as const;

/* ── Vehicle strip ────────────────────────────────────────────────────────
 * Four aircraft on station, one of them the feed you are looking at. A rail
 * that only works over an empty dock has not been tested. */
const CARDS = [
  { id: 3, mode: 'Hold', selected: true },
  { id: 4, mode: 'Offboard', selected: false },
  { id: 7, mode: 'Offboard', selected: false },
  { id: 8, mode: 'Hold', selected: false },
] as const;

/* ── Measured facts ───────────────────────────────────────────────────────
 * Every bracket on this page is COUNTED off the data that renders beneath it. */
const ZOOM_STOPS = Math.round((ZOOM.max - ZOOM.min) / ZOOM.step) + 1;
const coverBracket = computed(
  () =>
    `${STRIKE_STATES.length} strike states · ${TRACK_STATES.length} track states · `
    + `${ZOOM_STOPS} zoom stops · ${CARDS.length} vehicles`,
);
const railBracket = `${PLATE.strike} · ${PLATE.track} · ${PLATE.zoom} px`;
const specBracket = `${SPEC.length} rules · ${PANEL_THEMES.length} themes`;
</script>

<template>
  <main :data-theme="theme" class="dk sk-page" :style="plateVars">
    <!-- ════ IDENTITY STRIP ════ -->
    <header class="sk-topbar">
      <div style="display: flex; align-items: baseline; gap: 8px">
        <span class="dk-value">Auxiliary</span>
        <span class="dk-micro">/</span>
        <span class="dk-label">SW-3136 · Strike + Track</span>
      </div>
      <div style="display: flex; align-items: center; gap: 10px">
        <span class="dk-label">Theme</span>
        <div class="dk-segment">
          <button
            v-for="th in THEMES"
            :key="th.key"
            type="button"
            class="dk-segment-btn"
            :data-active="theme === th.key"
            :aria-pressed="theme === th.key"
            @click="theme = th.key"
          >
            {{ th.label }}
          </button>
        </div>
      </div>
    </header>

    <div class="sk-body">
      <!-- ════ COVER ════ -->
      <header class="sk-measure">
        <p class="dk-label">SW-3136 · Final · Strike + track control cluster</p>
        <h1 class="dk-h1">Chosen: vertical rail with vertical zoom</h1>
        <p class="dk-h2 dk-ghost">One column, ordered by consequence</p>
        <p class="dk-body" style="margin-top: 8px">
          One right-edge column: strike (octagon, hold {{ GUARD_S }} s), track (aperture plate,
          three states), a hairline fence, then the vertical zoom stepper. Live below — tap Track
          to arm, click the feed to lock, hold the octagon to strike.
        </p>
        <p style="margin-top: 8px"><span class="dk-bracket">{{ coverBracket }}</span></p>
      </header>

      <!-- ════ HEADER LEDGER ════ -->
      <div class="dk-ledger sk-ledger-5">
        <div class="dk-ledger-cell">
          <span class="dk-pointer">Surface</span>
          <span class="dk-value">AMC · fullscreen video view</span>
        </div>
        <div class="dk-ledger-cell">
          <span class="dk-pointer">Guard</span>
          <span class="dk-value dk-num">{{ GUARD_S }} s press-and-hold</span>
        </div>
        <div class="dk-ledger-cell">
          <span class="dk-pointer">Interlock</span>
          <span class="dk-value">No lock, no strike</span>
        </div>
        <div class="dk-ledger-cell">
          <span class="dk-pointer">Non-colour cue</span>
          <span class="dk-value">Silhouette · arc · aperture</span>
        </div>
        <div class="dk-ledger-cell" data-align="end">
          <span class="dk-pointer">Status</span>
          <span class="dk-value">Final</span>
        </div>
      </div>

      <!-- ═══════════════════════════════════════════ 1a · IN SITU ═══════ -->
      <section class="sk-turn">
        <div>
          <div class="sk-panel-head">
            <span class="sk-tag">1a</span>
            <span class="dk-value">Fullscreen video view</span>
            <span class="dk-bracket">{{ railBracket }}</span>
          </div>

          <VideoStage :picking="t.picking" :feed-label="t.feedLabel" @pick="t.pick">
            <template #feed>
              <TargetLock
                v-if="t.engaged && t.point"
                :x="t.point.x"
                :y="t.point.y"
                :readout="t.coords"
              />
            </template>

            <div class="sk-osd sk-osd-tl">
              <div style="display: flex; align-items: center">
                <span class="sk-osd-badge" style="background: var(--sk-amc-signal)">G1</span>
                <span class="sk-osd-badge" style="background: var(--sk-amc-armed)">A3</span>
              </div>
              <span class="sk-osd-read">
                FPS <b>25.0</b>&nbsp;&nbsp;Z <b>{{ zoom.toFixed(1) }}</b>&nbsp;&nbsp;FOV
                <b>{{ fov }}°</b>&nbsp;&nbsp;TRK <b>{{ t.trkReadout }}</b>
              </span>
            </div>

            <div class="sk-osd sk-osd-tr">
              <button type="button" class="sk-osd-btn">Stats</button>
              <button type="button" class="sk-osd-close" aria-label="Close fullscreen video">
                <Icon name="xmark" size="sm" />
              </button>
            </div>

            <!-- THE RAIL -->
            <div class="sk-controls">
              <StrikeOctagon
                scrim
                label-above
                :state="t.engaged ? t.hold.phase : 'disabled'"
                :progress="t.hold.progress"
                :size="PLATE.strike"
                :guard-seconds="GUARD_S"
                @holdstart="t.hold.start"
                @holdend="t.hold.end"
              />
              <TrackPlate :state="t.track" :size="PLATE.track" @click="t.toggle" />
              <div class="sk-fence" aria-hidden="true" />
              <ZoomStepper v-model="zoom" :min="ZOOM.min" :max="ZOOM.max" :step="ZOOM.step" />
            </div>

            <VehicleDock :vehicles="CARDS" />
          </VideoStage>
        </div>
      </section>

      <!-- ══════════════════════════════════════ 2a · GUIDELINES ═════════ -->
      <section class="sk-turn">
        <header class="sk-measure">
          <span class="dk-label">SW-3136 · Button guidelines</span>
          <h2 class="dk-h2">Strike octagon + track aperture</h2>
          <p class="dk-body">
            Strike is the one octagon in the UI — the universal "stop and think" silhouette —
            committed only by a {{ GUARD_S }} s press-and-hold whose perimeter trace is the
            progress. Track is a square camera plate whose brackets close as it moves toward
            engaged. Shape carries every state, so both survive glare, night modes, and
            colour-vision loss.
          </p>
        </header>

        <div>
          <div class="sk-panel-head">
            <span class="sk-tag">2a</span>
            <span class="dk-value">State sets</span>
            <span class="dk-bracket">{{ specBracket }}</span>
            <div class="dk-segment" style="margin-left: auto">
              <button
                v-for="pt in PANEL_THEMES"
                :key="pt"
                type="button"
                class="dk-segment-btn"
                :data-active="panelTheme === pt"
                :aria-pressed="panelTheme === pt"
                @click="panelTheme = pt"
              >
                {{ pt }}
              </button>
            </div>
          </div>

          <!-- The panel carries its own [data-theme]: this is the block whose
               subject is theme survival. -->
          <div
            :data-theme="panelTheme"
            class="sk-tone-token sk-panel-token"
            style="display: flex; flex-direction: column; gap: 20px"
          >
            <div class="sk-rule-head">
              <span
                class="sk-mono"
                style="font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--destructive)"
              >Strike — state set</span>
              <span class="sk-plate-caption">{{ GUARD_S }} S GUARD</span>
            </div>

            <div class="sk-states">
              <div class="sk-state">
                <StrikeOctagon state="disabled" :guard-seconds="GUARD_S" />
                <span class="sk-plate-caption">{{ STRIKE_STATES[0] }}</span>
              </div>
              <div class="sk-state">
                <StrikeOctagon :guard-seconds="GUARD_S" />
                <span class="sk-plate-caption">{{ STRIKE_STATES[1] }}</span>
              </div>
              <div class="sk-state">
                <StrikeOctagon
                  state="holding"
                  :progress="HOLDING_SAMPLE"
                  :guard-seconds="GUARD_S"
                />
                <span class="sk-plate-caption">
                  {{ STRIKE_STATES[2] }} — {{ Math.round(HOLDING_SAMPLE * 100) }}%
                </span>
              </div>
              <div class="sk-state">
                <StrikeOctagon state="sent" :progress="1" :guard-seconds="GUARD_S" />
                <span class="sk-plate-caption">{{ STRIKE_STATES[3] }}</span>
              </div>
              <div class="sk-state">
                <StrikeOctagon
                  :state="demo.phase.value"
                  :progress="demo.progress.value"
                  :guard-seconds="GUARD_S"
                  @holdstart="demo.start"
                  @holdend="demo.end"
                />
                <span class="sk-plate-caption">{{ STRIKE_STATES[4] }} — HOLD</span>
              </div>
            </div>

            <div class="sk-rule-head" style="margin-top: 8px">
              <span
                class="sk-mono"
                style="font-size: 11px; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase"
              >Track — state set</span>
              <span class="sk-plate-caption">NO GUARD ON RELEASE</span>
            </div>

            <div class="sk-states">
              <div v-for="ts in TRACK_STATES" :key="ts.caption" class="sk-state">
                <TrackPlate :state="ts.state" :size="PLATE.track" />
                <span class="sk-plate-caption">{{ ts.caption }}</span>
              </div>
            </div>

            <div style="border-top: 1px solid var(--border); margin-top: 8px">
              <div class="sk-spec sk-spec-head">
                <span class="sk-plate-caption">STATE</span>
                <span class="sk-plate-caption">TREATMENT</span>
                <span class="sk-plate-caption">LABEL</span>
                <span class="sk-plate-caption">NON-COLOUR CUE</span>
              </div>
              <div v-for="row in SPEC" :key="row.state" class="sk-spec">
                <dfn class="sk-mono" style="font-size: 12px; color: var(--foreground)">
                  {{ row.state }}
                </dfn>
                <span style="color: var(--muted-foreground)">{{ row.treatment }}</span>
                <span class="sk-mono" style="font-size: 11px; color: var(--foreground)">
                  {{ row.label }}
                </span>
                <span style="color: var(--muted-foreground)">{{ row.cue }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <p class="dk-caption">
        SW-3136 · strike + track — the chosen rail, in situ, and its guidelines
      </p>
    </div>
  </main>
</template>
