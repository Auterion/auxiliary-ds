---
id: AD-D-034
date: 2026-07-29
title: Adopt the GTC token model, with four groups
status: ratified
owner: Yasen
ratified_by: ""
---

## Context

The conventional three-tier model (primitive → semantic → component) answers "how abstract is this
value" but not the question that actually matters when someone proposes a change: *where may this
be changed, and what does changing it move?* The GTC model (buninux.com/design-tokens) organises
tokens by that question instead. Auxiliary also carries a second orthogonal non-colour axis
(`AD-D-020`) that canonical GTC does not model.

Back-filled from commit `92e6c7d` (2026-07-29).

## Options

- **A — GTC with a fourth group for the register axis** — keeps GTC's question, and gives the
  register axis a home rather than smuggling it into theme.
- **B — canonical three-group GTC** — closer to the source, and it would force register overrides
  into the theme tier, breaking the orthogonality rule the whole model rests on.
- **C — stay on primitive/semantic/component** — no migration, and the recurring "which tier does
  this belong in" argument never resolves because the tiers answer the wrong question.

## Decision

`packages/tokens/src` is organised into four groups:

| Directory | Carries |
|---|---|
| `global/` | the value layer — fixed, axis-free, self-contained |
| `theme/` | everything `[data-theme]` re-resolves — **colour only**, one file per theme |
| `register/` | everything `[data-register]` re-resolves — control height, radius, duration |
| `component/` | per-component **structure** — size, padding, gap, radius, icon size |

Rules that are enforced rather than conventional:

- **Component tokens are structural only** — never colour, never typography. Colour lives in
  `theme/` so it can re-resolve; a colour frozen into a component token would survive a theme
  switch, which is the bug.
- **Component tokens emit as `var()` references**, unlike every other tier, and each
  `[data-register]` block re-emits the ones depending on a var it shadows. Without that, a subtree
  setting `[data-register]` keeps the already-substituted `:root` value.
  `packages/tokens/test/component-flex.test.ts` guards both halves.
- **`packages/tokens/gtc-validate.mjs` runs 13 rules over the raw source**, before Style Dictionary
  hydration, so a dangling reference or a cycle fails with a token path instead of an SD stack
  trace.

Four documented divergences from canonical GTC are recorded in the validator's header. They are
deliberate; read it before "fixing" one.

## Revoked when

The GTC rulebook changes in a way the divergences cannot absorb, or the register axis is retired.
