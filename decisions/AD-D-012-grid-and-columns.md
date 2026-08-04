---
id: AD-D-012
date: 2026-08-03
title: Adopt a 4px spatial base; the column system is deliberately unresolved
status: proposed
owner: Yasen
ratified_by: ""
---

## Context

Half of this decision has been shipping since the beginning and half of it does not exist. The
spacing scale is real, documented, and enforced. The **column system is unstated anywhere in the
repo** — no grid tokens, no container widths, no column count. Layout on the demo surfaces is
composed ad hoc.

That gap is not an oversight to patch quickly: the column system is precisely where the direction
candidates differ (`AD-D-013`). A Gerstner field grid and a plain 12-column grid are different
propositions, and picking one before the direction is ratified would settle the direction by
accident.

## Options

For the column system specifically:

- **A — Gerstner field grid** — a field of small units combined into varied column sets; the Anno
  1965 candidate's native structure. High expressive range, more discipline required.
- **B — plain 12-column** — universally understood, trivially expressible in Tailwind and as a
  Figma layout grid, and generic.
- **C — no column system; compose on the spacing scale alone** — the status quo. Works at
  component scale, provides nothing at page scale, which is why marketing surfaces drift.

## Decision

**Ratified now — the spatial base.** A 4px base. `global.spacing.*` keys are Tailwind step indices
on that base (`spacing.4` = 16px), which is factual in GTC's sense: computable from the key without
a lookup. Two off-grid values exist and are documented at their definition with their sole consumer
and the reason retiring them is a visual change — `spacing.0_75` (GuardedAction progress fill) and
`spacing.9` (Switch track, deliberately *not* aliased to `control.height.md` so it does not shrink
under the operational register).

Breakpoints are `sm 40rem · md 48rem · lg 64rem · xl 80rem · 2xl 96rem`.

**Deferred — the column system.** Blocked on `AD-D-013`. Whatever wins must be expressible both as
CSS and as a Figma layout grid; a column system that cannot round-trip to Figma fails `AD-D-022`.
This entry is superseded by a follow-up once the direction review completes.

## Revoked when

`AD-D-013` ratifies, at which point the column half is written and this entry is superseded.
