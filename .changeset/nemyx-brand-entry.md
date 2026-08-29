---
'@auxiliary/brand': minor
'@auxiliary/shell': minor
---

brand: give Nemyx its place in the hierarchy

`brand.manifest.json` declared four entries — the org mark and three products —
and Nemyx was not one of them, despite shipping
(`nemyx-command-control-interface@0.0.55-beta`, Vue 3.5 on Tailwind v4) and
despite already drawing a brand watermark onto a live operational map
(`--color-c2-map-watermark`). The one product painting Auterion identity over
satellite imagery was the one the brand layer did not know about.

Adds `nemyx` as a `product` under `auterion`, art-pending like its siblings,
declaring **all four themes**: `dark` is its default, `light` is shipped today,
and `darknight`/`sunlight` are the operational pair it is the natural first
consumer of — `sunlight` has had no consumer at all until now. Its `forbidden`
list carries the watermark rules explicitly: never over imagery without a scrim
(`AD-D-032`), and never in a product hue.

See `AD-D-016` (proposed).

Also corrects the surface table, which declared Nemyx's themes as
`[dark, darknight, sunlight]` — omitting the light theme Nemyx actually ships.
The table was aspirational where it is supposed to be observational; a test now
asserts every surface's default theme is one it declares.
