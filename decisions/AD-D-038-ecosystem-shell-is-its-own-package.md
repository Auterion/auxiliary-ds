---
id: AD-D-038
date: 2026-08-28
title: The ecosystem shell ships as `@auxiliary/shell`, its own package
status: proposed
owner: Yasen
ratified_by: ""
---

## Context

The ecosystem demo (`apps/demo/src/eco/`) argues that five products can be made to read as one
system for the price of one component and one table, and it builds that component locally:
`IdentityBar.vue`, `LauncherFrame.vue`, `SurfaceGlyph.vue`, `AuterionMark.vue` and the `Surface`
declaration type in `surfaces.ts`. Step 2 of the build plan the page states is "`@auxiliary/shell`
— the smallest thing all five surfaces can adopt".

There is a standing decision that pulls the other way and must be addressed rather than ignored:
ROADMAP §6.4 resolved the blocks-home question **docs-first**, with "no `@auxiliary/blocks`
package yet" and app-shell extraction merely flagged as a candidate (`ROADMAP.md:338,839`). That
resolution is correct for what it covers, and this entry does not reopen it.

The distinction is what the two things are. The §6.4 app-shell is **intra-product layout** — top
bar, collapsible sidebar, content region — composed by one product for its own screens, which is
exactly the kind of thing a recipe plus documentation serves well. The ecosystem shell is
**inter-product chrome**: the strip that is identical across Suite, Control, Nemyx, the device app
and the launcher, whose entire value is that it is *the same artifact* in all of them. A recipe
copied into five repos is five artifacts that drift; that is the failure the page exists to argue
against, and documentation cannot prevent it.

There is also a hard architectural reason it cannot live in `packages/vue`. The identity bar
renders the Auterion mark and product glyphs, so it depends on `@auxiliary/brand` and
`@auxiliary/icons`. `@auxiliary/vue` depends on neither — its dependencies are `@auxiliary/css`,
`@auxiliary/tokens` and `reka-ui` (`packages/vue/package.json`). Adding the bar there would make
`vue → brand`, inverting the layered flow that `CLAUDE.md` states and that `brand` (which depends
only on `tokens`) currently respects.

## Options

- **A — a new leaf package `@auxiliary/shell`, downstream of `vue`, `brand`, `icons` and `css`.**
  Keeps the dependency flow acyclic, gives the cross-product chrome one home and one version, and
  leaves `vue` a primitive library.
- **B — put the bar in `@auxiliary/vue`.** One less package, and it forces `vue → brand`, making
  the primitive library depend on the brand layer for one component that most consumers of `vue`
  will never render.
- **C — document it as a pattern, like §6.4's app-shell.** Consistent with the blocks decision, and
  it makes the one component whose value is being singular into five copies.
- **D — keep it in `apps/demo` until a product asks for it.** Honest about demand, and it means the
  first adopter's migration begins with an extraction, which is when shortcuts get taken.

## Decision

Adopt **A**. Add `packages/shell` → `@auxiliary/shell`, a Vue package sitting downstream of
`@auxiliary/vue`, `@auxiliary/brand`, `@auxiliary/icons` and `@auxiliary/css`, with `vue` as a peer
dependency — the same shape as every other Vue package here.

**Scope, stated so it can be enforced:** the package owns the identity strip and the things that
strip needs, and nothing below it.

- **In:** `IdentityBar` (mark · AUTERION · surface · app grid · tabs · org · account — the app
  grid, the org readout and the account control are **slots of its recipe**, not separate
  components; splitting them would give four exports that may only ever be assembled one way),
  `Launcher`, `SurfaceGlyph`, and the `Surface` declaration table that all of them read.
- **Out:** page layout, sidebars, content regions, panels, routing, anything a product renders
  *below* the bar. Those stay with the product, or with §6.4's docs-first app-shell pattern.

The boundary is the point, and the demo already states why: "the moment it reaches further down,
product teams will refuse it and they will be right"
(`apps/demo/src/eco/EcoStudio.vue`). The four invariants the page lists — fixed element order,
height derived from `--control-height-lg`, semantic tokens only, renders the tabs it is handed —
are the package's contract and are gated by its tests.

`apps/demo/src/eco/` becomes a **consumer** of the package rather than the place it is defined, so
the specimen sheet keeps proving the claim against the shipped artifact.

The coarse-pointer floor applies to hit areas and not to readouts. `--target-floor` raises the
app grid, the account control and the bar itself; the org chip is sized by its padding and
line-height, because a 44px floor around something nobody can press produces a box holding one
10px word. When the org becomes the switcher the bar deserves, it gains a height token and takes
the floor with it that same day.

## Revoked when

A second cross-product chrome element appears that does not belong to the identity strip (a global
command palette, a cross-surface notification centre), at which point the package is either renamed
to cover the ecosystem layer generally, or split.
