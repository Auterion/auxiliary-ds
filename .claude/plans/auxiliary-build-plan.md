# Auxiliary — Clean Step-by-Step Build Plan

## Context

The `auxiliary-ds` repo is in a bootstrap state today: only [README.md](README.md) and [CLAUDE.md](CLAUDE.md) exist. Four research documents in [.claude/docs/](.claude/docs/) converge on a 2026 design-system architecture for Auterion that serves three surfaces from one set of tokens — product UIs (Mission Control, GCS, telemetry), the marketing site, and internal tools — built Vue-first on Tailwind v4 with framework-agnostic tokens.

The intent is to lay clean foundations now and iterate fast with AI-assisted coding on top. We are explicitly **not** trying to ship v1.0 in one go; we are trying to get the *spine* right so every later decision (operational primitives, themes, density, agent bench) plugs in without a rewrite.

### Decisions already taken (from this session)

1. **Typography** — Inter Variable (`opsz 14..32`) for sans, Geist Mono for code/identifiers/hex/IPv4. Mono is reserved, not the primary voice. Body uses `tabular-nums` + `ss02` to disambiguate `I/l/1` and `O/0` in mission IDs and coordinates.
2. **v1.0 shape** — General primitives first (Button → Input → Label → Dialog → …). Operational primitives (StatusBadge, EntityIcon, TelemetryValue, AlertBanner, OperationalLayout) come after the spine is stable.
3. **Token foundation depth** — Deferred. We pause and decide together at Step 3 below, once the pipeline is round-tripping and the choice is concrete instead of abstract.

### Guiding model (from [auterion-design-guidance-research.md](.claude/docs/auterion-design-guidance-research.md))

Five UI context levels — Foundation, Marketing, Conventional, Operational, Mission-Critical — frame *every* design decision. We are building Level 0 now. The constraint that matters: nothing in the token or component architecture may quietly preclude Levels 3–4 later (status hierarchy, density scaling, peripheral-vision alarm states, sunlight-readable contrast).

---

## Approach

Seven sequential steps, each with a verification gate. Steps 1–2 establish the spine and prove the pipeline. Step 3 is the explicit pause-and-decide moment for token depth. Steps 4–7 build outward (CSS preset → Vue primitives → docs → Figma sync). After Step 7 we have a complete, working v0.1 — primitives stand on real tokens, code round-trips to Figma — and we decide together what lands next.

---

## Step 1 — Monorepo skeleton

Scaffold pnpm + Turborepo for six packages. Pin Node 24 (active LTS) and pnpm 11.

**Files to create:**
- `pnpm-workspace.yaml` — packages: `packages/*`, `apps/*`
- `turbo.json` — `build`, `dev`, `lint`, `test`, `typecheck` pipelines with proper `dependsOn` graph
- `package.json` (root) — workspaces, scripts (`build`, `dev`, `lint`), devDeps: `turbo`, `@changesets/cli`, `typescript`, `prettier`
- `.nvmrc` → `22`
- `.gitignore` (extend to include `node_modules`, `dist`, `.turbo`, `.vitepress/cache`, `.vitepress/dist`)
- `.changeset/config.json` — for versioning
- `tsconfig.base.json` — shared base
- `.github/workflows/ci.yml` — Node 22 + pnpm 9, runs `pnpm install --frozen-lockfile`, `pnpm build`, `pnpm lint`, `pnpm typecheck`

**Package stubs (each with its own `package.json` + `README.md`):**
- `packages/tokens` → `@auxiliary/tokens`
- `packages/css` → `@auxiliary/css`
- `packages/vue` → `@auxiliary/vue`
- `packages/icons` → `@auxiliary/icons`
- `packages/figma-sync` → `@auxiliary/figma-sync`
- `apps/docs` → `@auxiliary/docs` (VitePress)

**Verification:** `pnpm install` succeeds; `pnpm -r exec node -e "console.log(process.cwd())"` lists all six paths; `pnpm build` is a no-op that completes; CI runs green on the empty graph.

---

## Step 2 — Token pipeline (prove round-trip with ONE token)

Set up Style Dictionary v4 inside `packages/tokens`. Author the minimum viable DTCG 2025.10 file: **one** color (`color.primitive.gray.900`), **one** spacing (`spacing.4`), **one** radius (`radius.md`). Emit four artifacts.

**Layout:**
- `packages/tokens/src/primitive/color.tokens.json` — DTCG 2025.10 shape (`$type`/`$value`)
- `packages/tokens/src/primitive/spacing.tokens.json`
- `packages/tokens/src/primitive/radius.tokens.json`
- `packages/tokens/build.mjs` — Style Dictionary config, four platforms:
  - `tailwind-v4.css` (`@theme { … }`)
  - `tokens.css` (raw `--color-…` custom props on `:root`)
  - `tokens.ts` (typed export for tooling — *never* imported into runtime components)
  - `figma.tokens.json` (DTCG-shaped, for Tokens Studio)
- `packages/tokens/dist/` — gitignored output

**References used:** `tokens-studio/sd-tailwindv4` repo as a *recipe* (copy the `createTailwindV4Plugin` pattern, don't depend on it). Use Style Dictionary **v5** (latest stable as of 2026-05-27, ^5.4.0) — v5 has full DTCG 2025.10 support, so the v4-era subset restriction noted in [auxiliary-ds-2026-build-plan-research.md](.claude/docs/auxiliary-ds-2026-build-plan-research.md) no longer applies.

**Verification gate (do not proceed without it):**
- `pnpm --filter @auxiliary/tokens build` produces all four dist files.
- `tailwind-v4.css` contains a valid `@theme` block with the one token.
- The token value resolves identically in `tokens.css` and in the JS export.
- Edit the source JSON → rebuild → diff confirms the change propagated everywhere.

---

## Step 3 — Pause and decide token depth, then author the rest

Before authoring the full primitive + semantic layers, we make three calls together. These are the calls deferred from this session:

1. **Status hierarchy** — ship the 4-level `success/warning/danger/info` per the build-plan, OR the 5-level `Alarm/Warning/Caution/Advisory/Nominal` per the design-guidance doc (MIL-STD-1472H / OpenBridge), OR scaffold 5 names but only populate 4 modes initially.
2. **Density** — single default in v1.0 with hooks for a future `--density-*` scale, OR ship `compact / default / comfortable / editorial` from day one.
3. **Themes** — dark-default + light only (build-plan), OR dark-default + light + Dark Vision + High Contrast + OpenBridge scaffolded as empty mode overlays (design-guidance).

The architecture supports any of these — the question is what to populate now versus leave as named-but-empty hooks. Recommendation when we get here: scaffold the *names* generously (5-level status, 4-density scale, 5 themes) but only *populate* dark-default + 4-level status + single density for v1.0. That lets us write contributions for the rest without re-shaping the foundation.

**Then author** (under [packages/tokens/src/](packages/tokens/src/)):

- **Primitive layer** — OKLCH neutral ramp (cool, hue ~250, very low chroma, 10 stops), amber accent at `oklch(~0.70 0.18 40)`, curated spacing scale (`0,1,2,3,4,5,6,8,10,12,16,20,24,32,40,48,64,96`), radii (`none/xs/sm/md/lg`), shadows (`sm/md` + focus ring), motion (`fast 120ms / base 200ms / slow 320ms`, two easings), type tokens (Inter family + opsz `text:14` / `display:32`, weights, line heights, letter spacing).
- **Semantic layer** — `bg.canvas/surface/elevated/overlay`, `text.primary/secondary/muted/disabled/inverse`, `border.default/strong/focus`, `accent.default/hover/muted`, `status.*` (per decision above). Dark mode lives on `:root`; light on `[data-theme="light"]`.
- **Component layer (selective)** — only for primitives we're actually building this round (button, input). Aliases into semantic.

**Reference:** the OKLCH palette table in [auxiliary-ds-2026-build-plan-research.md](.claude/docs/auxiliary-ds-2026-build-plan-research.md) section F (rows for `bg.canvas` through `status.info`) as starting values, to be verified against Auterion brand leadership before locking.

**Verification:** all four dist artifacts emit successfully; the docs site (Step 6) renders the neutral ramp, accent, spacing, radii, and type specimens.

---

## Step 4 — Tailwind v4 preset + recipes

`packages/css` becomes the framework-portable styling layer. **Recipes live here, not in `packages/vue`** — that is the load-bearing portability move from the build-plan research.

**Files to create:**
- `packages/css/theme.css` — imports `@auxiliary/tokens/dist/tailwind-v4.css`; declares the Google Fonts `@import` URL with the `opsz,wght@14..32,100..900` axis (per [auxiliary-ds-2026-build-plan-research.md](.claude/docs/auxiliary-ds-2026-build-plan-research.md) section F); applies `font-optical-sizing: auto`; sets `font-feature-settings` with `cv01 cv10 ss02 ss03 calt liga`; sets `.tabular`, `.font-display`, `.font-mono` helpers.
- `packages/css/preset.css` — Tailwind v4 preset entry; `@utility` blocks (focus ring); custom variants.
- `packages/css/recipes/button.ts` — first `tailwind-variants` recipe (variants: `intent` = primary/secondary/ghost/danger; `size` = sm/md/lg; `tone`; `loading`).
- `packages/css/recipes/index.ts` — barrel export.
- `packages/css/package.json` — depends on `@auxiliary/tokens`, `tailwind-variants`, `tailwind-merge` (peer: `tailwindcss@^4`).

**Verification:** A one-off Vite playground (gitignored, not committed) imports `@auxiliary/css/theme.css` and renders `<button class={buttonVariants({ intent: "primary", size: "md" })}>` correctly across `bg-bg-canvas`/`text-text-primary` paired classes.

---

## Step 5 — First three Vue primitives

Bring shadcn-vue source in as scaffolding (copy-and-own, **not** a dependency).

**Process:**
1. In a throwaway scratch app: `pnpm dlx shadcn-vue@latest init` then `pnpm dlx shadcn-vue@latest add button input label`.
2. Copy the resulting `.vue` files into `packages/vue/src/primitives/`.
3. Replace `class-variance-authority` calls with `tailwind-variants` recipes imported from `@auxiliary/css/recipes/*`.
4. Replace shadcn's CSS variables (`bg-primary`, etc.) with Auxiliary semantic-token utility classes (`bg-accent-default`, `text-text-primary`).
5. Re-export from `packages/vue/src/index.ts`.

**Files:**
- `packages/vue/src/primitives/Button.vue`
- `packages/vue/src/primitives/Input.vue`
- `packages/vue/src/primitives/Label.vue`
- `packages/vue/src/index.ts` — barrel
- `packages/vue/package.json` — peer: `vue@^3`, `reka-ui`; depends on `@auxiliary/css`, `@auxiliary/tokens`

**Discipline (from [auxiliary-ds-2026-build-plan-research.md](.claude/docs/auxiliary-ds-2026-build-plan-research.md) section C):**
- Components consume tokens **only** through CSS variables emitted by `@theme`. No `tokens.ts` import inside components.
- Reka UI handles ARIA, focus, keyboard. Auxiliary owns the styling and prop API.
- Pre-1.0 status — no compat shims, no deprecation layers (per [CLAUDE.md](CLAUDE.md)).

**Verification:** Button renders all variants in the docs site; keyboard focus shows the focus ring; disabled state is unclickable; the rendered DOM has zero inline styles (everything via classes against `@theme` vars).

---

## Step 6 — VitePress docs skeleton

`apps/docs` becomes the live surface of the system. Per CLAUDE.md it runs on `http://localhost:5173`.

**Files:**
- `apps/docs/.vitepress/config.ts` — nav, sidebar, theme
- `apps/docs/index.md` — landing
- `apps/docs/foundations/colors.md` — renders the neutral ramp + accent + status swatches with live OKLCH values
- `apps/docs/foundations/typography.md` — Inter opsz specimens, Geist Mono specimen, the `ss02`/`tabular-nums` demo with mission-ID strings (`I` vs `l` vs `1`, `O` vs `0`)
- `apps/docs/foundations/spacing.md` and `foundations/radii.md`
- `apps/docs/components/button.md` — one-sentence summary, when to use / not to use (3 bullets each), props table, slots table, three usage examples, a11y notes, "Tokens consumed" section resolved from the recipe
- `apps/docs/components/input.md`, `components/label.md`

**Verification:** `pnpm dev` opens the site at `:5173`; all foundation pages render real token values; component pages render real components.

---

## Step 7 — Figma sync (token round-trip end-to-end)

The proof that "code is the source of truth" actually holds.

**Setup:**
1. Create the Figma file `Auxiliary — Foundations` (Figma Variables only — no frames, no components, per [auxiliary-ds-2026-build-plan-research.md](.claude/docs/auxiliary-ds-2026-build-plan-research.md) section D).
2. Install the **Tokens Studio for Figma** plugin (free tier — sufficient for solo-author phase).
3. Connect to this GitHub repo, pointed at `packages/tokens/dist/figma.tokens.json`.
4. Pull. Verify primitive + semantic collections show up.
5. Round-trip test: change `accent.default` value in [packages/tokens/src/primitive/color.tokens.json](packages/tokens/src/primitive/color.tokens.json) → push → Tokens Studio pulls in Figma → variable updates → re-publishing the Figma library propagates to consumers.

**Files:**
- `packages/figma-sync/README.md` — documents the manual sync flow today; reserves space for the future GH Action that will replace it when/if Auterion goes Figma Enterprise (the Variables REST API path noted in section B of the build-plan research).

**Verification (end-to-end, this is the v0.1 gate):**

> Edit one OKLCH value in `color.tokens.json` → `pnpm build` → docs site at `:5173` shows the new value on `foundations/colors.md` AND on the Button primary state AND in `tailwind-v4.css` AND, after a Tokens Studio pull, in the Figma Foundations file.

If that round-trip works, the spine is real and we can iterate fast.

---

## Decision gate after Step 7 (we pause here)

What's next is a menu, not a queue. We decide together based on what Auterion needs first:

- **More general primitives** — Dialog, Sheet, Popover, Tooltip, DropdownMenu, Select, Tabs, Toast (build-plan week 5).
- **Operational primitives** — StatusBadge, EntityIcon, TelemetryValue, AlertBanner, OperationalLayout (design-guidance Priority 1). Pulls forward Level 3–4 surface readiness.
- **Patterns** — app shell, command palette, entity-list-detail layout (build-plan week 7).
- **Light mode QA** — validate the light theme variables for the Webflow marketing site.
- **Agent bench** — `/auxiliary-critique`, `/auxiliary-handoff`, `/auxiliary-drift` (build-plan section E).
- **Icons** — populate `packages/icons` once a real consumer asks.

---

## Explicit non-goals for this plan

- Storybook (VitePress is enough at solo scale).
- React / Svelte / web-components packages (folders only when a consumer exists).
- Figma Variables REST API direct sync (requires Enterprise, defer).
- Figma Code Connect (direction is code → Figma, not Figma → code).
- Auto-generated Vue/React from Figma (never).
- Defense compliance / regulated-lane tooling (per [two-designer-agency-research.md](.claude/docs/two-designer-agency-research.md) — relevant later when consuming surfaces touch ITAR, not for the design-system spine itself).

---

## End-to-end verification (run after each step lands)

| Step | Verify by |
|---|---|
| 1 | `pnpm install` clean; `pnpm -r ls --depth -1` shows 6 packages |
| 2 | `pnpm --filter @auxiliary/tokens build` emits 4 artifacts; one token round-trips through all 4 |
| 3 | Primitive + semantic layers emit; no broken token references; OKLCH values resolve in `tokens.css` |
| 4 | Vite playground renders a button with `buttonVariants({ intent: "primary" })` using zero inline styles |
| 5 | All three primitives render in the playground; tab/focus/disabled states correct; a11y tree shows correct roles |
| 6 | `pnpm dev` → `:5173` shows foundations + components pages with live values |
| 7 | Edit one OKLCH value → propagates to docs site AND `tailwind-v4.css` AND Figma after Tokens Studio pull |
