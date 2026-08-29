<script setup lang="ts">
/**
 * AMC20 — the studio.
 *
 * FlyView answers the two #amc-ui-work asks on the AMC27 tablet, where there
 * is no legacy chrome in the way. This is the same two answers dropped into a
 * redraw of the screenshot the thread is actually about, with a before/after
 * switch, because the only version of a proposal a shipping team can act on is
 * one they can diff against what they have.
 *
 * Two things change and nothing else does. That constraint is the design work:
 * a proposal that also tidies the telemetry cluster and re-spaces the rail
 * cannot be approved, because it can no longer be told apart from a redesign.
 */
import { ref } from 'vue';
import ArmState from '../flyview/ArmState.vue';
import DesktopFrame from './DesktopFrame.vue';
import { ARM_ORDER, SCHEME_LABEL, type Arm, type Scheme } from '../flyview/model';
import '../flyview/_flyview.css';
import './_amc20.css';

type Theme = 'dark' | 'darknight' | 'sunlight' | 'light';
const THEME_LABEL: Record<Theme, string> = {
  dark: 'Dark',
  darknight: 'Night',
  sunlight: 'Sunlight',
  light: 'Light',
};

const mode = ref<'before' | 'after'>('before');
const arm = ref<Arm>('safe');
const scheme = ref<Scheme>('requested');
const theme = ref<Theme>('dark');
const notes = ref(false);

const NOTES: { n: number; x: string; y: string; head: string; body: string }[] = [
  {
    n: 1,
    x: '50%',
    y: '9.5%',
    head: 'One slot, two jobs',
    body: 'The incumbent writes the single most consequential fact about the aircraft — whether the rotors can spin — in body-weight white, in the same dropdown clothes as the flight-mode picker beside it, in the middle of a bar the eye has no reason to visit. The ask is right that this belongs in the top bar and right that it needs colour. What it also needs is to stop being a dropdown: an indicator that opens a menu invites a press, and a press is how a state that was being reported becomes a state that was changed.',
  },
  {
    n: 2,
    x: '15%',
    y: '38%',
    head: 'The adjacency the thread opened with',
    body: '"Especially when the quick commands LAND and RESET VEHICLE POSITION are nearby… and the LAND command goes through instantly." Here it is, outlined: an instant mission start one disc above a silent correction to the aircraft\'s own position estimate, same size, same colour, nothing between them. Nothing about the rail says these are different kinds of act, because at this size and spacing there is nothing left to say it with.',
  },
  {
    n: 3,
    x: '15%',
    y: '30%',
    head: 'A command is two objects',
    body: 'Every rail item is a naked disc with a detached black box beside it holding the words. The pill is not attached to the disc, does not share its radius, and covers the map. That is not what the two asks are about, so it is left exactly as it is — but it is the reason "Position & Heading Reset" needs 24 characters of pill to say what a sector says in two words.',
  },
  {
    n: 4,
    x: '58%',
    y: '55%',
    head: 'Right-click, and the fallback',
    body: 'On the desktop the gesture the thread asked for is available and is bound here, so the ask can be judged as asked. Press-and-hold is bound too, because the thread also says right-click is taken by EVO. The dial does not care which opens it — that is the answer for Vlad: the gesture is a binding, one line, and it is not the design.',
  },
  {
    n: 5,
    x: '85%',
    y: '84%',
    head: 'The instruments were not touched',
    body: 'The cyan cluster and the compass are reproduced and left alone, including the things a redesign would want to fix. Holding them still is what makes the two changes above legible as changes rather than as taste.',
  },
];

const changed = [
  { what: 'The centre of the top bar', how: 'A plate, in three states, from the reserved hazard alias' },
  { what: 'Arming', how: 'A separate control beside the plate, never the plate itself' },
  { what: 'Right-click on the map', how: 'The command dial — the thread\'s six items' },
  { what: 'The rail', how: 'Position & Heading Reset leaves; it is two commands, not one' },
];
const untouched = [
  { what: 'The vehicle cell, mode picker, link and battery', how: 'As shipped' },
  { what: 'The rail\'s disc-and-detached-pill shape', how: 'As shipped' },
  { what: 'The video panel and its controls', how: 'As shipped' },
  { what: 'The telemetry cluster and the compass', how: 'As shipped' },
];
</script>

<template>
  <div :data-theme="theme" class="a20 fv a20-stage">
    <div class="a20-caption">
      <p class="a20-name" style="font-size: 15px">Auterion Mission Control · AMC20</p>
      <p class="a20-label mt-1.5">
        DESKTOP FLYVIEW · {{ mode === 'before' ? 'AS IT SHIPS' : 'PROPOSED' }} ·
        {{ SCHEME_LABEL[scheme].toUpperCase() }}
      </p>
    </div>

    <div class="a20-controls">
      <div class="fv-control-group">
        <span class="fv-label">Build</span>
        <div class="fv-seg">
          <button
            v-for="m in (['before', 'after'] as const)"
            :key="m"
            type="button"
            class="fv-seg-btn"
            :data-active="mode === m"
            :aria-pressed="mode === m"
            @click="mode = m"
          >{{ m }}</button>
        </div>
      </div>
      <div class="fv-control-group">
        <span class="fv-label">Arm state</span>
        <div class="fv-seg">
          <button
            v-for="a in ARM_ORDER"
            :key="a"
            type="button"
            class="fv-seg-btn"
            :data-active="arm === a"
            :aria-pressed="arm === a"
            @click="arm = a"
          >{{ a }}</button>
        </div>
      </div>
      <div class="fv-control-group">
        <span class="fv-label">Scheme</span>
        <div class="fv-seg">
          <button
            v-for="s in (['requested', 'proposed'] as const)"
            :key="s"
            type="button"
            class="fv-seg-btn"
            :data-active="scheme === s"
            :aria-pressed="scheme === s"
            @click="scheme = s"
          >{{ SCHEME_LABEL[s] }}</button>
        </div>
      </div>
      <div class="fv-control-group">
        <span class="fv-label">Theme</span>
        <div class="fv-seg">
          <button
            v-for="th in (['dark', 'darknight', 'sunlight', 'light'] as const)"
            :key="th"
            type="button"
            class="fv-seg-btn"
            :data-active="theme === th"
            :aria-pressed="theme === th"
            @click="theme = th"
          >{{ THEME_LABEL[th] }}</button>
        </div>
      </div>
      <div class="fv-control-group">
        <span class="fv-label">Rationale</span>
        <div class="fv-seg">
          <button type="button" class="fv-seg-btn" :data-active="!notes" :aria-pressed="!notes" @click="notes = false">off</button>
          <button type="button" class="fv-seg-btn" :data-active="notes" :aria-pressed="notes" @click="notes = true">notes</button>
        </div>
      </div>
    </div>

    <div class="relative">
      <DesktopFrame v-model:arm="arm" :mode="mode" :scheme="scheme" />
      <template v-if="notes">
        <span v-for="n in NOTES" :key="n.n" class="a20-note" :style="{ left: n.x, top: n.y }">{{ n.n }}</span>
      </template>
    </div>

    <div v-if="notes" class="fv-doc" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr))">
      <div v-for="n in NOTES" :key="n.n" class="fv-legend-row">
        <span class="fv-legend-n">{{ n.n }}</span>
        <span>
          <span class="fv-name block">{{ n.head }}</span>
          <span class="fv-micro mt-1 block" style="line-height: 1.55">{{ n.body }}</span>
        </span>
      </div>
    </div>

    <!-- ── The diff ────────────────────────────────────────────────────── -->
    <div class="fv-doc">
      <div class="fv-doc-card">
        <div class="fv-doc-head">
          <span class="fv-doc-title">What changed</span>
          <span class="fv-doc-tag">{{ changed.length }} things</span>
        </div>
        <div v-for="c in changed" :key="c.what" class="fv-row">
          <span class="fv-name" style="flex: 1">{{ c.what }}</span>
          <span class="fv-micro" style="text-align: right; max-width: 210px">{{ c.how }}</span>
        </div>
        <p class="fv-doc-body mt-4">
          The plate and the dial are the <strong>same two components FlyView uses</strong>, imported
          rather than restated, so the tablet and the desktop cannot drift apart into two
          vocabularies for one state. They also resolve through design-system tokens, which is why
          they re-theme with the switcher above and the rest of the window does not.
        </p>
      </div>

      <div class="fv-doc-card">
        <div class="fv-doc-head">
          <span class="fv-doc-title">What did not</span>
          <span class="fv-doc-tag">everything else</span>
        </div>
        <div v-for="c in untouched" :key="c.what" class="fv-row">
          <span class="fv-name" style="flex: 1">{{ c.what }}</span>
          <span class="fv-micro" style="text-align: right">{{ c.how }}</span>
        </div>
        <p class="fv-doc-body mt-4">
          Deliberately, including the parts a redesign would want. The incumbent chrome is drawn in
          <strong>AMC&rsquo;s own current palette</strong> — raw values, not tokens — because it is
          content being shown rather than styling being invented, and re-drawing it in tokens would
          quietly improve the thing the proposal is supposed to be measured against.
        </p>
      </div>
    </div>

    <!-- ── The one slot, in isolation ──────────────────────────────────── -->
    <div class="fv-doc" style="grid-template-columns: minmax(0, 1fr)">
      <div class="fv-doc-card">
        <div class="fv-doc-head">
          <span class="fv-doc-title">The centre of the bar, at full size</span>
          <span class="fv-doc-tag">{{ ARM_ORDER.length }} states · {{ SCHEME_LABEL[scheme].toLowerCase() }}</span>
        </div>
        <p class="fv-doc-body">
          What sits in that slot today, and what the two schemes put there. Switch
          <em>scheme</em> above to swap the row; the full argument, and the live contrast
          measurement that decides between them, is on the <strong>FlyView</strong> page.
        </p>
        <div class="mt-4 flex flex-wrap items-center gap-x-8 gap-y-4">
          <span
            class="flex items-center gap-2 px-4"
            style="height: 46px; background: var(--a20-bar); border-radius: var(--radius-md); font-family: var(--font-sans); font-size: 15px; color: var(--a20-ink)"
          >
            Disarmed
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M2.5 4.5 L6 8 l3.5 -3.5" /></svg>
          </span>
          <ArmState v-for="a in ARM_ORDER" :key="a" :arm="a" :scheme="scheme" />
        </div>
      </div>
    </div>
  </div>
</template>
