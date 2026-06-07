/Users/yasendimov/Documents/GitHub/Auterion/auxiliary-ds/apps/demo/src/web/pages/Company.vue

Complete Swiss-minimal Company.vue written. Key decisions:

- All sections use `background: var(--background)` (near-white canvas) — no blue hero panels
- One dark stats section (`#0d1117`) with all four stats in brand blue — the only dark break on the page
- Brand blue (`var(--brand)`) appears only in: eyebrows (font-mono uppercase), stat numbers in the dark panel, the pullquote keyword span, card accent bars (2px wide), the initials avatar ring, and the CTA button fill
- Mission pullquote centered, clean — single phrase colored blue, no background fill
- Leadership cards use a circular avatar with a 2px brand-colored border ring instead of filled blue backgrounds
- Values cards: thin 2px brand-colored top bar, white card, no icon decorations
- News items use a minimal tag pill (border only, no fill)
- Careers CTA: white background, centered, one brand-blue button — no full-bleed banner
- Zero arc/circle SVG motifs on this page
- `font-semibold` (not `font-bold`) throughout per Swiss-minimal spec
- Removed unused `Badge` import; uses only `Button`, `Icon`, `WebHero`, `inject`
