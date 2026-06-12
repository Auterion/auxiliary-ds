---
'@auxiliary/tokens': minor
---

`auterion-blue` now follows the shared palette pattern. It was the only primitive
ramp that broke ranks: its dark steps (500–950) rode well below the per-step
lightness every other hue lands on (ΔL up to +0.106 @900, diving to near-black
early in a swatch grid), and it was the only entry carrying non-numeric aliases.

Two structural fixes:

1. **Pure, regularized `50…950` brand ramp.** Hue held at 264; lightness pulled
   onto the shared spine so the dark steps lift out of near-black and align with
   every other color. The eight extra aliases (`DEFAULT`, `light`, `dark`, `tint`,
   `night`, `shade`, `surface`, `edge`) are removed — the ramp is strictly numeric
   like `cadet` and the Tailwind families.

2. **New `ink` primitive** — a low-chroma (~265°) dark-UI neutral as a full
   `50…950` ramp on the neutral lightness spine. The dark-theme surfaces that used
   to live inside `auterion-blue` now draw from it (background→`ink.950`,
   card/popover/muted→`ink.900`, secondary/accent/input→`ink.800`,
   border→`ink.700`).

Brand resolves at the semantic layer: `brand` → `auterion-blue.700` (#1248DF,
white-on 6.96:1), `ring` → `auterion-blue.600`. **Breaking (pre-1.0):** any code
referencing `auterion-blue.{DEFAULT,light,dark,tint,night,shade,surface,edge}`
must move to the numeric brand steps or the new `ink` ramp.
