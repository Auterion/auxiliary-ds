---
'@auxiliary/tokens': minor
'@auxiliary/css': minor
---

Tune type + numeric legibility for the engineered, operational voice the Auterion
mark sets.

These are additive deltas — the square/geometric punctuation already in the base set
rhymes with the mark's faceted forms, the disambiguation + slashed zero serve the
operational safety context, and the caps tracking is a craft correction to the
negative house baseline. None of them alter the documented house decisions
(h1–6 = 500, `.font-display`'s reduced feature set, the square-punctuation base
set, or the locked "type scale does not flex").

- **`tracking.caps` (+0.05em)** — a new DTCG primitive giving the only deliberate
  positive-tracking step a semantic home (emits `--tracking-caps`). The house
  baseline is negative, correct for mixed-case display but cramped for all-caps.
- **Slashed zero on `.tabular`** — `font-variant-numeric: slashed-zero tabular-nums`
  on every mission-ID / coordinate / telemetry surface (aviation/flight-strip
  convention), via the semantic numeric property so it composes with — rather than
  clobbers — the global feature set.
- **Operational register type seam** — a new `[data-register="operational"]` rule
  adds `I/l/1` disambiguation (`cv05`/`cv08`/`cv11`) + slashed-zero + a 500
  label/caption weight bump. Feature-level only — never font-size or line-height —
  so the type *scale* stays invariant. The first register seam in the type layer.
- **`.caps` utility** — uppercase + `--tracking-caps` + `case`. A reusable home for
  the ad-hoc `uppercase tracking-wide` repeated across several recipes; recipe
  migration is a deliberate follow-up (its +0.05em is wider than their +0.02em — a
  caps-spacing correction, not a no-op). The `case` feature, aligning punctuation to
  cap height, is the genuinely caps-specific reason for a dedicated class. A scoped
  `[data-register="operational"] .caps` keeps the register's `I/l/1` disambiguation.
- **Docs** — `foundations/registers.md` and `foundations/typography.md` document
  the register type seam and numeric/label legibility (with live demos), and the
  stale global-feature-set description in typography.md is corrected to match the
  shipped `theme.css`.
