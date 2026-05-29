---
'@auxiliary/tokens': minor
'@auxiliary/vue': minor
'@auxiliary/css': minor
---

Operational invariants: per-theme contrast + non-color status cue (ROADMAP cross-cutting).

**Tokens — status & muted palette brought to WCAG AA (4.5:1) in all four themes.**
Every `alarm/warning/caution/advisory/nominal` (+ `destructive`) fill/foreground
pair now clears 4.5:1 in `light`, `dark`, `sunlight`, and `darknight` — fixing
real defects (white-on-green `nominal` was 2.22:1; darknight `advisory` 2.46:1).
`light`/`darknight` `muted-foreground` were also raised to 4.5:1. Visible changes:
deeper red/green status fills in light/sunlight; uniform tinted-on-dark in dark;
warm amber-on-dim-chip in darknight (advisory dimmed to cut night-vision blue
leakage by >50%). New contrast gate (`@auxiliary/tokens` now runs Vitest) computes
WCAG ratios from the source tokens across every theme and fails CI on regression;
floors ratchet up only. Includes a darknight blue-energy cap (scotopic safety).

**Components — status is never conveyed by color alone.**
`StatusBadge` gains a default-on per-level glyph (5 grayscale-distinct outlines)
plus a new `icon` and `label` prop, and always renders a visually-hidden level
label so the level reaches assistive tech and survives grayscale even with an
empty slot. `AlertBanner` adopts the same distinct per-level glyphs and an
sr-only level label. A new gate asserts the intrinsic cue for every level on both
components. `@auxiliary/css`: `statusBadge` recipe adds an `icon` slot.
