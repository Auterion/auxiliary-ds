# Auxiliary — path to a world-class design system

Status as of 2026-05-29. This is the single forward-looking source of truth — a phased execution
plan grounded in the current code. The monorepo is real and well-layered: 5 packages, 2 apps,
~30 Vue primitives. Phases 1–5 are largely delivered; Phase 6 ("Elevation") is the large, active
frontier and is detailed in full below.

The debt was concentrated in three places, in priority order:

1. **The quality gate was hollow** — `lint`/`test` were `echo "… TODO" && exit 0` in every package.
2. **The styling layer was inconsistent** — three idioms, three names for "which look".
3. **Packaging was not library-grade** — single barrel, no tree-shaking signals, docs cover 2/30.

Phases 1–3 retire those three; Phases 4–5 close docs and the Figma loop; Phase 6 lifts the system
from *correct* to *exceptional* and makes its defense orientation explicit.

## Sequencing principle: gate before refactor

The roadmap from the original review listed styling unification first. **We flipped that.**
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

Original state:
- `packages/vue/package.json` → `"lint"`/`"test"` were TODO stubs; only `typecheck` (`vue-tsc`) was real.
- `packages/css/package.json` → same stubs ("no sources yet").
- `.github/workflows/ci.yml` already calls `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm build`
  — so the wiring existed; the package scripts behind it were empty.
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

### Surfaced bugs (found by the new gate — fixed in Phase 2, both component changes)

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

Original state — three idioms coexisted:
- **Recipe (the target):** `Button.vue` consumes `button()` from `@auxiliary/css/recipes`
  (`packages/css/recipes/button.ts`, a `tv()` definition). Clean, typed.
- **Inline object-map:** `Badge.vue`, `StatusBadge.vue`, `AlertBanner.vue` hand-rolled
  `{ alarm: '…', … }[props.level]` + `.join(' ')` inside the `.vue`. This is exactly what `tv()`
  replaces.
- **Inline class-string:** `Checkbox.vue`, `DialogContent.vue` carried long raw Tailwind strings.

And `packages/css/recipes/index.ts` exported **only** `button` — every other component reinvented
variants locally.

Steps:
1. **Add and export `cn()`** — `tailwind-merge` is already a dependency of `@auxiliary/css`
   (`package.json:28`). Create `packages/css/src/cn.ts` (`twMerge` + a `clsx`-style joiner) and
   export it from a new `@auxiliary/css/utils` subpath.
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
   safely override.

**Acceptance:** `recipes/index.ts` exports a recipe for every styled component; no component
contains a `{…}[props.x].join(' ')` map or a bare inline class string for its variants; every
component accepts `class`; `intent` is gone; Phase 1 tests still green.

---

## Phase 3 — Library-grade packaging

**Goal:** `@auxiliary/vue` tree-shakes and behaves like a serious published library.

Original state: `packages/vue/package.json` ships a single entry
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

Original state: `apps/docs/components/` had only `button.md` and `status-badge.md`.
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

This is by far the largest phase. It fans out into its own numbered sub-phases (6.1–6.5, below).
Sequencing *within* Phase 6 is partly locked (6.1 first; then the spine; then defense/compose/data-viz);
most tracks are otherwise independent. Most tracks begin with an **audit** (inventory current state,
name the gaps) before any build — the point of the break is to see the whole system clearly before
elevating it.

### Already delivered by Phases 1–5 (do not re-scope)

- **6f** (token layer) — 5b filled `z-index`, `breakpoints`, semantic typography.
- **6i** (gates) — reduced-motion reset, per-theme contrast + `darknight` blue-cap gates,
  color-blind non-color-cue gate, air-gap gate all exist. What's missing from 6i is the alert
  **model**, **guarded primitives**, **standards certification**, and **units/MGRS** — not the gates.
- **6a** (docs) — Phase 4 gave per-component props + usage guidance. Missing: the **states matrix**
  and the **gap analysis** (now delivered — see §6.1 below).

### The tracks (6a–6j)

The thematic goals. The sub-phase plan that follows buckets these into shippable units 6.1–6.5.

**6a. Full component audit** — know exactly what we have, how good it is, and what's missing before
adding more (Principle 3, restraint). Inventory all ~28 primitives: API consistency
(`variant`/`size`/`level` axes, `class` passthrough), a11y depth beyond axe, controlled/uncontrolled
patterns, slot/composition surface. **States matrix** per component (default, hover, focus-visible,
active, disabled, loading, empty, error, read-only, skeleton). **Gap analysis** against a reference
surface (Radix/Reka + shadcn) *filtered to what Auterion products need* — not kitchen-sink. Per-component
usage guidance (when to use, when not, do/don't). → **Delivered in §6.1.**

**6b. Blocks & pattern audit (marketing, app, operational)** — catalog the composed blocks each
surface needs (Principle 4). Marketing: hero, feature grid, pricing, logo wall, testimonial, CTA,
stat band, footer, nav/header. App: app shell (top bar + sidebar + content), command palette, settings
panels, filter bars, data tables with toolbar, detail drawers, empty/onboarding, notifications center.
Operational: mission-control layouts, telemetry dashboards, map + overlay panels, alert/event feeds,
video/stream tiles, command & control panels (where the defense character concentrates). Decide the
home for blocks (docs examples vs a `@auxiliary/blocks` package) — flag the decision; don't ship a
package speculatively.

**6c. Page templates & larger compositions** — end-to-end, copy-able page scaffolds. Generic:
dashboard, list+detail (master/detail), multi-step wizard/flow, settings, auth, empty/first-run,
error/404/offline. Operational: ground-control-station layout, mission-planning view, fleet/asset
overview, post-flight review. Treat air-gap/offline and degraded-connectivity as template *states*,
not edge cases.

**6d. Iconography, pictograms & imagery** — a complete, coherent visual-symbol layer across the
expressive↔operational range. Icon audit: coverage gaps, optical sizing/alignment, stroke
consistency, semantic naming, the Font Awesome Pro Sharp + custom-kit split. Pictograms: larger
conceptual/operational glyphs (vehicle states, payloads, sensor modes, comms status); evaluate
**map/military symbology** (MIL-STD-2525 / APP-6) — decide what we adopt vs. draw. Imagery &
illustration: photography direction, illustration style, empty-state art, diagram style; define what
"on-brand imagery" means and where it's appropriate (expressive) vs. forbidden (operational — no
decorative imagery in a GCS).

**6e. Data visualization** — a first-class, theme- and color-blind-safe viz layer for telemetry and
analytics. Viz token layer: categorical / sequential / diverging palettes that survive all four
themes (incl. `sunlight` glare and `darknight` scotopic constraints) **and** CVD — derived from
`@auxiliary/tokens`, never ad-hoc. Chart set: time-series (streaming telemetry), gauges/dials,
sparklines, bars, distributions, map-linked viz. Decide headless+token-driven vs. a charting lib
(spike; flag the call). Streaming performance: budgets for high-rate updates (10–60 Hz), no-reflow
value updates, `tabular-nums`, downsampling.

**6f. Visual design & style language** — a deliberate, coherent *look*; the system has functional
tokens but no articulated visual voice. Define the language: type scale & pairing, spacing rhythm,
elevation/shadow, radius, border, color-application rules (semantic vs. accent vs. neutral) — the
*why*, not just the values. Tighten the thin semantic token layer (per 5b). Establish a visual QA
bar: do components *look* designed, or merely unbroken?

**6g. Expressive ↔ operational duality** — treat the two registers as a first-class axis (the single
most important conceptual addition). Expressive (marketing, web, brand): rich, animated, photographic,
generous spacing. Operational (GCS, telemetry, C2): dense, calm, deterministic, glance-able,
high-contrast, decoration-free, motion-restrained. Model the duality explicitly — a mode/register
layer over the semantic tokens, not two parallel systems. → **Architecture DECIDED — see §6g below.**

**6h. Content, voice & operational lexicon** — content as a designed surface. Voice & tone per
register; microcopy standards, button/label grammar, error-message patterns. **Operational lexicon:**
consistent, unambiguous naming of states/actions/severities (no synonyms for the same concept across
surfaces) — safety-relevant in a C2 context. Units, number, date/time, coordinate conventions (see 6i).

**6i. Operational, safety & standards layer (defense)** — make the defense orientation real and
verifiable. **Alerting as a model, not a banner:** prioritization, acknowledgment, latching,
escalation, inhibit/suppress, audible-cue hooks layered over `AlertBanner`/`StatusBadge`.
**Safety-critical interaction:** guarded/confirm primitives for irreversible commands (arm/disarm,
RTL, payload/release) — hold-to-confirm, double-action, undo windows. **Standards conformance:**
Section 508 / **WCAG 2.2 AA** + a **MIL-STD-1472** human-engineering pass; evaluate DO-178C /
ARINC 661 alerting semantics. **Sunlight/night validation gates:** per-theme contrast/legibility
under glare; `darknight` preserves scotopic vision. **Determinism & reduced motion.** **Units /
coordinates / locale:** unit systems (metric/imperial), coordinate formats (lat/long, **MGRS**),
locale-aware numeric formatting in `TelemetryValue` and friends.

**6j. Motion, interaction & accessibility depth** — behavior that feels designed and holds up under
stress. A motion language tied to the `motion` primitives (purpose, duration, easing, expressive/
operational split — no motion that obscures operational state). Keyboard model, focus management,
screen-reader narration audited per component (beyond axe's static checks). Interaction states under
load and on degraded/offline connections.

### Dependency shape

```
6.1 AUDIT & DECIDE  (the "break" — see clearly, lock architecture)
        │  → prioritized backlog + the register decision
        ▼
6.2 SPINE  (visual language 6f · register/duality 6g · voice+lexicon 6h)
        ├───────────────┬───────────────────────┐
        ▼               ▼                       ▼
6.3 DEFENSE (6i)    6.4 COMPOSE (6b·6c·6j)   6.5 DATA-VIZ (6e)
```

### Sub-phases

| Sub-phase | Tracks | Ships | Size |
|---|---|---|---|
| **6.1 Audit & decide** | 6a, 6d-audit, 6b/6c needs-inventory, **6g design** | Per-component states matrix + a11y-depth audit; gap analysis vs Reka/shadcn *filtered to Auterion needs*; icon-coverage audit; prioritized primitive backlog; **2 locked decisions** (register model; blocks home) | M |
| **6.2 Spine** ✅ | 6f, 6g build, 6h | **Delivered.** Visual-language + registers + voice/lexicon foundation docs; `[data-register]` token layer (control-height/radius/motion flex expressive↔operational) wired into recipes; orthogonality build-assert + CSS gate; `<Register>` wrapper; operational lexicon anchored to the status ladder + unit/coord conventions | L |
| **6.3 Defense layer** ✅ | 6i | **Delivered.** ✅ **`GuardedAction`** — hold/double/confirm guard for irreversible commands (arm/RTL/release), keyboard-equivalent + tap-proof, reduced-motion-safe progress, composes Button without modifying it. ✅ **`CoordinateValue`** + **`@auxiliary/css/format`** — lat/long (DD·DMS·DDM) + **MGRS** coordinate formatting (framework-agnostic `formatLatLon`, graceful degradation), sibling to `TelemetryValue`. ✅ **Unit systems + locale** — `formatQuantity`/`convertQuantity`/`formatNumber` (metric/aviation-imperial: ft·kn·fpm·°F, angle/mils, affine °C↔°F), `<UnitSystemProvider>` + `useUnitSystem()` deployment context (package's first provide/inject), wired into `TelemetryValue` (`quantity`/`system`/`locale`, opt-in locale, default output unchanged). ✅ **Alert model** — `useAlertModel()` headless state machine (prioritization, ack, latching [alarm/warning], escalation, inhibit/suppress, audible-cue hooks) + `<AlertManager>` (prioritized ack-able banner stack) + `<AlertAnnunciator>` (highest+count); composes `AlertBanner`/`StatusBadge` (single polite live region; `AlertBanner` gains an additive `live` opt-out, `StatusBadge` untouched). ✅ **Sunlight/night redesign + gates** — redesigned the operational palettes (sunlight hardened for glare: deeper borders/fills; darknight fixed a luminance-scrambled severity ramp → monotonic **brightness ladder**, visible red.400 alarm → extinguished nominal, off-cyan advisory, all low-blue) and added token-layer gates certifying it: focus-ring + border/input ≥ 3:1 (1.4.11), darknight all-token blue-cap, monotonic luminance ladder, OKLab severity ΔE. ✅ **Conformance posture** — `foundations/conformance.md` collects the 508 / WCAG 2.2 AA / MIL-STD-1472 posture into one honest page (each row backed by a CI gate or component pattern; MIL-STD-1472 / DO-178C rows marked *design-conformant, pending expert review* — not self-certified; app-level criteria flagged as consumer responsibilities). | XL |
| **6.4 Compose** | 6b, 6c, 6j | Block catalog (marketing/app/operational); page templates (dashboard, GCS, mission-planning, list+detail, auth, offline/degraded); motion language + keyboard/SR depth per component | XL |
| **6.5 Data-viz** | 6e | Token-driven, 4-theme- + CVD-safe viz palettes; chart set (time-series, gauges, sparklines, map-linked); streaming-perf budgets (10–60 Hz). Likely a new `@auxiliary/viz` package | XL |

### Load-bearing constraint for 6.3 (decided)

The operational alert/safety work is an **additive, opt-in layer — it must never supersede the
base design-system alerts.**

- `AlertBanner` and `StatusBadge` stay simple presentational primitives that every surface
  (marketing, app, operational) uses as-is. They are **not** modified by 6.3.
- The defense alert **model** — prioritization, acknowledgment, latching, escalation,
  inhibit/suppress, audible-cue hooks — ships as a **separate, opt-in** piece (an
  `AlertManager`/alert-center component or a `useAlertModel` composable) that *composes* the base
  primitives for rendering. Operational/C2 surfaces opt in; nothing else changes.
- Guarded/confirm interactions ship as **new primitives** (`GuardedAction` / hold-to-confirm),
  not as changes to `Button`.
- Rationale: Principle 3 (restraint — don't bloat base components) and Principle 4 (one library,
  many surfaces — base alerts serve all surfaces; the model is operational-only).

### Sequencing & external flags

Run **6.1 first**, led by the **full component audit (6a)** — foundational (restraint before
adding), low-risk, and it produces the states-matrix + gap analysis that prioritizes everything
after. Then 6.2 (the spine), then 6.3 / 6.4 / 6.5 (6.5 can run parallel to 6.3/6.4).

- 6d needs `FONTAWESOME_PACKAGE_TOKEN`.
- 6e needs a charting-approach spike.
- 6i's MIL-STD-1472 / DO-178C pass likely needs human/expert sign-off (prep the conformance
  checklist, don't self-certify).

**Phase 6 acceptance:** every primitive has an audited API + states matrix + usage guidance and no
unfilled state gaps; a documented block & template catalog covers marketing, app, and operational
surfaces; a token-driven, color-blind- and theme-safe data-viz layer exists; an articulated visual
style language and an explicit expressive↔operational register model are documented and reflected
in components; the operational/defense layer (alert model, guarded actions, 508/WCAG 2.2 AA + a
MIL-STD-1472 pass, sunlight/night contrast gates, units/coordinates) is implemented and verified.

---

## §6.1 — Component audit & gap analysis

The states-matrix + a11y-depth audit that opens Phase 6.1. Every shipping component was audited by
one agent against a 10-state matrix (default, hover, focus-visible, active, disabled, loading, empty,
error, read-only, skeleton) plus API surface and a11y depth, then synthesized into the gap analysis
and prioritized backlog below.

**This is a planning artifact, not a spec.** It prioritizes 6.2+; it does not authorize any change
on its own. The opt-in constraint above still holds: hardening base-primitive *states* (below) is in
scope for 6.2/6.4; turning `AlertBanner`/`StatusBadge` into the operational alert **model** is not —
that stays a separate opt-in piece (6.3).

### Backlog status (updated as items land)

A first cleanup pass worked the backlog and, crucially, **verified each finding before building**.
That mattered: **4 of the highest-ranked items turned out to be false positives** — already handled
by the framework, the global CSS reset, or Reka defaults. The audit's per-component agents reasoned
from surface signals ("no explicit `v-bind`", "no `motion-reduce:` in the recipe") without accounting
for mechanisms one layer down. **Treat audit findings as leads to verify, not facts.**

| # | Item | Status |
|---|---|---|
| 1 | Shared validation API (`invalid` flag) | ✅ shipped — `invalid` prop on Input, Textarea, Select, Checkbox, Switch (aria-invalid + destructive border/ring); RadioGroup sets `aria-invalid` on the group |
| 2 | `$attrs` forwarding "bug" | ⛔ false positive — Vue single-root fallthrough already forwards; regression-tested |
| 4 | Recipe-level `prefers-reduced-motion` | ⛔ false positive — a global unlayered `!important` reset in `theme.css` already neutralizes all motion, gated by `reduced-motion.test.ts` (one source of truth, better than per-recipe) |
| 5 | Shared `size` axis | ✅ shipped — `size` (sm/md/lg) on Input, Textarea, Select (the controls where height/type is unambiguous; Checkbox/Switch deferred — box/thumb co-scaling is a deliberate, fiddlier change) |
| 9 | `class` passthrough on Dialog/Toast leaves | ⛔ false positive — single-root fallthrough already forwards `class` to the button (confirmed on DialogTrigger/DialogClose/ToastAction); regression-tested |
| 13 | Active/pressed feedback | ✅ shipped — `active:` states on the Button recipe (all 4 variants) + AlertBanner action/dismiss buttons |
| 14 | `SelectSeparator` role | ⛔ false positive — Reka's `SelectSeparator` already hardcodes `aria-hidden="true"` |
| 17 | Skeleton `loading` prop | ✅ shipped — `loading` (default `true`); `false` renders the default slot, dropping the consumer `v-if` |

Still open (need design thought or are net-new features): RadioGroup per-item error recolor (needs
context propagation), `Input.type` union (#12), the missing primitives (Table, NumberField,
Combobox…), and the deeper test-coverage / docs items.

### Overall health

26 components audited. **Most are solid or have only minor gaps.** Two need work, for real reasons.

| Verdict | Count | Components |
|---|---|---|
| **solid** | 7 | Label, DropdownMenu, StatusBadge, TelemetryValue, AlertBanner, Accordion, Separator |
| **minor-gaps** | 17 | Button, Input, Switch, Slider, RadioGroup, Select, Dialog, Popover, Tooltip, Toast, Progress, Spinner, Skeleton, Badge, Avatar, Card, Tabs |
| **needs-work** | 2 | **Textarea**, **Checkbox** |

> "Missing state" counts below are raw matrix misses; several are *correctly* N/A (a Separator has
> no loading state). The misses that matter are the cross-cutting ones called out under **State gaps**.

### The "$attrs bug" — verified false positive

The audit flagged `Input`/`Textarea` for documenting `$attrs` forwarding (`aria-*`, `data-*`,
`maxlength`, `required`) while never calling `v-bind="$attrs"`. **This was checked and is wrong.**
Both components have a single root element and don't set `inheritAttrs: false`, so Vue 3's implicit
fallthrough forwards every attribute to the `<input>`/`<textarea>` automatically — the docs are
accurate. Regression tests now lock this (see `Input.test.ts` / `Textarea.test.ts`,
*"forwards arbitrary attributes…"*), closing the audit's separate "no `$attrs` coverage" gap.

> Lesson: the audit reasoned from "no explicit `v-bind`" without accounting for implicit
> fallthrough. Treat its findings as leads to verify, not facts.

With that removed, **Textarea** is effectively `minor-gaps` — its remaining gaps (error / read-only
states) are the same cross-cutting ones shared across the form set, below. **Checkbox** stays the
one genuine `needs-work`: no hover/active feedback, no error/invalid path, no read-only, and
accessible-name pairing is advisory rather than enforced.

### State gaps (cross-cutting)

| Gap | Affected | Why it matters |
|---|---|---|
| **Error / `invalid`** | *Entire* form set — Input, Textarea, Select, Checkbox, Switch, RadioGroup | No `aria-invalid`, no error styling, no validation path. Every product form hand-rolls it. **Highest-impact gap.** |
| **`read-only`** | Input, Textarea, Checkbox, Slider, RadioGroup | Distinct from disabled (allows select/copy, blocks edit) — needed for telemetry/data-display surfaces |
| **loading / async** | Switch, Select, Popover, Card content | Async toggles & async-loaded data are common in C2/GCS |
| **hover** | Input, Checkbox | Interactive elements give no pointer feedback before click |
| **active / pressed** | Button, Checkbox, AlertBanner buttons | Weak tactile confidence on slow/high-latency operational networks |
| **skeleton integration** | Avatar, Card | `Skeleton` exists but is not composed into data-display components |

### A11y gaps (cross-cutting)

- **No `prefers-reduced-motion` contract at the recipe layer.** Button (`transition-colors`), Switch,
  Slider, Select, Tabs, Tooltip all animate unconditionally. The global reset in `theme.css` catches
  some, but it's not encoded per-recipe and isn't tested per-component.
- **Validation a11y wiring** (`aria-invalid` + `aria-describedby`) is provided by **no** form
  component — error announcement depends entirely on consumer discipline.
- **Color-only differentiation risk**: Button `ghost` hover (`bg-accent`) and Checkbox checked state
  (color fill + border only) — potential WCAG 1.4.1 misses; add a shape/weight/icon cue.
- **Accessible-name pairing is advisory, not contractual** on Checkbox, Switch, RadioGroupItem,
  Avatar — a component can ship with no accessible name. Consider a `label` prop or enforced binding.
- Minor: `SelectSeparator` lacks `role=presentation`/`aria-hidden`; Dialog disabled-trigger has no
  `aria-disabled`; DropdownMenu disabled-item announcement under-specified.
- **Test depth is shallow** for error states, `$attrs` passthrough, type-ahead, RTL/loop, and
  reduced-motion across Textarea, Input, Select, RadioGroup, Tooltip, Card.

### API consistency

- **`level` vs `variant` is a deliberate split** (operational severity tiers
  `alarm|warning|caution|advisory|nominal` vs design treatment) but is **undocumented as a
  convention**. Toast's `type` (foreground/background → ARIA politeness) is a third spelling.
  → Formalize: *`level` = operational severity, `variant` = design treatment*; annotate Toast `type`.
- **Form controls expose no `size` axis** — Button/Badge do; Input/Textarea/Select/Checkbox/Switch
  don't. Standardize a shared `sm/md/lg` scale for compact GCS/telemetry density.
- **`class` passthrough missing** on `DialogTrigger`, `DialogClose`, `ToastAction` — every leaf
  should accept `class?: HTMLAttributes['class']` merged via `cn()`.
- **Typed `Props`/`Variants` exports inconsistent** — Button exports `ButtonVariants`; Input,
  Textarea, StatusBadge, DropdownMenu, Popover don't, weakening downstream inference.
- `Input.type` is loose `string` — tighten to a union of valid HTML input types.
- **Good and worth keeping**: controlled/uncontrolled support (v-model + `defaultValue`) is
  consistent across families — make it the documented standard for new components.

### Missing primitives — filtered to Auterion operational needs

Not a shadcn/Reka parity checklist; only what GCS/C2/marketing surfaces actually need (Principle 3,
restraint).

| Primitive | Ops value | Effort | Note |
|---|---|---|---|
| **Table / DataGrid** | high | L | *The* top missing surface — fleets, mission logs, telemetry streams, alert history. Build the headless primitive first (sortable, sticky header, density, row selection); defer virtualization. |
| **NumberField** | high | S | Altitude/speed/frequency/step entry — steppers, min/max/step clamp, unit display. Input-as-string is error-prone. Pairs with `TelemetryValue`. |
| **Combobox** | high | M | Type-ahead over large sets (vehicle IDs, waypoints, frequencies) where Select is too slow. Reka provides primitives. |
| Command palette | medium | M | Keyboard-first launcher for dense consoles; composes on Combobox + DropdownMenu |
| Pagination | medium | S | Companion to Table — only valuable once Table lands |
| Toolbar | medium | S | Roving-tabindex action bars (map/console controls); fixes a11y of ad-hoc button clusters |
| Resizable / Splitter | medium | M | Multi-pane operator consoles (map + telemetry + log) |
| Tree | medium | L | Hierarchies (mission plans, layer/asset trees) — narrower than Table; defer unless a surface needs it |

> Landed since the audit (see git history): **Combobox**, **Table**, and **NumberField** primitives
> now exist in `packages/vue`. Keep this table as the original prioritization record.

### Prioritized backlog

Ordered by value. Items 1–5 are base-primitive hardening (lands in 6.2 spine / 6.4 depth); 6+ are
new primitives (6.4 compose). None touch the 6.3 opt-in alert model.

1. **Shared validation API** — `invalid`/`error` prop auto-wiring `aria-invalid` + `aria-describedby`
   across Input, Textarea, Select, Checkbox, RadioGroup, Switch. *Single highest-value fix.*
2. ~~Fix the `$attrs` forwarding bug on Input/Textarea~~ — **done & disproven**: not a bug (Vue
   implicit fallthrough already forwards); regression tests added.
3. Add **error / read-only / hover** states to form-control recipes (incl. `border-destructive`
   error styling and a distinct read-only treatment).
4. **Centralize a `prefers-reduced-motion` contract** at the recipe layer; apply to Button, Switch,
   Slider, Select, Tabs, Tooltip; add reduced-motion tests.
5. **Shared `size` axis** (`sm/md/lg`) on interactive controls for compact GCS/telemetry density.
6. **Build Table/DataGrid** headless primitive — top operational surface.
7. **Add NumberField** (steppers, min/max/step clamp, unit display).
8. **Build Combobox** (type-ahead filtered select) on Reka primitives.
9. Add `class` passthrough to `DialogTrigger`, `DialogClose`, `ToastAction`.
10. Add **non-color secondary cues** to Checkbox checked + Button ghost hover (WCAG 1.4.1); verify
    contrast across all Badge variants.
11. Make **accessible-name pairing contractual** (or add a `label` prop) for Checkbox, Switch,
    RadioGroupItem, Avatar; bind `aria-label` across Avatar image + fallback.
12. Tighten `Input.type` to a union; export typed `Props`/`Variants` for Input, Textarea,
    StatusBadge, DropdownMenu, Popover.
13. Add **active/pressed** feedback to Button recipe and AlertBanner action/dismiss buttons.
14. Fix `SelectSeparator` role; document Dialog disabled-trigger `aria-disabled` + DropdownMenu
    disabled-item announcement.
15. **Document the `level`-vs-`variant` vocabulary** as a formal API convention; reconcile/annotate
    Toast `type`.
16. Add **loading/async** states to Switch, Select, and Popover content.
17. **Integrate Skeleton** into Avatar and Card; add a loading control prop to Skeleton to drop the
    `v-if` boilerplate.
18. Add **Pagination** and **Toolbar** once Table lands.
19. **Deepen test coverage**: keyboard / type-ahead / RTL / error / `$attrs` / reduced-motion for
    Select, RadioGroup, Textarea, Input, Tooltip, Card.
20. Evaluate a Card `variant`/`level` axis and optional `CardTitle` tag override for vocabulary
    alignment and heading-hierarchy flexibility.

### Where this routes in Phase 6

- **6.2 Spine** — the validation API, reduced-motion contract, and size axis are spine-level
  conventions (#1, #3, #4, #5, #15).
- **6.3 Defense** — unaffected; the alert *model* and guarded primitives remain separate/opt-in.
- **6.4 Compose** — the missing primitives (#6–#9, #18), per-component a11y/motion depth (#10–#14,
  #19), and Skeleton integration (#17).
- **6.5 Data-viz** — Table/DataGrid (#6) is the natural neighbor; data-display surfaces feed it.

---

## §6g — The expressive ↔ operational register (decision record)

**Status: BUILT in 6.2 (Spine).** Architecture DECIDED 2026-05-29; implemented as the
`[data-register]` token-mode layer. This record is kept as the rationale; the shipped shape and the
resolved open questions are at the end of this section.

### The decision

Model the register as a **token-mode layer**: a `[data-register]` attribute that re-resolves a set
of *flex* semantic tokens — exactly the way `[data-theme]` re-resolves color. Components do **not**
change; they already consume semantic tokens, which now resolve differently per register.

```html
<div data-theme="darknight" data-register="operational">
  <!-- dense, motion-restrained, tight radii -->
</div>
<section data-register="expressive">
  <!-- roomy, animated, softer -->
</section>
```

**Rejected:** per-component `density=` props (churn ×N components, repeat ×N instances, no subtree
default, no inter-component rhythm) and a Vue context provider as the *primary* mechanism (per-
component inject wiring; Vue-only, which violates Principle 2 — tokens stay framework-agnostic). A
thin `<Register>` provider may later be added purely as ergonomics (it just sets the attribute), but
it is not the source of truth.

### Why

- **Mirrors the proven `[data-theme]` system** — same build path, same mental model, same testing
  approach. No new paradigm.
- **Near-zero component churn** — components consume `--control-height`, `--radius-md`, etc.; they
  don't know or care which register is active.
- **Framework-agnostic** (Principle 2) — the axis lives in `@auxiliary/tokens` / CSS, not in Vue.
- **One library, two registers** (Principle 4) — not two parallel systems.
- It is the roadmap's own hint: *"likely a mode/register layer over the semantic tokens, not two
  parallel systems."*

### The two axes are orthogonal

| Axis | Attribute | Controls | Values |
|---|---|---|---|
| **Theme** | `[data-theme]` | **color** | light · dark · sunlight · darknight |
| **Register** | `[data-register]` | **everything non-color** (density, rhythm, radius, motion) | expressive · operational |

They compose freely (`[data-theme=darknight][data-register=operational]`) and never overlap:
**register never touches color; theme never touches density/motion.** A gate will assert this
separation (no color token varies by register; no density/motion token varies by theme).

### Registers

Two poles for the first cut (the underlying `density` scale already has 4 rungs —
`compact/default/comfortable/editorial` in `density.tokens.json` — which the registers map onto):

- **`expressive`** — the **default** (no attribute needed). Roomy spacing, softer radii, full
  motion, larger type rhythm. Marketing, web, brand, onboarding.
- **`operational`** — **opt-in**. Compact density, tight radii, suppressed/short motion, glance-able
  rhythm. GCS, telemetry, C2, mission-critical surfaces.

Default = expressive so every existing surface is unchanged until it opts in. Operational being
opt-in mirrors the air-gap / defense-layer philosophy (additive, never imposed) and is consistent
with the 6.3 opt-in constraint.

### What flexes by register (the "register-variable" token set)

To be finalized with values in 6.2; the *set* is fixed here:

- **Density / control height** — wire up the existing `density.control-height` scale
  (operational → `compact` 28px, expressive → `default`/`comfortable`).
- **Spacing rhythm** — a multiplier on the spacing scale (the `density.scale` factor).
- **Radius** — operational tightens (`--radius-md` smaller); expressive softens.
- **Motion** — operational shortens or zeroes durations. *Distinct from* `prefers-reduced-motion`
  (a user/OS preference, already globally honored): register motion is a **design** choice, the
  reduced-motion reset is an **accessibility** override. They're independent and both can suppress
  motion; the global reset always wins when the user asks for it.
- **Type scale step** (candidate, decide in 6.2) — operational may compress the modular scale.

**Does NOT flex by register:** all color (theme's job), and the reserved status ladder
(`alarm→…→nominal`) which is invariant everywhere.

### Register-*guided*, not register-*tokenized*

Some of the expressive/operational split can't be a token and stays **convention + per-component
guidance** (documented in 6f/6h, enforced by review, not the cascade):

- decorative imagery / photography / illustration — allowed expressive, **forbidden** operational
  (no decoration in a GCS).
- animation choreography (what animates, not just how fast).
- copy voice/tone (6h).

Each component's docs will state which register(s) it serves and how it adapts.

### Implementation shape — as built in 6.2

1. **Register-aware tokens in `@auxiliary/tokens`.** A `REGISTERS` array + `isRegister()` partition in
   `build.mjs` mirror the `THEMES`/`isTheme()` machinery; `src/register/operational.tokens.json`
   holds the operational overrides; base (expressive) values live in `@theme`/`:root`. The emitter
   adds an `[data-register="operational"]` block after the `[data-theme]` blocks. `expressive` is the
   default and needs no block.
2. **Recipes** point control height at `--control-height-{sm,md,lg}` (the one real gap); radius and
   motion already resolve through `--radius-*` / `--duration-*`, so `rounded-*` and `transition-*`
   flex for free once `--default-transition-duration` is bridged to `--duration-base` in `theme.css`.
3. **Gates.** `assertRegisterOrthogonality()` in `build.mjs` (no color in register, no non-color flex
   token in theme) + `packages/css/test/register-orthogonality.test.ts` locking the generated CSS.
   Color is invariant across registers, so the per-register contrast spot-check is satisfied by
   construction.
4. **Ergonomics.** `<Register>` (`@auxiliary/vue`) sets `data-register` on a subtree — pure
   convenience over the attribute, defaults to `operational`, supports an `expressive` opt-out.

### Open questions — resolved in 6.2

- **Flex token set + values.** Locked to control-height (32/36/40 → 28/32/36), radius
  (4/6/8 → 2/4/6), motion (120/200/320 → 80/120/200ms). **Type scale does not flex** (legibility under
  glare/scotopic/MIL-STD-1472). A global spacing-scale multiplier was evaluated and **deferred**: the
  build emits an explicit named `--spacing-*` scale, so a `--spacing` base override is ineffective and
  a full rescale is layout-broad — better validated against real layouts in 6.4 (Compose). Operational
  density is carried by control height + radius + motion for the spine.
- **Motion is shortened, not 0ms** — state-change affordances still read; full-zero stays reserved for
  `prefers-reduced-motion` (an a11y override that always wins, independent of register).
- **Two poles, no neutral middle** — `expressive` (default) + `operational` (opt-in). The four-rung
  `density` scale remains available for explicit per-surface use; the registers map onto two rungs.

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
