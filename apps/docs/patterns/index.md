# Patterns

Components are the *vocabulary*; **patterns** are the *sentences*. A pattern is a small, opinionated composition of primitives that solves a recurring product need — a fleet table, a telemetry readout grid, a vehicle status card. Where a component page documents one primitive's API, a pattern page shows how several compose into something you'd actually ship.

## How to use them

Each pattern is a **copy-able example**, not an import. Read the live preview, copy the source, and adapt it — the primitives it composes (`Table`, `TelemetryValue`, `StatusBadge`, `Card`, …) are the stable, versioned surface; the composition is yours to own and tweak.

> **Why copy, not import?** (the blocks-home decision) — Auxiliary deliberately does **not** ship a `@auxiliary/blocks` package yet (Principle 3, restraint). Blocks live here as documented examples until a real consumer needs to `import` one; at that point these pages are the package's seed. Shipping a versioned block surface nobody consumes yet would be a kitchen sink, not a library.

## Grounded in the real products

These patterns are distilled from Auterion's live surfaces — Mission Control, AuterionSuite, AuterionOS — not invented. As the catalog grows, each new block is built by first scanning the matching product repo for the real component's API and states, then reducing it to the restrained Auxiliary vocabulary (never porting product-specific assumptions — Principle 4).

## The catalog

This is the first cut — the operational/data blocks the demo already composes. It grows toward the full marketing / app / operational set (see the roadmap's §6.4).

| Pattern | Composes | Use for |
|---|---|---|
| [App shell](/patterns/app-shell) | `Icon` · `DropdownMenu` · `Avatar` · `Badge` · layout | The top-bar + collapsible-sidebar + content frame every Level-2/3 surface sits in |
| [Fleet table](/patterns/fleet-table) | `Table` · `Checkbox` · `StatusBadge` · `TelemetryValue` | Fleets, mission logs, alert history — rows of vehicles/assets with status + telemetry |
| [Telemetry grid](/patterns/telemetry-grid) | `TelemetryValue` | A glanceable block of live sensor readouts |
| [Vehicle status card](/patterns/vehicle-status-card) | `Card` · `StatusBadge` · `TelemetryValue` · `Separator` · `Button` | A compact at-a-glance summary of one vehicle/asset |
| [Pre-flight checklist](/patterns/preflight-checklist) | `Card` · `Accordion` | Confirm-before-proceed checks with expandable detail |
