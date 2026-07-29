# Auxiliary

Auterion's design system. Tokens, components, and patterns for the
products and surfaces we ship — built Vue-first on Tailwind v4, with
framework-agnostic tokens so other runtimes can follow.

**Status:** pre-1.0. APIs and tokens will change without notice until
the first tagged release. Do not depend on this in production yet.

## What's in here

This is a pnpm + Turborepo monorepo.

| Package | Purpose |
| --- | --- |
| `packages/tokens` | Design tokens (DTCG-spec JSON). Source of truth. |
| `packages/css` | Tailwind v4 preset and `@theme` exports. |
| `packages/vue` | Vue 3 components built on Reka UI. |
| `packages/icons` | Icon set. |
| `packages/viz` | Data-visualization: token-driven palettes + chart set. |
| `packages/brand` | Auterion logo/lockup components + brand manifest. |
| `packages/figma-sync` | Scripts that push tokens into Figma Variables. |
| `apps/docs` | VitePress documentation site. |
| `apps/demo` | Vite playground (demo surfaces across themes/registers). |

## Principles

1. **Code is the source of truth.** Tokens, components, and patterns
   live here first. Figma mirrors what ships in code, not the reverse.
   Figma may be **read** — `pnpm figma:diff` reports how a file has drifted
   from the token contract — but nothing applies that report automatically.
   The line is at *application*, not *observation*: a human moves a value
   into `packages/tokens`, through the normal gates.
2. **Tokens are framework-agnostic.** Vue today, anything tomorrow.
3. **Restraint over reach.** A small, opinionated system that fits
   Auterion's products, not a kitchen sink.
4. **One library, many surfaces.** Product UI, marketing site, and
   internal tools all consume the same tokens.

## Getting started

Requires Node 24+ and pnpm 11+.

\`\`\`bash
pnpm install
pnpm build
pnpm dev
\`\`\`

The docs site runs at `http://localhost:5173`.

## Repo layout

\`\`\`
auxiliary-ds/
├── packages/
│   ├── tokens/      # design tokens
│   ├── css/         # Tailwind v4 preset
│   ├── vue/         # Vue components
│   ├── icons/       # icon set
│   ├── viz/         # data-visualization charts
│   ├── brand/       # logo/lockup components
│   └── figma-sync/  # token → Figma scripts
├── apps/
│   ├── docs/        # VitePress docs site
│   └── demo/        # Vite playground
└── turbo.json
\`\`\`

## License

UNLICENSED. Proprietary to Auterion AG. Not for redistribution.
