---
'@auxiliary/css': minor
'@auxiliary/vue': patch
---

Consume the new token tiers:

- **StatusBadge outline, TelemetryValue, and CoordinateValue** color their
  status text/border/dot/glyph with the `*-emphasis` on-surface inks instead
  of the raw fills — the fills are only gated against their own foregrounds
  and fell to 1.4–2.9:1 as ink (worst: darknight nominal 1.41:1).
- **Dialog's scrim** is `bg-overlay` (the new always-dark black scrim) —
  `bg-background/70` contributed nothing in sunlight (white over white) and
  the inert-page signal rode entirely on backdrop-blur.
- theme.css bridges the new roles into the Tailwind color namespace
  (`--color-*-emphasis`, `--color-overlay`).
