# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current state

The monorepo is fully scaffolded and building. The pnpm + Turborepo workspace, CI, and changesets release flow are all in place, and the component library has been built out across many merged steps. This is no longer a greenfield repo — when asked to implement something, extend the existing package rather than scaffolding from scratch.

Packages (all under the `@auxiliary/*` scope):

- `packages/tokens` — `@auxiliary/tokens`
- `packages/css` — `@auxiliary/css`
- `packages/vue` — `@auxiliary/vue`
- `packages/icons` — `@auxiliary/icons`
- `packages/figma-sync` — `@auxiliary/figma-sync` (parked — see its README)

Apps:

- `apps/docs` — `@auxiliary/docs`, VitePress docs at `http://localhost:5173`
- `apps/demo` — `@auxiliary/demo`, Vite playground at `http://localhost:5174`

## Architecture

Auxiliary is Auterion's design system, a **pnpm + Turborepo monorepo** built Vue-first on Tailwind v4, with framework-agnostic tokens.

Layered dependency flow (downstream packages depend on upstream ones):

```
tokens  →  css  →  vue  →  docs
                ↘  icons  ↗
         figma-sync (consumes tokens)
```

- `packages/tokens` — DTCG-spec JSON. **Source of truth.** Every other package downstream of tokens must derive from these, not redefine.
- `packages/css` — Tailwind v4 preset and `@theme` exports generated from tokens.
- `packages/vue` — Vue 3 components built on Reka UI, styled via the css preset.
- `packages/icons` — icon set, consumable by `vue` and downstream surfaces.
- `packages/figma-sync` — one-way push of tokens → Figma Variables. Code → Figma, never the reverse (see Principle 1 below).
- `apps/docs` — VitePress documentation site, runs at `http://localhost:5173`.

### Load-bearing principles (from README)

These are architectural constraints, not style preferences:

1. **Code is the source of truth.** Figma mirrors code. Do not introduce sync paths that flow Figma → code.
2. **Tokens are framework-agnostic.** Keep `packages/tokens` free of Vue/React/Tailwind specifics — runtime adapters live in their own packages.
3. **Restraint over reach.** Prefer not adding a component over adding a marginal one. This is not a kitchen-sink library.
4. **One library, many surfaces.** Tokens must serve product UI, marketing, and internal tools — don't bake product-specific assumptions into them.

### Pre-1.0 status

APIs and tokens will change without notice until the first tagged release. No backwards-compatibility shims are owed to consumers yet — prefer clean changes over deprecation layers.

## Environment & commands

Requires **Node 24+** (`.nvmrc` pins `24`) and **pnpm 11+** (`packageManager` is `pnpm@11.4.0`).

Root scripts (all `turbo run` orchestrated except the changeset helpers):

```bash
pnpm install
pnpm build       # build across packages, respecting the dependency graph
pnpm dev         # docs + demo + watch builds
pnpm lint        # most package lint scripts are still stubs
pnpm test        # most package test scripts are still stubs
pnpm typecheck
pnpm changeset   # add a changeset (required on every PR — see below)
pnpm release     # build + changeset publish
```

Package-scoped commands use the real names:

```bash
pnpm --filter @auxiliary/tokens build   # node build.mjs
pnpm --filter @auxiliary/css build      # tsc
pnpm --filter @auxiliary/vue build      # vite build && vue-tsc
pnpm --filter @auxiliary/docs dev       # VitePress on :5173
```

## CI / contribution gotchas

CI (`.github/workflows/ci.yml`) enforces two things that are easy to miss:

1. **The icon registry is generated and must be committed in sync.** `packages/icons/src/registry.ts` is produced from `packages/icons/src/config.ts` (and `packages/icons/inputs/*.svg`). After changing either, run `pnpm --filter @auxiliary/icons sync` and commit the regenerated `registry.ts` — CI fails if it drifts. Icons build on Font Awesome Pro Sharp plus a custom kit, so installing/syncing needs `FONTAWESOME_PACKAGE_TOKEN` in the environment.
2. **Every PR needs a changeset.** CI runs `changeset status --since=origin/main`; add one with `pnpm changeset`.

`@auxiliary/figma-sync` is currently parked — its build/lint/test scripts are stubs.

## License

UNLICENSED. Proprietary to Auterion AG.
