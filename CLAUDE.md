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
- `packages/viz` — `@auxiliary/viz` (data-visualization: palettes + Sparkline/Gauge/Bars/Distribution/TimeSeries)
- `packages/brand` — `@auxiliary/brand` (logo/lockup components + brand manifest, generated registry)
- `packages/figma-sync` — `@auxiliary/figma-sync` (tokens → Figma push; see its README)

Apps:

- `apps/docs` — `@auxiliary/docs`, VitePress docs at `http://localhost:5173`
- `apps/demo` — `@auxiliary/demo`, Vite playground at `http://localhost:5174`

**Where things are headed:** `ROADMAP.md` owns execution sequencing (phased plan; active frontier is Phase 7 "Refinement"). `AD-2026-001.md` owns doctrine, the design org, and governance, and defers sequencing to the roadmap. Settled choices live in `decisions/` — cite the `AD-D-###`. Design grounding lives in `.claude/docs/` — incl. `auterion-product-inventory.md` (real Mission Control / Suite / OS surfaces to design against); reference material is scored in `references/`.

## Architecture

Auxiliary is Auterion's design system, a **pnpm + Turborepo monorepo** built Vue-first on Tailwind v4, with framework-agnostic tokens.

Layered dependency flow (downstream packages depend on upstream ones):

```
tokens  →  css  →  vue  →  docs
                ↘  icons  ↗
                ↘  viz, brand  ↗
         figma-sync (consumes tokens)
```

- `packages/tokens` — DTCG-spec JSON. **Source of truth.** Every other package downstream of tokens must derive from these, not redefine. Composite tokens (`shadow`, `type/*` typography roles) aren't single CSS values — they ship to Figma as Effect/Text Styles via figma-sync, not as Variables.
- `packages/css` — Tailwind v4 preset and `@theme` exports generated from tokens. Also ships the
  styling toolkit consumed by `vue`: `cn()` (`@auxiliary/css/utils`), per-component recipes
  with typed variants (`@auxiliary/css/recipes`), and framework-agnostic formatters
  (`@auxiliary/css/format` — lat/long·MGRS, units, locale-aware numbers).
- `packages/vue` — Vue 3 components built on Reka UI, styled via the css preset.
- `packages/icons` — icon set, consumable by `vue` and downstream surfaces.
- `packages/viz` — token-driven, theme- & CVD-safe chart set (SVG + uPlot) and palette helpers.
- `packages/brand` — Auterion logo/lockup components; `src/registry.generated.ts` is generated from `brand.manifest.json` + `assets/` and drift-gated by its test suite.
- `packages/figma-sync` — pushes tokens → Figma Variables, and reads Figma back to **report** drift (`pnpm figma:diff`). Writes flow code → Figma only; the read path applies nothing (see Principle 1 below).
- `apps/docs` — VitePress documentation site, runs at `http://localhost:5173`.

### The GTC token model

`packages/tokens/src` is organised by the **GTC model** (Global · Theme · Component,
per [buninux.com/design-tokens](https://buninux.com/design-tokens)) — four groups, each
answering "where may this be changed, and what does changing it move?":

| Directory | Carries | Example |
| --- | --- | --- |
| `global/` | the **value layer** — fixed, axis-free, self-contained | `global.spacing.4` → `--spacing-4` |
| `theme/` | everything `[data-theme]` re-resolves — **colour only**, one file per theme | `theme.card-foreground` → `--card-foreground` |
| `register/` | everything `[data-register]` re-resolves — control height, radius, duration | `register.operational.radius.md` |
| `component/` | per-component **structure**: size, padding, gap, radius, icon size | `component.card.footer.gap` → `--component-card-footer-gap` |

Rules that are enforced, not conventions:

- **Component tokens are structural only** — never colour, never typography. Colour
  belongs to `theme/` so it can re-resolve per theme; a colour frozen into a component
  token would survive a theme switch.
- **A component's geometry lives in a token, not a class string.** Recipes consume them
  as `gap-(--component-card-footer-gap)`. A bare `gap-2` renders fine and so fails
  nothing — which is why `packages/css/test/no-bare-scale-utilities.test.ts` gates it.
- **Component tokens emit as `var()` references**, unlike every other tier, and each
  `[data-register]` block re-emits the ones depending on a var it shadows. Without
  that, a subtree setting `[data-register]` keeps the already-substituted `:root`
  value. `packages/tokens/test/component-flex.test.ts` guards both halves.
- `packages/tokens/gtc-validate.mjs` runs 13 rules over the **raw** source before Style
  Dictionary hydration, so dangling refs and reference cycles fail with a token path
  instead of an SD stack trace. Its header documents what it deliberately cannot check
  and where Auxiliary diverges from canonical GTC — read it before "fixing" a divergence.

Emitted CSS custom-property names are **tier-stripped** (`--spacing-4`, not
`--global-spacing-4`), as are Figma variable paths. Full reference:
`apps/docs/foundations/tokens.md`.

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

1. **Code is the source of truth.** Figma mirrors code. Do not introduce sync paths that **apply** Figma → code. Reading Figma is fine and supported — `pnpm figma:diff` reports drift between a Figma file and the token contract — but the report is a worklist for a human, never a patch. No tool writes into `packages/tokens/src` from Figma. (`AD-D-022`)
2. **Tokens are framework-agnostic.** Keep `packages/tokens` free of Vue/React/Tailwind specifics — runtime adapters live in their own packages.
3. **Restraint over reach.** Prefer not adding a component over adding a marginal one. This is not a kitchen-sink library.
4. **One library, many surfaces.** Tokens must serve product UI, marketing, and internal tools — don't bake product-specific assumptions into them.

### The decision log

`decisions/` holds one `AD-D-###` file per settled choice — context, options considered, the decision stated so a stranger could enforce it, and the condition that reopens it. Start at `decisions/README.md`.

**Cite the ID; don't restate the rationale.** A proposal that contradicts a ratified entry must name it and argue for supersession. You may draft an entry at `status: proposed`; only Yasen ratifies. `pnpm decisions:check` gates the format and the README index (CI runs it).

The old flat `DECISIONS.md` is a pointer stub — its four entries were migrated on 2026-08-03 with their original dates.

### Pre-1.0 status

APIs and tokens will change without notice until the first tagged release. No backwards-compatibility shims are owed to consumers yet — prefer clean changes over deprecation layers. (`AD-D-035`)

## Environment & commands

Requires **Node 24+** (`.nvmrc` pins `24`) and **pnpm 11+** (`packageManager` is `pnpm@11.4.0`).

Root scripts (all `turbo run` orchestrated except the changeset helpers):

```bash
pnpm install
pnpm build       # build across packages, respecting the dependency graph
pnpm dev         # docs + demo + watch builds
pnpm lint        # real gate: eslint --max-warnings 0 in every package
pnpm test        # real suites in tokens (contrast/orthogonality/parity gates), css (generated-CSS + recipe gates), vue (Vitest + vitest-axe w/ coverage), viz, brand (registry drift), figma-sync, docs (props drift + coverage); only icons and demo are stubs
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

1. **The icon registry is generated and must be committed in sync.** `packages/icons/src/registry.ts` is produced from `packages/icons/src/config.ts` (and `packages/icons/inputs/*.svg`). After changing either, run `pnpm --filter @auxiliary/icons sync` and commit the regenerated `registry.ts` — CI fails if it drifts. Icons are sourced entirely from `packages/icons/inputs/*.svg` — no vendor package, no registry auth, no token.
2. **Every PR needs a changeset.** CI runs `changeset status --since=origin/main`; add one with `pnpm changeset`.
3. **More committed-generated artifacts with drift gates:** docs props (`apps/docs/.vitepress/data/props.generated.json`, regenerate with `node apps/docs/scripts/gen-props.mjs`) and the brand registry (`pnpm --filter @auxiliary/brand sync`) — both fail `pnpm test` when stale. CI also runs `pnpm pack:smoke` (publish-correctness of tokens/css/vue tarballs) and `pnpm decisions:check` (decision-log format + index).

4. **Visual regression runs in its own CI job, not in `pnpm test`.** 48 committed screenshots — the operational-critical components × 4 themes × 2 registers — live in `apps/docs/test/visual/__screenshots__/`. Run locally with `pnpm --filter @auxiliary/docs test:visual`; accept an intended change with `test:visual:update` and commit the PNGs like any other generated artifact. It is a separate job because it needs a ~95 MB browser download and its own docs build; folding it into `pnpm test` would put both in front of every local test loop. The harness is `apps/docs/specimens.md` → `.vitepress/theme/components/VisualSpecimens.vue` (open `/specimens?theme=darknight&register=operational` by hand to explain a diff).

`@auxiliary/figma-sync` builds a self-contained push program (`dist/push.figma.js`) with the token data inlined; its build hard-errors if `packages/tokens/dist` is older than the token sources.

Note: root `turbo.json` deliberately keeps `test.dependsOn: ["^build"]` (upstream builds only, not the package's own) — every suite reads `src`, and adding own-`build` would force vite+vue-tsc ahead of each test loop.

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

## figma-sync — pushing tokens to Figma

Full procedure lives in the **`figma-sync` skill** (`.claude/skills/figma-sync/`). Key facts:

- **Build the program:** `pnpm --filter @auxiliary/tokens build` then
  `pnpm --filter @auxiliary/figma-sync build` → `packages/figma-sync/dist/push.figma.js`
  (self-contained, data inlined; idempotent + atomic).
- **What it pushes:** three Variable collections named for the GTC tiers — `Global` (412,
  one `Base` mode), `Theme` (53 × 4 theme modes), `Component` (152 × `sm`/`md`/`lg`) —
  plus **Effect Styles** (`shadow/*`) and **Text Styles** (`Type/*`, generated from the
  `type/*` typography composites). Push summary:
  `{ collections, valuesSet, effectStyles, textStyles }`.
- **Components too:** `dist/push-components.figma.js`, built from `@auxiliary/css`'s
  generated `component-schema.json`. **Run it AFTER the token push** — every binding
  addresses a variable by qualified name, and one that doesn't exist yet can't be bound.
  Nine flat recipes, 88 variants, idempotent. Slotted recipes get schema coverage but no
  generated component (a slotted frame tree can't be derived — Card is six Vue components).
- **Gotcha — `use_figma` isn't always available.** The skill assumes a plugin-API Figma MCP
  (`use_figma` + `whoami`). In this environment the connected Figma MCP is often the
  **read-only Dev Mode** server (no `use_figma`/`whoami`). To actually write when that's the
  case, run the generated **one-shot dev plugin** instead: in Figma **desktop** → Plugins →
  Development → Import plugin from manifest → `packages/figma-sync/dist/plugin/manifest.json`,
  then run it (re-reads `code.js` each run, so no re-import after rebuilds). The plugin wraps
  `push.figma.js`; regenerate it after any token change by re-wrapping the rebuilt program.
- Code → Figma only; never sync Figma back (README Principle 1). Renaming a token orphans the
  old Figma variable (pre-1.0: acceptable; clean up manually).
