# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Current state

The repository is in a **bootstrap state**: only `README.md` exists. The structure described below is the *intended* layout from the README — none of the `packages/`, `apps/`, or tooling files have been created yet. Treat the README as a design intent document, not a description of code that exists.

When asked to implement something, first check whether the relevant package directory exists. If it doesn't, scaffolding it (with the right `package.json`, build config, and workspace wiring) is part of the task.

## Intended architecture

Auxiliary is Auterion's design system, planned as a **pnpm + Turborepo monorepo** built Vue-first on Tailwind v4, with framework-agnostic tokens.

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

Requires **Node 22+** and **pnpm 9+**.

From README (will work once the workspace is scaffolded):

```bash
pnpm install
pnpm build      # turbo-orchestrated build across packages
pnpm dev        # runs docs site + watch builds
```

Package-scoped commands once Turborepo is wired:

```bash
pnpm --filter @auxiliary/tokens build
pnpm --filter @auxiliary/docs dev
```

(Exact package names are TBD — the README doesn't fix them. Check `package.json` once it exists.)

## License

UNLICENSED. Proprietary to Auterion AG.
