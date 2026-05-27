# Anduril Lattice/Matter Visual Examples & Comparable Mission-Critical Design Systems

## TL;DR
- **Anduril's "Matter" design system is essentially invisible to the public** — the strongest verifiable visual references are (a) Anduril's own marketing pages (anduril.com/lattice/command-and-control, /eagleeye) plus EagleEye reveal photos in Breaking Defense, Defense One, UploadVR and Road to VR, and (b) ONE sanitized portfolio case study by Anduril Product Designer Lauren Park at laurenjpark.com/work/anduril, which shows Lattice Live COP surfaces with a confidentiality disclaimer.
- **For a design-system benchmark with real public documentation, look first to Palantir's Blueprint (blueprintjs.com), Esri's Calcite (developers.arcgis.com/calcite-design-system), the OpenBridge maritime standard (openbridge.no), and NASA's Open MCT (nasa.github.io/openmct)** — these four are open-source, documented, Figma-supported, and explicitly designed for data-dense / mission-critical operator interfaces.
- **The traditional primes (Lockheed Martin, Northrop Grumman, RTX/Raytheon, Boeing) publish almost no design-system artifacts** — only job postings hint at internal systems (Lockheed's "Auroras Design System," Northrop's UX organization, Boeing/Jeppesen's FliteDeck Pro EFB). Their work is far less visually transparent than Anduril's, so the open-source benchmarks above are more useful comparators than the primes.

---

## Key Findings

1. **Anduril publishes only marketing-grade Lattice imagery and a few mockup videos**, with no public component library, no design tokens, no documented "Matter" system, and an explicit confidentiality firewall around employee portfolios. The "Matter" design system is referenced only in Anduril's own job postings ("design and iterate upon all elements of Matter, Anduril's design system").
2. **EagleEye, unveiled at AUSA 2025 (October 13, 2025)**, generated the largest single batch of public Anduril UI imagery — three short mockup video clips on Anduril's site/X and embedded in Breaking Defense, UploadVR, Road to VR, Defense One, Soldier Systems Daily, and Heise. These are mockups, not screenshots from a live build.
3. **Palantir's Blueprint is the single best-documented mission-critical-adjacent design system**. It is open-source on GitHub (palantir/blueprint), fully documented at blueprintjs.com/docs, used by Palantir Foundry/Slate/Gotham, and explicitly optimized for "complex, data-dense web interfaces for desktop applications" — directly comparable to a C2/COP context.
4. **Esri Calcite is the most relevant pure design system for tactical mapping/GIS UIs** — a 1.0+ web-component library (~80+ components in 5.0), Figma UI kit on the Esri Figma Community, WCAG-AA compliant, and used to build the new ArcGIS Map Viewer.
5. **OpenBridge is the closest analogue to a "Matter for defense" that already exists publicly** — an open-source design system for safety-critical maritime bridge interfaces, version 6.1 released December 2025, with Figma libraries, IEC 62288 / WCAG compliance, and "over 700 companies from all over the world have registered to gain access to the system" per the Oslo School of Architecture and Design's ODES project page (aho.no/english/research/projects/ODES/).
6. **NASA Open MCT (open-source on GitHub at nasa/openmct) is the canonical public mission-control framework**, in active use across JPL missions; it pairs with NASA JPL's Human Centered Design Group at hi.jpl.nasa.gov for HCI methodology references.
7. **DoD's published interface standard is MIL-STD-1472H** ("Human Engineering"), freely downloadable from denix.osd.mil; it is the underlying standard that any Anduril/Palantir/Lockheed C2 UI must defensibly comply with.
8. **Shield AI / Skydio / Lockheed STAR.OS publish far less than Palantir or Esri** but each has a public hook — Shield AI Hivemind UI is documented on designer Robert Gourley's case study at robertcreative.com/work/hivemind; Skydio's Remote Flight Deck appears in product pages and detailed release notes at support.skydio.com; Lockheed's STAR.UI was unveiled November 6, 2025.

---

## Details

### PART 1 — Anduril Lattice / Matter / EagleEye public visuals

**Anduril-owned sources (highest authority, all confirmed accessible):**
- **anduril.com/lattice/command-and-control** — product hero page for Lattice for Command & Control with marketing renders of the operator UI ("AI-powered battle management platform that integrates thousands of sensors and effectors to accelerate complex kill chains at machine speed").
- **anduril.com/lattice/mission-autonomy**, **/lattice/lattice-mesh**, **/lattice/lattice-sdk**, **/lattice/lattice-partner-program** — each carries marketing imagery of the COP and entity views.
- **anduril.com/eagleeye** — EagleEye marketing page (announced October 13, 2025).
- **anduril.com/news** — newsroom; the October 13, 2025 release "Anduril's EagleEye Puts Mission Command and AI Directly into the Warfighter's Helmet" is the canonical EagleEye announcement.
- **anduril.com/press** — official press kit (logos and media assets; JS-gated, contact media@anduril.com).
- **developer.anduril.com** — developer documentation; the only place Anduril shows real Lattice UI behavior in working context, including the "entity thumbnail" sample app screenshot at developer.anduril.com/samples/overview.
- **2022 Lattice OS Australia slick (PDF hosted on sldinfo.com)** — a leaked-into-public marketing brief listing UI form factors: "Laptop · Desktop · Web UI · VR."

**Defense-trade press with EagleEye imagery (October 2025):**
- **Breaking Defense** (Ashley Roque, Oct 13, 2025): "'I have got this s- figured out': Anduril unveiling EagleEye mixed-reality device at AUSA" — includes a soldier-wearing-EagleEye press photo and a booth-floor image of the full-face variant.
- **Defense One** (Oct 9, 2025): "Anduril debuts Eagle Eye, a modular, AI-powered soldier headset" — the deepest interview with Palmer Luckey on the four-variant family.
- **UploadVR** ("Anduril Reveals EagleEye Military XR Headset Design & Interface Clips") and **Road to VR** ("Anduril Shows First Look at Capabilities of 'EagleEye' Military XR Headset") — both reproduce Anduril's three short mockup clips showing the persistent compass/minimap, blue/red bounding boxes, skeletal silhouettes for occluded targets, and rear-view PIP drone feeds.
- **Heise (English edition)**, **NewAtlas** ("Anduril EagleEye Helmet: AI, AR & Super Sensory Gear"), **Soldier Systems Daily** ("AUSA 25 - Eagle Eye by Anduril") — additional press photos and skeptical reportage.
- **Air & Space Forces Magazine** ("Sneak Peek: Anduril Lifts Veil on Its Combat Drone Software", September 2024) — describes the Lattice for Mission Autonomy console used by an engineer at the West Texas test range with voice command demo.
- **Breaking Defense Lattice tag page** (breakingdefense.com/tag/lattice/) — ongoing coverage feed.

**Public portfolios from Anduril designers (sanitized only):**
- **Lauren Park, Product Designer at Anduril** — laurenjpark.com/work/anduril and laurenjpark.com/work/anduril-internship. Park covers Lattice Live COP and Lattice Mesh; she explicitly states "Due to confidentiality, I cannot fully disclose details." Her internship case study (May–Aug 2023) shows an Asset Pre-Launch Checklist surface inside Lattice. **This is the single most useful public portfolio for studying Lattice UI patterns from an insider.**
- **Tanner Christensen** — tannerchristensen.com — Anduril software product designer; site mentions Anduril by name but does not show product UI ("Indie designer and builder. Also designing software for autonomous machines and AI-powered robots at Anduril").
- **Jen Bucci, VP, Head of Design at Anduril** — x.com/jendarhy/status/1929295208384004342 (June 1, 2025): "It's been a sprint since the Microsoft mixed reality team joined Anduril. Industrial Design and UI has already come a long way. We're about to move even faster with Meta."
- **Yashas Mitta / Raw Materials** — yashasmitta.com/anduril — agency-side rebrand of the anduril.com marketing site (not the product UI), useful only for brand language.

**LinkedIn / YouTube:** Anduril's official post "Check out a demo of Lattice for Mission Autonomy" (activity 7263210584995676160) on linkedin.com/posts/anduril/ remains the most direct public Lattice demo on LinkedIn. Anduril's YouTube channel hosts "Anduril Lattice Counter Drone System" (youtube.com/watch?v=KX0ji1sAXl8) — a polished product trailer with extensive UI footage.

**Bottom line for Part 1:** there is no public design-system documentation for Matter. The richest visual material is (1) Anduril's own marketing video on the four Lattice product pages, (2) EagleEye press photos and mockup clips from the AUSA 2025 reveal, (3) Lauren Park's portfolio, and (4) Anduril's own YouTube product trailers.

---

### PART 2 — Comparable mission-critical design systems

#### 1. Palantir — Blueprint (and Foundry/Gotham/Slate UIs)
- **What it's called:** Blueprint (open-source); Gotham, Foundry, Workshop, Slate (proprietary apps that USE Blueprint).
- **Public availability:** Full open-source code at **github.com/palantir/blueprint** (Apache 2.0). Complete docs at **blueprintjs.com/docs** with live component playground. Palantir engineering blog post "Scaling product design with Blueprint" (blog.palantir.com). Dribbble portfolio at **dribbble.com/Palantir/projects/451877-Blueprint** with toast/messaging iterations, color generators, feature icons.
- **Gotham/Foundry UI screenshots:** The most candid public Gotham UI screenshots remain in the 2019 VICE/Motherboard piece "Revealed: This Is Palantir's Top-Secret User Manual for Cops" (vice.com), showing real heatmap, object-explorer, and license-plate-tracking views. Marketing renders at palantir.com/platforms/gotham/ and palantir.com/platforms/foundry/.
- **Relevance:** Most directly comparable design system in scope — desktop-first, dense data, dark mode default, WCAG 2.0 contrast, used in actual defense/intel operations including the Ukrainian military and the US IC. **If you can only study one external system, study Blueprint.**

#### 2. Esri — Calcite Design System (ArcGIS)
- **What it's called:** Calcite Design System (also "Calcite components").
- **Public availability:** **developers.arcgis.com/calcite-design-system** (production 1.0 since 2023, 5.0+ released February 2026). Open Figma UI kit on Esri Figma Community. GitHub at github.com/Esri/calcite-design-system.
- **Relevance:** Calcite is the closest publicly-documented sibling for any tactical-mapping / geospatial-COP UI. ArcGIS Map Viewer is built with it; light/dark themes pass WCAG AA; ~80+ components including List, Action Group, Combobox, Table with pagination, Notice, Tooltip, Modal-replacement Sheet, all relevant to a Lattice-style sidebar+map layout.

#### 3. OpenBridge — Maritime/Industrial HMI Design System
- **What it's called:** OpenBridge Design System (originally ODES).
- **Public availability:** **openbridge.no**. Figma libraries, code libraries, icon set, design-cases gallery, all open-source. Version 6.1 released December 10, 2025 — first non-beta production release. Run from Oslo School of Architecture and Design (Prof. Kjetil Nordby) with SINTEF Ocean and University of South-Eastern Norway.
- **Compliance:** Built to support IEC 62288 and WCAG.
- **Adoption:** Per the AHO ODES project page, "over 700 companies from all over the world have registered to gain access to the system."
- **Relevance:** OpenBridge is the only existing open-source design system explicitly designed for safety-critical, fatigue-prone, multi-vendor operator interfaces. It is **the conceptual model Anduril's Matter is implicitly competing with** in the maritime/industrial domain.

#### 4. NASA — Open MCT + JPL Human Centered Design
- **What it's called:** Open MCT (Open Mission Control Technologies).
- **Public availability:** **nasa.github.io/openmct** with full docs, plus source on **github.com/nasa/openmct**. Plugin ecosystem documented at github.com/NASA-AMMOS/openmct-mcws.
- **Companion resources:** **hi.jpl.nasa.gov** (NASA JPL Human Centered Design Group, led by Scott Davidoff). **nasa.gov/reference/jsc-crew-interfaces/** (JSC Crew Interfaces / Mission Control Center displays standards). NASA Technical Reports Server has multiple HCI papers (e.g., NTRS 20170010705 "Open Source and Design Thinking at NASA"; NTRS 20110010878 "Reinventing User Applications for Mission Control"; NTRS 20190001440 on lunar/Mars HCI).
- **Relevance:** Open MCT is functionally what an "open Lattice COP" would look like — a composable web-based framework for live telemetry, timelines, procedures, and visualizations. In use at JPL and Ames. Pair with JPL HCD methodology for the user-research side.

#### 5. US DoD / Military Standards — MIL-STD-1472H and family
- **Primary standard:** MIL-STD-1472H, "Design Criteria Standard — Human Engineering," superseding MIL-STD-1472G. Free PDF at denix.osd.mil and discoverable via quicksearch.dla.mil/qsdocdetails.aspx?ident_number=36903.
- **Companion docs:** MIL-HDBK-759 (Human Engineering Design Guidelines), MIL-HDBK-761A (Human Engineering Guidelines for Management Information Systems — the closest legacy "software UI" reference), MIL-HDBK-1908 (Definitions of Human Factors Terms).
- **Reference compilation:** **NIST IR 7889** "Human Engineering Design Criteria Standards" (nvlpubs.nist.gov) consolidates MIL-STD-1472G/H, ASTM F1166, W3C WCAG 2.0 and similar across domains.
- **Relevance:** Not a design system per se, but the regulatory floor. Any Anduril-style C2 UI sold to DoD will be tested against MIL-STD-1472H. If you want a single document to ground "what the customer expects," this is it.

#### 6. Cesium — CesiumJS / Cesium ion
- **What it's called:** CesiumJS (Apache-2.0 open-source 3D globe library); Cesium ion (SaaS); Cesium for Unreal / Unity / Omniverse.
- **Public availability:** **cesium.com** and **github.com/CesiumGS**. Per Bentley Systems' acquisition press release (Sept 6, 2024), "Cesium's open-source offerings have more than 10 million downloads." Open standard "3D Tiles." Bentley Systems acquired Cesium on September 6, 2024.
- **Relevance:** Cesium underpins many defense 3D COPs. The Cesium ion SDK includes UI widgets used in mission interfaces; Cesium showcased at GEOINT 2025 demos with "agentic AI" natural-language access to 3D environments. The Lattice 3D COP visualization is conceptually closest to a Cesium-derived globe.

#### 7. Shield AI — Hivemind / Hivemind Commander
- **Public availability:** **shield.ai/hivemind**, **shield.ai/enterprise** (Commander, Edge, EdgeOS). Help center at **hivemindhelp.shield.ai**. **Robert Gourley's design case study at robertcreative.com/work/hivemind** is the most candid public look at the actual Hivemind operator UI, low-code agent configuration screens, and the Figma component library that Shield AI built.
- **Integration insight:** Per Shield AI/Palantir joint PR Newswire release dated December 5, 2024, the partnership "builds on work Shield AI and Palantir showcased at the Association of the U.S. Army's (AUSA) Annual Meeting and Expo in October [2024], where the companies demonstrated the integration of Shield AI's Hivemind with Palantir's Gaia. This integration created a unified command-and-control system for autonomous systems." — useful evidence that a Lattice-vs-Gaia-vs-Hivemind UX comparison is operationally meaningful.

#### 8. Skydio — Remote Flight Deck (RFD) / Skydio Cloud / DFR Command
- **Public availability:** **skydio.com/software/remote-ops**, **skydio.com/software**, plus the highly detailed monthly release notes at **support.skydio.com/hc/en-us/articles/4402745311259-Skydio-Cloud-Release-Notes**, which document UI iterations week-by-week (HUD overlays, sidebar collapses, thermal palette persistence, etc.). Apple App Store listing for Skydio Enterprise shows additional UI screenshots.
- **Relevance:** Skydio is the closest publicly visible commercial-grade operator UI for autonomous-vehicle command — useful for thinking through map+telemetry+camera-feed density tradeoffs.

#### 9. Lockheed Martin — STAR.OS / STAR.UI and Auroras Design System
- **Public availability:** **lockheedmartin.com/STAROS** announcement from November 6, 2025: STAR.OS™ is described as having three pillars — STAR.SDK™ (toolkit), STAR.IO™ (integration), and **STAR.UI™** ("A user-friendly interface that lets engineers and operators see how AI is being used in real-time").
- **Auroras Design System** — referenced only in a Lockheed Martin job posting on LinkedIn for the "1LMX Software Factory Next" team: "Be a part of the effort to build a unified design system that will help standardize user interfaces and experiences across Lockheed Martin." No public docs.
- **Strata (GEOINT visualization)** — Lockheed Martin Strata is mentioned in a current UI/UX engineer job posting and a 2007 press release announcing the Office of Naval Research "Interface to the Warfighter" component for Large Tactical Sensor Networks.
- **Relevance:** Almost no visual evidence is public, but STAR.UI is the named successor design surface. Watch this space; ask via Lockheed press for STAR.OS demo material.

#### 10. Northrop Grumman — Missile-defense Fire Control UI
- **Public availability:** **northropgrumman.com/what-we-do/missile-defense/transforming-fire-control** — case study from team lead Joe Davis on a two-year, 50-user-event UX modernization for fire-control software. Companion piece at **now.northropgrumman.com/ux-transforming-defense**.
- **Relevance:** No system name disclosed and no screenshots — but the page is one of the only places a US prime publicly describes its UX practice. Useful as a methodology benchmark, not a visual one.

#### 11. RTX / Raytheon — FORGE MDPAF and Air Base Air Defense BMC2
- **Public availability:** **rtx.com/raytheon/what-we-do/space/forge** — Raytheon's marketing on the Mission Data Processing Application Framework (open-architecture, cloud-based) for SBIRS/Next-Gen OPIR. **Breaking Defense** coverage May 2025 confirms FORGE C2 target operational date of 2028 and lists competitors (BAE/Ball, Parsons, General Dynamics, Omni Federal).
- **Raytheon Air Base Air Defense (BMC2)**: rtx.com news from October 3, 2023 — $39M USAF prototype contract.
- **Relevance:** Very little public UI imagery; this is a "watch list" rather than a usable benchmark.

#### 12. Boeing / Jeppesen ForeFlight — FliteDeck Pro EFB
- **Public availability:** **ww2.jeppesen.com/navigation-solutions/flitedeck-pro/** (commercial) and **ww2.jeppesen.com/navigation-solutions/flitedeck-pro-military/** (military). Public design case study at **swimstudio.com/html/jepp.html** (Swim Studio designed the original interface). FAA-approved EFB.
- **Ownership change:** Boeing announced the agreement to sell Jeppesen to Thoma Bravo on April 22, 2025 for $10.55 billion (Boeing investor release); per AeroTime, "The transaction, announced on April 22, 2025, has now closed following regulatory approvals, according to a statement issued by Thoma Bravo on November 3, 2025," and the entity is now branded Jeppesen ForeFlight.
- **Relevance:** The most polished publicly available aviation operator UI from a prime ecosystem. Useful for chart/map layering patterns, ownship rendering, taxi diagram transitions.

#### 13. Other notable (no usable visuals located in this pass)
- **Rebellion Defense** — repeatedly reorganized; no current public design-system artifacts located within this search budget.
- **L3Harris** — no public UI design system documentation located.

---

## Recommendations

**Staged research/inspection plan, decision-ready:**

1. **Today, for visual study (~2 hours):** Open three browser tabs side-by-side — (a) blueprintjs.com/docs, (b) developers.arcgis.com/calcite-design-system, (c) openbridge.no. Capture screenshots of each system's "Components" index and one detail page (e.g., Table, List, Notice, Sheet). These are the three documented systems closest to what Matter aspires to be.

2. **This week, for tactical/COP context (~1 day):** Walk through Anduril's own Lattice marketing pages plus Lauren Park's portfolio; cross-reference against NASA Open MCT live demo screenshots and the Shield AI Hivemind case study on robertcreative.com. Note the recurring patterns: 3D map base layer, entity inspector panel right, mission timeline top, decision-modal overlay.

3. **Within 2 weeks, for compliance grounding:** Download MIL-STD-1472H from denix.osd.mil and skim sections on display design, visual perception, control device characteristics — these are the legal "shall" statements your UI is implicitly bench-marked against by DoD evaluators.

4. **Outreach asks:** Request EagleEye/Lattice press kits through Anduril's media@anduril.com (the press page is JS-gated but the email is public). Request STAR.OS demo material from Lockheed Martin's STAR.OS page. Ask Esri for Calcite Figma seats (free via Esri Figma Community).

5. **Threshold that would change this plan:** If Anduril ever publishes a public component reference for Matter, or open-sources any portion of Lattice's UI shell, drop the Calcite/Blueprint deep dive in favor of native Matter study. Today, nothing about Matter is public, so external benchmarks dominate.

---

## Caveats

- **Anduril enforces a strict confidentiality posture.** Every designer portfolio I located carries a "cannot fully disclose" disclaimer. Treat all designer-portfolio content as sanitized, not representative of the live build.
- **EagleEye imagery released October 2025 is explicitly mocked-up**, per Anduril, not a recording of the working device. The Soldier Systems Daily piece flags this directly: "they are relying on a few AI created videos, an impressive list of industry partners, and some static displays."
- **NextSprints' "teardown" and similar analytics blogs** are secondary analyses with no Anduril relationship — useful for narrative, weak for visual fidelity.
- **Defense primes (Lockheed, Northrop, RTX) publish far less than Silicon Valley defense startups.** Absence of public artifacts is not evidence of absence; it's policy.
- **The Mobile FliteDeck/FliteDeck Pro lineage is governed by FAA-approved EFB rules**, which constrain visual choices in ways that don't apply to a Lattice-style C2. Use Jeppesen ForeFlight for chart-layering patterns, not for general HMI inspiration.
- **OpenBridge's IEC 62288 / WCAG basis is maritime-specific**; it gives an excellent structural pattern (panels, info hierarchy, dark default) but its color tokens and icon vocabulary are not transplantable directly to a tactical context.