---
'@auxiliary/shell': minor
'@auxiliary/tokens': minor
'@auxiliary/css': minor
'@auxiliary/demo': minor
---

shell: the ecosystem layer ships as a package

New `@auxiliary/shell` — the chrome that is identical across every Auterion
surface, and nothing else. It sits downstream of `vue`, `brand`, `icons` and
`css`, which is also why it cannot live in `@auxiliary/vue`: the bar renders the
Auterion mark and per-surface glyphs, so it depends on `brand` and `icons`, and
`vue` depends on neither. Putting it there would invert the layered flow.

This does **not** reopen ROADMAP §6.4's docs-first blocks decision. That covers
*intra-product* layout — a top bar and sidebar a product composes for its own
screens, which a recipe plus docs serves well. This is *inter-product* chrome
whose whole value is being the **same artifact** in five products; a recipe
copied into five repos is five artifacts that drift. See `AD-D-038` (proposed).

**Exports**

- `IdentityBar` — mark · AUTERION · / · SURFACE · apps · tabs · org · account.
  Fixed order, register-flexed height, semantic colour only, uncontrolled tab
  by default with `v-model:tab` for products that own routing.
- `Launcher` — every surface as a tile that declares the theme and register it
  will hand you, so moving between a light roomy Suite and a dark dense Control
  stops being a jolt.
- `SurfaceGlyph` — identity by silhouette, never by hue.
- `SURFACES` / `Surface` — the one surface declaration table the rest read.

**Scope boundary, stated so it can be enforced:** the package owns the identity
strip and what that strip needs. Page layout, sidebars, content regions, panels
and routing stay with the product. The moment a shared shell reaches further
down, product teams refuse it and they are right to.

**New token tiers and recipes:** `component.identity-bar.*` and
`component.launcher.*`; `identityBar` and `launcher` in `@auxiliary/css`. The
bar's height aliases `control.height.lg`, so `[data-register="operational"]`
takes it 48px → 44px, and `[data-input="coarse"]` composes the 44px touch floor
*over* that density. `theme.css` gains `@source` globs for the new package.

**The org chip is deliberately not floored.** It is a readout, not a control,
and `--target-floor` applied to something nobody can press produces a 44px box
holding one 10px word. It takes its size from padding and line-height instead.
If the org becomes the switcher the bar deserves, it gains a height token and
the floor with it.

27 tests, including axe on both components and gates on the bar's four
invariants and the surface table's shape.

**The ecosystem demo is now a consumer** rather than the place this is defined —
its local `IdentityBar`, `LauncherFrame`, `SurfaceGlyph` and `AuterionMark` are
deleted and ~360 lines of page-local CSS with them. That is the point: a
page-local copy of the bar would make every specimen on that page a drawing of
the claim rather than a test of it.
