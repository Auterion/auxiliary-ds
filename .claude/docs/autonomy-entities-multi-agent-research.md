# Deep research — Autonomy, entities & multi-agent layer for Auxiliary

**Question:** What UI/UX patterns, components, and design tokens does a modern multi-agent /
drone-swarm / multi-domain C2 interface require, and how should they be structured in a Vue 3 +
Tailwind, token-driven design system?

**Method:** 5 parallel research angles (entity/symbology · swarm/span-of-control · autonomy display ·
operational design systems + alert model · web map/token implementation). ~70 cited claims.
**Verification caveat:** sandboxed `WebFetch` returned HTTP 403 on most primary sites, so claims rest
on search-result summaries against authoritative URLs. The load-bearing findings are *cross-
corroborated across independent agents and domains* (e.g. three-tier severity appears identically in
maritime IEC-62288 and FAA 25.1322; the "one entity object → many views" pattern appears
independently in Lattice, Open MCT, Palantir, and TAK/CoT). Exact enum/hex/SIDC tables must be
re-pulled directly before any build spec.

---

## The single most important finding (the spine)

Every mature C2 reference tool is built on **one typed *entity* / *domain-object* that backs multiple
views** — the *same* object renders as a map marker, a roster row, and an inspector panel:

- **Anduril Lattice** — an "entity" is a component-bag (presence/absence of components, not a type
  hierarchy, defines it); templates: **track** (sensed, not controlled), **asset** (controllable,
  accepts tasks), **geo-entity** (region/POI). A `mil_view` component carries `disposition`,
  `environment`, nationality; `ontology.platform_type` drives the icon. The name renders in the side
  panel; external identifiers let other systems reference the same entity.
  (developer.anduril.com/guides/entities/overview, docs.anduril.com/guide/entity/publish)
- **NASA Open MCT** — "everything is a Domain Object"; the left tree and the Inspector are both
  registries of views over the *same* objects. (github.com/nasa/openmct/blob/master/API.md)
- **Palantir** — typed objects (Entity/Event/Document); the Object Explorer drives map + list +
  chart + graph from one atom, defaulting geopoints to a clustered map. (palantir.com/docs)
- **TAK / Cursor-on-Target** — the canonical track atom: `uid` + `type` (affiliation/dimension tree,
  e.g. `a-f-G` = atoms·friendly·ground) + `point` (lat/lon/hae + ce/le error) + `detail.contact`
  (callsign) + `detail.track` (course+speed) + `time/stale`. (mitre.org pdf, freetakteam docs)

**Implication for Auxiliary:** the foundational unit is an **`Entity` model + `EntityIcon` atom** with
two renderers (map-marker view + list-item/inspector view). This is exactly what the in-repo research
doc already named but never built (`auterion-design-guidance-research.md:221,294,301` —
`EntityIcon`, `FleetList`, `InspectorPanel`). Build this first; everything else composes on it.

---

## Area 1 — The entity/track atom & symbology

**Recurring patterns.** A MIL-STD-2525 / NATO APP-6 symbol = **frame** (shape) + **icon** (type
glyph) + **modifiers/amplifiers** (text fields). The **frame shape simultaneously encodes three
dimensions**: standard identity (affiliation), battle-dimension/environment, and status —
*redundantly with color* so it survives a monochrome display (grayscale/NVIS-safe).

- Affiliation (7 values: pending/unknown/assumed-friend/friend/neutral/suspect/hostile) →
  frame shape: circle/rectangle=friend, diamond=hostile, square=neutral, quatrefoil=unknown;
  color: blue=friend, red=hostile, green=neutral, yellow=unknown.
  (en.wikipedia.org/wiki/NATO_Joint_Military_Symbology)
- Environment/battle-dimension (air/ground/sea-surface/subsurface/space/SOF) also in frame geometry;
  APP-6(D) added **unmanned-systems, EW, cyber** sets — directly relevant to drones.
- Status present-vs-anticipated = solid vs **dashed** frame (DTIC testing: dashed beat a "?" glyph).
  (apps.dtic.mil/sti/tr/pdf/ADA484484.pdf)
- 2525D/APP-6(D) = a **20-digit SIDC** (Set A identity/status/amplifiers, Set B entity type),
  icons composable rather than pre-baked. (docs.carmenta.com milstd2525d_tactical_sidc)
- **milsymbol** (spatialillusions) generates 2525C/D/E + APP-6 B/D/E as **pure-JS SVG or Canvas**,
  zero deps, **1000 symbols < 20 ms**; exposes amplifier fields as named options
  (`uniqueDesignation`, `direction`, `speed`, `altitudeDepth`, `location`, `dtg`,
  `combatEffectiveness`, `iffSif`, …). (github.com/spatialillusions/milsymbol)

**The entity-atom data model (consensus across tools):** stable **ID** · **affiliation** ·
**environment/domain** · **type glyph** · **status** (present/anticipated + operational condition) ·
**callsign** · **geolocation** (lat/lon/alt + error) · **kinematics** (heading + speed) · optional
amplifiers (quantity, higher-formation, combat-effectiveness, IFF, DTG).

**Auxiliary primitives:** `Entity` (data model) · `EntityIcon` (renderer-agnostic SVG atom, used by
BOTH map and roster) · `EntityListItem` / `FleetList` · `InspectorPanel`.
**Token categories:** **affiliation/identity** (color + frame-shape, redundant; *distinct* from the
severity ladder) · **domain/environment** (air/ground/surface/subsurface/space) · entity-type icon set.
**Sign-off:** MIL-STD-2525E / APP-6(D) conformance.

## Area 2 — Fleet (N independent) vs swarm (collective)

**Recurring patterns.**
- **Abstraction is the core HSI principle:** the operator must perceive/influence an *abstracted
  collective state*, not N agents — so the swarm's primary UI object is **one collective entity**, not
  N rows. Support **dynamic granularity of control** (collective → sub-team → agent).
  (sciencedirect S3050741325000291)
- **Collective health is a gradient, not a count:** model per-agent state on healthy→degraded→lost
  and aggregate to a swarm-level status that stays "operational" while individuals drop (graceful
  degradation / "K-of-N"). "Is the collective degrading?" is itself a first-class display.
  (link.springer 978-3-031-35634-6_23, sciencedirect S0951832023008347)
- **Role topology archetypes:** leader / predator(repulsor) / stakeholder(anonymous subset);
  leader-based performs best, predator highest workload. Influenced membership can be ephemeral.
  (faculty.cs.byu.edu PendletonGoodrich2013)
- **Neglect benevolence:** after a command, *waiting* can improve performance — discourage instant
  re-commanding; surface a "settling" state. (researchgate 283114321)

**Auxiliary primitives:** `CollectiveStatus` (K-of-N health gradient + degradation indicator) ·
granularity/abstraction control (collective↔group↔agent) · role-topology affordance.
**Token categories:** collective-health gradient; reuse severity ladder for the rollup.
**Restraint:** the most novel + hardest area — build LAST, only after the entity atom and a real
swarm surface exist.

## Area 3 — Span-of-control / one-operator-to-many

**Recurring patterns.**
- **Fan-out capacity** = neglect-time ÷ interaction-time, minus operator wait-times; **SA-recovery
  wait time dominates** (≈36% capacity loss in a modeled management-by-exception system). Anything
  that cuts per-vehicle interaction time or raises neglect tolerance raises manageable N.
  (dspace.mit.edu/handle/1721.1/90280)
- **Command-by-intent, not per-vehicle waypoints:** DARPA OFFSET "**plays**" (sports-playbook
  analogy) + freestyle + a tactics exchange; operator directs **tasks bound to capability
  requirements**, autonomy self-assigns vehicles. Realized span: **1 operator : 160 platforms**
  (OFFSET FX5). (darpa.mil/news/2016/offset-swarm-capabilities, thedefensepost 2022/01/11)
- **Two selection patterns:** marquee region-select (needs per-agent position) vs **beacon**
  broadcast (identity-free, spatial). (faculty.cs.byu.edu PendletonGoodrich2013)
- Shield AI Hivemind frames the goal as inverting the ratio via edge autonomy. (shield.ai)

**Auxiliary primitives:** selection model (marquee + beacon) · `Playbook` / command-by-intent
surface · bulk/guarded action scaled to N (composes the 6.3 GuardedAction).
**Pattern:** summarize → drill → act.

## Area 4 — Autonomy-display layer

**Recurring patterns.**
- **Level-of-autonomy** is an ordinal scale (Sheridan-Verplank 10-level; SAE J3016 0–5) shown as a
  **persistent mode indicator / segmented control** (Manual/Shared/Supervisory/Autonomous; GCS
  "flight mode"). *Caveat:* J3016 does NOT guarantee a takeover countdown — don't imply one.
  (ri.cmu.edu walkerHFES2013, users.ece.cmu.edu/~koopman/j3016, PMC7589587, ardupilot flight-modes)
- **SAT model** (Army Research Lab, Chen et al.) — agent transparency in **3 tiers**: L1 current
  state/intent/plan · L2 reasoning/constraints · L3 projection of outcomes. Higher transparency
  improved SA, performance, AND trust across RoboLeader / IMPACT / Autonomous Squad Member.
  → the exact **content slots** an autonomy component needs.
  (apps.dtic.mil AD1143367, tandfonline 1463922X.2017.1315750)
- **Intent Preview:** before any irreversible/significant action, show a scannable plain-language
  plan with per-step approve/reject; irreversible steps flagged by **icon + distinct color**.
  (aiuxdesign.guide/patterns/intent-preview)
- **Confidence/uncertainty** visualization (bar/%/color) + **trust-calibration** cues
  (visual/auditory/verbal); an **audit/outcome-history** surface, not just instantaneous confidence.
  (aiuxdesign.guide/patterns/confidence-visualization, thesai.org Paper_122)
- **Automation surprise / mode confusion** is safety-load-bearing (NHTSA/NTSB Tesla L2 findings):
  make mode changes **salient**; takeover requests must convey **urgency + a time budget**.
  (nhtsa EA22002, sciencedirect S1369847825001238)

**Auxiliary primitives:** `AutonomyMode` (LoA indicator) · `IntentPreview` (composes 6.3 guarded
actions) · `ConfidenceSignal` · `TakeoverRequest`/handoff.
**Token categories:** autonomy-level scale; confidence ramp.
**Sign-off:** MIL-STD-1472; DO-365/FAA alerting semantics for handoff.

## Area 5 — The alert MODEL (standards-traceable)

**Recurring patterns.** Three-tier severity is **cross-domain-validated**: BAM/IEC-62288
Alarm>Warning>Caution (+Emergency) ≈ FAA 25.1322 Warning>Caution>Advisory. **Severity and state are
orthogonal:** color = priority, **motion (flashing→steady) = acknowledgment state**.

- Alert **state machine:** active-unacknowledged → silenced → acknowledged → (responsibility)
  transferred → rectified. The list renders state, not just severity.
- **Mandated sort:** most-important first, unacknowledged-before-acknowledged, cautions last;
  re-sorts on every event.
- **Per-priority ack:** alarms/warnings ack individually; emergency + caution are silence-only.
- **Time-bounded silence** (re-alert after 30 s); **escalation timer** (warning→alarm, ≤5 min);
  **aggregation only within same priority** (the "12 GPS warnings" rollup).
- Critical alerts need **≥2 senses** (aural+visual); only one aural at a time, higher preempts lower.
  (iec.ch BAM pdf, gov.uk UK21/N004, faa 25.1322, imorules.com)

**Auxiliary primitives:** `useAlertModel` / `AlertManager` (list + state machine) — **this IS roadmap
6.3**; the research gives it a precise, standards-traceable spec. Composes the base `AlertBanner`/
`StatusBadge` (opt-in, per the 6.3 constraint). Add an aural-cue manager (queue/preempt).
**Token categories:** alert-state (motion encodes state) layered on the existing severity ladder.
**Sign-off:** IEC 62288 Table 2 / Annex F icons; FAA 25.1322.

## Area 6 — Contested-environment / degraded state

**Recurring patterns.** **Never blank lost data — show last-known greyed-out with explicit age.**
Distinguish **stale** (data timeout, ~60 s) from **lost link** (heartbeat timeout, ~5 s, ArduPilot
GCS-failsafe default) as separate visual states; carry GPS-denied / comms-loss as first-class
operational states. (github SignalK #2350, ardupilot gcs-failsafe)

**Auxiliary primitives:** `DataFreshness` / staleness wrapper (live / stale / lost / last-known +
age) — extends `TelemetryValue`. A shared **Time Conductor** (Open MCT) toggling real-time vs
fixed/historical synchronizes "live vs replay/last-known" across views.
**Token categories:** **data-freshness** (live/stale/lost/last-known) — orthogonal to severity.

## Area 7 — Map/geospatial layer & implementation

**Recurring patterns / decisions.**
- **Layered stack:** MapLibre GL (themeable vector basemap, GPU/60fps, paint-property + feature-state
  for **no-reflow** attribute updates) **+ deck.gl** (GPU entity layers, ~1M points @60fps; 10M →
  10–20fps). Reserve **Cesium** for true 3D/time-dynamic (CZML), accepting a ~few-thousand-billboard
  Entity-API ceiling. (deck.gl/docs/developer-guide/performance, maplibre.org, cesium.com)
- **Symbol pipeline:** milsymbol → **SVG** at low counts (fits the recipe/DOM system) or →
  **Canvas/texture** for deck.gl IconLayer at high counts. SIDC + `setOptions` is where tokens bind.
- **No-reflow rule:** drive appearance via paint-properties / feature-state / `updateTriggers` over
  pre-computed data — never layout properties or per-frame accessor recompute.
- **Calcite app-shell vocabulary:** Shell → Shell-Panel → Panel/Block + **Action Bar** + **Flow**
  (push/pop drill-down) = the canonical sidebar+map+inspector skeleton. (developers.arcgis.com/calcite)
- **OpenBridge:** four ambient palettes (Bright/Day/Dusk/**Night**); color split into **UI /
  Instrument / Alert** groups (alert ramp is its own token group); ships Lit web components with Vue
  wrappers. (openbridge.no)
- **NVIS/night is a wavelength constraint** (≈630–930 nm suppressed), not merely a dark palette — a
  real token-level constraint for a true night/NVIS theme (extends `darknight`).
  (agdisplays.com/services/nvis-design-integration)
- **Multi-platform tokens:** Style Dictionary v4 = DTCG + CSS/SCSS/iOS/Android/Flutter out of the box;
  **Qt/QML is a custom-format build-it-yourself path** (reference: TilmanGriesel/style-dictionary-qml-
  example) — relevant because AMC/QGroundControl is Qt. Budget for it; not turnkey. (styledictionary.com)

**Architecture recommendation:** keep heavy map rendering **out of the core DS package**; ship
`EntityIcon` as a renderer-agnostic SVG atom that the DOM roster and a separate map-integration layer
both consume. Spike MapLibre+deck.gl before committing.

---

## What's genuinely new vs. already in the roadmap

| Area | Status in current ROADMAP |
|---|---|
| Alert **model** (Area 5) | **Already 6.3** — research = precise spec |
| Guarded/confirm + intent preview (Area 4 partial) | **Already 6.3** (GuardedAction) |
| Map symbology adopt-vs-draw (Area 1, 7) | **6d** decision (parked) — research resolves: adopt 2525/APP-6 via milsymbol |
| GCS app shell / fleet templates (Area 7) | **6.4 Compose** (templates only) |
| Viz/identity CVD-safe palette (Area 1) | overlaps **6.5 Data-viz** |
| **Entity model + EntityIcon + affiliation/domain/freshness tokens** | **UNSCOPED** ← the gap |
| **Autonomy-display layer** (AutonomyMode/Intent/Confidence/Takeover) | **UNSCOPED** ← the gap |
| **Swarm/collective layer** (CollectiveStatus/granularity/playbook) | **UNSCOPED** ← the gap |

So ~half threads through existing Phase 6; the **entity/identity token layer, the autonomy-display
layer, and the swarm-collective layer** are the genuinely new territory.

## Restraint-filtered recommendation (Principle 3 — atom + tokens first)

Proposed **"Phase 7 — Autonomy, entities & multi-agent"** (or fold A/B into 6.3/6.4):

- **7A — Atom + tokens (foundational, build first).** `Entity` model + `EntityIcon` (SVG, dual
  renderer) + token categories: **affiliation/identity**, **domain/environment**, **data-freshness**.
  Validate on ONE real surface: a `FleetList` whose rows also drop onto a basemap. milsymbol spike.
- **7B — Highest-value composites (already half-scoped).** Alert **model** (6.3, standards spec
  above) + operational **app shell** (Calcite vocabulary, 6.4) + `DataFreshness`/Time-Conductor.
- **7C — Autonomy display.** `AutonomyMode` (LoA) · `IntentPreview` · `ConfidenceSignal` ·
  `TakeoverRequest` — content slots from the SAT 3-tier model.
- **7D — Collective/swarm (last).** `CollectiveStatus` (K-of-N) · granularity control · selection
  (marquee+beacon) · `Playbook`/command-by-intent. Only after 7A–C and a real swarm surface.

**Decisions to make:** (1) map stack (MapLibre+deck.gl vs Cesium) — spike; (2) map rendering lives
outside core DS package; (3) is this Phase 7 or an extension of 6.3/6.4; (4) Qt/QML token output
budget (AMC).
**Expert sign-off (don't self-certify):** MIL-STD-2525E/APP-6(D), IEC 62288/BAM, MIL-STD-1472,
DO-365/FAA 25.1322.

## Confidence

**High (cross-corroborated):** the entity-atom-backs-many-views pattern; three-tier severity;
frame-shape redundant encoding; fan-out & command-by-intent; SAT 3-tier; MapLibre+deck.gl layering;
milsymbol capability. **Medium (single-source / paywalled exact values):** precise SIDC position
table, IEC-62288 Annex-F icon glyphs, OpenBridge hex, exact Lattice enums — re-pull before a build
spec.

---

## Sources

### Entity / track / symbology
- https://nps.edu/documents/104517539/109705106/MIL-STD-2525.PDF
- https://en.wikipedia.org/wiki/NATO_Joint_Military_Symbology
- https://apps.dtic.mil/sti/tr/pdf/ADA484484.pdf
- https://proceedings.esri.com/library/userconf/proc18/tech-workshops/tw_1914-242.pdf
- https://docs.carmenta.com/pages/milstd2525d_tactical_sidc.html
- https://github.com/spatialillusions/milsymbol/blob/master/docs/README.md
- https://developer.anduril.com/guides/entities/overview
- https://docs.anduril.com/guide/entity/publish
- https://freetakteam.github.io/FreeTAKServer-User-Docs/About/architecture/mil_std_2525/
- https://www.mitre.org/sites/default/files/pdf/09_4937.pdf
- https://github.com/nasa/openmct/blob/master/API.md
- https://www.palantir.com/docs/foundry/object-explorer/explore-charts

### Swarm / span-of-control
- https://www.sciencedirect.com/science/article/pii/S3050741325000291
- https://faculty.cs.byu.edu/~mike/mikeg/papers/PendletonGoodrich2013ScalableHSI_final2.pdf
- https://www.researchgate.net/publication/380049890_Human-Swarm_Interaction_and_Collaboration
- http://dspace.mit.edu/handle/1721.1/90280
- https://thedefensepost.com/2022/01/11/raytheon-drone-swarm-darpa/
- https://www.darpa.mil/news/2016/offset-swarm-capabilities
- https://apps.dtic.mil/sti/tr/pdf/ADA444096.pdf
- https://shield.ai/hivemind-for-operational-read-and-react-swarming/
- https://www.researchgate.net/publication/283114321_Neglect_Benevolence_in_human_control_of_robotic_swarms
- https://www.sciencedirect.com/science/article/abs/pii/S0951832023008347
- https://link.springer.com/chapter/10.1007/978-3-031-35634-6_23

### Autonomy display
- https://www.ri.cmu.edu/pub_files/2014/9/walkerHFES2013loa-final-CR.pdf
- https://users.ece.cmu.edu/~koopman/j3016/
- https://www.ncbi.nlm.nih.gov/pmc/articles/PMC7589587/
- https://ardupilot.org/copter/docs/flight-modes.html
- https://arxiv.org/pdf/2303.06776
- https://apps.dtic.mil/sti/html/trecms/AD1143367/
- https://www.tandfonline.com/doi/full/10.1080/1463922X.2017.1315750
- https://www.aiuxdesign.guide/patterns/intent-preview
- https://www.smashingmagazine.com/2026/02/designing-agentic-ai-practical-ux-patterns/
- https://www.aiuxdesign.guide/patterns/confidence-visualization
- https://thesai.org/Downloads/Volume16No12/Paper_122-Confidence_Based_Trust_Calibration_in_Human_AI_Teams.pdf
- https://static.nhtsa.gov/odi/inv/2022/INCR-EA22002-14496.pdf
- https://www.sciencedirect.com/science/article/pii/S1369847825001238

### Operational design systems & alert model
- https://www.openbridge.no/about-openbridge
- https://www.openbridge.no/guidelines/components
- https://www.openbridge.no/components/alert-components/alert-notification
- https://github.com/Ocean-Industries-Concept-Lab/openbridge-webcomponents
- https://assets.iec.ch/public/tc80/Supporting%20Document%20Bridge%20Alert%20Management%20for%20mariners%20V4.pdf
- https://wwwcdn.imo.org/localresources/en/KnowledgeCentre/IndexofIMOResolutions/MSCResolutions/MSC.302(87).pdf
- https://www.gov.uk/marine-equipment-approved-recommendations/bridge-alert-management-uk21-slash-n004
- https://www.imorules.com/GUID-6099A467-810A-4EF5-9FED-5364DD4E8398.html
- https://webstore.iec.ch/en/publication/64659
- https://www.faa.gov/sites/faa.gov/files/2022-11/25.1322.pdf
- https://www.federalregister.gov/documents/2010/11/02/2010-27629/flightcrew-alerting
- https://hsi.arc.nasa.gov/flightcognition/Publications/NASA_TM_2017-219720.pdf
- https://developers.arcgis.com/calcite-design-system/foundations/layouts/
- https://developers.arcgis.com/calcite-design-system/components/flow/
- https://nasa.github.io/openmct/about-open-mct/

### Map / token implementation
- https://geomatico.es/en/vector-tiles-mapbox-maplibre-or-deckgl-for-my-3d-map/
- https://deck.gl/docs/developer-guide/performance
- https://maplibre.org/projects/gl-js/
- https://cesium.com/blog/2016/07/20/cesium-and-milsymbol
- https://maplibre.org/maplibre-style-spec/expressions/
- https://www.palantir.com/docs/foundry/workshop/widgets-data-freshness
- https://github.com/SignalK/signalk-server/issues/2350
- https://ardupilot.org/copter/docs/gcs-failsafe.html
- https://styledictionary.com/info/dtcg/
- https://github.com/TilmanGriesel/style-dictionary-qml-example
- https://www.maptiler.com/maps/dark/
- https://agdisplays.com/services/nvis-design-integration
