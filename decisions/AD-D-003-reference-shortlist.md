---
id: AD-D-003
date: 2026-08-03
title: Fix the reference shortlist; everything else is admired, not adopted
status: proposed
owner: Yasen
ratified_by: ""
---

## Context

The repo has accumulated references without ever scoring them: nine research documents in
`.claude/docs/`, roughly thirty screenshots and scrapes at the root, and a further two dozen names
in `AD-2026-001` Appendix B. Accumulation is the failure mode — an unscored pile means every review
can reach for a different precedent, and "we should look at X" never resolves.

A shortlist also has a second job: it makes *rejection* durable. Without a written "admired, not
adopted" list, the same inspiration returns every quarter and is re-argued from scratch.

## Options

- **A — a fixed shortlist plus an explicit admired-not-adopted list** — references that shape the
  system are named and countable; everything else is named as *not* shaping it, with the reason.
- **B — a curated inspiration folder** — lower effort, and it preserves exactly the ambiguity the
  audit exists to remove: presence in a folder implies endorsement without ever stating it.
- **C — no list; judge case by case** — the status quo, which is why the pile exists.

## Decision

`references/README.md` is the audit. It holds four sections, and a reference sits in exactly one:

1. **Shortlist** — actively shapes the system; each entry names where it landed in code or in a
   ratified decision. Eight today: OpenBridge, MIL-STD-1472H, Swiss/NASA-JPL, the GTC model,
   Reka UI + shadcn architecture, Vercel Geist, Deck 07b + Console, Palantir Blueprint.
2. **Queued** — shortlisted for work that is scheduled but not started (Esri Calcite, NASA Open
   MCT, MIL-STD-2525E/APP-6(D), IEC 62288).
3. **Admired, not adopted** — with the reason it stays out. **Re-read before adding any new
   inspiration.**
4. **Not assessed** — listed somewhere but with no evidence in this repo. Scoring these would mean
   inventing findings, which the roster's unknowns protocol forbids.

Scoring is on five axes: *trusted · mission-critical · precise · buildable in Vue+Tailwind ·
serves both registers*. Failing **buildable** is disqualifying for adoption but not for admiration.

**Reference assets stay out of the repo.** Screenshots, scrapes and `.pen` boards remain root-level
and gitignored — the audit is the committed artifact, not the material.

New references are admitted the way new devices are: a rendered specimen plus a written grant
naming where it is allowed and what revokes it. Unused entries are retired quarterly.

## Revoked when

The shortlist grows past ~10 without something being retired — that is the signal that
accumulation has restarted.
