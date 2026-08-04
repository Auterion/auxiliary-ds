---
id: AD-D-013
date: 2026-08-03
title: Direction — operational truth, expressed with precision
status: proposed
owner: Yasen
ratified_by: ""
---

## Context

The system has a visual language and has never ratified one. The thesis is written at
`apps/docs/foundations/visual-language.md` and applied consistently across six demo surfaces — but
it arrived by accretion rather than by competition, and the working branch is still called
`explore/mono-neutral`. An unratified direction is why "is this Auterion enough?" keeps being
re-argued from taste.

This entry stays `proposed` until the direction review completes. It is gate-level: it needs a
signature, and nothing downstream of it (the column system in `AD-D-012`, the deck templates,
the brand book) should be settled first.

## Options

- **A — the incumbent, mono-neutral** — *operational truth, expressed with precision.* Swiss /
  NASA-JPL restraint; neutral carries ~90% of every surface; accent marks one action; ornament that
  carries no meaning is refused. Already shipping and already specified.
- **B — "Anno 1965"** — Gerstner-derived field grid, zero radius, zero shadow, `steps(1)` motion.
  Mechanical Swiss modernism. Feedstock exists: Magic Path Deck System 07b, the `anno-1965` HTML,
  `.claude/docs/deck-07b-grammar.md`.
- **C — a synthesis** — 1965's mechanical grid discipline over the incumbent's operational density.
  The likely outcome, and it still has to be written as one named language, not two.

## Decision

*Pending the direction review.* Provisionally A, as documented in `visual-language.md`:

1. **Restraint over ornament** — nothing decorative that does not carry meaning.
2. **Neutral carries the surface**; accent marks the single most important action. If everything is
   accented, nothing is.
3. **Colour by role, never by hue** — and the status ladder is never borrowed (`AD-D-014`).
4. **Density is a property of the surface, not the component** — operational tightens via
   `data-register`, never by hand-picking smaller sizes.
5. **The type scale never shrinks for density.**
6. **One border before one shadow** — shadow only when something genuinely floats.
7. **Status is never colour-only.**

The review runs the incumbent against candidate B as coded specimens over one shared content set —
**built, at `apps/demo/src/direction/`** (demo → "Direction"). One `DirectionContent.vue` renders
five pieces (deck cover · section divider · data table · product screen · mobile view); the
challenger is a `[data-direction]` override layer over the same markup, so no candidate can win by
authoring better HTML. Scored against *trusted · mission-critical · precise* plus
buildable-in-Vue/Tailwind and serves-both-registers, in all four themes × both registers.

**The constraint that makes the exercise worth running:** the challenger must be expressible as a
token override plus a register value. If it cannot be, that is the finding — it means the system
cannot hold the language, and that is more important than which one wins.

### Buildability result (2026-08-03) — the finding, ahead of the review

Anno 1965 is **4 of 7** expressible as pure token overrides:

| Expressible | Not expressible |
| --- | --- |
| zero radius (`--radius-*`) | letterspaced uppercase — **no tracking or case tokens exist** |
| zero shadow (`--shadow-*`) | the Gerstner field grid — **no column system exists** (`AD-D-012`) |
| `steps(1)` motion (`--ease-*`) | display size correction — the type scale is not family-aware |
| mono display (`--font-display`) | |

The three failures are not three problems. They cluster on **two gaps**, and the larger one is the
column system `AD-D-012` already defers. That is the durable result: whichever direction wins, the
system needs a column vocabulary, and this is the evidence that the gap is load-bearing rather than
cosmetic.

One question is left open for the room rather than decided here: `--radius-full` is deliberately
*not* zeroed, so status badges stay pills inside a zero-radius language. Squaring them is one more
token override — a design call, not a buildability limit.

On ratification this entry records what the loser contributes (candidate B's field grid is the
live input to `AD-D-012`) and what is explicitly rejected.

## Revoked when

A surface appears that the ratified language cannot serve without violating one of its own
principles — reopened with a rendered specimen, per the quarterly device review.
