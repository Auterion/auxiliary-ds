---
id: AD-D-010
date: 2026-06-07
title: Build on mono/ink neutrals; accents are Mono and Ultramarine
status: ratified
owner: Yasen
ratified_by: ""
---

## Context

Auterion needs a colour identity that reads as trusted, mission-critical, and precise, and that
differs from both consumer-drone playfulness and defense-prime cliché. The two nearest reference
points are already taken: Anduril owns near-black plus warm orange, Helsing owns near-black plus
white. An accent also has to survive the operational register, where the status ladder
(`AD-D-014`) has first claim on hue.

Migrated from `DECISIONS.md` (2026-06-07 entry, "Brand accent directions").

## Options

- **A — Mono** — fully monochromatic; status colours are the only chromatic elements on screen.
  Purest expression of the thesis; nobody in autonomous systems owns it.
- **B — Ultramarine** — `auterion-blue.DEFAULT` `oklch(0.500 0.235 264)` on a Space Cadet ground.
  A navy that has character rather than mere darkness; continuous with the product HUD and site.
- **C — Amber** — warm, distinctive, and *rejected*: it collides directly with the
  `caution`/`warning` vocabulary, which in an operational surface is a safety defect, not a
  preference.

## Decision

Two supported accent directions: **Mono** and **Ultramarine**. Amber is dropped and must not
return as a brand accent while the status ladder owns warm hues.

Neutrals are built from two primitive ramps in
`packages/tokens/src/global/color/tailwind-palette.tokens.json`: `mono` (achromatic) and `ink`
(the near-black ground). `auterion-blue` sits alongside as the Ultramarine accent, and the
Auterion brand neutral is a low-chroma cyan-grey at ~200°, deliberately kept below the chroma of
advisory cyan (~185–215° at 0.14+) so the two never read as the same signal.

Both directions consume tokens. No hardcoded `oklch`/hex for brand colour anywhere (`AD-D-037`).

## Revoked when

The status ladder's hue assignments change such that a warm accent no longer collides, or brand
strategy ratifies a third direction with a specimen and a contrast table.
