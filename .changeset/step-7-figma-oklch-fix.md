---
"@auxiliary/tokens": patch
"@auxiliary/figma-sync": patch
---

**Step 7 — Figma import: OKLCH → hex conversion + workflow doc.**

### The bug

`packages/tokens/dist/figma.tokens.json` contained CSS `oklch(...)` function values. The DTCG Design Token Manager Figma plugin (and Figma Variables in general) can't parse modern color-space functions, so it silently fell back to `#FFFFFF` for every color. Designers importing the file got all-white variables.

### The fix

`packages/tokens/build.mjs`:

- Added `culori` (~14 KB devDep) for sRGB color conversion
- New helper `toFigmaColor()` detects `oklch(…)` / `oklab(…)` / `lab(…)` / `lch(…)` strings, converts to hex via `culori.formatHex`
- Applied **only inside the `json/dtcg` format** (the figma artifact)
- Other artifacts — `tailwind-v4.css`, `tokens.css`, `tokens.ts` — keep the OKLCH literals so browsers render in the perceptual color space

After the fix:

- `figma.tokens.json`: zero OKLCH strings (sample values: `#ef363c` red 500, `#f7791a` orange 500, `#f6b900` yellow 500, etc.)
- `tailwind-v4.css` + `tokens.css`: 188 OKLCH literals each, untouched

### Also: skip `cubicBezier` + `shadow` types in the figma artifact

Two more plugin warnings surfaced after the OKLCH fix:

- `ease/out` and `ease/in-out` → "Mismatched variable resolved type" (Figma Variables don't have a cubicBezier type)
- `shadow/{sm,md,lg}` → "Invalid shadow format" (Figma Variables don't model composite multi-layer shadows)

Both types are not usable as Figma Variables — designers apply easing via Smart Animate and shadows via the Effect panel, neither binds to variables. Added a `FIGMA_SKIP_TYPES` set (`['cubicBezier', 'shadow']`) that excludes these from the `json/dtcg` format only. They remain in `tailwind-v4.css` / `tokens.css` / `tokens.ts` where code actually consumes them.

### The doc

`packages/figma-sync/README.md` replaces the stub with the verified workflow:

- **Primary path:** DTCG Design Token Manager plugin → Import → Single file → `packages/tokens/dist/figma.tokens.json`
- What gets through correctly (hex colors, dimensions, numbers, resolved references)
- What does NOT (themes as Figma Modes — needs Enterprise REST API)
- Round-trip verification flow
- Alternative: Tokens Studio (documented as the escape hatch, not the recommended path — bi-directional sync is a footgun for our code-is-source-of-truth model)
- Future: Variables REST API + GitHub Action when Auterion goes Enterprise
