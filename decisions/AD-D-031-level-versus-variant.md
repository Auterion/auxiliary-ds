---
id: AD-D-031
date: 2026-05-28
title: `level` is severity; `variant` is treatment
status: ratified
owner: Yasen
ratified_by: ""
---

## Context

Early components used three different prop names for "which look" — `intent` on Button, `variant`
on Badge, `level` on the status components. Collapsing them all into one name would have been
tidier and wrong: severity and design treatment are genuinely different axes, and conflating them
is how a decorative component ends up borrowing a status hue.

Back-filled from the decision locked with the maintainer on 2026-05-28 (`ROADMAP.md:29-31`).

## Options

- **A — two names for two axes** — `variant` everywhere for treatment, `level` retained *only*
  where severity is the semantic.
- **B — one name (`variant`) for everything** — one thing to remember, and it makes
  `variant="alarm"` sit in the same namespace as `variant="outline"`, which invites exactly the
  misuse `AD-D-014` forbids.
- **C — leave the three names as they were** — no migration cost, permanent ambiguity.

## Decision

**`variant` is design treatment** and is the standard name on every component.
**`level` is the reserved operational severity ladder** — `alarm | warning | caution | advisory |
nominal` — and appears only on the status family (`StatusBadge`, `AlertBanner`, and the
annunciator/alert components that followed).

Never conflate them. Never expose a status hue through `variant`. `Button.intent` was renamed to
`Button.variant` as a clean pre-1.0 break (`AD-D-035`).

## Revoked when

Never, while the status ladder is reserved (`AD-D-014`).
