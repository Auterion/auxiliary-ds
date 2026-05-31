# Auterion product inventory — grounding for Phase 6.4 / 6.5

Captured from operator screenshots of Auterion's three live product surfaces (Mission Control,
AuterionSuite, AuterionOS). This is **durable grounding** so the design system can be built against the
real products instead of from imagination — screenshots don't persist into the repo; this does. It is a
background/grounding doc (sibling to the files in `.claude/docs/`), **not** a spec: `ROADMAP.md` remains
the single forward-looking source of truth. Where a pattern is owned, the row points at the `ROADMAP.md`
slice that owns it.

> **Source of truth stays in code (Principle 1).** This doc mirrors the *products* to design against;
> it does not authorize anything on its own.

## 1 — Context-level map

Auxiliary's "five UI context levels" (`auterion-design-guidance-research.md`, "Five UI Context Levels",
lines 161–167: L0 Foundation → L1 Marketing → L2 Conventional → L3 Operational → L4 Mission-Critical)
map cleanly onto the three products. This is the lens for *which register / theme / density / touch
posture* a given surface wants.

| Product | Context level(s) | Default theme | Register | Notes |
|---|---|---|---|---|
| **AuterionSuite** | L2 Conventional | **light** | expressive→app | Fleet/ops management web app: dashboards, fleet, operations, manufacturer, store, settings. Both light and dark observed (Overview light, Settings dark). |
| **AuterionOS** | L2 Conventional (device admin) | **light** | expressive→app | On-device admin served from the vehicle (`10.41.1.1`): system status, apps, device security, diagnostics, install software. Offline/not-activated states are first-class. |
| **Mission Control** | **L3 Operational / L4 Mission-Critical** | **dark only** | operational | GCS: map + multi-vehicle, payload/video, arming, emergency actions, strike/track. Runs on desktop **and rugged touch tablets/controllers** — the touch posture (see ROADMAP `§ Input modality & touch`) exists for this surface. |

## 2 — Observed patterns → status

What each product shows, and whether the design system has it, plans it, or lacks it. "PLANNED §x"
cites the owning `ROADMAP.md` slice; "GAP → §6.1" means a newly-confirmed gap appended to the
missing-primitives backlog.

| Pattern (where seen) | Status | Where it lives / lands |
|---|---|---|
| Radial/donut gauges — battery %, voltage, CPU/RAM (MC header, OS) | **PLANNED** | §6.5 slice 3 (gauge) |
| Sparklines — stat-card trend (Suite) | **PLANNED** | §6.5 slice 3 (sparkline) |
| Line charts — weather 4-day outlook, flight trends (Suite) | **PLANNED** | §6.5 slice 4 (time-series) / slice 5 |
| Stat card with sparkline + delta% — "Flight Count 695 ↑75%" (Suite) | **PLANNED** | block of §6.4 slice 5 (app blocks) over §6.5 sparkline |
| Usage meter — "Seats 226/∞", "Vehicles 1667/10000" (Suite Settings) | **GAP → §6.1** | new **UsageMeter** primitive |
| App-shell sidebar — collapsible nav, grouped sections, org switcher, footer, user (Suite/OS, light+dark) | **PLANNED** | §6.4 slice 2 (app-shell layout block) |
| Top operational status/telemetry bar — RSSI/SNR, voltage, power/current, INS HAcc/VAcc/Nsat, battery (MC) | **PLANNED** | §6.4 slice 6 (operational block set: status bar) |
| Mode dropdowns in a bar — Position ▾, MC Follow ▾, Disarmed ▾, Emergency Actions ▾ (MC) | **PLANNED** | §6.4 slice 6 (composes `DropdownMenu`/`Select`) |
| Left icon+label action rail — Arm/Altitude/Marker; Land/Mission/RTL/Abort/Map Layers/Measure (MC) | **PLANNED** | §6.4 slice 6 (rail = Toolbar pattern; backlog Toolbar) |
| Vehicle strip — bottom row of selectable vehicle cards w/ status chip + mode (MC) | **PLANNED** | §6.4 slice 6 (fleet panel, horizontal variant) |
| Map **EntityIcon** — vehicle arrow + callsign + heading + status halo (MC) | **PLANNED** | §6.4 slice 6 (owner); iconography half coordinates with 6d |
| Attitude/compass instrument — artificial horizon + heading rose (MC) | **PLANNED** | §6.4 instruments slice (maximal scope) |
| Payload action cluster — large round STRIKE / TRACK / zoom / record (MC) | **PLANNED** | §6.4 instruments slice (STRIKE/TRACK composed from `GuardedAction`) |
| RTL / mode progress timeline in header — "49 min" bar (MC) | **PLANNED** | §6.4 slice 6 (header composition over `Progress`) |
| Minimap / video picture-in-picture w/ expand/collapse (MC) | **PLANNED** | §6.4 slice 6 (chrome + slot; video pipeline product-owned) |
| Copy-to-clipboard field — serial numbers w/ copy icon (OS) | **GAP → §6.1** | new **CopyField** primitive |
| Inline-editable field — value + pencil-to-edit (Suite Settings) | **GAP → §6.1** | new **EditableField** primitive |
| Feature/status card — "App Developer Program — ACTIVE ✓" (Suite Settings) | **PLANNED** | §6.4 slice 5 (composes `Card` + `Badge`/`StatusBadge`) |
| Scrollable location tab row — Montreal/Munich/… +Location (Suite) | **PLANNED** | §6.4 slice 5 (overflow/scroll variant over `Tabs`) |
| File-upload field + inline error — ".auterionos / Installation failed" (OS) | **GAP → §6.1** | new **FileUpload** (error via `AlertBanner`) |
| Empty / offline / error states — "Not Activated", "Offline", "Installation failed" (OS) | **PLANNED** | §6.4 slices 7/8 (templates ship degraded/offline as states) |
| Map integration — Mapbox w/ pins/clustering (Suite), satellite basemap (MC) | **product-owned (slot)** | §6.4 map+overlay placeholder; DS owns overlay grammar only |
| Guarded irreversible commands; alert model; telemetry/coordinate readouts | **EXISTS** | `GuardedAction`, `useAlertModel`/`AlertManager`, `TelemetryValue`, `CoordinateValue` |

## 3 — Scope boundary (maximal-minus-pipelines)

The user's call: the design system goes **maximal** — it owns the full operational grammar *and* the
bespoke instruments. The single boundary is **data pipelines**: the DS renders widgets/chrome/overlays,
products feed them data.

- **DS owns (widgets / chrome / overlays / instruments):** app-shell + sidebar, operational status bar,
  action rail, vehicle strip, mode dropdowns, EntityIcon, gauges/sparklines/charts, attitude-compass
  instrument, payload action cluster (guarded), usage meters, copy/editable/file-upload fields,
  empty/offline/error states, and the **map overlay grammar** (entity layer, path lines, labels, scrims).
- **Products own (data pipelines):** the **map-tile engine** (Mapbox/satellite tiles), the **video
  pipeline** (decode/stream), and any live telemetry transport. The DS ships **labelled slots** for
  these — it never bundles a map engine or video decoder.

> **Parked constraint (do not design yet — revisit at the §6.4 map-block / §6.5 palette work):** the
> Mission Control basemap is **satellite/terrain imagery, not flat tiles**. Everything the DS draws over
> it — EntityIcon halos, labels, RTL/path lines, viz series — must stay legible over *high-variance
> photographic terrain* (scrims, outlines, contrast halos), not a calm flat fill. Recorded here so it's
> not lost; full treatment is deferred ("when the time is correct").

## 4 — Repo-scan protocol (just-in-time)

We have access to all three product repos. Rather than one stale upfront inventory, **each 6.4/6.5 slice
opens by scanning the relevant product repo** for the real component's API, states, and naming before
building the DS version — so every block/template is grounded in the shipped product, then distilled to
the restrained DS vocabulary (Principle 3).

| Surface | What to scan it for |
|---|---|
| **Mission Control** | operational status bar, action rail, vehicle strip, EntityIcon, attitude/compass, payload cluster, mode dropdowns, RTL timeline |
| **AuterionSuite** | app-shell sidebar + org switcher, stat cards, usage meters, feature/status cards, editable fields, dashboard/list+detail templates, charts |
| **AuterionOS** | device-admin shell, copy fields, file-upload + error, system-status gauges, offline/not-activated states |

Scan = read the real component for its props/states/edge-cases; do **not** port product code or
product-specific assumptions into the DS (Principle 4 — one library, many surfaces).
