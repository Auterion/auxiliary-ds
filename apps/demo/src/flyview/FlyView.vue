<script setup lang="ts">
/**
 * FlyView — the studio.
 *
 * Two UI/UX asks came out of the UA team's product review and were routed to
 * #amc-ui-work for a design answer:
 *
 *   1. "ARM: RED | DISARM: GREEN — displayed prominently in the Top Bar.
 *      Consider adjusting text/letter colors to improve visibility and status
 *      recognition. When the UAV is ARMED / in flight, consider using Deep Red."
 *   2. "Add quick commands for HOLD / EIGHT — currently four actions, we want
 *      two", and "RESET VEHICLE POSITION should work differently: right-click
 *      in FlyView opens a window where the operator can choose six modes."
 *
 * Both arrive as solutions. This surface takes each one back to the question it
 * came from, answers it in situ, and — for the one that is a colour decision
 * somebody still has to sign off — puts both candidates side by side and
 * measures them, so the meeting argues about a number instead of a taste.
 *
 * The stage chrome is presentation, not product.
 */
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import ArmState from './ArmState.vue';
import TabletFrame from './TabletFrame.vue';
import { ARM_ORDER, COMMANDS, SCHEME_LABEL, type Arm, type Scheme } from './model';
import './_flyview.css';

type Theme = 'dark' | 'darknight' | 'sunlight' | 'light';
const THEME_LABEL: Record<Theme, string> = {
  dark: 'Dark',
  darknight: 'Night',
  sunlight: 'Sunlight',
  light: 'Light',
};

const theme = ref<Theme>('dark');
const scheme = ref<Scheme>('requested');
const arm = ref<Arm>('ground');
const notes = ref(false);

/* ── The live contrast readout ─────────────────────────────────────────────
 * The request asks for a deeper red and for "text/letter colors" that improve
 * recognition. Both are contrast questions, and contrast questions are settled
 * by measurement, not by preference — which is the case for putting the
 * measurement on the page rather than in a reply.
 *
 * Every semantic pair the token package ships is gated in all four themes.
 * `--fv-hazard-deep` is mixed by hand in the demo layer and is gated by
 * nothing, so it is measured here beside the pairs that are, and the gap is
 * the argument for promoting it to a token before it ships.
 */
type Rgb = [number, number, number, number];

let probe: CanvasRenderingContext2D | null = null;
function toRgba(css: string): Rgb {
  if (!probe) {
    const c = document.createElement('canvas');
    c.width = 1;
    c.height = 1;
    probe = c.getContext('2d', { willReadFrequently: true });
  }
  if (!probe) return [0, 0, 0, 1];
  probe.clearRect(0, 0, 1, 1);
  probe.fillStyle = css;
  probe.fillRect(0, 0, 1, 1);
  const d = probe.getImageData(0, 0, 1, 1).data;
  return [d[0]!, d[1]!, d[2]!, d[3]! / 255];
}

/** Composite a possibly-translucent colour over an opaque one. */
function over(fg: Rgb, bg: Rgb): Rgb {
  const a = fg[3];
  return [
    Math.round(fg[0] * a + bg[0] * (1 - a)),
    Math.round(fg[1] * a + bg[1] * (1 - a)),
    Math.round(fg[2] * a + bg[2] * (1 - a)),
    1,
  ];
}

/** WCAG 2.x relative luminance and ratio — the same maths the token suite runs. */
function luminance([r, g, b]: Rgb) {
  const lin = (v: number) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}
function contrast(a: Rgb, b: Rgb) {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

const probes = ref<HTMLElement[] | null>(null);
const stage = ref<HTMLElement | null>(null);
interface Measured {
  scheme: Scheme;
  arm: Arm;
  ratio: number;
}
const measured = ref<Measured[]>([]);

/**
 * Read the plates that are actually rendered rather than re-deriving their
 * colours from the stylesheet. A ratio computed from what a rule was MEANT to
 * resolve to is a ratio that cannot catch the case where it did not.
 */
function measure() {
  const els = probes.value;
  const host = stage.value;
  if (!els?.length || !host) return;
  const page = toRgba(getComputedStyle(host).backgroundColor);
  measured.value = els.map((el) => {
    const cs = getComputedStyle(el);
    const fill = over(toRgba(cs.backgroundColor), page);
    const ink = over(toRgba(cs.color), fill);
    return {
      scheme: el.dataset.scheme as Scheme,
      arm: el.dataset.arm as Arm,
      ratio: contrast(ink, fill),
    };
  });
}

/**
 * `flush: 'post'` and two frames, both load-bearing.
 *
 * A default pre-flush watcher runs BEFORE the component re-renders, so it
 * measured the plates as they were one switch ago — the readout sat exactly one
 * theme behind, which is the worst possible failure for an instrument whose
 * whole job is to be trusted over a look. Post-flush puts it after the DOM
 * patch; the second frame puts it after the style recalculation that the
 * `[data-theme]` swap forces.
 */
function scheduleMeasure() {
  requestAnimationFrame(() => requestAnimationFrame(measure));
}
onMounted(() => void nextTick(scheduleMeasure));
watch([theme, scheme], scheduleMeasure, { flush: 'post' });

const rows = computed(() =>
  measured.value.filter((m) => m.scheme === scheme.value).map((m) => ({
    ...m,
    // 4.5:1 is the floor for the plate's own text: it is small, it is the
    // thing being read, and it is the only wording of the state.
    pass: m.ratio >= 4.5,
  })),
);

const ARM_ROW_LABEL: Record<Arm, string> = {
  safe: 'Disarmed',
  ground: 'Armed · on ground',
  air: 'Armed · airborne',
};

/* ── Annotation ────────────────────────────────────────────────────────── */

const NOTES: { n: number; x: string; y: string; head: string; body: string }[] = [
  {
    n: 1,
    x: '9%',
    y: '7%',
    head: 'The plate is not the button',
    body: '"ARM: RED" can mean the state is red once armed, or that the button which arms is red — and an operator who reads it the second way presses the red thing to make the danger stop. Split by form before colour: this is a plate, with no hover, no press and no focus ring, and it sits first on the bar because it decides whether it is safe to walk toward the aircraft.',
  },
  {
    n: 2,
    x: '25.5%',
    y: '7%',
    head: 'The actuator, kept apart',
    body: 'Arming is a guarded press-and-hold shaped nothing like the indicator beside it. Disarming is a plain button, because disarming is the safe direction and a guard on the safe direction only teaches operators to power through guards.',
  },
  {
    n: 3,
    x: '9%',
    y: '50%',
    head: 'Three commands, not six',
    body: 'The thread settled on "use now only 3 modes, everything else we can control from keyboard". The three that stay are the ones reached for without having decided anything first; the three that had to be thought about moved into the dial, which is where a decision belongs.',
  },
  {
    n: 4,
    x: '50%',
    y: '46%',
    head: 'Press and hold, anywhere',
    body: 'One gesture on the map opens the dial at the point pressed. That is action one; the sector is action two. Right-click is ruled out by the thread — occupied by EVO — and a tablet has no right button at all, so the gesture that costs nothing is the one to take.',
  },
  {
    n: 5,
    x: '68%',
    y: '46%',
    head: 'The fence',
    body: 'Two dashed marks split the ring: everyday commands on one side, corrections to the aircraft\'s own position and heading estimate on the other. The complaint that opened this thread was LAND sitting beside RESET VEHICLE POSITION with nothing between them. The fence costs no colour and no label to say a press here is not the same kind of act as a press there.',
  },
  {
    n: 6,
    x: '50%',
    y: '96%',
    head: 'Nothing was added to the frame',
    body: 'Both asks are answered without spending a single new pixel of permanent screen. The dial exists only while held, the arm plate replaced a smaller plate that was already there, and the left rail got shorter rather than longer.',
  },
  {
    n: 7,
    x: '87%',
    y: '7%',
    head: 'A command leaves a trace',
    body: 'What the dial issued stays on screen for eight seconds, named and with its value. A quick command that vanishes on release is a command the operator has to remember issuing, which is the failure the four-step version at least did not have.',
  },
];

const answers: { ask: string; where: string }[] = [
  { ask: 'ARM / DISARM in different colours', where: 'Top-bar plate · both schemes below' },
  { ask: 'Prominent in the Top Bar', where: 'First slot on the bar, ahead of the callsign' },
  { ask: 'Text / letter colours for recognition', where: 'Gated pairs · live ratios below' },
  { ask: 'Deep Red when armed / in flight', where: 'Built, measured, and costed as a token' },
  { ask: 'HOLD / EIGHT in two actions', where: 'Hold the map, then the sector' },
  { ask: 'RESET VEHICLE POSITION as a window', where: 'The dial · six items, two guarded' },
  { ask: 'Right-click is taken by EVO', where: 'Press-and-hold instead; nothing reassigned' },
  { ask: 'Change speed / change altitude', where: 'The hub opens into a stepper with type-in' },
];
</script>

<template>
  <div ref="stage" :data-theme="theme" class="fv fv-stage">
    <!-- ── Stage chrome (not product) ─────────────────────────────────── -->
    <div class="fv-caption">
      <p class="fv-name" style="font-size: 15px">Auterion Mission Control · FlyView</p>
      <p class="fv-label mt-1.5">
        ARM STATE &amp; COMMAND DIAL · {{ SCHEME_LABEL[scheme].toUpperCase() }} · {{ THEME_LABEL[theme].toUpperCase() }}
      </p>
    </div>

    <div class="fv-controls">
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

    <!-- ── The device ─────────────────────────────────────────────────── -->
    <div data-register="operational" class="fv-device">
      <TabletFrame v-model:arm="arm" :scheme="scheme" />

      <template v-if="notes">
        <span v-for="n in NOTES" :key="n.n" class="fv-note" :style="{ left: n.x, top: n.y }">{{ n.n }}</span>
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

    <!-- ── The three states, both schemes, side by side ────────────────── -->
    <div class="fv-doc" style="grid-template-columns: minmax(0, 1fr)">
      <div class="fv-doc-card">
        <div class="fv-doc-head">
          <span class="fv-doc-title">Three states, two schemes</span>
          <span class="fv-doc-tag">{{ ARM_ORDER.length }} states · 2 schemes · 4 themes</span>
        </div>
        <p class="fv-doc-body">
          The request is binary. The aircraft is not. An armed aircraft
          <strong>on the ground</strong> is the state in which a person can walk into a
          turning rotor, and it lasts seconds. An armed aircraft <strong>airborne</strong>
          has taken that hazard away from everyone standing near it, and it lasts the whole
          sortie. Colouring both the same throws away the distinction the colour was
          being asked for.
        </p>

        <div class="mt-4 flex flex-wrap items-end gap-x-9 gap-y-5">
          <div v-for="s in (['requested', 'proposed'] as const)" :key="s">
            <p class="fv-doc-tag mb-2.5">{{ SCHEME_LABEL[s] }}</p>
            <div class="flex flex-wrap items-center gap-3">
              <ArmState v-for="a in ARM_ORDER" :key="a" :arm="a" :scheme="s" />
            </div>
          </div>
        </div>

        <p class="fv-doc-body mt-4">
          <strong>As requested</strong> reads green when disarmed and red when armed, with a
          deeper red in flight. <strong>Proposed</strong> keeps disarmed quiet — green already
          means <em>nominal</em> on the reserved ladder, so a green arm plate reads as
          &ldquo;arming is fine&rdquo; rather than &ldquo;not armed&rdquo;, which is the
          ambiguity the request is trying to remove — and it spends no second red at all:
          both armed states take the same gated pair, and the hazard hatch, present only on the
          ground, is what separates them. The difference is a channel rather than a hue, which
          is why it survives all four themes and the deep red does not. Red and green are also
          the one pair roughly one man in twelve cannot separate, in a population that is
          overwhelmingly men, so the plate carries the word, the fill weight and the hatch
          before it carries any hue at all.
        </p>
      </div>
    </div>

    <!-- ── The measurement ────────────────────────────────────────────── -->
    <div class="fv-doc">
      <div class="fv-doc-card">
        <div class="fv-doc-head">
          <span class="fv-doc-title">Deep Red, measured</span>
          <span class="fv-doc-tag">{{ THEME_LABEL[theme] }} · live</span>
        </div>
        <p class="fv-doc-body">
          Each plate&rsquo;s own text against its own fill, read off the rendered element in
          the theme currently selected. Switch themes and watch the numbers move — that is
          the whole reason a deeper red is not a one-line change. On
          <strong>as requested</strong>, the deep red is the row that gives way, and it gives
          way in <strong>night</strong> — at 3.34:1, against a 4.5 floor. The scotopic theme
          deliberately runs <code>--alarm</code> as a <em>light</em> red so that black text can
          sit on it; darkening that fill by hand takes the pairing apart from the wrong end.
          The proposed scheme, which spends no second red, holds above 6:1 in all four.
        </p>
        <div class="mt-3">
          <div v-for="r in rows" :key="r.arm" class="fv-row">
            <span class="fv-name" style="flex: 1">{{ ARM_ROW_LABEL[r.arm] }}</span>
            <span class="fv-ratio">{{ r.ratio.toFixed(2) }}:1</span>
            <span class="fv-verdict" :class="r.pass ? 'fv-verdict-pass' : 'fv-verdict-fail'">
              {{ r.pass ? 'passes 4.5' : 'under 4.5' }}
            </span>
          </div>
        </div>
        <p class="fv-doc-body mt-3">
          The two gated pairs come from the token package, which holds every semantic pair to
          a floor in <strong>all four themes at once</strong>. The deep red does not: it is
          mixed by hand in the demo layer and nothing has ever measured it. Shipping it means
          a new gated <code>--hazard</code> / <code>--hazard-foreground</code> pair, which is a
          tokens change with a test behind it — a day, not an afternoon, and the honest answer
          to give when the colour is agreed.
        </p>
      </div>

      <div class="fv-doc-card">
        <div class="fv-doc-head">
          <span class="fv-doc-title">Two actions, one dial</span>
          <span class="fv-doc-tag">{{ COMMANDS.length }} items · 2 guarded</span>
        </div>
        <p class="fv-doc-body">
          &ldquo;Quick commands for HOLD / EIGHT&rdquo; and &ldquo;RESET VEHICLE POSITION
          should open a window with six modes&rdquo; are the same feature, and answering them
          apart is what makes each one awkward. One dial, anchored where the press landed:
          the press is action one, the sector is action two.
        </p>
        <p class="fv-doc-body">
          <strong>Press-and-hold, not right-click.</strong> The thread rules right-click out —
          it is taken by EVO — and a tablet has no right button to argue over. Long press is
          free, and it is what every map application has already trained the same operators to
          expect. On the desktop build the same dial can hang off middle-click or a modifier
          without disturbing anything.
        </p>
        <p class="fv-doc-body">
          <strong>A ring, not a list.</strong> Six is under the count where a ring stops
          paying. Every item sits the same distance from the pointer, direction becomes muscle
          memory within a week, and after that the labels stop being read. A list prices every
          item differently and never stops being read.
        </p>
        <p class="fv-doc-body">
          <strong>Two of the six are not commands.</strong> Change speed and change altitude
          are numbers, so they open the hub into a stepper with a type-in field rather than
          firing — which is also what SW-3160 asks for, in the gesture that was going to be
          built anyway.
        </p>
        <p class="fv-doc-body">
          <strong>Two more are guarded.</strong> Reset position and reset heading do not change
          what the aircraft does; they change what it <em>believes</em>. A wrong one is silent
          — the aircraft flies confidently to the wrong place and nothing on the screen looks
          unusual — so they cost a third action, sit together behind a drawn fence, and are the
          only items on the ring that never fire on release.
        </p>
      </div>
    </div>

    <!-- ── Requirements, and where each one is answered ────────────────── -->
    <div class="fv-doc" style="grid-template-columns: minmax(0, 1fr)">
      <div class="fv-doc-card">
        <div class="fv-doc-head">
          <span class="fv-doc-title">Every line of the ask, and where it landed</span>
          <span class="fv-doc-tag">{{ answers.length }} requirements</span>
        </div>
        <div v-for="a in answers" :key="a.ask" class="fv-row">
          <span class="fv-name" style="flex: 1">{{ a.ask }}</span>
          <span class="fv-micro" style="text-align: right">{{ a.where }}</span>
        </div>
        <p class="fv-doc-body mt-4">
          <strong>Still open, and not ours to close.</strong> Which scheme ships is Artem&rsquo;s
          call, and the plates above exist so that call can be made by looking rather than by
          describing. Whether the desktop build hangs the dial off middle-click or a modifier
          depends on what EVO actually holds, which Vlad has. And the deep red needs a token
          pair before it can ship, whichever scheme wins.
        </p>
      </div>
    </div>

    <!-- Off-screen probes: the same rules the plates above use, rendered so
         `getComputedStyle` has something real to read. Measuring the stylesheet
         instead would not catch a rule that failed to apply. -->
    <div
      aria-hidden="true"
      style="position: absolute; left: -9999px; top: 0; opacity: 0; pointer-events: none"
    >
      <div
        v-for="a in ARM_ORDER"
        :key="a"
        ref="probes"
        class="fv-arm fv-probe"
        :data-scheme="scheme"
        :data-arm="a"
      >
        <span class="fv-arm-word">{{ a }}</span>
      </div>
    </div>
  </div>
</template>
