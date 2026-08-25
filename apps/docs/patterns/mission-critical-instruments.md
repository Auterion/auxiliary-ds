<script setup>
import { ref } from 'vue';
const roll = ref(-12);
const pitch = ref(6);
const heading = ref(247);
const tracking = ref(false);
const setRoll = (v) => (roll.value = v[0]);
const setPitch = (v) => (pitch.value = v[0]);
const setHeading = (v) => (heading.value = v[0]);
</script>

# Mission-critical instruments

The Level-4 bespoke widgets a heads-up / payload view needs — an attitude indicator, a heading compass, and the payload action cluster. These are the **widgets**, token-driven and pure-SVG; the **data** (AHRS, gimbal, video) and the **map/video engines** stay product-owned. Irreversible commands here compose [`GuardedAction`](/components/guarded-action) — a stray click must never fire a strike.

## Attitude indicator

An artificial horizon — sky/ground split rolls and pitches with the aircraft, a fixed reference and bank scale stay put. Drag the sliders to fly it.

<div class="auxiliary-demo vp-raw" style="gap:var(--spacing-6); align-items:center; flex-wrap:wrap;">
  <svg width="180" height="180" viewBox="0 0 200 200" role="img" :aria-label="`Attitude: roll ${roll}°, pitch ${pitch}°`">
    <defs><clipPath id="adi"><circle cx="100" cy="100" r="86" /></clipPath></defs>
    <g clip-path="url(#adi)">
      <g :transform="`rotate(${-roll} 100 100)`">
        <g :transform="`translate(0 ${pitch * 2})`">
          <rect x="-60" y="-120" width="320" height="220" fill="oklch(0.6 0.12 240)" />
          <rect x="-60" y="100" width="320" height="220" fill="oklch(0.42 0.06 70)" />
          <line x1="-60" y1="100" x2="260" y2="100" stroke="#fff" stroke-width="2" />
          <g stroke="#fff" stroke-width="1.5" font-size="8" fill="#fff" font-family="var(--font-mono)">
            <line x1="78" y1="70" x2="122" y2="70" /><text x="66" y="73">10</text>
            <line x1="86" y1="55" x2="114" y2="55" /><text x="74" y="58">20</text>
            <line x1="78" y1="130" x2="122" y2="130" /><text x="66" y="133">10</text>
            <line x1="86" y1="145" x2="114" y2="145" /><text x="74" y="148">20</text>
          </g>
        </g>
      </g>
      <g stroke="var(--muted-foreground)" stroke-width="1.5">
        <line x1="14" y1="100" x2="40" y2="100" stroke="#fbbf24" stroke-width="3" />
        <line x1="160" y1="100" x2="186" y2="100" stroke="#fbbf24" stroke-width="3" />
        <circle cx="100" cy="100" r="2.5" fill="#fbbf24" stroke="none" />
      </g>
      <polygon points="100,18 95,28 105,28" fill="#fbbf24" />
    </g>
    <circle cx="100" cy="100" r="86" fill="none" stroke="var(--border)" stroke-width="3" />
  </svg>
  <div style="display:flex; flex-direction:column; gap:var(--spacing-3); min-width:14rem;">
    <div style="display:flex; align-items:center; gap:var(--spacing-3);"><span style="width:3rem; font-size:0.8125rem; color:var(--muted-foreground);">Roll</span><Slider :model-value="[roll]" @update:model-value="setRoll" :min="-45" :max="45" :step="1" aria-label="Roll" style="flex:1;" /><code style="width:3rem; text-align:right;">{{ roll }}°</code></div>
    <div style="display:flex; align-items:center; gap:var(--spacing-3);"><span style="width:3rem; font-size:0.8125rem; color:var(--muted-foreground);">Pitch</span><Slider :model-value="[pitch]" @update:model-value="setPitch" :min="-20" :max="20" :step="1" aria-label="Pitch" style="flex:1;" /><code style="width:3rem; text-align:right;">{{ pitch }}°</code></div>
  </div>
</div>

## Heading compass

A rotating compass rose with a fixed lubber line and a mono readout — the numbers-before-graphics rule applies (the digits lead, the rose confirms).

<div class="auxiliary-demo vp-raw" style="gap:var(--spacing-6); align-items:center; flex-wrap:wrap;">
  <svg width="150" height="150" viewBox="0 0 200 200" role="img" :aria-label="`Heading ${heading}°`">
    <circle cx="100" cy="100" r="86" fill="var(--card)" stroke="var(--border)" stroke-width="3" />
    <g :transform="`rotate(${-heading} 100 100)`" font-family="var(--font-mono)" font-size="14" font-weight="600" fill="var(--foreground)">
      <text x="100" y="34" text-anchor="middle" fill="var(--alarm)">N</text>
      <text x="170" y="105" text-anchor="middle">E</text>
      <text x="100" y="178" text-anchor="middle">S</text>
      <text x="30" y="105" text-anchor="middle">W</text>
      <g stroke="var(--muted-foreground)" stroke-width="1.5"><line x1="100" y1="14" x2="100" y2="24" /><line x1="186" y1="100" x2="176" y2="100" /><line x1="100" y1="186" x2="100" y2="176" /><line x1="14" y1="100" x2="24" y2="100" /></g>
    </g>
    <polygon points="100,20 94,32 106,32" fill="var(--primary)" />
    <rect x="78" y="88" width="44" height="24" rx="4" fill="var(--background)" stroke="var(--border)" />
    <text x="100" y="105" text-anchor="middle" font-family="var(--font-mono)" font-size="14" font-weight="600" fill="var(--foreground)">{{ heading }}°</text>
  </svg>
  <div style="display:flex; align-items:center; gap:var(--spacing-3); min-width:14rem;"><span style="width:3.5rem; font-size:0.8125rem; color:var(--muted-foreground);">Heading</span><Slider :model-value="[heading]" @update:model-value="setHeading" :min="0" :max="359" :step="1" aria-label="Heading" style="flex:1;" /></div>
</div>

## Payload action cluster

The gimbal/payload controls. The dangerous ones are **guarded** — `STRIKE` requires a hold (`GuardedAction`), so it can't fire on a stray tap; track toggles; zoom and record are immediate.

<div class="auxiliary-demo vp-raw" style="gap:var(--spacing-4); align-items:center; flex-wrap:wrap;">
  <div style="display:flex; flex-direction:column; gap:var(--spacing-2.5); align-items:stretch; width:13rem;">
    <GuardedAction mode="hold" variant="danger" :hold-ms="1500" confirm-label="Hold to STRIKE">Strike</GuardedAction>
    <Button :variant="tracking ? 'primary' : 'secondary'" @click="tracking = !tracking">{{ tracking ? 'Tracking — release' : 'Track target' }}</Button>
    <div style="display:flex; gap:var(--spacing-2);"><Button variant="secondary" aria-label="Zoom out" style="flex:1;"><Icon name="minus" /></Button><Button variant="secondary" style="flex:2;">FOV 49°</Button><Button variant="secondary" aria-label="Zoom in" style="flex:1;"><Icon name="plus" /></Button></div>
    <Button variant="ghost" aria-label="Record"><Icon name="circle-info" /> Record</Button>
  </div>
</div>

## Notes

- **Widget, not pipeline.** The DS owns the instrument rendering (token-driven SVG); AHRS/gimbal/video data and the map/video engines are product-owned, fed in as props. Sky/ground use fixed aviation colors (recognition over theming); the chrome (ring, ticks, readout) follows tokens.
- **Guarded by construction.** `STRIKE` is a [`GuardedAction`](/components/guarded-action) in `hold` mode — irreversible commands never fire on a single click, and the keyboard equivalent is guarded too. Track/zoom/record are reversible, so they're immediate.
- **Numbers before graphics.** The compass leads with the mono heading readout; the attitude indicator pairs with numeric pitch/roll. The graphic confirms; the digit decides.
- **Reduced motion / determinism.** These reflect live state — no decorative animation; transitions are short and state-bearing (see [Motion](/foundations/motion)).
- Extraction candidates (`AttitudeIndicator`, `HeadingCompass`) once a product surface consumes them — docs-first like the other blocks.
