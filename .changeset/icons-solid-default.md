---
'@auxiliary/icons': minor
---

`<Icon>` now defaults to the **solid** weight (was `regular`). Solid reads more
clearly at UI sizes and matches the operational, high-legibility character of the
system. The registry already ships solid path data for every Font Awesome glyph,
so this is purely a default change — pass `weight="regular" | "light" | "thin"`
to opt back out per icon. The missing-weight fallback now prefers solid too.
