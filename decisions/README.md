# Decision log

The constitution. Every settled design or architecture decision gets an entry here with an ID,
a date, the options considered, and the choice stated so a stranger could enforce it.

**A decision not in this log does not exist.** If you find yourself re-litigating something,
either it has an entry (read it) or it doesn't (write one).

## Rules

1. **Immutable once ratified.** Never edit a ratified entry's Decision. To change it, write a new
   entry and set the old one's status to `superseded by AD-D-###`.
2. **Agents propose, the owner decides.** Subagents may draft entries at `proposed`; only Yasen
   moves an entry to `ratified`. A proposal that contradicts a ratified entry must name it and
   argue for supersession.
3. **Cite the ID.** Reviews, PRs, and agent output reference `AD-D-###` rather than restating the
   rationale.
4. **Ground every claim.** Entries cite `path:line` for anything asserted about the codebase. See
   the evidence ladder in `design-team/roster.md`.

## Format

One file per entry: `AD-D-###-kebab-slug.md`. YAML frontmatter carries the machine-checked fields;
the body carries the prose sections.

```markdown
---
id: AD-D-###
date: YYYY-MM-DD
title: One line, imperative
status: proposed | ratified | superseded
superseded_by: AD-D-###   # only when status is superseded
owner: Yasen
ratified_by: ""            # sign-off for gate-level entries; empty until signed
---

## Context
Two to four sentences — why now, what breaks without it.

## Options
- **A** — one-line trade-off
- **B** — one-line trade-off

## Decision
The choice, stated so a stranger could enforce it.

## Revoked when
The condition that reopens this decision.
```

This is the `AD-2026-001` Appendix C template with its head fields moved into frontmatter so
`packages/tokens`-style drift gating can parse them. Field names and information content are
unchanged.

## Numbering

Blocks are reserved by subject so IDs stay legible as the log grows:

| Range | Subject |
|---|---|
| `001–009` | The system itself — name, success criteria, references |
| `010–019` | Visual language — colour, type, grid, direction, status ladder |
| `020–029` | Token architecture — axes, naming, the Figma loop |
| `030–039` | Engineering — stack, component contracts, release policy |

## Index

| ID | Title | Status | Date |
|---|---|---|---|
| [AD-D-001](AD-D-001-name-the-system-auxiliary.md) | Name the system Auxiliary | ratified | 2026-05-26 |
| [AD-D-002](AD-D-002-success-criteria.md) | Define what "world-class" means, testably | proposed | 2026-08-03 |
| [AD-D-003](AD-D-003-reference-shortlist.md) | Fix the reference shortlist; everything else is admired, not adopted | proposed | 2026-08-03 |
| [AD-D-010](AD-D-010-colour-neutrals-and-accents.md) | Build on mono/ink neutrals; accents are Mono and Ultramarine | ratified | 2026-06-07 |
| [AD-D-011](AD-D-011-typefaces.md) | Inter Variable + Geist Mono; display via the `opsz` axis | ratified | 2026-08-03 |
| [AD-D-012](AD-D-012-grid-and-columns.md) | Adopt a 4px spatial base with no fixed column system | proposed | 2026-08-03 |
| [AD-D-013](AD-D-013-visual-direction.md) | Direction: operational truth, expressed with precision | proposed | 2026-08-03 |
| [AD-D-014](AD-D-014-reserved-status-ladder.md) | The five-level status ladder is reserved and regulated | ratified | 2026-08-03 |
| [AD-D-015](AD-D-015-anchor-auterion-blue-on-the-shipped-blue.md) | Anchor `auterion-blue` on the blue the products already ship | proposed | 2026-08-28 |
| [AD-D-016](AD-D-016-nemyx-enters-the-brand-hierarchy.md) | Nemyx enters the brand hierarchy as a product under Auterion | proposed | 2026-08-28 |
| [AD-D-020](AD-D-020-theme-and-register-axes.md) | Two orthogonal axes: theme for colour, register for the rest | ratified | 2026-08-03 |
| [AD-D-021](AD-D-021-token-naming.md) | Emit tier-stripped, role-based custom-property names | ratified | 2026-08-03 |
| [AD-D-022](AD-D-022-figma-loop-policy.md) | Figma mirrors code; reads are report-only | ratified | 2026-07-29 |
| [AD-D-030](AD-D-030-component-stack.md) | Vue 3 + Tailwind v4 + Reka UI, styled by `tv()` recipes | ratified | 2026-05-27 |
| [AD-D-031](AD-D-031-level-versus-variant.md) | `level` is severity; `variant` is treatment | ratified | 2026-05-28 |
| [AD-D-032](AD-D-032-map-terrain-exemption.md) | Map terrain fills are the one sanctioned token exemption | ratified | 2026-06-06 |
| [AD-D-033](AD-D-033-card-radius.md) | Cards and panels are `rounded-xl` system-wide | ratified | 2026-06-06 |
| [AD-D-034](AD-D-034-gtc-token-model.md) | Adopt the GTC token model, with four groups | ratified | 2026-07-29 |
| [AD-D-035](AD-D-035-pre-1.0-clean-breaks.md) | Pre-1.0: clean breaks, never deprecation shims | ratified | 2026-05-26 |
| [AD-D-036](AD-D-036-air-gap-first.md) | No runtime network dependency, ever | ratified | 2026-08-03 |
| [AD-D-037](AD-D-037-brand-surfaces-use-tokens.md) | Brand surfaces reference token vars, not literals | ratified | 2026-06-07 |
| [AD-D-038](AD-D-038-ecosystem-shell-is-its-own-package.md) | The ecosystem shell ships as `@auxiliary/shell`, its own package | proposed | 2026-08-28 |

## Retroactive entries

Most of this log was back-filled on 2026-08-03 from decisions that were already true and already
enforced in code. Their `date` is the date the decision was *made* (from `DECISIONS.md`, the
roadmap, or the commit that landed it); `ratified_by` is empty because none of them ever went
through a sign-off — they were enforced by tests instead, which is why the system held together
without the log. The entries record what is; they do not re-open it.
