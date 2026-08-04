---
id: AD-D-036
date: 2026-08-03
title: No runtime network dependency, ever
status: ratified
owner: Yasen
ratified_by: ""
---

## Context

Defense deployments are frequently disconnected. A design system that pulls a webfont, an icon
sprite, or a telemetry-adjacent asset from a CDN at runtime works perfectly in the office and fails
in the field — and fails *quietly*, degrading to a fallback nobody has ever reviewed. This is
cheapest to lock as a principle before anything regresses it.

Back-filled from the cross-cutting section of `ROADMAP.md`. Mostly already true — icons are
build-baked SVG, tokens are static — which is precisely why asserting it now costs nothing.

## Options

- **A — assert air-gap-first in the build** — no runtime fetch, verified rather than intended.
- **B — document it as a guideline** — free, and the first convenient CDN link breaks it silently.

## Decision

Nothing Auxiliary ships may fetch over the network at runtime. No CDN fonts, no remote icon
sprites, no remote assets of any kind. Fonts are self-hosted (`AD-D-011`), icons are inlined into
the generated registry at build time, and the brand registry inlines its master SVGs the same way
so consumers ship no raw asset references.

This constrains `AD-D-011`: a typeface that cannot be self-hosted under Auterion's licence cannot
be adopted, regardless of how it performs in a specimen.

## Revoked when

Never, while Auterion ships to disconnected environments.
