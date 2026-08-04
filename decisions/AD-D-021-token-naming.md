---
id: AD-D-021
date: 2026-08-03
title: Emit tier-stripped, role-based custom-property names
status: ratified
owner: Yasen
ratified_by: ""
---

## Context

Token source is organised by tier (`global/`, `theme/`, `register/`, `component/` — `AD-D-034`),
but the tier is an authoring concern, not a consumption concern. A consumer writing a component
does not care which tier `--card-foreground` came from; they care what role it plays. Emitting the
tier into the name would make every consumer restate the architecture, and would make moving a
token between tiers a breaking rename for no semantic reason.

Back-filled. The convention has shipped since the token package existed; the do/don't guidance in
`apps/docs/foundations/tokens.md` is what makes it reviewable.

## Options

- **A — tier-stripped, role-based** (`--spacing-4`, `--card-foreground`) — short, readable at the
  call site, survives a token moving tiers.
- **B — fully qualified** (`--global-spacing-4`, `--theme-card-foreground`) — self-documenting, and
  turns every refactor into a breaking change across every consumer.
- **C — descriptive-value names** (`--color-text-secondary-default`, `--blue-500` as a role) —
  encodes appearance rather than role, so it lies the moment a theme re-resolves it.

## Decision

Emitted CSS custom-property names are **tier-stripped**: `global.spacing.4` → `--spacing-4`,
`theme.card-foreground` → `--card-foreground`. Figma variable paths are stripped the same way, so
the two surfaces stay legible against each other.

Names state **role, not appearance**: `--muted-foreground`, never
`--color-text-secondary-default`; and never a name that describes the value (`--blue-500` as a
semantic role), since a theme switch would make it false. Do/don't pairs are published in
`apps/docs/foundations/tokens.md` under "Choosing a name" — that is what reviews cite.

Component tokens keep their component segment (`--component-card-footer-gap`) because that segment
*is* the role.

## Revoked when

Two tiers collide on a name that cannot be resolved by choosing a better role word.
