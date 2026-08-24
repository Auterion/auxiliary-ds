---
'@auxiliary/tokens': minor
'@auxiliary/css': minor
---

Mono-neutral surfaces + Ultramarine accent, and a full brand blue scale.

**Color.** Dark mode no longer reads as "all blue." The `auterion-blue.{night,
shade,surface,edge}` dark-UI stops are retuned to LOW chroma (~0.014–0.024 at
264°) so every dark surface (`background`/`card`/`popover`/`muted`/`secondary`/
`accent`/`border`/`input`) becomes a near-black neutral with only a whisper of
blue — while `brand`/`ring` keep the saturated Ultramarine, so the blue now
reads as *highlights* on a monochrome canvas. Light mode picks up a subtle blue
cast (faint-blue canvas, crisp white cards, blue-tinted chips/borders) by
pointing its surfaces at the new low blue tints. `brand` (DEFAULT) is retuned to
`oklch(0.500 0.235 264)` — gamut-safer and legible on both light and dark.

**Brand scale.** Adds a perceptually-even `auterion-blue` ramp `50–950` (oklch,
hue ~264°, chroma peaking mid-ramp and tapering at both ends to stay in sRGB)
for marketing/brand work. `600` is the canonical brand anchor (== `DEFAULT`).

**Typography.** Display/heading steps `text-3xl`–`text-10xl` are now fluid via
`clamp()` (phone min ≈ 360px viewport → desktop max == the prior fixed value),
so headings scale down gracefully on mobile while desktop is unchanged. Body/UI
sizes (`xs`–`2xl`) stay fixed. All headings default to medium (500). Inter
square/straight punctuation (ss01/ss03/ss07/ss08 + cv*) now also applies to
form controls, which previously reset font-features to round defaults.
