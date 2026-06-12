---
'@auxiliary/brand': minor
---

Land the first Auterion master artwork in the brand layer.

- **Masters** — the Auterion org **mark** and **horizontal lockup** ship as single-color
  `currentColor` SVG masters in `assets/auterion/`, wired into the manifest (`mono` + `inverse`)
  and inlined into the generated registry. `<Logo id="auterion" kind="mark" />` and
  `kind="lockup-horizontal"` now render real art across all four themes via `currentColor`;
  the `wordmark` / `lockup-stacked` kinds and the product marks remain `pending` placeholders.
- **App-icon / favicon export** — new `scripts/export-icons.mjs` (`pnpm --filter @auxiliary/brand
  export:icons`) rasterizes each available mark into the manifest's declared outputs (adaptive
  `favicon.svg`, multi-res `favicon.ico`, apple-touch / PWA / maskable PNGs, and a 1200×630
  `og-image.png` template) under `exports/<id>/`. Uses ImageMagick; skips cleanly without it.
- **Docs site** — the Auterion mark now sits in the navbar (rendered via `<Logo>` so it follows
  the themed text color) and the exported favicons + OG card are wired into VitePress.
