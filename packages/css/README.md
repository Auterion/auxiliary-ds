# @auxiliary/css

Tailwind v4 preset and framework-agnostic styling recipes for Auxiliary.

## Status

Scaffold only. Step 4 of the build plan lands:

- `theme.css` — imports `@auxiliary/tokens` and declares the `@theme` block, plus Inter Variable / Geist Mono font setup, the square-punctuation base feature set, and the slashed-zero `.tabular` default. `I/l/1` disambiguation is scoped to the operational register.
- `preset.css` — Tailwind v4 preset entry with custom utilities and variants (focus ring, 44px min-target hook for future Mission-Critical surfaces).
- `recipes/` — `tailwind-variants` recipes for each primitive, framework-agnostic so future React / Svelte packages can consume the same source of variant truth.

## Why recipes live here

Recipes do not live in `packages/vue`. Keeping them in CSS means a future `@auxiliary/react` or `@auxiliary/svelte` package consumes the same variant definitions without duplicating the logic.
