---
'@auxiliary/brand': minor
---

Add `@auxiliary/brand` — the brand-asset layer. Ships the org + product (Mission Control,
AuterionSuite, AuterionOS) marks/wordmarks/lockups across four kinds × three tones, a
machine-readable usage manifest (`brand.manifest.json`: clearspace, min-size, tone-by-theme,
forbidden contexts) exposed via typed helpers (`resolveLogo`/`getLogo`/`toneForTheme`), and a
`<Logo>` component. Masters live in `assets/` and are inlined into a generated, drift-gated
registry by `scripts/sync.mjs` (mirrors the icon-registry pattern); until a master lands, a slot
renders a labelled placeholder so nothing fake ships. Docs gain a `foundations/brand` page.
App-icon export and an Auterion brand-color token are tracked as follow-ups in `ROADMAP.md`.
