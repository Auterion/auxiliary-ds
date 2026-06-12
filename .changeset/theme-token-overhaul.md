---
'@auxiliary/tokens': minor
---

**Theme-token overhaul** from the holistic per-theme review (20 confirmed,
verifier-recomputed findings). Every change is locked by a new or extended
gate; 324 token tests pass.

**Severity salience now tracks urgency** (it was scrambled — light's nominal
out-shouted warning 4.53 vs 2.65; dark was exactly inverted):
- light: warning → orange.600+black, advisory → cyan.400+black, nominal →
  green.400+black (dark's anchors — cross-theme parity). Ladder is strictly
  decreasing: 5.89 > 3.29 > 1.75 > 1.66 > 1.63.
- dark: benign end goes quiet (nominal → green.700+white, advisory →
  cyan.700+white, caution → yellow.600+black).
- sunlight: alarm → red.800 (8.37, tops the ladder), caution → yellow.600
  (the deepest yellow whose black label clears the 7:1 lean; documented as
  the one sub-3:1 rung).
- Per-theme salience gates lock each contract.

**destructive ≠ alarm everywhere** (light/sunlight/darknight aliased the
identical primitive, ΔEok 0.000): light → red.800, sunlight → red.900,
darknight → red.500+black (dimmer than alarm, per the night ladder). Gated
≥0.04 ΔEok in all themes.

**Dark surfaces get a real elevation step**: popover → new ink.850 primitive,
muted → ink.800 (it was identical to card). Light accent → auterion-blue.200
(secondary/muted/accent were one value — hover produced zero visual change).
Dark brand → auterion-blue.500 + ink.950 foreground (was 2.86:1 vs
background); brand now gated ≥4.5 vs background + its foreground in all
themes, with sunlight/darknight documenting brand := primary as intentional.

**Darknight**: primary/brand → amber.600 (chrome no longer out-emits alarm —
gated), accent → stone.800 (was inside the status-fill band), input →
amber.600 (was identical to border), advisory → lime.900 (hue identity was
caution's twin; 2.5× the separation), advisory/nominal foregrounds rebalanced
(amber.400-tier / lime.500).

**New tiers**: `*-emphasis` (on-surface status ink, gated ≥4.5 vs background
AND card — fills were being used as ink at 1.4–2.9:1); `overlay` (black scrim
primitives — dark in every theme; background/70 was white-on-white in
sunlight); per-theme `viz-categorical-1…6` / `viz-sequential-1…5` /
`viz-diverging-1…5` (see the css/viz changesets).
