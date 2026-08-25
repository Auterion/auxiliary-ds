# Moodboard review — work in progress (Phase 7.1b)

**Status: paused mid-review, 2026-06-03.** Resume by saying "resume the moodboard review."

We are critically reviewing every reference in `visual-research-moodboard.md` one-by-one. The user
disliked ~80% of the original curated set and wants each justified or cut. The live moodboard doc is
**deliberately left untouched** until decisions are locked — all running verdicts live here. Apply them
to the moodboard in a batch once the pass is complete.

## Process

- Mode: **"I open, you react."** Claude opens each Mobbin screen, gives a quick read of why it's on the
  list, user gives a verdict (keep / cut / keep-but-reframe). Claude edits the doc at the end.
- **Tooling note:** Mobbin `/apps/<id>/<flowId>/screens` collection URLs hit a login wall and 404 in
  the headless browser. What works: (a) direct `/screens/<uuid>` permalinks render unauthenticated via
  Playwright; (b) the **Mobbin MCP `search_screens`** returns inline images + real `/screens/<id>`
  permalinks without auth — this is the reliable path, prefer it.

## Verdicts so far

| # | Group | Reference | Verdict | Note |
|---|-------|-----------|---------|------|
| 1 | Operational | **v0 "Tactical Ops"** | **CUT** | AI-slop v0 "Cyberpunk dashboard" template; movie-prop costume. User: "cut it, it's slop." |
| — | Operational | **Supabase** (NEW) | **ADD — swap v0 slot** | LOCKED 2026-06-03: Supabase replaces the cut v0 slot as the operational/command-center dark anchor. Straight swap only — no redundancy pressure on Neon/Better Stack/Vapi; each judged on its own merits. Calm dark, single green accent, hairline data tables, tabular figures, project-home metric cards w/ inline micro-charts. |
| 2 | Operational | **Better Stack** — telemetry table | **KEEP** | User: "I kinda like it, keep it." Reframe its role: calm dark **event/log-stream** density (severity-tagged rows + monospace payloads) for our flight-log / telemetry-stream / alert-feed surfaces — distinct from Supabase's structured-config tables. |
| 3 | Operational | **Felt** — map ops | **KEEP base, DROP filters** | Base screen (`58a17ddb`) is the canonical operational-console match: map + floating inspector + status-colored entity dots + legend-as-overlay → feeds `<EntityIcon>`. Steal the spatial grammar, not the light color. Filters/expression screen (`4bf168b2`) dropped — its value (filter-overlay-on-map) is wrapped in a Felt-specific SQL/expression editor we wouldn't borrow. |

### Supabase — captured screens (real permalinks from Mobbin MCP)

- Project-home metric cards (the one the user linked twice — **canonical**):
  `https://mobbin.com/screens/3cfe1bf0-e673-4780-bdfd-aca9ea50239d`
  Also `ba81e839-9859-4d34-b966-9f4d217f50d3` (clean project-home, no overlay).
- Hairline data tables / table editor: `fe8df771-b0b0-462e-aa5a-0e346fd6b63e`,
  `6c84cfc8-59cc-4de2-869a-8adfb5b36d39`, `3493a6bc-eaa9-4537-a69d-1265eb79b507`
- Reports / DB health (usage chart + % readouts): `357c9178-87d7-40f7-85b0-3a5e4159f6a6`
- Schema visualizer: `5e43c510-eb5c-4f21-ae90-9aacce660dc4`

**Steal (mapped to our system):** project-home metric cards + inline micro-charts → dark dashboard /
viz-in-card; hairline data tables + tabular figures + calm density → fleet/telemetry tables (maturity
bar); single green accent / monochrome-else → validates principle #5 (one accent), from a real product;
left-rail nav + schema view → console/settings nav.

## Resolved decisions (2026-06-03)

- **Supabase role:** straight swap for the v0 slot only (option 2). Neon / Better Stack / Vapi reviewed on
  their own merits, no redundancy pressure.
- **Vitaly "Designing For Complex UIs" workshop doc** (Maven, Jan 2026 — `https://smashed.by/maven26`):
  DISTILLED into a standalone actionable checklist → **`.claude/docs/complex-ui-patterns-checklist.md`**
  (P0/P1/P2-tagged, each item mapped to one of our components/surfaces with best 1–2 links). This
  supersedes the earlier "fold into a moodboard section" plan — the patterns are check-and-decide items,
  not steal-this-look captures, so they get their own doc. Moodboard's "Reference design systems" list
  still gets the enterprise-DS upgrade (GS / Ethos / Cisco / Lightning). Curated pulls captured there:
  - *Data tables* (fleet/telemetry): pencilandpaper enterprise data-tables analysis, AG Grid DS,
    Goldman Sachs DS (archived — dense-financial-data lineage), GE Ethos, Cisco Momentum, Salesforce Lightning.
  - *Dashboards + dataviz* (L2 Suite, viz-in-card): Dashboard Design Patterns (dashboarddesignpatterns.github.io),
    dataschool "How To Design A Dashboard" eBook, "Designing For Expert Users / UX efficient frontier."
  - *Forms* (templates/settings, Input/Label): Co-Op Form Design System, Gov.UK patterns,
    "Where to put buttons on forms," "Avoid multi-column forms" — sharpen the GitHub helper-text-under-label call.
  - The GS / GE Ethos / Cisco axis = the grown-up-instrument-at-data-density lineage (backs fork #1).

## Review queue (not yet reviewed)

Operational / command-center:
- [x] Better Stack — telemetry table `86e6e184-5717-4f28-9aad-8dfb4bab8192` → **KEEP** (reframed: event/log-stream density)
- [x] Felt — map ops `58a17ddb` → **KEEP base** · filters `4bf168b2` → **DROP**

**Mode switch (2026-06-03):** user is providing curated links directly (Mapbox, a satellite view, more) to add — moving faster, batching verdicts instead of one-by-one open/react. New incoming links go in a holding list below as they arrive.

### Incoming user-supplied refs (to capture + slot)
- _(awaiting links: Mapbox, satellite, …)_

Dark developer/analytics:
- [ ] Neon — monitoring `cf45e7bf-4a0e-40cc-9db5-a29845b58d4e`
- [ ] Vapi — metrics `9da1fbc3-8295-418a-bb3f-67079f8fd2f2`, latency `b8729b4f-d389-40a9-b865-6937d66f6afe`

Clean light dashboards:
- [ ] Cloudflare — analytics `5cfd2aab-b900-484e-bca8-7bec7cbdcc27` (doc's "gold standard")
- [ ] Amplitude — home `7ba117ed-b50f-434d-9e5c-c8e8b7c1c896` (radial gauge ref)
- [ ] Adaline — insights `7483692e-1571-40a7-829d-468a0686e2d9`
- [ ] Gorgias — live overview `d201baf7-979c-4b6c-a849-fc35269ab6bb`

Enterprise settings & forms:
- [ ] GitHub — enterprise settings `80dca4a7-39c7-4c4b-adec-a74e85b41d11`
- [ ] Bonsai — company settings `e7f84b34-9c05-41ec-9418-a1f463e0db32`
- [ ] Posh — org settings dark `64af2e3e-eef0-4d48-b383-965eed01c7fb`

Not screens (review as a list, lighter touch):
- [ ] Reference design systems: Linear, Vercel/Geist, Stripe, IBM Carbon, Datadog/Grafana
- [ ] Synthesized visual direction (6 cross-cutting principles + per-register) — revisit after refs settle
- [ ] Open aesthetic forks (3) — the human calls that gate the 7.2 audit

## When the pass is done

Apply locked verdicts to `visual-research-moodboard.md` in one batch edit, then delete this WIP file.
