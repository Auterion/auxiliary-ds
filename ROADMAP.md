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

## Phase 6 — Elevation: from correct to exceptional

Phases 1–5 make the system **correct**: gated, consistent, tree-shakeable, documented, and
syncable to Figma. They are necessary and they are not enough. Phase 6 is a deliberate **break** —
a step back to lift Auxiliary from "a clean modern component library" to an **exceptional**
design system in content, design, and usage, and to make its **defense orientation explicit**
rather than latent. Today the operational DNA lives only in the artifacts (four themes incl.
`sunlight`/`darknight`, the `alarm→warning→caution→advisory→nominal` severity ladder,
`TelemetryValue`, the `density` primitive, color-blind-safe status). Phase 6 promotes that intent
to a first-class destination.

This is by far the largest phase and will almost certainly **fan out into its own sub-roadmap**
when we reach it. It is captured here as a single milestone so the ambition is on record.
Sequencing *within* Phase 6 is not yet locked; the tracks are largely independent. Most tracks
begin with an **audit** (inventory current state, name the gaps) before any build — the point of
the break is to see the whole system clearly before elevating it.

### 6a. Full component audit

**Goal:** know exactly what we have, how good it is, and what's missing — before adding more
(Principle 3, restraint).

- Inventory all ~28 primitives: API consistency (prop names, `variant`/`size`/`level` axes,
  `class` passthrough), a11y depth beyond axe, controlled/uncontrolled patterns, slot/composition
  surface.
- **States matrix** per component: default, hover, focus-visible, active, disabled, loading,
  empty, error, read-only, skeleton. Flag every component missing a state it should have.
- **Gap analysis** against a reference surface area (Radix/Reka + shadcn vocabulary) *filtered by
  what Auterion products actually need* — not kitchen-sink. Name the missing primitives
  (e.g. Combobox, Command palette, Table/DataGrid, Pagination, Breadcrumb, Calendar/DatePicker,
  Toolbar, Resizable/Splitter, Tree, Menubar, NumberField).
- Per-component **usage guidance**: when to use, when not, do/don't, anti-patterns.

### 6b. Blocks & pattern audit (marketing, app, operational)

**Goal:** catalog the composed blocks each surface needs (Principle 4, many surfaces), so product
teams assemble from blessed patterns instead of re-inventing.

- **Marketing blocks:** hero, feature grid, pricing, logo wall, testimonial, CTA, stat band,
  footer, nav/header.
- **App blocks:** app shell (top bar + sidebar + content), command palette, settings panels,
  filter bars, data tables with toolbar, detail drawers, empty/onboarding states, notifications
  center.
- **Operational blocks:** mission-control layouts, telemetry dashboards, map + overlay panels,
  alert/event feeds, video/stream tiles, command & control panels. These are where the defense
  character concentrates.
- Decide the home for blocks (composed examples in docs vs a `@auxiliary/blocks` package) — flag
  the decision; don't ship a package speculatively.

### 6c. Page templates & larger compositions

**Goal:** end-to-end, copy-able page scaffolds, not just parts.

- Generic: dashboard, list+detail (master/detail), multi-step wizard/flow, settings, auth,
  empty/first-run, error/404/offline.
- Operational: ground-control-station layout, mission-planning view, fleet/asset overview,
  post-flight review. Treat air-gap/offline and degraded-connectivity as template states, not
  edge cases.

### 6d. Iconography, pictograms & imagery

**Goal:** a complete, coherent visual-symbol layer across the expressive↔operational range.

- **Icon audit:** coverage gaps, optical sizing/alignment, stroke consistency, semantic naming,
  the Font Awesome Pro Sharp + custom-kit split (does the custom kit cover operational needs?).
- **Pictograms:** larger conceptual/operational glyphs — vehicle states, payloads, sensor modes,
  comms status. Evaluate **map/military symbology** needs (e.g. MIL-STD-2525 / APP-6) for
  operational surfaces; decide what we adopt vs. draw.
- **Imagery & illustration:** photography direction, illustration style, empty-state art,
  diagram/figure style. Define what "on-brand imagery" means and where it's appropriate
  (expressive surfaces) vs. forbidden (operational surfaces — no decorative imagery in a GCS).

### 6e. Data visualization

**Goal:** a first-class, theme- and color-blind-safe viz layer for telemetry and analytics.

- **Viz token layer:** categorical / sequential / diverging palettes that survive all four themes
  (incl. `sunlight` glare and `darknight` scotopic constraints) **and** color-vision deficiency —
  derived from `@auxiliary/tokens`, never ad-hoc.
- Chart set: time-series (streaming telemetry), gauges/dials, sparklines, bars, distributions,
  and map-linked viz. Decide headless+token-driven vs. a charting lib (spike; flag the call).
- **Streaming performance:** budgets for high-rate updates (10–60 Hz), no-reflow value updates,
  `tabular-nums`, downsampling. Viz must hold up under operational data rates, not just demos.

### 6f. Visual design & style language

**Goal:** a deliberate, coherent *look* — the system currently has functional tokens but no
articulated visual voice.

- Define the language: type scale & pairing, spacing rhythm, elevation/shadow, radius, border,
  and color-application rules (when semantic vs. accent vs. neutral). Document the *why*, not just
  the values.
- Tighten the token semantic layer where it's thin (per 5b: `z-index`, `breakpoints`, semantic
  typography roles).
- Establish a visual QA bar: do components *look* designed, or merely unbroken? Capture reference
  comps for the flagship surfaces.

### 6g. Expressive ↔ operational duality

**Goal:** treat the two registers as a first-class axis of the system — the single most important
conceptual addition.

- **Expressive** (marketing, web, brand): rich, animated, photographic, generous spacing, brand
  expression. **Operational** (GCS, telemetry, C2): dense, calm, deterministic, glance-able,
  high-contrast, decoration-free, motion-restrained.
- Model the duality explicitly: how tokens, density, motion, color application, imagery, and
  typography flex across the spectrum — likely a **mode/register** layer over the semantic tokens,
  not two parallel systems. One library, two registers (Principle 4).
- Per-component guidance on which register(s) it serves and how it adapts.

### 6h. Content, voice & operational lexicon

**Goal:** content as a designed surface, not an afterthought ("exceptional content").

- Voice & tone per register (expressive vs. operational). Microcopy standards, button/label
  grammar, error-message patterns.
- **Operational lexicon:** consistent, unambiguous naming of states, actions, and severities
  (no synonyms for the same concept across surfaces) — safety-relevant in a C2 context.
- Units, number, date/time, and coordinate formatting conventions (see 6i).

### 6i. Operational, safety & standards layer (defense)

**Goal:** make the defense orientation real and verifiable — the gap between "modern generic DS"
and "defense-oriented DS."

- **Alerting as a model, not a banner:** prioritization, acknowledgment, latching, escalation,
  inhibit/suppress, and audible-cue hooks layered over `AlertBanner`/`StatusBadge`.
- **Safety-critical interaction:** guarded/confirm primitives for irreversible or dangerous
  commands (arm/disarm, RTL, payload/release). Hold-to-confirm, double-action, undo windows.
- **Standards conformance as an explicit target:** Section 508 / **WCAG 2.2 AA** (federal
  procurement table-stakes) and a **MIL-STD-1472** human-engineering pass; evaluate DO-178C /
  ARINC 661 alerting semantics for flight-relevant surfaces. axe (Phase 1) checks WCAG *semantics*
  only — this certifies a *level*.
- **Sunlight/night validation gates:** assert per-theme contrast/legibility under glare, and that
  `darknight` preserves scotopic vision (no bright/blue leakage). Threshold tests, not vibes.
- **Determinism & reduced motion:** state-bearing changes never animate in a way that hides
  status; honor `prefers-reduced-motion`.
- **Units / coordinates / locale:** unit *systems* (metric/imperial), coordinate formats
  (lat/long, **MGRS**), and locale-aware numeric formatting in `TelemetryValue` and friends.

### 6j. Motion, interaction & accessibility depth

**Goal:** behavior that feels designed and holds up under stress.

- A motion language tied to the `motion` primitives: purpose, duration, easing, and the
  expressive/operational split (see 6g). No motion that obscures operational state.
- Keyboard model, focus management, and screen-reader narration audited per component — beyond
  axe's static checks.
- Interaction states under load and on degraded/offline connections.

**Acceptance:** every primitive has an audited API + states matrix + usage guidance and no
unfilled state gaps; a documented block & template catalog covers marketing, app, and operational
surfaces; a token-driven, color-blind- and theme-safe data-viz layer exists; an articulated visual
style language and an explicit expressive↔operational register model are documented and reflected
in components; the operational/defense layer (alert model, guarded actions, 508/WCAG 2.2 AA + a
MIL-STD-1472 pass, sunlight/night contrast gates, units/coordinates) is implemented and verified.
Given the scope, Phase 6 is expected to ship as a sequence of its own numbered sub-phases.

---

## Cross-cutting

- **Fix `CLAUDE.md`** — it still claims "only `README.md` exists." Update it to describe the real
  monorepo so future agents aren't misled. (Small, do it early.)
- **Changesets** — CI already enforces a changeset per PR. Every phase's breaking changes (esp. the
  `intent` → `variant` rename) need one.
- **Honor pre-1.0** — clean breaks over shims; no back-compat owed yet (README).
- **Lock air-gap-first now** — defense deployments are frequently disconnected. No runtime CDN
  dependency (fonts, icons, assets); verify in the build. Already mostly true (icons are
  build-baked SVG, tokens static) — make it a guaranteed, asserted principle before it regresses.
  Full operational treatment lands in Phase 6i; locking the principle is cheap and belongs now.
- **Extend the Phase 1 gate with operational invariants now** — beyond axe: per-theme contrast
  thresholds, "every status `level` carries a non-color cue" assertion, and `prefers-reduced-motion`
  honored. These fold into the existing Vitest/axe harness for near-zero cost and protect the
  color-blind-safe + sunlight/night contract as the system grows (the deeper validation is 6i).

---

## References & background

This roadmap is the single forward-looking source of truth. The sourced research that informed it
lives in [`.claude/docs/`](.claude/docs/) and is kept as background (to be revisited and updated):

- [`auterion-design-guidance-research.md`](.claude/docs/auterion-design-guidance-research.md) —
  the design-language thesis (*"Operational truth, expressed with precision"*), the Swiss / NASA-JPL
  traditions, and the **five UI context levels** (Foundation → Marketing → Conventional →
  Operational → Mission-Critical). Anchors Phase 6f–6g and the defense orientation.
- [`anduril-matter-research.md`](.claude/docs/anduril-matter-research.md) — mission-critical
  benchmarks: Palantir Blueprint, Esri Calcite, OpenBridge, NASA Open MCT, and **MIL-STD-1472H**.
  Feeds the Phase 6i standards and 6b/6e operational work.
- [`auxiliary-ds-2026-build-plan-research.md`](.claude/docs/auxiliary-ds-2026-build-plan-research.md)
  — stack rationale (DTCG, Style Dictionary v4, Reka UI, Figma tier constraints). Largely realized
  in Phases 1–5.
- [`two-designer-agency-research.md`](.claude/docs/two-designer-agency-research.md) — agent/tooling
  ops and **ITAR/compliance** strategy. **Known follow-up:** reconcile its compliance section with
  the Phase 6i operational/safety/standards layer (air-gap, regulated lane, 508/WCAG, MIL-STD-1472).
