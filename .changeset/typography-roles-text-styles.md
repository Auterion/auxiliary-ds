---
'@auxiliary/tokens': minor
'@auxiliary/figma-sync': minor
'@auxiliary/css': minor
---

Composite typography roles → Figma Text Styles. Adds a `type/*` token group
(DTCG `typography` composite) defining eight named roles — `caption`, `label`,
`body`, `body-lg`, `title`, `heading`, `display`, `display-marketing` — each
bundling family + size + weight + line-height + tracking as the single source of
truth. This activates the previously-unused role-named `leading/*` and
`tracking/*` primitives and resolves the old size/leading drift between tokens
and docs.

Roles split into two surface families (README Principle 4), mirroring the
`expressive` / `operational` register axis: `type/marketing/*` (display 60, h1 48,
h2 40, h3 30, lead 20, body 18, caption 14 — the large web/brand scale) and
`type/product/*` (display 32, heading 24, title 20, body-lg 18, body 16, label 14,
caption 12 — the denser operational ramp). This replaces the prior flat `type/*`
set and resolves the old 60-vs-32 display ambiguity.

The marketing headline voice is tuned toward **Neue Haas Grotesk**: a new
`font/display` family (`Inter Display` — the opsz display cut) on marketing
display/h1/h2/h3, **Medium** weight, and tight tracking (new `tracking/tighter`
−0.05em). `@auxiliary/css` `.font-display` pins `opsz 32` and a clean feature set
(keeps calt+liga); on the web `Inter Display` falls through to Inter Variable + the
optical-size axis. Product keeps Inter Text for legibility. Also folds in manual
Figma tweaks: product `title`→semibold, `body-lg`→medium, marketing
`caption`→semibold.

**Font re-vendored to the feature-complete official build.** The previously
vendored `@fontsource-variable/inter` (opsz subset) **strips Inter's `ssXX`/`cvXX`
stylistic sets + character variants** — verified no-ops on the web (cv05/cv12/cv13
produced zero width change). Replaced with the official `InterVariable.woff2`
(single full-charset file, opsz+wght + every OpenType feature, SIL OFL-1.1).
`scripts/sync-fonts.mjs` now fetches the official build for Inter (Geist Mono stays
on Fontsource); the runtime stays air-gapped (vendored locally, gate green). This
makes squared/disambiguation/etc. actually renderable on the web — they were only
working in Figma before.

`figma-native.json` now emits a resolved `textStyles[]` block (composites are no
longer mis-emitted as variables), and `figma-sync` creates Figma **Text Styles**
grouped under `Type/Marketing/*` and `Type/Product/*` — mirroring how `shadow` →
Effect Styles. The `niceName` helper preserves `/` as Figma style-group separators.
Font loading is resilient (per-role fallback, failures recorded not thrown) and each
style's font size is bound to its `Primitives/text/*` variable. The push summary
gains a `textStyles` field.
