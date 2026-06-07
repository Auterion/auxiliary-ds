## Intro

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

**Where things are headed:** `ROADMAP.md` is the single forward-looking source of truth (phased plan; active frontier is Phase 6 "Elevation"). Design grounding lives in `.claude/docs/` — incl. `auterion-product-inventory.md` (real Mission Control / Suite / OS surfaces to design against).

## Architecture

Auxiliary is Auterion's design system, a **pnpm + Turborepo monorepo** built Vue-first on Tailwind v4, with framework-agnostic tokens.

Layered dependency flow (downstream packages depend on upstream ones):

```
tokens  →  css  →  vue  →  docs
                ↘  icons  ↗
         figma-sync (consumes tokens)
```

- `packages/tokens` — DTCG-spec JSON. **Source of truth.** Every other package downstream of tokens must derive from these, not redefine.
- `packages/css` — Tailwind v4 preset and `@theme` exports generated from tokens. Also ships the
  styling toolkit consumed by `vue`: `cn()` (`@auxiliary/css/utils`), per-component recipes
  with typed variants (`@auxiliary/css/recipes`), and framework-agnostic formatters
  (`@auxiliary/css/format` — lat/long·MGRS, units, locale-aware numbers).
- `packages/vue` — Vue 3 components built on Reka UI, styled via the css preset.
- `packages/icons` — icon set, consumable by `vue` and downstream surfaces.
- `packages/figma-sync` — one-way push of tokens → Figma Variables. Code → Figma, never the reverse (see Principle 1 below).
- `apps/docs` — VitePress documentation site, runs at `http://localhost:5173`.

### Theme & register axes

Two orthogonal token-mode layers re-resolve semantic tokens at runtime:

- **`[data-theme]`** controls **color** — `light` · `dark` · `sunlight` · `darknight` (the last two
  operational: glare-hardened / scotopic low-blue).
- **`[data-register]`** controls **everything non-color** (control-height/density, radius, motion) —
  `expressive` (default) vs `operational` (opt-in: denser, tighter, calmer). `<Register>`
  (`@auxiliary/vue`) just sets the attribute.

They compose freely and never overlap (a build + CSS gate asserts it). Components consume the resolved
CSS vars and don't know which theme/register is active. See `apps/docs/foundations/registers.md`.

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
pnpm lint        # real gate: eslint --max-warnings 0 in every package (figma-sync parked)
pnpm test        # @auxiliary/vue runs Vitest + vitest-axe w/ coverage; other packages are stubs
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

## Component patterns (vue)

These are conventions in `packages/vue`, not optional style:

1. **Style via recipes, not ad-hoc classes.** Components compose classes with `cn()` from
   `@auxiliary/css/utils` and pull variants from a recipe in `@auxiliary/css/recipes`
   (e.g. `import { button, type ButtonVariants } from '@auxiliary/css/recipes'`). Don't
   hand-roll Tailwind class strings or redefine a variant vocabulary locally.
2. **Every component gets an a11y test.** Tests live in `src/primitives/__tests__/*.test.ts`
   and run axe via the shared runner in `src/test-utils/a11y.ts` (`configureAxe`), which disables
   page-level rules (`region`, `html-has-lang`, …) that false-positive on isolated mounts.
3. **`level` vs `variant` are distinct axes.** `level` = operational severity
   (`alarm|warning|caution|advisory|nominal`, the reserved status ladder); `variant` = design
   treatment. Don't conflate them, and don't reuse a status hue for a non-status purpose.

## License

UNLICENSED. Proprietary to Auterion AG.

<!-- crystl-cli:begin -->

## Crystl CLI (agent-callable)

You're running inside Crystl. You can inspect and control sibling gems and shards via the `crystl` CLI:

- `crystl gems` / `crystl shards --gem <name>` — discover what's open
- `crystl screen --gem <name> --shard <name>` — read another shard's terminal output
- `crystl send --gem <name> --shard <name> "<text>"` — type into another shard
- `crystl shard create --gem <name> [--isolated] [-c "<cmd>"]` — fan out parallel work into a new shard
- `crystl pending` / `crystl approve <id>` / `crystl deny <id>` — handle pending tool approvals
- `crystl wait pending [--timeout SECS]` — block until a permission request appears (built on SSE; no polling)
- `crystl events [--type pending_changed,notification]` — stream live bridge events as JSON lines

Full reference: https://crystl.dev/docs/cli
<!-- crystl-cli:end -->

## Build & Run

```bash
# add your build / run commands here
```

## figma-sync

# figma-sync — push Auxiliary tokens into Figma Variables

One-way sync: `@auxiliary/tokens` → Figma Variables. Code is the source of truth; never read
Figma back into code (README Principle 1). The push is session-triggered (the Figma MCP is
interactively authenticated — there is no CI path on Org tier).

## Preconditions

- The **Figma MCP** is connected (check `mcp__figma__whoami`). If not, stop and ask the user.
- A **target Figma design file URL** (`figma.com/design/<fileKey>/...`). Ask if not given.
- You will run `use_figma`, so the **`/figma-use` skill is mandatory** — load it first.

## Steps

1. **Build the artifacts** (Bash):
   ```bash
   pnpm --filter @auxiliary/tokens build      # dist/figma-native.json + dist/tokens.json
   pnpm --filter @auxiliary/figma-sync build  # dist/push.figma.js
   ```
2. **Load `/figma-use`** (canonical Plugin API rules) before any `use_figma` call.
3. **Inspect** the target file first (idempotency / safety): a read-only `use_figma` listing
   existing collections via `figma.variables.getLocalVariableCollectionsAsync()`. Expect the push
   to update in place if Primitives/Semantic already exist.
4. **Run the push**: read `packages/figma-sync/dist/push.figma.js` and pass its **entire contents**
   as the `code` to `use_figma` (with `skillNames: "figma-use,figma-sync"` and the target fileKey).
   The program is idempotent and self-contained (data inlined). It returns a summary
   `{ collections, valuesSet, effectStyles }` — surface it.
   - It creates ~350 variables in one atomic script. If `use_figma` errors on size/timeout, the
     program is safe to re-run (idempotent); if it persistently fails, split by editing the
     generated `DATA.collections` to push Primitives first, then Semantic.
5. **Verify**: `get_variable_defs` on a node, or a read-only `use_figma`, to confirm two
   collections, the 4 Semantic modes, a spot-checked alias (e.g. `alarm` → red/700 in light,
   red/800 in dark), and the `shadow/*` Effect Styles. Re-run the push once to confirm no
   duplicates.

## Notes

- Variables are **unitless** — FLOATs are px (spacing/radius/text), rem (breakpoint), em
  (tracking), ms (duration); colors are sRGB `{r,g,b,a}`.
- Idempotency keys on collection + variable **name**. Renaming a token in code orphans the old
  Figma variable (pre-1.0: acceptable; clean up manually if needed).
- `shadow` → Effect Styles (handled). `cubicBezier`/easings can't be Variables → see the
  package README's table; maintain them manually in Figma.
