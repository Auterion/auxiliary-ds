# Auxiliary — path to a world-class design system

Status as of 2026-05-28. This is a phased execution plan grounded in the current code, not the
stale `CLAUDE.md` (which still describes a "bootstrap state" — that's wrong; the monorepo is real
and well-layered: 5 packages, 2 apps, ~30 Vue primitives).

The debt is concentrated in three places, in priority order:

1. **The quality gate is hollow** — `lint`/`test` are `echo "… TODO" && exit 0` in every package.
2. **The styling layer is inconsistent** — three idioms, three names for "which look".
3. **Packaging is not library-grade** — single barrel, no tree-shaking signals, docs cover 2/30.

## Sequencing principle: gate before refactor

The roadmap from the original review listed styling unification first. **We are flipping that.**
Unifying ~28 components onto recipes + `cn()` rewrites every component's class output. Without
tests and a11y assertions in place first, that refactor is blind — you can't distinguish an
intended rename from a regression. So: **build the gate (Phase 1), then refactor under it
(Phase 2).** Everything after is independent and can be reordered.

Decisions locked with the maintainer (2026-05-28):
- **Variant prop name:** standardize on `variant` everywhere; keep `level` **only** for the
  operational/status family (`StatusBadge`, `AlertBanner`), where severity is a semantically
  distinct axis. → `Button.intent` becomes `Button.variant`.

---

## Phase 1 — Make the gate real

**Status: largely DONE** (branch `feat/quality-gate`). Vitest + `@vue/test-utils` + happy-dom +
`vitest-axe` wired; **26 test files, 195 tests** (192 pass, 3 documented skips) covering every
component; ESLint flat config across all packages at `--max-warnings 0`; coverage floor set
(baseline ~95/95/89/95, floor 85/85/80/85). `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`
all green. **Still open:** visual-regression (step 4 below — deferred into Phase 4 with docs stories).

The gate immediately earned its keep — it surfaced two real a11y bugs (see "Surfaced bugs" below).

**Goal:** CI fails when a component breaks behaviorally, visually, or in a11y — not just on types.

Current state:
- `packages/vue/package.json` → `"lint"`/`"test"` are TODO stubs; only `typecheck` (`vue-tsc`) is real.
- `packages/css/package.json` → same stubs ("no sources yet").
- `.github/workflows/ci.yml` already calls `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`
  — so the wiring exists; the package scripts behind it are empty.
- `turbo.json` already declares `lint`/`test`/`typecheck` tasks with `coverage/**` output. Good.

Steps:
1. **Unit/behavior tests** — add Vitest + `@vue/test-utils` + `happy-dom` to `@auxiliary/vue`.
   Replace the `test` stub with `vitest run`. Start with the components that carry logic:
   `StatusBadge`, `AlertBanner`, `Badge`, `Checkbox`, `Switch`, `Slider`, `Dialog`, `Select`.
2. **a11y assertions** — add `vitest-axe`. Encode the invariants the review flagged: e.g.
   `StatusBadge`/`AlertBanner` must never encode status by color alone (assert a text label /
   `aria` is present for every `level`). This is the test that protects the color-blind-safe
   contract as components evolve.
3. **Lint** — add ESLint flat config with `eslint-plugin-vue` + `typescript-eslint` at the repo
   root; replace every `lint` stub with `eslint .`. Wire Prettier (already a root dep) as
   `eslint-config-prettier` to avoid fighting it.
4. **Visual regression** — stand up component stories (Storybook 8 *or* VitePress-embedded demos —
   decide in Phase 4 since docs needs stories anyway) and drive Playwright snapshots. Gate on
   diffs. This can land at the end of Phase 1 or fold into Phase 4; flag if deferred.
5. **Coverage floor** — set a Vitest coverage threshold (start low, ratchet up) so new components
   can't ship untested.

**Acceptance:** `pnpm test` and `pnpm lint` do real work; CI red on a deliberately-broken
component (color-only status, removed label, broken variant). No new `echo … TODO` scripts.

### Surfaced bugs (found by the new gate — fix in Phase 2, both are component changes)

1. **Slider** — a consumer `aria-label` falls through `v-bind="forwarded"` onto `SliderRoot` (the
   role-less root `<span>`), never reaching the `role="slider"` `SliderThumb`, which has no naming
   path. axe `aria-prohibited-attr`. The slider cannot be given an accessible name.
   Documented via `it.skip` in `Slider.test.ts`. Fix: expose a label prop routed to the thumb(s).
2. **Select** — `SelectContent`'s `[role="listbox"]` has no accessible name and no
   `aria-label`/`aria-labelledby` forwarding. axe `aria-input-field-name`. Documented via `it.skip`
   in `Select.test.ts`.

(A third skip in `Toast.test.ts` is an upstream Reka focus-guard `aria-hidden-focus` at the document
level — not a wrapper bug; the component-scoped axe check passes.)

### Lint tuning decisions (rules turned off, with rationale)
- `vue/multi-word-component-names` — single-word primitive names (Button, Badge) are intentional.
- `vue/require-default-prop` + `vue/require-valid-default-prop` — redundant with TS / `withDefaults`
  (vue-tsc type-checks defaults), and the latter false-positives on union-typed props.
- `vue/no-v-html` — **scoped off only for `packages/icons`** (trusted build-generated SVG).
- `vue/one-component-per-file` — **scoped off only for test files** (inline harness components).

---

## Phase 2 — Unify the styling layer (under the Phase 1 gate)

**Goal:** one styling idiom, one variant vocabulary, every component restyleable by consumers.

Current state — three idioms coexist:
- **Recipe (the target):** `Button.vue` consumes `button()` from `@auxiliary/css/recipes`
  (`packages/css/recipes/button.ts`, a `tv()` definition). Clean, typed.
- **Inline object-map:** `Badge.vue`, `StatusBadge.vue`, `AlertBanner.vue` hand-roll
  `{ alarm: '…', … }[props.level]` + `.join(' ')` inside the `.vue`. This is exactly what `tv()`
  replaces.
- **Inline class-string:** `Checkbox.vue`, `DialogContent.vue` carry long raw Tailwind strings.

And `packages/css/recipes/index.ts` exports **only** `button` — every other component reinvents
variants locally.

Steps:
1. **Add and export `cn()`** — `tailwind-merge` is already a dependency of `@auxiliary/css`
   (`package.json:28`) with **zero** current uses. Create `packages/css/src/cn.ts`
   (`twMerge` + a `clsx`-style joiner) and export it from a new `@auxiliary/css/utils` subpath.
2. **One recipe per component** — port `Badge`, `StatusBadge`, `AlertBanner`, then the inline-string
   components, into `tv()` recipes under `packages/css/recipes/`. Export each from
   `recipes/index.ts`. Components shrink to: read props → call recipe → `cn(recipe(...), props.class)`.
3. **Normalize the variant axis** — rename `Button`'s `intent` → `variant` (and
   `ButtonVariants['intent']` in `recipes/button.ts`). `Badge` already uses `variant`. Leave
   `level` on `StatusBadge`/`AlertBanner` per the locked decision. **Pre-1.0, no deprecation shim**
   (per README) — clean rename, add a changeset noting the break.
4. **Shared size scale** — define one `size` vocabulary in `@auxiliary/css` and reference it from
   recipes so `Button` (`sm/md/lg`) and the badges (`sm/md`) stop diverging arbitrarily.
5. **`class` passthrough** — every component accepts `class` and merges via `cn()` so consumers can
   safely override. Currently none do.

**Acceptance:** `recipes/index.ts` exports a recipe for every styled component; no component
contains a `{…}[props.x].join(' ')` map or a bare inline class string for its variants; every
component accepts `class`; `intent` is gone; Phase 1 tests still green.

---

## Phase 3 — Library-grade packaging

**Goal:** `@auxiliary/vue` tree-shakes and behaves like a serious published library.

Current state: `packages/vue/package.json` ships a single entry
(`"." → ./dist/auxiliary-vue.js`), `files: ["dist"]`, **no `sideEffects: false`**, no per-component
subpaths. `src/index.ts` is one big barrel.

Steps:
1. Add `"sideEffects": false` to `packages/vue/package.json`.
2. Add per-component export subpaths (`"./Button"`, `"./Dialog"`, …) alongside the barrel; configure
   Vite library mode for multi-entry output.
3. Verify tree-shaking with a bundle-analysis smoke test (import one component → assert others absent).

**Acceptance:** importing a single component from a downstream app pulls only that component's code.

---

## Phase 4 — Docs to parity

**Goal:** one page per component; close the 2-of-~30 gap.

Current state: `apps/docs/components/` has only `button.md` and `status-badge.md`.
`apps/docs/foundations/` has `colors`, `radii`, `spacing`, `typography`.

Steps:
1. One page per component: live example, props table, a11y notes, usage guidance.
2. Reuse the Phase 1 stories as the live examples (decide stories home here if deferred from Phase 1).
3. Generate props tables from component types where possible to prevent doc drift.

**Acceptance:** every exported component has a docs page; no component ships without one (lint check).

---

## Phase 5 — Close the open loops

### 5a. Unpark `figma-sync` — MCP-driven, session-triggered, one-way (code → Figma)

Context: Auterion is on Figma **Organization** tier, so `file_variables:write` (REST) is blocked —
no headless "sync on merge to `main`" is possible. The Figma **MCP** provides the full Plugin API
from the session (`use_figma`) plus read-back (`get_variable_defs`). That **collapses the
"build & publish a custom plugin" path** the README deferred — we reach multi-mode collections +
cross-collection aliases without shipping a plugin — and makes the README's "Figma MCP exploration"
follow-up directly actionable. Trade-off accepted by the maintainer: the push is **session/agent-
triggered, not CI-automated** (the MCP is interactively authenticated, absent in headless/cron). It
honors Principle 1 (one-way, code → Figma). Revisit CI automation only if Auterion moves to Enterprise.

Two tracks:

1. **`json/figma-native` build format in `@auxiliary/tokens`** (the contract). Spike with the MCP:
   `create_new_file` → `use_figma` to build a reference file (primitive collection + 4-mode semantic
   collection `light`/`dark`/`sunlight`/`darknight` + cross-collection aliases) → `get_variable_defs`
   to capture Figma's **native** variable JSON shape. Use that captured shape as the contract for a
   new Style Dictionary format in `packages/tokens/build.mjs` that emits matching JSON. Kills
   plugin-format guesswork; gives a deterministic round-trip.
2. **`@auxiliary/figma-sync` becomes a `use_figma` push script + a Claude skill** (replacing the
   parked stubs in `packages/figma-sync/`). Reads the figma-native JSON from track 1 and applies it
   one-way to a target file: create/update the primitive collection, the 4-mode semantic collection,
   and the cross-collection aliases. **Bonus the REST API can't do:** also create **Effect Styles**
   for the composite shadows (`shadow/sm|md|lg`) that Variables can't model — see the table in
   `packages/figma-sync/README.md`. Easings/beziers remain documentation (can't be Variables).
   Update `packages/figma-sync/README.md` to flip status from "parked" to the live MCP workflow.

### 5b. Fill missing token categories

`packages/tokens` has primitives + 4 themes but lacks `z-index`, `breakpoints`, and a **semantic**
typography scale (primitives exist; semantic roles are thin). Add these as DTCG tokens so the system
serves product + marketing + internal tools (Principle 4) without per-surface hacks.

**Acceptance:** running the `figma-sync` push from a session produces — in a target Figma file — a
primitive collection, a 4-mode semantic collection with correct aliases, and shadow Effect Styles,
all matching `dist/tokens.json`; re-running is idempotent (updates, no duplicates).
`@auxiliary/tokens` emits a `json/figma-native` artifact whose shape `get_variable_defs` round-trips.
Token set covers layout (`z-index`, `breakpoints`) + semantic type, not just color/space/radii.
**Non-goal (Org tier):** unattended CI sync — explicitly out of scope until Enterprise REST.

---

## Cross-cutting

- **Fix `CLAUDE.md`** — it still claims "only `README.md` exists." Update it to describe the real
  monorepo so future agents aren't misled. (Small, do it early.)
- **Changesets** — CI already enforces a changeset per PR. Every phase's breaking changes (esp. the
  `intent` → `variant` rename) need one.
- **Honor pre-1.0** — clean breaks over shims; no back-compat owed yet (README).
