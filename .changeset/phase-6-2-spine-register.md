---
'@auxiliary/tokens': minor
'@auxiliary/css': minor
'@auxiliary/vue': minor
---

Phase 6.2 — Spine: the expressive↔operational register, visual language, and lexicon (ROADMAP §6g).

Implements the second orthogonal axis decided in §6g as a **token-mode layer**: `[data-register]`
re-resolves the non-color "flex" tokens exactly the way `[data-theme]` re-resolves color. `expressive`
is the default (no attribute); `operational` is opt-in for GCS/C2 surfaces.

**`@auxiliary/tokens`** — `build.mjs` gains a `REGISTERS` partition mirroring `THEMES`, emitting a
`[data-register="operational"]` override block after the theme blocks. New `control.tokens.json` base
control-height rungs and `register/operational.tokens.json` overrides for control-height (32/36/40 →
28/32/36 px), radius (4/6/8 → 2/4/6 px), and motion duration (120/200/320 → 80/120/200 ms). A build-time
`assertRegisterOrthogonality()` guarantees the axes never cross (no color in register; no flex token in
theme).

**`@auxiliary/css`** — form-control recipes (button, input, select, combobox, number-field) bind height
to `--control-height-*`; `theme.css` bridges `--default-transition-duration` to `--duration-base` so
`transition-*` flexes by register; accordion/progress motion bound to duration tokens. Radius flexes for
free via `rounded-*` → `--radius-*`. New `register-orthogonality.test.ts` gate locks the generated CSS.

**`@auxiliary/vue`** — new `<Register>` wrapper (sets `data-register` on a subtree; defaults to
`operational`, supports an `expressive` opt-out) — pure ergonomics over the attribute.

Type scale and color are deliberately register-invariant; a global spacing-scale multiplier was
evaluated and deferred (the named `--spacing-*` scale makes a `--spacing` override ineffective and a full
rescale layout-broad). Motion is shortened, not zeroed — `prefers-reduced-motion` remains the a11y
override that always wins.
