---
id: AD-D-030
date: 2026-05-27
title: Vue 3 + Tailwind v4 + Reka UI, styled by `tv()` recipes
status: ratified
owner: Yasen
ratified_by: ""
---

## Context

Auterion's product surfaces are Vue. The system therefore ships Vue first, but the tokens must stay
framework-agnostic (`packages/tokens` carries no Vue, Tailwind, or React specifics) so another
runtime can follow without a rewrite. The open question was what to build the components *on* —
accessibility primitives are the part a solo maintainer cannot credibly write from scratch.

Back-filled from the stack rationale in `.claude/docs/auxiliary-ds-2026-build-plan-research.md`,
realised across Phases 1–3.

## Options

- **A — Reka UI as the headless/a11y layer** — the successor to Radix Vue, and what shadcn-vue's
  registry migrated to. Keyboard and ARIA behaviour is maintained upstream by people who do only
  that.
- **B — hand-rolled primitives** — total control, and a standing accessibility liability. Dialog
  focus management alone is a project.
- **C — a full component library** (Vuetify, PrimeVue) — fastest start, and it brings its own
  design language, which is the one thing the system exists to own.

## Decision

The stack is **Vue 3 + Tailwind v4 + Reka UI**, in a pnpm + Turborepo monorepo laid out
`tokens → css → vue → docs`, with `icons`, `viz`, `brand`, and `figma-sync` hanging off it.

shadcn's component anatomy and variant-API style are an **architectural reference**, ported to Vue
idioms and re-tokened. Never imported as a runtime dependency.

Styling is by **recipe, not by hand**: components compose classes with `cn()` from
`@auxiliary/css/utils` and pull typed variants from a `tv()` recipe in `@auxiliary/css/recipes`.
No hand-rolled Tailwind class strings in a `.vue` file, and no component-local variant vocabulary.
A component's geometry lives in a component token consumed as
`gap-(--component-card-footer-gap)`, not as a bare `gap-2` — gated by
`packages/css/test/no-bare-scale-utilities.test.ts`, because a bare utility renders fine and so
fails nothing on its own.

Every component ships an axe test via the shared runner in `packages/vue/src/test-utils/a11y.ts`,
or it does not ship.

## Revoked when

Reka UI is abandoned upstream, or Auterion's product surfaces move off Vue.
