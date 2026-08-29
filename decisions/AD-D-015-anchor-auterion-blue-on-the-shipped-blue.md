---
id: AD-D-015
date: 2026-08-28
title: Anchor `auterion-blue` on the blue the products already ship
status: proposed
owner: Yasen
ratified_by: ""
---

## Context

Two operational products ship the **same** primary blue, independently: Mission Control declares
`#1475ff` for `primaryButton`, `colorBlue` and `checkedColor` across all four palette columns
(`auterion-qgroundcontrol/src/QGCPalette.cc:62,75,84`), and Nemyx declares
`--highlight: rgba(20, 117, 255, 0.95)` — the identical value — as its brand blue
(`trellys-command-control-interface/src/assets/main.css:68`, reused for map selection at `:90-91`).

Auxiliary's `auterion-blue` does not contain that colour. The ramp holds hue at **264°**
(`packages/tokens/src/global/color/tailwind-palette.tokens.json:1071`), while `#1475ff` is
`oklch(0.594 0.222 259.3)` — 4.7° away, and by lightness it falls *between* rungs 500 (L 0.631)
and 600 (L 0.548), landing on neither. 264° is Tailwind `blue.700`'s hue: the ramp was built by
freezing one rung's hue up the whole ladder, and that rung is not the one anyone uses.

The consequence is that adopting `@auxiliary/tokens` currently asks both operational products to
change their primary colour, for no reason either team can see. That is the single cheapest way to
lose an adoption argument, and it blocks Steps 2–3 of the ecosystem build plan.

A complication found while checking this: `#1475ff` sits at **99.9% of the sRGB chroma maximum**
at its own lightness and hue. `packages/tokens/test/gamut.test.ts` requires every authored rung to
stay at or below 97% of that maximum, because a rung any closer is silently clipped by the browser
and renders as a different colour than the one written down — the exact defect that gate was
written to catch, after five rungs of this very ramp shipped outside sRGB. So the literal shipped
hex **cannot** be a token rung. The nearest value that clears the gate is
`oklch(0.594 0.215 259.3)` = `#1b76fb`, which is **ΔE00 0.52** from `#1475ff` — half of a
just-noticeable difference.

## Options

- **A — re-anchor the ramp at 259.3°, with rung 600 set to the gate-legal neighbour of the shipped
  blue.** The products keep their colour to within an invisible delta, and the ramp stays inside
  the gamut gate. Costs one semantic repoint (see Decision) and a re-tune of all eleven rungs.
- **B — hold 264° and treat the products as drifted.** Cheapest in this repo, and it makes adoption
  a colour change for two teams who did not ask for one. It also keeps a hue nobody ships.
- **C — add a second primitive (`product-blue`) beside `auterion-blue`.** Honest about the split,
  but it institutionalises two brand blues, which is the problem this ramp exists to prevent.
- **D — set rung 600 to the literal `#1475ff` and exempt it from the gamut gate.** Byte-exact, and
  it re-opens the clipping defect `gamut.test.ts` was written to close, on the most-used rung.

## Decision

Adopt **A**. `global.color.primitive.auterion-blue` is re-tuned to hue **259.3°**, held constant,
with the lightness ladder regularized and chroma a single hump peaking at rung 600:

| Rung | Value | Hex |
|---|---|---|
| 50 | `oklch(0.970 0.011 259.3)` | `#f1f5fd` |
| 100 | `oklch(0.940 0.024 259.3)` | `#e2ecfc` |
| 200 | `oklch(0.884 0.050 259.3)` | `#c6dafb` |
| 300 | `oklch(0.812 0.084 259.3)` | `#a1c3f8` |
| 400 | `oklch(0.734 0.129 259.3)` | `#77a9fa` |
| **600** | `oklch(0.594 0.215 259.3)` | **`#1b76fb`** — the product blue, ΔE00 0.52 |
| 700 | `oklch(0.520 0.192 259.3)` | `#1161d4` |
| 800 | `oklch(0.448 0.165 259.3)` | `#0c4eae` |
| 900 | `oklch(0.378 0.140 259.3)` | `#073d8a` |
| 950 | `oklch(0.290 0.088 259.3)` | `#0d2956` |

(500 is `oklch(0.664 0.168 259.3)` = `#5091f9`.)

**Rung 600 is the anchor and the contract.** It is the value products adopt; it is already what
`ring` resolves to in every theme, and it is what Mission Control uses `checkedColor` for — so the
focus ring and the product's selection colour become the same token rather than two near-misses.

**The semantic layer does not move to 600.** `brand` stays on 700 (light) and 500 (dark).
`#1475ff` carries white text at only **4.18:1**, below the 4.5:1 floor
(`packages/tokens/test/contrast.test.ts:100-102`); the products ship a primary button that fails
AA, and the design system must not inherit that. `brand` → 700 = `#1161d4` carries white at
5.77:1.

**One semantic repoint is required and is part of this decision:** light `accent-foreground` moves
from `auterion-blue.700` to `auterion-blue.800`. Rung 700 lifts from L 0.482 to L 0.520, which
takes `accent`/`accent-foreground` to 4.01:1 against `accent` = rung 200; at 800 it is 5.46:1.

Verified: all **464** tests in `packages/tokens` pass with this ramp — contrast floors, the gamut
gate (every rung at 77–97% of its sRGB maximum), `ramp-shape` monotonic-lightness and
single-hump-chroma, sunlight/darknight gates, and CVD separation. The lightness ladder is *more*
regular than the one it replaces (max/min step ratio 2.93, against 3.09 today).

## Revoked when

Mission Control and Nemyx both move off `#1475ff` to some third value, or a P3-aware token tier is
introduced in which the literal shipped hex can be expressed with gamut headroom.
