# Plan — Add "Phase 7 — Autonomy, entities & multi-agent" to ROADMAP.md

> **Status: PARKED for ultraplan pickup.** This is a planning artifact, not yet executed. It captures
> the exact `ROADMAP.md` change to make. Background/evidence:
> [`autonomy-entities-multi-agent-research.md`](./autonomy-entities-multi-agent-research.md).

## Context

`ROADMAP.md` is the single forward-looking source of truth. Its Phase 6 fan-out (6.3 Defense /
6.4 Compose / 6.5 Data-viz) touches operational *surfaces* but never scopes the layer Auterion's
actual domain needs: **entity identity, multi-vehicle/fleet, swarms/collective behavior,
multi-domain, autonomy display, and the map/symbology substrate**. A 5-angle deep-research pass
(~70 cited claims) confirmed the gap and produced concrete, standards-traceable specs. This change
records that research and adds a Phase 7 that scopes the unbuilt layer, while folding the parts that
already belong to Phase 6 back into 6.3/6.4/6d.

**Key research finding (the spine):** every mature C2 tool (Lattice, NASA Open MCT, Palantir,
TAK/CoT) is built on **one typed `Entity` object that backs many views** — the same atom is a map
marker, a roster row, and an inspector panel. That atom (`EntityIcon`) is the foundational unit and
is exactly what the in-repo `auterion-design-guidance-research.md` named but never built.

## Files to change (when executed)

1. **`ROADMAP.md`** — four edits:
   - Insert the **`## Phase 7`** section (full prose below) after the Phase 6 material (after §6g,
     before `## Cross-cutting`).
   - **6d** — note the symbology adopt-vs-draw decision is **resolved** (adopt MIL-STD-2525E/APP-6(D)
     via `milsymbol`) and routed to Phase 7A.
   - **6.3** — add a one-line pointer that the alert **model** spec + `IntentPreview`/handoff detail
     now live in the Phase 7 research doc.
   - Add a bullet to **## References & background** citing
     `.claude/docs/autonomy-entities-multi-agent-research.md`.
   - (No change to delivered-phase content; pre-1.0, additive.)
2. **NEW changeset** (`pnpm changeset`) — docs-only; patch/none on packages. Note it adds Phase 7
   scope and resolves the 6d symbology decision.
3. Commit, push, open a **draft** PR.

## The drafted Phase 7 section (exact prose to insert into ROADMAP.md)

## Phase 7 — Autonomy, entities & multi-agent

Phase 6 makes the *single-entity* operational system exceptional (status ladder, telemetry, alerts,
the expressive↔operational register). It does not model what Auterion actually operates: **many
vehicles, as a fleet and as a swarm, across domains, under autonomy, on a map, in contested RF.**
Today every operational primitive is single-entity — `StatusBadge` (one severity), `TelemetryValue`
(one reading), `AlertBanner` (one alert). Phase 7 adds the multi-agent layer. It is grounded in a
dedicated research pass (`.claude/docs/autonomy-entities-multi-agent-research.md`).

**The spine.** Every mature C2 reference tool — Anduril Lattice, NASA Open MCT, Palantir, ATAK /
Cursor-on-Target — is built on **one typed `Entity` object that backs many views**: the same atom
renders as a map marker, a roster row, and an inspector panel. That atom is the foundational unit
here (the `EntityIcon` the original design-guidance research named but never built). Build it first;
everything else composes on it.

### Load-bearing constraints (decided)

- **Atom before kitchen sink (Principle 3).** Ship the entity atom + its token layer and validate
  it on *one* real surface before any collective/swarm components. No speculative swarm widgets.
- **Identity ≠ severity.** Affiliation (friend/hostile/neutral/unknown/…) is a *new, orthogonal*
  token axis — it must not overload the `alarm→…→nominal` severity ladder, which stays invariant.
- **Redundant, grayscale/NVIS-safe encoding.** Per MIL-STD-2525 / APP-6, affiliation + domain +
  status are carried by **frame shape** redundantly with color, so an entity is legible in
  monochrome / under night-vision. Never color-only (consistent with the existing non-color-cue gate).
- **Renderer-agnostic atom.** `EntityIcon` is an SVG atom consumed by both the DOM roster and a
  *separate* map-integration layer. Heavy map rendering (MapLibre/deck.gl) stays **out of the core
  DS package** — the DS ships the symbol + tokens, not a mapping engine.
- **Additive/opt-in** like the rest of the operational layer; expressive surfaces are unaffected.

### Dependency shape

```
7A  ENTITY ATOM + TOKENS   (Entity model · EntityIcon · affiliation/domain/freshness tokens)
        │  validate on one FleetList-over-a-basemap
        ▼
7B  OPERATIONAL COMPOSITES  (alert model [from 6.3] · app shell [Calcite vocab, 6.4] · DataFreshness/Time-Conductor)
        ├───────────────────────────┐
        ▼                           ▼
7C  AUTONOMY DISPLAY          7D  COLLECTIVE / SWARM   (build last)
```

### Sub-phases

| Sub-phase | Ships | Size |
|---|---|---|
| **7A — Entity atom & tokens** | `Entity` data model; `EntityIcon` (renderer-agnostic SVG, MIL-STD-2525E/APP-6(D) via `milsymbol`); `FleetList` + `InspectorPanel`; **new token categories: affiliation/identity, domain/environment, data-freshness**. Validated on one FleetList that also drops onto a basemap. | L |
| **7B — Operational composites** | Alert **model** (`useAlertModel`/`AlertManager` — IEC-62288/BAM state machine: unack→silenced→ack→transferred→rectified, mandated sort, time-bounded silence, escalation timer, same-priority aggregation; **color=priority, motion=ack-state**; composes base `AlertBanner`/`StatusBadge`, opt-in). Operational **app shell** (Calcite Shell→ShellPanel→Panel/Block + ActionBar + Flow drill-down). `DataFreshness` (live/stale/lost/last-known + age) + shared Time-Conductor (live vs replay). | XL |
| **7C — Autonomy display** | `AutonomyMode` (level-of-autonomy indicator); `IntentPreview` ("about to do" before irreversible actions, composes the 6.3 guarded action); `ConfidenceSignal`; `TakeoverRequest`/handoff. Content slots from the SAT model (current state/intent · reasoning · projected outcome). Mode changes must be **salient** (automation-surprise avoidance). | XL |
| **7D — Collective / swarm** | `CollectiveStatus` (K-of-N health **gradient**, not a count — swarm stays operational while agents drop); abstraction/granularity control (collective↔group↔agent); selection (marquee + beacon); `Playbook` / command-by-intent; role-topology affordance (leader/predator/stakeholder); neglect-benevolence guard. **Only after 7A–C and a real swarm surface exists.** | XL |

### Map / rendering substrate (decisions)

- **Stack:** MapLibre GL (themeable vector basemap; paint-property + feature-state for **no-reflow**
  high-rate updates) **+ deck.gl** (GPU entity layers, ~1M points @60fps). Cesium only for true
  3D/time-dynamic. **Spike before committing.**
- **Symbol pipeline:** `milsymbol` → SVG at low counts (fits the recipe/DOM system), → Canvas/texture
  for deck.gl at high counts. SIDC + options is where tokens bind to affiliation/domain/type.
- **Themes:** model day/dark/high-contrast/**NVIS** basemaps as token sets; NVIS is a real
  **wavelength constraint** (≈630–930 nm suppressed), not merely a dark palette — extends `darknight`.
- **Multi-platform tokens:** Qt/QML output (for AMC/QGroundControl) is a **build-it-yourself**
  Style-Dictionary format, not turnkey — budget for it if Skynode-ecosystem Qt surfaces are in scope.

### What moved here vs stayed in Phase 6

- **6d symbology decision — RESOLVED:** adopt MIL-STD-2525E / APP-6(D) via `milsymbol` rather than
  draw custom; the entity-type icon set and affiliation/domain frames land in **7A**.
- **6.3 alert model** — the precise standards-traceable spec lives in 7B's `AlertManager`; the 6.3
  guarded-action / intent-preview work feeds 7C.
- **6.4 GCS layout / fleet templates** — the app-shell vocabulary is 7B; templates remain 6.4.
- **6.5 viz palette** — the CVD-safe identity/categorical palette overlaps 6.5 and is shared.

### External flags / sign-off (don't self-certify)

MIL-STD-2525E / APP-6(D) symbology conformance · IEC 62288 / Bridge Alert Management alert model ·
MIL-STD-1472 · DO-365 / FAA 25.1322 alerting semantics. Prep conformance checklists; expert review.
Exact enum/hex/SIDC tables in the research doc rest on search summaries (sandbox blocked direct
fetch) — **re-pull from primary sources before any build spec.**

**Phase 7 acceptance:** a renderer-agnostic `Entity`/`EntityIcon` atom drives both a roster and a
basemap from one model, with affiliation/domain/data-freshness token axes orthogonal to the severity
ladder and grayscale/NVIS-safe; an opt-in alert **model** implements the IEC-62288/BAM state machine
over the base primitives; an autonomy-display set (mode/intent/confidence/takeover) exists per the
SAT model; and a collective/swarm layer represents K-of-N health and command-by-intent — each layer
additive and validated on a real surface before the next.

## First-PR suggestion (7A, when ready)

`Entity` model + `EntityIcon` SVG atom (dual map/roster renderer) + affiliation/domain/data-freshness
token categories, validated on a `FleetList`. Spike `milsymbol` rendering. This is the atom-first,
restraint-respecting entry point; everything else composes on it.
