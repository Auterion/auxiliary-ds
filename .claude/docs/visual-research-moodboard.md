# Visual research & moodboard (Phase 7.1)

Grounding for the Phase 7 **visual design pass**. Auditing against *nothing* is fiddling — this doc
articulates the target the audit (7.2) and polish (7.3) measure against. Anchored on the identity the
guidance docs already hint at (dark operational + light conventional, mono "instrument-panel" aesthetic,
restraint) and a curated reference sweep (Mobbin, June 2026) of world-class execution of that direction.

Companion to `auterion-design-guidance-research.md` (the *why*) and `auterion-product-inventory.md` (the
*what*). This is the *how it should look*.

## Reference set (curated)

Grouped by the surface archetype each informs. Links are durable Mobbin permalinks. "Steal" = the signal
worth adopting; "avoid" = where it diverges from our restraint.

### Operational / command-center (→ our dark L3/L4: GCS, operational-console, instruments)

- **v0 "Tactical Ops"** — [screen](https://mobbin.com/screens/0c8a8e35-df91-4521-aa71-1edd1bfb50ac). The
  closest single hit on our identity: near-black canvas, single warm accent, **monospace uppercase labels**,
  bracketed section headers (`TACTICAL COMMAND / OVERVIEW`), hairline-bordered dense cards, inline sparkline,
  status dots. **Steal:** the instrument-panel grammar — mono labels, bracketed headers, hairline cards,
  one accent. **Avoid:** the "classified/cyberpunk" costume (glow, ALL-CAPS everything) reads as theme, not
  product — we want grown-up instrument, not movie-prop.
- **Better Stack** — [telemetry table](https://mobbin.com/screens/86e6e184-5717-4f28-9aad-8dfb4bab8192).
  Calm dark dense data tables, hairline separators, restrained. **Steal:** the calm — dense without noise;
  this is the maturity level for our fleet/telemetry tables.
- **Felt** — [map ops](https://mobbin.com/screens/58a17ddb-ae85-48cf-96d8-aa8c632517d7),
  [with filters](https://mobbin.com/screens/4bf168b2-a18b-417d-b66d-0c55e0bad572). Map-first with a floating
  **selected-entity detail card** + legend + overlaid filter controls. Maps straight onto our
  operational-console (map + inspector + EntityIcon dots on a basemap). **Steal:** floating inspector over
  map, status-colored entity dots, legend-as-overlay. Directly informs the `<EntityIcon>` extraction.

### Dark developer/analytics (→ our dark conventional, viz integration)

- **Neon** — [monitoring](https://mobbin.com/screens/cf45e7bf-4a0e-40cc-9db5-a29845b58d4e). Dark, generous
  metric cards, tiny CPU/RAM charts integrated in-card. **Steal:** chart-in-card integration.
- **Vapi** — [metrics](https://mobbin.com/screens/9da1fbc3-8295-418a-bb3f-67079f8fd2f2),
  [latency breakdown](https://mobbin.com/screens/b8729b4f-d389-40a9-b865-6937d66f6afe). Soft gradient area
  charts; a horizontal segmented latency bar (good pattern for a budget/threshold readout).

### Clean light dashboards (→ our light L2: Suite dashboard/overview)

- **Cloudflare** — [analytics](https://mobbin.com/screens/5cfd2aab-b900-484e-bca8-7bec7cbdcc27).
  **Gold standard for our light mode:** sectioned KPI groups (Security / Cache / Errors) separated by
  hairline rules, big tabular numbers, *tiny* inline sparklines under each metric, near-zero chrome.
  **Steal:** section-group rhythm, number-first cards, micro-sparklines.
- **Amplitude** — [home](https://mobbin.com/screens/7ba117ed-b50f-434d-9e5c-c8e8b7c1c896). A **radial gauge**
  in a clean metric grid — direct reference for our `<Gauge>` in a light context.
- **Adaline** — [insights](https://mobbin.com/screens/7483692e-1571-40a7-829d-468a0686e2d9). Soft area
  charts in a calm metric grid.
- **Gorgias** — [live overview](https://mobbin.com/screens/d201baf7-979c-4b6c-a849-fc35269ab6bb).
  Multi-series line chart + legend, light, clean.

### Enterprise settings & forms (→ our templates/settings, Input/Label/Select)

- **GitHub** — [enterprise settings](https://mobbin.com/screens/80dca4a7-39c7-4c4b-adec-a74e85b41d11).
  **The reference for dense-but-calm forms:** label + **helper text under the field**, generous vertical
  rhythm, left-rail section nav, single primary action. **Steal:** helper-text-under-label, the calm rhythm.
- **Bonsai** — [company settings](https://mobbin.com/screens/e7f84b34-9c05-41ec-9418-a1f463e0db32).
  Tabs + sub-nav + two-column form; clean light enterprise.
- **Posh** — [org settings (dark)](https://mobbin.com/screens/64af2e3e-eef0-4d48-b383-965eed01c7fb).
  Same settings grammar in dark — useful for cross-theme parity.

## Reference design systems to study (beyond Mobbin)

Best-in-class systems whose *execution* (not just tokens) we should hold ourselves to:

- **Linear** — restraint, density, keyboard-first, calm dark. The bar for "serious tool."
- **Vercel / Geist** — hairline borders, mono for data, near-monochrome + one accent. Closest public DS to
  our instrument direction.
- **Stripe** — light enterprise polish, form/typography rhythm, documentation quality.
- **IBM Carbon** — the incumbent "industrial/operational" DS; study its data-table + density, but it reads
  heavier/older than our target — a foil as much as a model.
- **Datadog / Grafana** — operational dashboards at real data density; how charts/alerts coexist calmly.

## Synthesized visual direction

### Cross-cutting principles (both registers)

1. **Structure with hairlines, not fills or shadows.** 1px low-contrast rules and borders define regions;
   avoid filled boxes and drop shadows except for true overlays. (Every world-class ref above does this.)
2. **Charts live inside cards**, bound to their metric label + value — thin strokes, soft area fills, never
   floating decoration.
3. **Status via small dots / edge accents, not large color fills.** Color earns attention; reserve the
   status ladder for status. (Aligns with our restraint principle + reserved level hues.)
4. **Generous internal padding, tight external rhythm** — cards breathe inside; the grid stays dense.
5. **One accent, used sparingly.** Monochrome + a single accent reads more confident than a palette.
6. **Numbers are first-class** — tabular figures, value-before-chrome, big where it's the point.

### Operational register (dark — the instrument panel)

- Near-black canvas; elevated surfaces a hair lighter (not bordered boxes-on-gray).
- **Monospace for data, labels, and section headers**; consider bracketed/sectioned headers
  (`FLEET / ACTIVE`) — embraced, but *grown-up*, not cyberpunk costume.
- Single accent; alarm-in-periphery; calm under load.
- Refs: v0 Tactical Ops (grammar), Better Stack (maturity), Felt (map + inspector).

### Conventional register (light — clean enterprise)

- White/near-white canvas, hairline gray rules, sectioned groups with clear headers.
- Sans body; **helper text under labels**; whitespace; soft chart fills.
- Refs: Cloudflare (dashboards), GitHub (forms), Amplitude (gauge).

## What this implies for *our* system (audit hooks for 7.2)

Each becomes a thing to check, surface-by-surface, in the audit:

- **Card recipe** — borders vs shadows? Lean hairline. Internal padding generous enough?
- **Operational patterns** — are we actually using mono labels / sectioned headers, or defaulting to sans?
  (Likely underused — the "instrument" identity is asserted in docs but not yet *rendered*.)
- **Status rendering** — `StatusBadge` and fleet rows: dots/edge accents vs filled pills?
- **Viz-in-card** — do data-viz docs/patterns bind charts to a metric label+value, or float them?
- **Forms** — `templates/settings` + Input/Label: helper-text-under-label, sectioned groups, single
  primary action?
- **Type scale** — tabular numerals for telemetry/metrics; is the scale applied consistently?
- **Accent discipline** — count accent uses per surface; is color reserved for meaning?

## Open aesthetic forks (need a human call)

1. **Tactical ↔ clean-instrument spectrum.** v0 Tactical Ops is striking but costume-y; Felt/Better
   Stack/Vercel are grown-up-instrument. Where do we sit? (Recommendation: grown-up instrument, *mono labels
   yes, glow/cyberpunk no*.)
2. **Accent strategy.** Single brand accent vs our current cooler viz-adjacent palette — ties directly to
   the forthcoming world-class branding work, so may want to settle brand first.
3. **Operational mono-first labels.** Commit to monospace section labels/headers in the operational
   register as a signature, or keep it subtler? Strong, identity-defining commitment either way.
