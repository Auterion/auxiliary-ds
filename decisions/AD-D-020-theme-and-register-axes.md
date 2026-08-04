---
id: AD-D-020
date: 2026-08-03
title: Two orthogonal axes — theme for colour, register for the rest
status: ratified
owner: Yasen
ratified_by: ""
---

## Context

One token source has to serve marketing surfaces and ground-control stations. Those need different
density, radius, and motion — but *not* a different colour model, and not a different type scale.
Meanwhile the operational surfaces need colour treatments for daylight glare and for night
operations. If those two concerns share one axis, every new context doubles the matrix and the
system stops being maintainable by one person.

Back-filled. The axes have shipped since Phase 6 and their orthogonality is asserted by a build
gate plus a generated-CSS gate.

## Options

- **A — two axes: `[data-theme]` for colour, `[data-register]` for everything non-colour** —
  minimal, composable, and each axis has one testable rule.
- **B — three axes: `scheme × context × register`** (the `AD-2026-001` proposal) — expresses
  daylight and night as a separate dimension from light/dark. But two of its six cells are
  meaningless: `light + darknight` and `dark + sunlight` cannot both hold. It buys nothing the flat
  set doesn't, and costs a dimension of test matrix.
- **C — one axis of named themes carrying density too** — simplest to implement, and immediately
  wrong: switching to a dark theme would silently change control heights.

## Decision

**`[data-theme]` controls colour and nothing else.** Four values, flat rather than matrixed, because
the meaningful combinations of scheme and context are exactly four:

| | Standard | Operational context |
|---|---|---|
| Light | `light` | `sunlight` — glare-hardened, pure white ground / pure black ink for maximum contrast |
| Dark | `dark` | `darknight` — scotopic, pure black ground with an amber foreground to preserve night vision |

**`[data-register]` controls everything non-colour** — control height, radius, motion duration.
Two values: `expressive` (default) and `operational` (denser, tighter, calmer). Every operational
override is one rung down the corresponding global scale, expressed as an alias rather than a
literal, so a change to a global rung propagates.

The axes compose freely and must never overlap: register may not touch colour, theme may not touch
density. Components consume the resolved custom properties and do not know which theme or register
is active. `<Register>` in `@auxiliary/vue` does nothing but set the attribute.

## Revoked when

A surface appears that needs a colour context orthogonal to light/dark in a way the flat four
cannot express — at which point revisit option B with the two dead cells named.
