---
'@auxiliary/css': minor
---

Air-gap-first: self-host the webfonts. `theme.css` no longer pulls Inter + Geist
Mono from Google Fonts at runtime — the woff2 are vendored into the package
(`fonts/`, SIL OFL-1.1, latin/latin-ext/cyrillic/cyrillic-ext subsets) and
shipped in the tarball, so the design system renders correctly fully offline
instead of silently falling back to system fonts (which breaks `tabular-nums` /
mission-ID disambiguation). Geist's `@font-face` family is normalized to
`Geist Mono` to match the `--font-mono` token. Re-vendor with
`pnpm --filter @auxiliary/css fonts:sync`.

Also lands the air-gap gate (`@auxiliary/css` now runs a real Vitest test):
fails CI if a runtime CDN reference (`@import url(http…)`, external
`<link>`/`<script>`) reappears in any source CSS/Vue/HTML across the monorepo.
