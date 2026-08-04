---
id: AD-D-011
date: 2026-08-03
title: Inter Variable + Geist Mono; display via the `opsz` axis
status: ratified
owner: Yasen
ratified_by: ""
---

## Context

The system needs one family doing display through micro, plus a mono register for anything a human
reads as data — coordinates, IDs, telemetry. Licence cost is a real input for a company shipping
to air-gapped defense deployments, where a foundry's webfont CDN is not an option (`AD-D-036`).

Back-filled: this has been the shipped configuration since early in the build. The rationale for
the display decision was already written verbatim in
`packages/tokens/src/global/typography.tokens.json:10`; this entry is the missing log record, and
closes the "final typeface call" item in the `design-team/roster.md` unknowns list.

## Options

- **A — Inter Variable + Geist Mono** — free, variable, self-hostable, carries the `opsz` axis and
  the `ss07`/`ss08` square-punctuation sets. Already in the tokens.
- **B — a licensed grotesk** (Neue Haas Grotesk, Helvetica Now, or a foundry pick) — more
  distinctive, but adds per-seat licence cost, complicates air-gapped distribution, and none of
  the candidates offer a comparable variable optical-size axis.
- **C — Inter for UI plus a separate display family** — rejected on a technical fact: the
  standalone Inter Display binary does **not** carry `ss07`/`ss08`, and square punctuation is
  house-wide. A second family would silently drop the feature set at display sizes.

## Decision

`--font-sans` and `--font-display` are the **same stack** — `Inter Variable, Inter, system-ui,
sans-serif`. The display voice is reached through the `opsz` axis (`opsz 32` is equivalent to the
static Inter Display cut), never through a second family. `--font-mono` is
`Geist Mono, ui-monospace, SFMono-Regular, monospace`.

Any number that changes or aligns in a column uses `tabular-nums`. Type is applied through the
semantic roles (`caption`, `label`, `body`, `body-lg`, `title`, `heading`, `display`), never raw
sizes. The scale does not shrink in the operational register — density comes from spacing
(`AD-D-020`).

## Revoked when

Auterion buys a licence for a display family that carries a variable optical-size axis and a
square-punctuation feature set, and a specimen shows it beating Inter on both registers.
