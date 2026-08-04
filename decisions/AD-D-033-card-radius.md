---
id: AD-D-033
date: 2026-06-06
title: Cards and panels are `rounded-xl` system-wide
status: ratified
owner: Yasen
ratified_by: ""
---

## Context

The demo had drifted into two radii for the same idea: `rounded-xl` on Suite and OS surfaces,
`rounded-2xl` on Web and AMC glass. Two radii for one concept reads as drift, not as design — it is
the kind of inconsistency a viewer registers without being able to name.

Migrated from `DECISIONS.md` (2026-06-06 entry).

## Options

- **A — one radius (`rounded-xl`, 12px) for all card and panel surfaces**, with glass allowed its
  own distinct value — because glass is a different idiom, not a different-sized card.
- **B — one radius for absolutely everything including glass** — maximally consistent, and it
  erases a distinction that is doing real work in the AMC overlay language.
- **C — leave both** — no work, permanent low-grade drift.

## Decision

All card and panel surfaces are `rounded-xl` (12px): every `ix-panel`, card, popover, and bordered
container.

AMC glass overlays may use `rounded-2xl` (16px) as a **distinct idiom** — glass is not a card.

Out of scope: pill-shaped controls (nav toggles, badges), which use `full`.

Radius tightens automatically in the operational register (`AD-D-020`); never hard-code a pixel
radius to achieve that.

## Revoked when

The direction ratified in `AD-D-013` calls for a different radius language — the Anno 1965
challenger, for instance, is a zero-radius proposition.
