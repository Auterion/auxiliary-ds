---
'@auxiliary/tokens': minor
'@auxiliary/css': minor
'@auxiliary/vue': minor
'@auxiliary/viz': patch
---

Cross-discipline interface review: fixes all 38 verified findings, and widens the
gates that let them ship.

**The gates were the story.** Four of the six blockers existed because a
verification artifact was wrong, not because a component was — and every suite
was green throughout.

- **The visual regression harness rendered one register under two names.**
  `VisualSpecimens.vue` passed `<Register :value>`; the declared prop is
  `register`, so `value` fell through to `$attrs` and `data-register` was pinned
  to the `operational` default. All 24 expressive/operational baselines were
  byte-identical, and the repo's only cross-axis render gate could not fail. The
  24 pairs now differ.
- **16 of 48 baselines were blessed with unstyled buttons.** The harness was
  missing `vp-raw`, so VitePress's *unlayered* `button` reset beat Tailwind's
  `@layer utilities` — `GuardedAction` rendered "Arm / Abort" as bare text
  despite `variant="danger"`.
- **`level` was color-only on three components.** `TelemetryValue`,
  `CoordinateValue` and `Progress` emitted a hue and nothing else, violating
  `AD-D-014` invariant 1 while `conformance.md` listed WCAG 1.4.1 as Supported.
  The first two now render the shared `STATUS_GLYPHS` shape plus an `sr-only`
  level word; `Progress`, which has no room for a glyph, carries the level in
  `aria-valuetext`. The non-color gate covered two of the five components that
  take `level` — it now covers all five, with a positive control.
- **The severity ladder collapsed under dichromacy.** `warning-emphasis` and
  `caution-emphasis` measured ΔEok **0.0013** deuteranopic in light and sunlight.
  The ladder's ΔEok gate covered the five *fills* only, under normal vision only,
  while `viz-palette.test.ts` already held a decorative chart series to 0.04 under
  both dichromacies using a CVD simulator shipped in the same directory and
  imported by one file. Nine pairs across both tiers and all four themes were
  below the floor. The ladder is re-spaced on lightness — the only channel
  dichromacy leaves intact — preserving hue semantics, the 4.5:1 contrast floors,
  darknight's low-blue cap and its monotonic-luminance invariant. The gate now
  covers both tiers under protanopia and deuteranopia.

Also fixed: Dialog had no `max-height` and was unreachable at 320px / 200% zoom
(measured: 657px tall in a 256px viewport, no scroll path); the scrolling Table
had no keyboard path in Firefox/Safari; form controls shipped 14px typed text,
triggering iOS focus zoom on the documented device class (new `--field-text-floor`,
keyed on the pointer like `--target-floor`); `color-scheme` never followed
`[data-theme]`, so UA chrome fought the two themes whose purpose is controlling
emitted light; chart series were painted in the interface's own chrome ink;
Table hover and selection shared one token; `type/*` composites shipped Figma
leading the web never renders; Inter loaded with `swap`, no metric fallback and
no preload; the `cadet` ramp had a 3.5× chroma spike carrying a workaround for a
consumer deleted long ago; recipes pinned logical-named tokens to physical sides;
Toast ignored safe-area insets; overlay item radii were non-concentric; inline
glyphs mixed stroke weights; and the reserved lexicon was paraphrased across the
toast template and demo console.

**New gates**, each with a positive control that fails on a deliberately broken
input: typed-text floor, single-weight inline glyphs, authored-ramp shape,
type-role parity, `color-scheme`/`prefers-contrast`/`forced-colors`, and no raw
layout lengths in pattern and template docs. The touch-target gate now also
policies square controls (`-size`, not just `-height`) — icon-only close buttons
had escaped it entirely.

BREAKING (pre-1.0, `AD-D-035`): status ladder values move in all four themes;
`cadet.500`/`600` change; three `viz-categorical-*` series are repointed;
accordion inline padding goes 4px → 12px; overlay item radius 4px → 2px; check
indicators grow one rung. Re-accept visual baselines after upgrading.
