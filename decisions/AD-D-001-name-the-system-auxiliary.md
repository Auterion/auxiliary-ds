---
id: AD-D-001
date: 2026-05-26
title: Name the system Auxiliary
status: ratified
owner: Yasen
ratified_by: ""
---

## Context

The design system needed a name that could carry a package scope, a docs site, and a repo without
reading as a product. Auterion's products already own the operational nouns — Mission Control,
Suite, AuterionOS, Skynode — so a name drawn from that vocabulary would compete with them.
Back-filled: the name has been in use since the initial commit (`e1b8dc4`, 2026-05-26).

## Options

- **A — Auxiliary** — a supporting system, not a product; neutral enough to serve marketing and
  operational surfaces alike; `@auxiliary/*` is clean as a scope.
- **B — a product-derived name** (e.g. "Skynode DS") — inherits recognition, but binds the system
  to one product line and violates "one library, many surfaces."
- **C — an Auterion-branded name** ("Auterion Design System") — accurate but unwieldy as a package
  scope, and offers nothing to say in a sentence.

## Decision

The system is **Auxiliary**. Packages publish under the `@auxiliary/*` scope; the repo is
`auxiliary-ds`. The name is deliberately subordinate: Auxiliary serves the products, it is not one.

## Revoked when

Auterion adopts a company-wide naming convention for internal platforms that this contradicts, or
the system is externalised as a product in its own right.
