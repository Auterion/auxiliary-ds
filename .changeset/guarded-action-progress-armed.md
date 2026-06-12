---
'@auxiliary/css': minor
---

GuardedAction's two ungated state treatments are replaced, both locked by
recipes-a11y assertions:

- **Hold progress** is now a solid `currentColor` bar along the bottom edge
  instead of a 25%-alpha full-height wash. The wash measured 1.2–2.2:1
  filled-vs-unfilled across all 16 variant×theme combinations — invisible
  progress on a safety-critical hold — and no alpha fixes it (≥3:1 alpha
  makes the label illegible). The variant's paired `-foreground` is already
  gated 4.76–7.26:1 against every fill.
- **Armed state** draws `outline-2 outline-offset-2 outline-destructive`
  instead of borrowing the focus `ring` — ring utilities share one box-shadow
  slot, so armed and focused were indistinguishable (and `ring` is
  contractually the focus role). Outline is an independent channel;
  `destructive` vs background is gated ≥3:1 everywhere, and armed means a
  destructive action is imminent. Root now uses plain `outline-none` so the
  armed outline wins unconditionally; focus stays on the ring channel.
