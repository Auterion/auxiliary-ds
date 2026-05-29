# Phase 6 — Elevation: the sub-roadmap

Phase 6 (see [`ROADMAP.md`](ROADMAP.md) for the full track descriptions 6a–6j) is the largest
phase and fans out into its own numbered sub-phases here. Phases 1–5 made the system **correct**
(gated, consistent, tree-shakeable, documented, figma-synced). Phase 6 makes it **exceptional**
and makes its **defense orientation explicit** rather than latent.

## Already seeded by Phases 1–5 (do not re-scope)

- **6f** (token layer) — 5b filled `z-index`, `breakpoints`, semantic typography.
- **6i** (gates) — reduced-motion reset, per-theme contrast + `darknight` blue-cap gates,
  color-blind non-color-cue gate, air-gap gate all exist. What's missing from 6i is the alert
  **model**, **guarded primitives**, **standards certification**, and **units/MGRS** — not the gates.
- **6a** (docs) — Phase 4 gave per-component props + usage guidance. Missing: the **states matrix**
  and the **gap analysis**.

## Dependency shape

```
6.1 AUDIT & DECIDE  (the "break" — see clearly, lock architecture)
        │  → prioritized backlog + the register decision
        ▼
6.2 SPINE  (visual language 6f · register/duality 6g · voice+lexicon 6h)
        ├───────────────┬───────────────────────┐
        ▼               ▼                       ▼
6.3 DEFENSE (6i)    6.4 COMPOSE (6b·6c·6j)   6.5 DATA-VIZ (6e)
```

## Sub-phases

| Sub-phase | Tracks | Ships | Size |
|---|---|---|---|
| **6.1 Audit & decide** | 6a, 6d-audit, 6b/6c needs-inventory, **6g design** | Per-component states matrix + a11y-depth audit; gap analysis vs Reka/shadcn *filtered to Auterion needs*; icon-coverage audit; prioritized primitive backlog; **2 locked decisions** (register model; blocks home) | M |
| **6.2 Spine** | 6f, 6g build, 6h | Articulated visual-language doc; thin **register layer** over semantic tokens (density/motion/color/type flex expressive↔operational); voice/tone + operational lexicon + unit/coord/format conventions | L |
| **6.3 Defense layer** | 6i | Alert **model**, guarded/confirm primitives, 508 / WCAG 2.2 AA + MIL-STD-1472 pass, extended sunlight/night threshold gates, MGRS/unit-system formatting in `TelemetryValue` | XL |
| **6.4 Compose** | 6b, 6c, 6j | Block catalog (marketing/app/operational); page templates (dashboard, GCS, mission-planning, list+detail, auth, offline/degraded); motion language + keyboard/SR depth per component | XL |
| **6.5 Data-viz** | 6e | Token-driven, 4-theme- + CVD-safe viz palettes; chart set (time-series, gauges, sparklines, map-linked); streaming-perf budgets (10–60 Hz). Likely a new `@auxiliary/viz` package | XL |

## Load-bearing constraints for 6.3 (decided)

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

## The one early decision

**6g — the register/duality model** ("the single most important conceptual addition"). Whether
it's a token-mode layer (like themes), component props, or a `density`-style primitive changes how
6.2–6.5 are built. Decide it (design only) in **6.1** to avoid rework.

## Sequencing & recommendation

Run **6.1 first**, led by the **full component audit (6a)** — foundational (restraint before
adding), low-risk, and it produces the states-matrix + gap analysis that prioritizes everything
after. Then 6.2 (the spine), then 6.3 / 6.4 / 6.5 (6.5 can run parallel to 6.3/6.4).

**External flags:** 6d needs `FONTAWESOME_PACKAGE_TOKEN`; 6e needs a charting-approach spike;
6i's MIL-STD-1472 / DO-178C pass likely needs human/expert sign-off (prep the conformance
checklist, don't self-certify).
