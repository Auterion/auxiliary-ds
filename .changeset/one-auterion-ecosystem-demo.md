---
'@auxiliary/demo': patch
---

demo(eco): "One Auterion" — the ecosystem layer as a working specimen sheet

A new demo surface arguing the seam **between** products rather than any one of
them: an ecosystem launcher, and a shared identity bar rendered across nine
surfaces at once — Suite, Control, Simulation, Nemyx, Device, Insights, Deploy,
Store and Docs.

The claim under test is that the layer costs **one component and one table**,
because the four themes and two registers it needs are already built. So the
page is built that way and cannot cheat: `eco/surfaces.ts` is the only place a
surface's theme, register, context level or stack is stated, and every panel —
tiles, bars, spec ledger, object resolver — reads from it. The six bars are six
instances of `IdentityBar.vue`, each inside its own `[data-theme]` /
`[data-register]` subtree.

- **The control is the argument.** Both axes default to `Declared`, where every
  specimen renders as it would ship — four themes and two densities on screen
  together. Force either and all six re-resolve while the bar's structure does
  not move.
- **No product hues.** Five accent colours with no ramp, no contrast gate and no
  token would collide with a status ladder that already owns five meanings, and
  would fail in both operational themes. Identity is carried by a drawn glyph
  per surface instead, so it survives `darknight` (no blue at any strength) and
  `sunlight` (low end collapsed).
- **The bar height is a ladder, not 46px.** It steps off `--control-height-lg`,
  so `operational` makes it denser; the spec panel measures the two values off
  live probes rather than asserting them.
- **The object grammar is live.** `auterion:<org>:<kind>:<id>`, with the app grid
  as a resolver: surfaces that cannot open the held object grey out and say why.
  Nine surfaces × five object kinds, and the best evidence the contract earns its
  keep is that a vehicle group in Suite and a rollout ring in Deploy are the same
  set, maintained today as two lists by two people.
- **Simulation declares another surface's axes on purpose** — Control's
  dark/operational pair, because a rehearsal surface that does not look like the
  thing it rehearses is not a rehearsal. It is the one row in the table whose
  theme and register are an argument rather than a description.
- **Every count on the page is derived**, including the ones in headings and
  prose. Adding three surfaces changed nine sentences and no source line that
  states a number.

Specimens are drawn in design-system semantic tokens only — never the page-local
`--dk-*` ladders — because a specimen drawn in page variables re-resolves on the
page's axis and quietly answers a different question. All 48 rendered contrast
pairs (12 pairs × 4 themes) were measured, not assumed.

Also here:

- `apps/demo/test/eco-object-grammar.test.ts` — a drift gate on the table. The
  resolver renders generated prose, so a bad row does not look like a bad row,
  it looks like a sentence ("Opens as a this airframe.").
- Fixes a missing semicolon in `brand/Brand.vue`'s scoped style that broke
  `vite build` for the whole demo app.
