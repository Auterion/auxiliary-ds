---
id: AD-D-037
date: 2026-06-07
title: Brand surfaces reference token vars, not literals
status: ratified
owner: Yasen
ratified_by: ""
---

## Context

The brand page is the canonical showcase of the system, and it had drifted into three different
blues: Tailwind `blue.600`, stale draft values, and the actual token. The web Brand page's
`blueRamp` had `oklch(0.46 0.285 265)` where the token says `oklch(0.500 0.235 264)`. A showcase
that misquotes the system it showcases is worse than no showcase.

Migrated from `DECISIONS.md` (2026-06-07 entry).

## Options

- **A — brand surfaces consume CSS custom properties like everything else** — one blue, and it
  cannot drift.
- **B — allow literals on brand surfaces for authoring speed** — which is how the three blues
  happened.

## Decision

Brand surfaces — `apps/demo/src/brand/Brand.vue`, `apps/demo/src/web/pages/Brand.vue`, and any
successor — reference CSS custom properties (`var(--color-primitive-auterion-blue-*)`, `var(--brand)`)
rather than inline `oklch`/hex.

Two exemptions, both narrow: display-only hex **labels** in palette swatches (text about a colour,
not a colour), and SVG data layers (`AD-D-032`).

## Revoked when

Never. This is `AD-D-010` applied to the one surface most likely to break it.
