---
id: AD-D-022
date: 2026-07-29
title: Figma mirrors code; reads are report-only
status: ratified
owner: Yasen
ratified_by: ""
---

## Context

A design system maintained by one person cannot survive two sources of truth. The moment Figma can
write back into the token source, every value has two possible origins and reconciling them becomes
a standing tax. But refusing to *read* Figma is also wrong — drift between the file and the
contract is real information, and discovering it by eye does not scale.

The distinction that makes both true is **application**, not observation. Back-filled from
`README.md:28-33`; the read path landed in `75f7b7c` (2026-07-29).

## Options

- **A — one-way writes, read-only drift reporting** — Figma consumes tokens; a reader reports how a
  file has diverged, and a human moves anything worth keeping back through the normal gates.
- **B — full round-trip sync** — designers edit variables in Figma and changes flow back. Two
  sources of truth; the failure mode is silent and arrives during a release.
- **C — write-only, no reads at all** — safest and blind. Drift accumulates unobserved until
  someone builds a screen against a stale variable.

## Decision

**Writes flow code → Figma only.** `@auxiliary/figma-sync` pushes three Variable collections
(`Global`, `Theme`, `Component`) plus Effect and Text Styles, and separately pushes component
recipes. It is idempotent and atomic.

**Reads are permitted and report-only.** `pnpm figma:diff` reports how a Figma file has drifted
from the token contract. The report is a worklist for a human, never a patch. **No tool writes into
`packages/tokens/src` from Figma**, and nobody edits a synced variable in Figma by hand.

Exploration tooling — Figma, Paper, Magic Path — enters the system the same way: by being rebuilt
in code and ratified with a log entry. Never by import.

## Revoked when

Never, while the system has one maintainer. This is the load-bearing constraint that makes that
possible.
