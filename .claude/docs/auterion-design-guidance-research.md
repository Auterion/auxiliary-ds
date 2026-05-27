# Auterion Design Guidance
## Defense UI of the Future — Brand, Applications, and Auxiliary

*Strategic guidance for redesigning auterion.com and Auterion's application suite, informed by benchmarks in defense-tech, mission-critical, and aerospace HMI design.*

---

## 01 — The Thesis

Auterion occupies a rare position: a company building autonomous aerospace systems that is simultaneously consumer-visible enough to need a world-class brand and operationally serious enough to need interfaces that work in the field under real stress. Most companies in this space can do one or the other. Anduril has proven you can do both — their design org serves both functions under one VP. That is the model.

The goal is not to imitate Anduril. The goal is to define a distinct design language that is unmistakably Auterion — one that is credible in a defense procurement room, compelling on a product page, and usable by an operator in the field. The unifying idea:

> **Operational truth, expressed with precision.**

Not "beautiful and functional" — that is a generic aspiration. The specific quality Auterion's interfaces should have is the feeling of *measured certainty* — the same quality you feel looking at a 1969 Apollo flight console, a Swiss railway timetable, a Leica M rangefinder. Everything present is intentional. Nothing decorates. And yet the result is undeniably beautiful.

This guidance document is organized in four sections:
1. **Design Language** — the visual vocabulary that unifies brand and product
2. **auterion.com** — guidance for the marketing surface
3. **Applications** — guidance for GCS, telemetry, and operational interfaces
4. **Auxiliary** — how these principles ground the design system being built

---

## 02 — Design Language

Auterion's design language is already defined by three founding traditions. This section makes them operational — concrete enough to make decisions from.

### The Three Traditions

**Swiss International Style (1950s–1970s)**
Grid. Hierarchy. Negative space as signal. The grid is not a constraint — it is a precision instrument. Every element should occupy its position with the same certainty a coordinate occupies a map. Typography does not decorate, it *structures*. IBM Plex Mono is the primary type vehicle because monospace type carries institutional weight that proportional type cannot — it is the typeface of measurement, of code, of the terminal, of flight data recorders.

*Applied:* tight baseline grids, hard-edged alignment, typographic hierarchy that is legible before color is applied, zero decorative illustration.

**1960s NASA/JPL Aerospace Operational Design**
The canonical reference is the Apollo MOCR (Mission Operations Control Room) at JSC — not because it is retro, but because it solved a genuinely hard problem: multiple operators, different roles, heterogeneous data streams, high-stakes decisions, zero tolerance for ambiguity in the interface layer. The UI vocabulary that emerged from this era — monochrome displays, status codes over pictograms, alphanumeric precision, hierarchical alert states — is not aesthetic nostalgia. It is tested ergonomics.

*Applied:* status vocabulary over icon vocabulary, explicit numeric readout alongside visual representations, alert hierarchy that is legible in peripheral vision, minimal saturated hue reserved for high-priority state.

**New Industrial Aesthetic**
The correction to over-referencing the past. This is what grounds the language in 2025: materials honesty, structural visibility, the aesthetics of precision manufacturing. Not brutalism — restraint. The seam on an anodized aluminum housing. The font on a PCB silkscreen. The calibrated tick of a vernier caliper. This tradition says: the object should look like it knows what it is for.

*Applied:* dark neutral grounds that read as material rather than theme, surfaces that feel like machined metal rather than painted plastic, weight in typography and spacing that matches the weight of the subject matter.

---

### The Core Visual Decisions

These decisions apply across both brand and product surfaces.

**Color**
The palette is not a mood palette — it is a signal vocabulary. Each color carries a meaning that should be consistent across every surface.

| Role | Purpose | Notes |
|---|---|---|
| Ground | Primary background | Near-black, slightly warm or desaturated neutral. Not pure black — a material tone. |
| Surface 1 | Primary container | 5–8% lighter than Ground. For panels, cards, sidebars. |
| Surface 2 | Elevated container | Interactive states, hover, active. |
| Line | Border / separator | Hairline weight. High enough contrast to structure without asserting. |
| Content High | Primary text | Near-white, high contrast. |
| Content Mid | Secondary text | Labels, metadata, support text. |
| Content Low | Tertiary / disabled | Suffixes, placeholders, inactive states. |
| Operational | Interactive accent | The identity color. Reserved for interactive affordances, CTA, selected state. Use sparingly. |
| Caution | Attention / warning | Yellow-adjacent. High luminance on dark ground. |
| Alarm | Critical / danger | Red-adjacent. Maximum priority. Flashable in safety-critical contexts. |
| Advisory | Status / informational | Blue-adjacent. Situational awareness data. |
| Safe | Nominal / confirmed | Green-adjacent. Mission success, locked state, confirmed action. |

The five operational states (Operational, Caution, Alarm, Advisory, Safe) should directly map to the OpenBridge / MIL-STD-1472H alert hierarchy. This is not brand whimsy — it is the standard that customers will evaluate compliance against.

**Type**
IBM Plex Mono is primary. Not a supporting voice — the primary voice. Use it at all sizes, for all data, for all UI text. It communicates precision, repeatability, and technical seriousness that no proportional typeface can match in this context.

A second typeface for marketing/editorial surfaces is permissible but must be structurally neutral — consider an expanded grotesque or a condensed neo-grotesque that reads as *instrument panel* rather than *consumer app*. Never a humanist sans. Never anything warm.

Typographic scale should be anchored to multiples of the base grid. If the base unit is 4px, the type scale reads: 10 / 12 / 14 / 16 / 20 / 24 / 32 / 40 / 56. No fluid type — operational interfaces require predictable geometry.

**Spacing and Grid**
Base unit: 4px. All spacing is multiples. The grid is an 8-column grid for compact interfaces (GCS panels, telemetry cards), a 12-column grid for marketing, and a 16-column grid for editorial content.

Density matters. Not all surfaces should be equally dense. Applications should be high-density by default — users are looking for information, not breathing room. Marketing should breathe — hierarchy established by space, not by contrast alone.

**Motion**
Operational interfaces: motion should be invisible as an effect and present only as state-change signal. A panel appearing is not an opportunity for a transition — it is a data event. Smooth but immediate. 150ms max for micro-transitions. 0ms preference for anything in the flight-critical path.

Marketing surfaces: motion earns its place. Purposeful animation communicating scale (flyover, drone path, terrain), system behavior, or company confidence. Never parallax scroll effects that serve only aesthetics.

**Iconography**
No decorative icons. All icons are operational. They should have the visual weight and legibility of aviation symbology — not SaaS icons. Target size minimum 20×20px rendered at 1.5px stroke. Prefer geometric, rectilinear construction over organic forms. The icon vocabulary should feel like it belongs in an avionics suite, not a productivity app.

---

### What to Take From Each Benchmark

**From Palantir Blueprint:** The density model. Blueprint proves that a React-based, dark-first, data-dense component library can be both rigorously documented and visually coherent. Take the data-table and tooltip patterns. Take the interaction model for multi-select, filter groups, and nested menus. Take the philosophy that components should be opinionated about density, not about decoration.

**From Esri Calcite:** The geospatial panel vocabulary. Calcite's Action Group, List, Panel, and Sheet components are solved patterns for the sidebar/map/details layout that every GCS uses. Take the structural skeleton — inspect their panel-header, action-bar, and notice components carefully.

**From OpenBridge:** The compliance grammar. OpenBridge is the only open-source design system that explicitly solves for IEC 62288 and operator fatigue over time. Take the alert hierarchy — their five-level model (Alarm, Warning, Caution, Advisory, Normal/Safe) maps directly to MIL-STD-1472H. Take the color assignment rules for alert states. Take the icon stroke weight and minimum size guidance.

**From NASA Open MCT:** The telemetry layout model. Open MCT's composable workspace — resizable panes, persistent layouts, plugin-based view types — is the architectural model for a GCS that handles heterogeneous data streams. Take the idea that the dashboard is user-authored, not developer-designed. Take the timeline strip.

**From Anduril EagleEye/Lattice:** The visual register. The palette (very dark ground, monochrome neutrals, one active-mission accent color, status halos on entity icons), the use of horizontal scan lines as structural elements, the sparse but precise typography, the absence of decorative chrome. This is the correct reference register — not for copying, but for calibration.

---

## 03 — auterion.com

### The Problem With Most Defense-Tech Websites

They either look like consumer SaaS (dark mode, purple gradients, glowing icons — the "Vercel template" aesthetic), or they look like legacy defense contractors (navy blue, stock photo of a soldier, Times New Roman). Neither is credible to the actual buyer.

The Anduril anime-ad approach works for Anduril because Palmer Luckey is a recognizable founder with a consumer electronics background and a deliberate cultural strategy. That is not Auterion. Auterion's credibility comes from depth of expertise in autonomous flight systems, from the Pixhawk/PX4 lineage, from the actual technical substance of what the company builds. The website should express that.

### What auterion.com Should Do

**Communicate operating scale.** The most underused asset a UAS/autonomous systems company has is the visual scale of what they actually build: drone formations over terrain, sensor footprints, autonomous decision trees, real mission data. Not rendered product shots of the drone on a white background — operational context.

**Demonstrate technical specificity.** The buyer is a systems engineer, a program manager, or an integrations lead. They are reading for evidence of real capability: latency numbers, sensor fusion quality, supported hardware matrix, regulatory status. The site should not hide this behind marketing copy.

**Establish the design language as proof of quality.** A company that builds software for operating autonomous systems in the field should have a website that looks like it was built by people who care about precision. The site is evidence of the product. Sloppy marketing = doubt about the software.

### auterion.com Design Direction

**Structure:**
- Single-scroll homepage with three distinct register shifts: (1) Statement — who Auterion is in four words, with full-bleed operational imagery; (2) System — how the platform works, with technical diagrams; (3) Proof — case evidence, customer logos, technical specifications.
- Navigation: sparse, flat, typographic. No mega-menus. The nav should feel like a flight instrument panel header, not a SaaS product's nav.
- Product pages for each application (Auterion OS, Suite, Mission Control, Nemyx) that are specification-forward — features rendered as structured data, not feature-bullet copy.

**Visual treatment:**
- Ground: near-black (#0B0C0D range). Not pure black.
- Full-bleed photography: real operational scenes — actual hardware in actual environments. No stock. If custom photography is not yet available, use Auterion's own mission footage treated with a flat, de-saturated grade.
- Typography at large scales: IBM Plex Mono in all caps, wide tracking, for statements. IBM Plex Mono regular weight for body and captions. No mixing typefaces on the marketing site — the system speaks in one voice.
- Status halos / bracket notation: use bracket notation as a compositional device on the homepage — wrapping mission stats, coordinates, system names. This is already established as a formal language element in Auxiliary.
- Motion: one hero animation — drone flight path traced over a dark terrain map, rendered in the operational accent color. This communicates the product without requiring explanation.
- Data surfaces embedded in the marketing site: show a live-adjacent telemetry card (simulated, but authentic in format) as part of the product explanation. Prove the design quality of the applications by embedding them in the marketing surface.

**Marketing components to build (from the Auxiliary backlog):**
These should each carry the operational design language, not generic marketing component aesthetics:
- `MarketingStatBar` — mission proof-points rendered as instrument readouts: `[ 847 · ACTIVE DEPLOYMENTS ]`, `[ 99.7% · UPTIME ]`. Not card-grid stats.
- `MarketingQuote` — customer or partner quotes rendered as mission logs — attribution as a callsign or role, not a name+title.
- `MarketingValueGrid` — capabilities rendered as a structured matrix, not an icon grid with copy.
- `MarketingPillars` — core platform pillars rendered with the same visual grammar as an operations dashboard widget.

---

## 04 — Applications

### The Problem With Most GCS / Operational UIs

They are designed by software engineers under time pressure, accumulated feature-by-feature, with no coherent information hierarchy. The result is interfaces that require training not because the domain is complex, but because the interface is incoherent. This is the exact problem Matter, Blueprint, and OpenBridge all exist to solve.

The second problem is the "dark mode SaaS" trap: applying a dark theme to a conventional application layout and calling it "mission-critical UI." Adjusting hue is not designing for operational context. True operational UI has different density, different information hierarchy, different alert vocabulary, different interaction cost models (high-stakes action requires confirmation; time-sensitive action requires acceleration).

### The Design Framework for Auterion Applications

**Five UI Context Levels (from Auxiliary):**

| Level | Surface | Design Priority |
|---|---|---|
| 0 — Foundation | Token primitives | Consistency, compliance, theme-ability |
| 1 — Marketing | auterion.com, brand collateral | Clarity of value, credibility, brand |
| 2 — Conventional | Suite, configuration tools, admin | Efficiency, standard patterns, rapid comprehension |
| 3 — Operational | Mission Control, GCS, telemetry | Situational awareness, error prevention, fatigue resistance |
| 4 — Mission-Critical | OSD, heads-up, alerts in flight path | Human factors compliance, peripheral legibility, alarm management |

Most design systems handle Levels 0–2 adequately. Levels 3–4 are where Auterion needs to do original, principled work. This is the space that OpenBridge, NASA Open MCT, and MIL-STD-1472H address — and where there is almost no good public reference in the UAS domain.

---

### Level 2 — Conventional Applications (Suite, Configuration, Admin)

These follow established patterns. The key guidance is:

- **Panel-based layout.** No full-page scrolling in operational tooling. Everything visible simultaneously or one keyboard shortcut away. Use the Calcite Action Bar + Panel + Shell model as structural reference.
- **Keyboard-complete.** Every destructive or complex action reachable without mouse. Keyboard shortcut vocabulary should be printed in the interface (not hidden in a help modal).
- **State is always visible.** Connection status, sync state, active vehicle, active mission — always in the header or a fixed status bar. Not in a dropdown.
- **No modal-first patterns.** Dialogs only for irreversible actions. Everything else is inline edit, slide-over panel, or expandable row.

### Level 3 — Operational Interfaces (Mission Control, GCS)

This is where Auterion has the most to gain from principled design investment. The reference architecture:

**The Operational Layout Model:**

```
┌─────────────────────────────────────────────────────────────────┐
│  STATUS BAR: [ MISSION NAME ]   [ VEHICLE STATUS ]  [ TIME ]    │
├──────────┬─────────────────────────────────────┬────────────────┤
│  FLEET   │                                     │  INSPECTOR     │
│  PANEL   │           PRIMARY MAP / VIEW        │  PANEL         │
│          │                                     │                │
│  - UAS 1 │   [ 3D terrain + entity layer ]     │  [ Selected    │
│  - UAS 2 │                                     │    entity      │
│  - UAS 3 │                                     │    telemetry ] │
│          │                                     │                │
├──────────┴─────────────────────────────────────┴────────────────┤
│  TIMELINE: [ Mission elapsed | waypoint progress | alerts ]     │
└─────────────────────────────────────────────────────────────────┘
```

This is the stable model across Lattice, Open MCT, and every mature C2 tool. Don't reinvent it. Execute it with precision: every measurement correct, every alignment intentional, every label serving a decision.

**Information Hierarchy Rules:**

1. **Alarm state is always in the periphery.** A flashing red border on the vehicle entry in the Fleet Panel is visible in peripheral vision while the operator is reading the Inspector. They should not need to look for it.
2. **Numbers before graphics.** Show the altitude as `124.3m` alongside the altitude visualization. The number is more precise and faster to process in critical moments.
3. **Labels are always present.** No icon-only controls in Level 3+. Icons carry labels in all persistent interactive elements. Tooltips are for supplemental explanation, not primary identification.
4. **State changes are animated but immediate.** Vehicle status transitions should be visible (color change, icon change) but not delayed by a transition. 0–80ms.
5. **Destructive actions require a step.** ARM, TAKEOFF, RTL, LAND require a confirmation gesture — either a second tap, a hold, or a dedicated confirm button. Not a modal. A built-in interaction pattern.

**Entity Vocabulary:**
Every vehicle or asset should be represented by a consistent visual grammar:
- Icon (vehicle type)
- Status halo (nominal / caution / alarm — using the color vocabulary defined in 02)
- Callsign / ID in Plex Mono
- Altitude + heading displayed as instrument readouts adjacent to the icon

This grammar should be defined as a design token set and implemented as a single `EntityIcon` component consumed by both the map layer and the fleet panel.

**Alert Hierarchy (five levels, OpenBridge/MIL-STD-1472H compliant):**

| Level | Color | Behavior | Example |
|---|---|---|---|
| Alarm | Red | Flashable, audible | Engine failure, collision alert |
| Warning | Orange/Amber | Steady, audible optional | Battery < 20%, geofence breach |
| Caution | Yellow | Steady, visible | Wind speed elevated, GPS degraded |
| Advisory | Cyan/Blue | Passive, informational | Waypoint reached, ETA updated |
| Nominal | Content Mid | No alert behavior | All systems normal |

### Level 4 — Mission-Critical (OSD, Heads-Up Display)

This is the domain where Auterion builds something that genuinely does not exist in the public design-system literature. OSD design for autonomous systems is an open field. Guidance:

- **Minimum target size 44×44px.** All interactive elements. No exceptions.
- **WCAG AA minimum at all times; AAA preferred for alarm states.** Measured at the display's actual ambient light conditions, not at 100-nit lab white.
- **Luminance hierarchy replaces saturation hierarchy.** On a display that may be viewed in direct sunlight or in total darkness, relative luminance is more reliable than color alone. Every alarm state should be distinguishable in grayscale.
- **Scan path design.** Establish a fixed "home position" for status information (top-left or top-center on most display orientations) so the operator's eye always knows where to return after a focal task.
- **Clutter management.** Every element on an OSD should earn its place in a specific use-case review. Remove anything that cannot be named as belonging to a specific operator task.

---

## 05 — Auxiliary Design System: How to Apply This

### What This Means for Tokens

The token architecture already defined in Auxiliary is the right structure. The additions that ground it in operational design:

**Add a Status layer** to the semantic token set that is distinct from interactive states:

```
--color-status-alarm
--color-status-alarm-surface
--color-status-alarm-foreground

--color-status-warning
--color-status-warning-surface
--color-status-warning-foreground

--color-status-caution
--color-status-caution-surface
--color-status-caution-foreground

--color-status-advisory
--color-status-advisory-surface
--color-status-advisory-foreground

--color-status-nominal
--color-status-nominal-surface
--color-status-nominal-foreground
```

This layer is separate from `--color-alarm` (a component variant) and from `--color-danger` (a semantic role in standard UI). Status tokens express operational hierarchy. Component tokens express UI state. They should not be conflated.

**Add a Density scale** to spacing tokens. The existing spacing scale applies at medium density. Define multipliers:

```
--density-compact: 0.75    /* OSD, heads-up */
--density-default: 1.0     /* GCS, operational apps */
--density-comfortable: 1.25 /* Suite, configuration tools */
--density-editorial: 1.5   /* Marketing, docs */
```

Components should accept a `density` prop that scales padding from the token. This enables the same Button component to work correctly at all four density levels.

### Next Components to Prioritize

Given the guidance above, the component queue should be ordered by operational impact, not by generality:

**Priority 1 — Operational primitives that everything else depends on:**
- `StatusBadge` — 5-level alert hierarchy rendered as badge/pill. Used in FleetPanel, Inspector, Timeline.
- `EntityIcon` — vehicle + status halo + label. The atom of the GCS layer.
- `TelemetryValue` — label / value / unit in Plex Mono. The atom of all instrument readouts.
- `AlertBanner` — full-width, level-aware alert strip. Flashable in Level 4 contexts.

**Priority 2 — Layout shells:**
- `OperationalLayout` — the four-region layout (status bar / fleet / map / inspector / timeline). Defined as a CSS Grid layout component.
- `InspectorPanel` — slide-over panel for entity detail. Keyboard-addressable, persistent.
- `FleetList` — vehicle roster with EntityIcon, status halo, and inline telemetry values.

**Priority 3 — General UI (already in queue):**
- Tabs, Dialog, Toast, Popover — proceed as planned.

### Themes to Plan For

The multi-theme architecture (Dark Vision, High Contrast, OpenBridge) should be designed with operational use cases in mind:

| Theme | Target Context |
|---|---|
| Default (Dark) | Standard GCS, indoor lab, training environments |
| Dark Vision | Night operations, cockpit use, eyes adapted to darkness. Reduced luminance overall. |
| High Contrast | Direct sunlight use, low-vision operator compliance. Maximum WCAG AAA across all elements. |
| OpenBridge | Maritime/naval bridge integration. IEC 62288 palette compliance. |
| Light (OEM) | Customer white-label environments that require light mode. |

Each theme is a CSS variable override block. No component changes. This is the right model — confirm the token architecture supports it before adding components.

---

## 06 — The Standard to Aim For

The goal is not to approximate what Anduril, Palantir, or Lockheed has done. The goal is to define what the best UAS software in the world looks like — and then build it.

The specific bar: **Palantir Blueprint's documentation rigor × OpenBridge's operational compliance × Auterion's aerospace precision.**

A design system that achieves this will:
1. Pass a MIL-STD-1472H compliance review without modification
2. Have clear, public documentation that a new engineer or designer can use without onboarding
3. Produce interfaces that an operator in the field trusts instinctively — not because it looks familiar, but because it is clear
4. Carry a visual language distinctive enough that an Auterion interface is recognizable in a screenshot without a logo

That is the standard. It is achievable. Auxiliary is already the right vehicle for it.

---

*Authored from benchmarking research on Anduril Matter, Palantir Blueprint, Esri Calcite, OpenBridge ODES, NASA Open MCT, MIL-STD-1472H, Shield AI Hivemind, and comparable defense-tech and aerospace operational design systems. Guidance is specific to Auterion's context and should be treated as a living document updated alongside Auxiliary.*
