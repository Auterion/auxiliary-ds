---
'@auxiliary/vue': minor
---

Export `STATUS_LABELS`, `STATUS_GLYPHS` and `STATUS_RANK` from `@auxiliary/vue`.

Only the `StatusLevel` *type* was exported, so a consumer building its own status
cue — a bare dot in a dense table, a mark on a map, anything too small for a
`StatusBadge` pill — had no way to reach the reserved word or the
grayscale-distinct shape that `StatusBadge` and `AlertBanner` use. The
non-colour half of `AD-D-014` therefore stopped at the package boundary.

That is not hypothetical: the demo re-implemented the ladder as five parallel
CSS vocabularies and lost the glyph and the label on the way, shipping 35 status
dots carrying their level in hue alone — several of them wrapped in
`aria-hidden`, so the level was absent from the accessibility tree entirely.

Exporting the vocabulary means a consumer can satisfy the invariant with the
system's own words instead of re-typing them.
