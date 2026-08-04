# Reference audit

What actually shapes Auxiliary, what is merely admired, and what has never been assessed.

The purpose is to stop accumulating. A reference that is not on the shortlist does not get to
influence a review; a reference on the "admired" list gets re-read *before* anything new is added,
so the same inspiration is not re-litigated every quarter. Decision: `AD-D-003`.

**No assets live here.** Screenshots, scrapes and `.pen` boards stay at the repo root and are
gitignored on purpose (see the "Design scratch — local only" block in `.gitignore`) — they are
working material, not artifacts the system ships. This file is the committed part: the scoring and
the conclusions.

## How references were scored

Five axes, from `AD-2026-001` Week 2:

| Axis | Asks |
| --- | --- |
| **Trusted** | Does it read as credible in a procurement room? |
| **Mission-critical** | Does it hold up under time pressure, glare, degraded link? |
| **Precise** | Is every element intentional, or is some of it decoration? |
| **Buildable** | Can it be expressed in Vue + Tailwind + tokens, without bespoke CSS? |
| **Both registers** | Does it serve marketing *and* operational surfaces from one source? |

A reference that fails **Buildable** can still be admired — it just cannot be adopted.

## The shortlist — references that actively shape the system

Each of these is already load-bearing in code or in a ratified decision.

| Reference | What it contributes | Where it landed |
| --- | --- | --- |
| **OpenBridge** (maritime HMI DS) | The five-level alert hierarchy — Alarm · Warning · Caution · Advisory · Normal — and the rule that alert colour encodes *priority*. The closest published analog to Auterion's problem. | `AD-D-014`; the `--alarm/--warning/--caution/--advisory/--nominal` families in every theme |
| **MIL-STD-1472H** | The severity ladder as a regulated set rather than a palette. Not an aesthetic reference — a compliance one. | `AD-D-014`; `apps/docs/foundations/conformance.md` |
| **Swiss International Style + NASA-JPL** | *Measured certainty* — grid as precision instrument, typography that structures rather than decorates, nothing decorative. | `AD-D-013`; `apps/docs/foundations/visual-language.md` |
| **GTC token model** ([buninux](https://buninux.com/design-tokens)) | The organising question: *where may this be changed, and what does changing it move?* Adopted wholesale, with four documented divergences. | `AD-D-034`; `packages/tokens/gtc-validate.mjs` |
| **Reka UI + shadcn architecture** | Headless a11y primitives, and shadcn's component anatomy / variant-API style ported to Vue idioms. Reference, never a runtime dependency. | `AD-D-030` |
| **Vercel Geist** | Geist Mono as the data vehicle — `I`, `l`, `1`, `O`, `0` distinguishable without OpenType features. | `AD-D-011`; `apps/docs/foundations/typography.md:66` |
| **Deck 07b + Console** | The house standards, and they answer different questions: 07b is the design *language* (what it looks like), Console is the *construction method* (how a surface is built). Orthogonal — a surface is right when it speaks 07b, built the Console way. | `.claude/docs/deck-07b-grammar.md`; `apps/demo/src/console/_console.css` |
| **Palantir Blueprint** | The density model, and the philosophy that components are opinionated about density but not about decoration. Data-table and nested-menu interaction patterns. | Partially landed — `Table`, `DropdownMenu`, `Combobox` |

## Queued — shortlisted, not yet drawn on

Admitted to the shortlist because the work they feed is already scheduled, not because they are
influencing anything today.

| Reference | For | Blocked on |
| --- | --- | --- |
| **Esri Calcite** | The geospatial panel vocabulary — Action Group, Panel, Sheet, action-bar. The sidebar/map/details skeleton every GCS uses. | The parked operational-map work |
| **NASA Open MCT** | The telemetry layout model: composable workspace, user-authored dashboards, the timeline strip. | Q1 2027 operational layer |
| **MIL-STD-2525E / APP-6(D)** | Affiliation symbology as its own token axis, shape-redundant, never overloading status. | Q1 2027 entity atom |
| **IEC 62288** | The alert model — colour = priority, motion = acknowledgement state. | External conformance review |

## Admired, not adopted

Re-read this list before adding any new inspiration. Each entry names *why* it stays out, so the
question does not reopen.

| Reference | Why not |
| --- | --- |
| **Anduril Lattice / EagleEye** | Calibration only, never copying — and the public imagery is explicitly **mocked up**, not a recording of a working device. Designer-portfolio material is sanitised under a strict confidentiality posture. Treating it as fidelity evidence would be building on fiction. |
| **OpenBridge's colour tokens and icon vocabulary** | Adopted for its *alert grammar* only. The palette and icons are maritime-specific and not transplantable to a tactical context. |
| **Lockheed STAR.OS · Northrop · RTX FORGE** | Defense primes publish almost nothing; the absence is policy, not evidence of absence. Nothing to study. |
| **Boeing / Jeppesen ForeFlight** | Governed by FAA-approved EFB rules that constrain visual choices in ways that do not apply here. Useful for chart-layering only. |
| **Cesium · Shield AI Hivemind · Skydio RFD** | Narrative-strength references. No usable component-level artifacts located. |
| **Tokens Studio · Specify · Knapsack · Supernova** | Superseded. The pipeline question they answer is closed — `packages/tokens` → Style Dictionary → four artifacts → Figma REST push, all shipping (`AD-D-022`). Specify shut down in 2024. |
| **c2d2c (code→design→code)** | Moot. The Figma loop is closed in both directions already: components push via `figma-sync`, drift reports back via `pnpm figma:diff`. |
| **Motto** | Scraped and studied (`motto-*.json` at root): near-monochrome, `#f2f2f2` ground, 128px uppercase display. The *editorial confidence* is admired; the register is agency-portfolio, not defense. Nothing adopted directly. |

## Not assessed — needs Yasen

Listed in `AD-2026-001` Appendix B with no evidence in this repo. Scoring them would be inventing
findings, which the roster's unknowns protocol forbids. Each needs either a scrape or a call.

- **Brand/editorial:** Studio Noteform, AREA 17, devrev.standard-projects.com, SpaceX, EnduroSat,
  Starlink, the-brandidentity store purchases.
- **Systems & docs craft:** once-ui, ocean_lab Figma.
- **Tokens & patterns:** programui, interior.dev, aicss.dev, canvasui.dev, nexvyn, beautiful-ui,
  the two X cheatsheets. The guide already scopes these as *density benchmarks, not systems* —
  worth confirming before any of them influences a review.
- **Devouring Details.** `AD-2026-001` Part IV claims its craft habits are "institutionalized," but
  they are not in this repo — the roster's iteration discipline and evidence ladder are adapted
  from **MengTo/Skills** (MIT) instead. Either the guide is wrong or the adoption never happened;
  worth a call, because the two are not the same doctrine.

## Anti-drift rule

New references are admitted the same way new devices are: with a rendered specimen and a written
grant that says where it is allowed and what revokes it. Quarterly, retire what went unused.
