---
'@auxiliary/vue': minor
'@auxiliary/css': minor
---

**Breaking (pre-1.0):** one canonical type for the reserved severity ladder.
`StatusKind` is renamed `StatusLevel` at its definition (status-glyphs) and
exported once from `@auxiliary/vue`; the per-component aliases
(`StatusBadge`'s `StatusLevel` re-export and `AlertBanner`'s `AlertLevel`)
are gone, and the hand-retyped unions in Progress, TelemetryValue, and
CoordinateValue now use it. StatusBadge derives its `variant`/`size` prop
types from the recipe's `StatusBadgeVariants` like every other recipe-backed
component. `@auxiliary/css` drops two dead exports: `SizeSm` (unused) and
`DialogVariants` (the dialog recipe has no variants, so the type was `{}`).
