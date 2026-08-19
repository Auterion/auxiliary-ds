# @auxiliary/css

Tailwind v4 preset and framework-agnostic styling recipes for Auxiliary.

## Status

Scaffold only. Step 4 of the build plan lands:

- `theme.css` — imports `@auxiliary/tokens` and declares the `@theme` block, plus Inter Variable / Geist Mono font setup, the square-punctuation base feature set, and the slashed-zero `.tabular` default. `I/l/1` disambiguation is scoped to the operational register.
- `preset.css` — Tailwind v4 preset entry with custom utilities and variants (focus ring, 44px min-target hook for future Mission-Critical surfaces).
- `recipes/` — `tailwind-variants` recipes for each primitive, framework-agnostic so future React / Svelte packages can consume the same source of variant truth.

## Why recipes live here

Recipes do not live in `packages/vue`. Keeping them in CSS means a future `@auxiliary/react` or `@auxiliary/svelte` package consumes the same variant definitions without duplicating the logic.

## `component-schema.json` — the recipes, in tokens

A recipe says everything already, but it says it in Tailwind classes, so nothing except a
browser can read it. `component-schema.json` (generated, **committed**, exported as
`@auxiliary/css/schema`) states the same thing as token paths: for every component, every
variant combination, every slot — which token binds to which CSS property.

```jsonc
// button, variant=primary size=md
{
  "background-color": { "figma": "Theme/primary" },
  "border-radius":    { "figma": "Component/button/radius" },
  "padding-inline":   { "figma": "Component/button/padding-x", "mode": "md" }
}
```

Regenerate with `pnpm --filter @auxiliary/css schema` (the `build` script chains it).

**Nothing in the chain interprets a class**, which is what makes the artifact trustworthy:

```
tv() introspection  ->  which variant combinations exist   (tailwind-variants)
recipe invocation   ->  the merged class list per slot     (tailwind-merge applied)
Tailwind compiler   ->  the CSS those classes generate     (the real compiler)
scripts/figma-index ->  the Figma variable behind each var (derived from the tokens build)
```

Every link is the machinery the runtime uses, so the schema cannot describe a component
differently from how it renders. A `var()` that resolves to no token is a **build
failure**, not an omission.

Two consequences worth knowing:

- **The size variant lands on the Figma *mode* axis.** `padding-inline` binds
  `Component/button/padding-x` at mode `md`, not a separate `md` variable — which is what
  lets `@auxiliary/figma-sync` generate a component set that flips size coherently.
- **It is committed on purpose.** A recipe edit then shows up in review as a design diff
  ("button's fill moved from `Theme/primary` to `Theme/brand`") rather than a class-string
  diff. `test/component-schema.test.ts` fails when it goes stale.
