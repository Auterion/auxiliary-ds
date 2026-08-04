---
id: AD-D-002
date: 2026-08-03
title: Define what "world-class" means, testably
status: proposed
owner: Yasen
ratified_by: ""
---

## Context

"World-class design system" is not a target — it is an adjective. Without a definition the system
cannot be said to be done, behind, or drifting, and every scope argument reopens from zero. This is
the entry that lets a gate be *passed* rather than merely reached.

Gate-level: needs sign-off, not just an owner's decision.

## Options

- **A — outcome criteria, each one testable** — measured by whether a task completes, not by
  whether an artifact exists.
- **B — coverage criteria** (component count, docs page count, token count) — easy to measure and
  easy to game; a kitchen-sink library scores well and violates the restraint principle.
- **C — no formal criteria; rely on judgement** — how the last year went.

## Decision

Auxiliary is succeeding when all seven hold. Each is a test someone else could run.

1. **A new deck is buildable from templates in under two hours** — measured by doing it, from
   scratch, without writing CSS.
2. **A new product screen composes from existing components without new CSS.** If a screen needs
   bespoke CSS, that is either a missing component (log it) or a misuse (fix it).
3. **A token change propagates code → Figma in one command**, and `pnpm figma:diff` reports clean
   afterwards.
4. **Every component passes axe** in all four themes and both registers — `pnpm test` is the proof,
   not a spot check.
5. **Every approved colour pair meets its contrast floor**, published as a table and enforced as a
   test in `packages/tokens`.
6. **One person can maintain it.** Operationally: a full green gate (`lint`, `typecheck`, `test`,
   `build`) runs unattended, and no generated artifact can drift without CI failing.
7. **Every load-bearing choice has an `AD-D-###` entry.** A settled fact in
   `design-team/roster.md` with no corresponding entry is a defect in this log.

Criteria 4, 5, 6 and 7 are gated in CI today. Criteria 1, 2 and 3 are exercised by hand and belong
in the Phase-4 proof pass.

## Revoked when

A criterion is met permanently and stops discriminating, or the system acquires external consumers
and needs adoption criteria alongside these.
