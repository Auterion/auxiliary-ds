---
id: AD-D-035
date: 2026-05-26
title: Pre-1.0 — clean breaks, never deprecation shims
status: ratified
owner: Yasen
ratified_by: ""
---

## Context

The system has no external consumers yet. Carrying alias layers and deprecation shims "just in
case" would preserve mistakes at exactly the moment they are cheapest to delete, and a solo
maintainer pays that carrying cost forever.

Back-filled from `README.md:7`.

## Options

- **A — clean breaks until the first tagged release** — mistakes get deleted rather than
  accumulated.
- **B — semver discipline from day one** — professional-looking, and it freezes early guesses into
  permanent API surface.

## Decision

Until the first tagged release, APIs and tokens change **without notice** and without
back-compatibility shims. Prefer a clean rename to a deprecation layer. Every breaking change ships
a changeset that names the break (CI enforces `changeset status --since=origin/main` on every PR).

Non-obvious rationale for a break belongs in this log, not in a code comment.

After 1.0: semver, and breaking token renames ship with a codemod or an alias layer.

## Revoked when

The first tagged release. At that point this entry is superseded by a versioning policy entry.
