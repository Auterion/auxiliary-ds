# Phase 7 — Visual Design Audit
**Rogue · Interaction, Layout, States · 2026-06-06**

Observation-only pass across all four demo surfaces on `explore/mono-neutral`. No code touched. Written for wizard to direct implementation passes.

Taste frame: Swiss International · NASA/JPL aerospace · New Industrial. Anchor: Supabase dark. Direction: mono-neutral, color reserved for severity.

---

## 1. Surface-by-surface

### Suite — Overview (dark)

**Working:**
- Sidebar structure: icon + text nav, `FLEET OPS` section label in `ix-label` small-caps. Strong.
- `FLIGHT ACTIVITY` chart: minimal, axis labels in tracked caps, signal-to-noise is right.
- Fleet Status donut: status colors pop against dark ground. Legend is clean.
- Stat card sparklines: thin white lines on dark — instrument-quality.
- Bottom sidebar: `LINK NOMINAL · 12ms / BUILD v4.2.1-9f3a` — exactly the right aerospace touch. Keep this.

**Problems:**
1. **Stat card numbers show `.0` on whole-number counts** — `695.0 flights`, `14.0 missions`. `TelemetryValue` defaults to `precision: 1`. These are event counts, not measurements. Should be `695`, `14`. Root cause: caller doesn't pass `precision: 0`.
2. **Activity feed: dual status encoding** — each row has a colored status icon *and* a colored status dot. Two encodings of the same thing. One is redundant. The icon already carries the status; the trailing dot adds noise.
3. **Topbar hierarchy collapse** — location chips (Munich, Montreal…) and the date range picker live in the same header row at the same visual weight. The location switcher is a navigation act; the range picker is a filter. They deserve different visual treatment or separate placement.
4. **Stat cards read SaaS** — the rounded-2xl corners, soft border, and centered sparkline layout feel like a startup analytics dashboard. The numbers themselves are right; the card container is too soft. Hard edges or hairline borders would read more precisely.
5. **Delta badges ambiguity** — `+75%` in green, `−4%` in alarm-red. Green `+75%` is fine; the red down-delta is visually identical to an alarm badge. A down-trend is not an alarm. Consider direction arrows in muted-foreground instead of status-colored deltas.

---

### Suite — Fleet (dark)

**Working:**
- Table density is excellent — 8 columns, compact rows, status badges per row. This is the best-composed view in the system.
- Battery column color-coding (alarm/warning/caution/nominal by percentage) is correct token usage.
- Detail inspector panel: the right-side slide-in pattern is solid. Label/value pairs with monospace values for serial/firmware.
- Fleet header breadcrumb + filter controls (All vehicles dropdown) is a clear, reusable pattern.

**Problems:**
1. **Status badge labels diverge from system vocabulary** — badges say `OPERATIONAL`, `IN FLIGHT`, `MAINTENANCE`, `DATA LOST`, `ATTENTION`. The system's semantic ladder is `nominal / advisory / caution / warning / alarm`. These table badges are displaying *operational state labels* (prose), not system severity levels. That's a valid distinction — but the badge component should probably accept either `level` (semantic, colored) or `label` (display text). Right now the label is doing double duty.
2. **Inspector panel hierarchy is flat** — every label/value pair reads at the same weight. Section headers (`DIAGNOSTICS`, `LOCATION`, `ZONES`) exist but don't create enough separation. Needs either a tighter section divider or more contrast between label and value.
3. **Aircraft illustration placeholder** — the small grid icon (top-right of inspector) is the correct `@auxiliary/brand` placeholder behavior. But the placeholder area (appears to be a small bordered square) is undersized and blends into the card. An explicit "no image" state with a labelled placeholder region would be clearer.
4. **RSSI/CPU columns** — the numeric values are right-aligned but not in monospace, so digit widths aren't tabular. These are measurements; they should use `font-mono tabular-nums`.

---

### Suite — Light theme

**Working:**
- Status badge colors carry correctly — alarm/warning/caution all pop against the light ground. The status ladder is actually *more legible* in light mode.
- Overall structure holds — the layout doesn't break.

**Problems:**
1. **Surface distinction nearly gone** — sidebar (`card` token) vs. main content (`background` token) are separated by maybe 4% luminance on the mono-neutral light ramp. The sidebar almost disappears into the page. This is a fundamental tension with the mono-neutral direction: a neutral ramp flattens light surfaces.
2. **Topbar is invisible** — `background/80 backdrop-blur` on a near-white background renders as a fully transparent bar. The border-b is the only separator. On light, this needs a more deliberate treatment.
3. **The light theme has no distinctive character** — it looks like a generic gray-scale SaaS dashboard. The design guidance says light is for "OEM/customer white-label" contexts. If that's the intended use, it may not need a strong character. But if it's meant to stand as a first-class Auterion theme, it needs more work.

---

### Mission Control — Camera view (dark)

**Working:**
- Full-bleed dark stage for the camera feed is correct — operational interfaces should maximize data, not chrome.
- `amc-glass` panels: the blur + border + shadow treatment is the right idiom for HUD overlays. Feels like avionics glass.
- Red disarm/alarm button (right panel, far right): correct use of alarm color for the highest-consequence action. The only saturated red in the view.
- Top telemetry strip (heading indicator, flight mode badge with brand color): the heading compass is well-crafted. The amber flight-mode chip is exactly right on the mono-neutral thesis.
- Minimap: bottom-left glass card with AHI indicator is a strong aerospace touch.

**Problems:**
1. **Glass panels consume too much of the camera viewport** — left panel (228px wide) and right panel (~224px) eat the left and right thirds of the frame. The camera feed itself is visible in only the middle ~50%. An operator needs to see the feed. These panels should be collapsible or designed to float over the image more minimally.
2. **Camera overlay telemetry (top center)** — `PPL · mm · F/N · TRACK INACTIVE` labels are correct data but rendered at ~11px. At operational distance from a tablet, this is unreadable. Minimum should be 13px for critical telemetry.
3. **Left panel vehicle/waypoint controls** — `ALTITUDE / STATION / STATION` buttons are unlabeled at a glance. They read as three identical gray pills. The active state (filled vs. unfilled) distinguishes them but the labels are too small.
4. **AHI minimap contrast** — the AHI (artificial horizon indicator) uses `foreground / card` color mixing. On the dark theme this works; the horizon line is visible. But the overall contrast of the AHI circle against the glass card background is low — it blends in.

---

### Mission Control — Map view (dark)

**Working:**
- Mission path route (white dashed line) reads clearly against the terrain.
- Top header bar with heading compass and flight-mode chip carries from camera view — correct.
- Left telemetry panel: `ALT / GS / D.HOME / VERT` — good label/value layout, compact.
- Right waypoint info panel: clean header + metadata grid.
- Bottom bar: coordinates + time-of-flight + Pause/RTL — exactly the right information for a flight-critical action row.
- `Return to Launch` button (white/primary treatment): the *highest priority action* uses the strongest visual treatment. Correct hierarchy.

**Problems:**
1. **Map terrain colors are hardcoded hex values** — the terrain fill uses `#6f7a48`, `#57633a`, `#444f2e`, `#5b6a3a`, etc. These are not token-derived. They break the mono-neutral thesis: the map has a distinct greenish-olive chromatic identity that no other surface shares. This is a deliberate aesthetic choice for military-map legibility, but it should be documented as intentional, not accidental.
2. **Waypoint distinction unclear** — all route waypoints are white filled circles of the same size. Completed, active, and upcoming waypoints are visually identical at small sizes. The active waypoint needs a distinct treatment (larger, different fill, maybe using `brand` color).
3. **Route line weight** — the dashed mission path is thin (appears ~1.5px). On a real map with terrain complexity, this would be hard to trace. Should be at least 2px.
4. **Pause button affordance** — the PAUSED state shows a white circle. It reads as a waypoint marker, not a control. The button needs more explicit affordance (label, or a clearly different shape).

---

### Mission Control — Night (darknight) mode

**This is the strongest view in the entire demo.** Full endorsement.

- Amber activates everywhere that `brand` token is used: telemetry values, waypoint labels, flight-mode chip, active waypoint marker. The map darkens. The amber-on-dark-olive combination is exactly the NASA/aerospace operational feel.
- The low-blue amber keeps night vision intact. This is not aesthetic — it's the correct engineering choice. It's good that this is embodied in the token (`darknight` → amber).
- `Return to Launch` retains white — the one action that needs to be findable in absolute darkness without color discrimination. Correct.
- The terrain shifts to a darker value, maintaining the map's legibility with reduced photopic load.

**One finding:** The caution warning strip (top center, triangle exclamation) uses `--caution` (yellow-orange). In night mode / darknight, caution is still a warm color. Verify that this satisfies night-vision protocol — the amber brand and the caution yellow may be hard to discriminate in the darknight palette. Worth checking contrast between `brand` and `caution` in darknight tokens.

---

### AuterionOS — Device Console

**Working:**
- Two-panel layout: sidebar + main content. Mirrors Suite's structure — this is correct, same app family.
- System update banner: prominent, clear CTA. The right level of urgency without alarm styling.
- Device card header (Skynode X, status badge, firmware version): clean, dense, correct.
- Connectivity diagram: node graph layout is an appropriate representation for a hardware topology view.

**Problems:**
1. **Circular gauge instruments are critically low contrast** — the four circular gauges (CPU, battery, temp, link) use a gray arc on a dark gray background with a lighter gray needle. In the mono-neutral palette, all three elements are desaturated neutrals. The current/limit values are unreadable at a glance. These instruments fail the "legible in peripheral vision" test from the design guidance. Either: (a) use the status color for the arc fill when near threshold, or (b) use the `brand` accent to mark the needle/active value.
2. **Connectivity diagram node labels are too small** — the nodes (Autopilot, FC with solo, Router, etc.) have text labels that render below 11px. At tablet scale, these are unreadable.
3. **No observable difference from Suite visually** — OS and Suite use the same sidebar pattern, same card treatment, same type. This may be correct (same app family, same design language) but there's no visual signal that says "this is a device-management context, not a fleet context." Consider a different surface density or a subtle register difference.

---

### Web — auterion.com

**Working:**
- Hero headline ("The operating system for autonomous robotics"): excellent. Weight, tracking, leading — this is the best typography moment in the demo. The tightened tracking on large display type is clearly doing its job.
- Stats row (2M+, 10,000+, 60+, 99.9%): the display-size numbers with small labels below is correct display hierarchy. Strong.
- "Built for the mission. Proven at the edge." section: headline + bullet list + technical illustration. The illustration (corridor paths on a grid) is appropriately minimal and technical without being gratuitous.
- Footer: well-structured 4-column grid, correct density, no decorative noise.
- Hero widget (Fleet · Watch, right side): a live product widget inside the marketing hero is a very strong idea — "we're so confident in our UI we put it in our homepage." The widget is functional and legible at small size.

**Problems:**
1. **Product cards use generic SaaS icon treatment** — the 44×44px rounded square containing a white icon (house, X, gear, bars) is the same pattern as every SaaS product page from 2020. The design guidance explicitly calls for "geometric, rectilinear construction that feels like an avionics suite, not a productivity app." These icons are SaaS icons. The container (rounded-xl border bg-secondary) makes them worse — it's a decorative frame that serves no information purpose.
2. **Partner logo row is text-only** — "GovTech · NATO · Quantum Systems · Nokia · Skydio · US DoD" renders as a row of muted text strings. These should be logo marks, not strings. Text-only reads as placeholder even when it isn't.
3. **CTAs in hero don't match the brand weight** — "Get started" (primary) and "Watch the demo" (secondary) use proportional type at 16px in rounded pill buttons. The pill shape and the proportional type feel consumer-app. Given the mono-neutral direction and the "measured certainty" quality described in the guidance, the CTA buttons should be more precise — sharp corners or minimal radius, maybe a more technical label treatment.
4. **Navigation dark/light toggle** — the top-right `Dark · Light` toggle in the web nav is fine functionally but feels like a developer affordance, not a user-facing one. Users of auterion.com don't need to switch themes.
5. **`Watch the demo` secondary CTA** — uses bordered/outlined style on a near-black background. The border is nearly invisible. This CTA disappears.

---

## 2. Cross-surface consistency

### What's consistent (keep)
- Dark ground: all surfaces use `background` → near-black mono. ✓
- Status color vocabulary: alarm/warning/caution/advisory/nominal correctly applied everywhere. ✓
- `ix-label` small-caps treatment for section/category labels. ✓
- Brand mark (Auterion X) present and consistent across Suite/OS/Web. ✓
- Topbar/header height (~56px) is consistent across Suite, OS, and Web. ✓
- Sidebar width implied at ~210-215px across Suite and OS. ✓

### Inconsistencies (flag for resolution)

1. **Navigation chrome pattern is solved three different ways:**
   - Suite: persistent sidebar (icon + text, section labels)
   - AMC: no sidebar; floating glass panels
   - OS: persistent sidebar (same as Suite)
   - Web: fixed top navbar
   Each context has a good reason for its choice, but there's no documented rationale. AMC is genuinely different (full-bleed operational display). Suite vs. OS sameness is correct (same app family). Web top-nav is appropriate for marketing. *These are defensible decisions but should be written down.*

2. **Breadcrumb pattern:**
   - Suite Fleet header: `[icon] SUITE / Fleet` (breadcrumb with slash)
   - Suite Overview header: `[icon] SUITE / Overview`
   - OS header: `Overview / AuterionOS v4.2.2 / [version chip]`
   - These are close but not identical — SUITE uses ALL CAPS for the app name; OS uses title case. The slash separator spacing differs. Needs normalization.

3. **Card/surface treatment differs between app and web:**
   - Apps (Suite, OS): `rounded-xl` cards with `border-border` and transparent backgrounds
   - AMC: glass cards with blur + inset highlight
   - Web: `rounded-2xl` cards (larger radius) with `bg-card`
   The radius inconsistency is noticeable when switching surfaces. Web uses 16px radius (rounded-2xl), apps use 12px (rounded-xl), AMC uses 16px glass (rounded-2xl). Pick one radius vocabulary.

4. **Type size for body copy:**
   - Suite activity feed: 14px
   - Suite stat card labels: 12px small-caps
   - Web hero subhead: 17px
   - OS device card metadata: 13px
   - No document-level baseline size is being respected. The `text-sm` (14px) and `text-[13px]` are scattered. The guidance calls for 14/16px as the base — this isn't consistently enforced.

5. **Hover/active state vocabulary differs:**
   - Suite sidebar active item: `bg-secondary text-foreground` with left-edge fill (brand color)
   - Suite topbar location chips: `ix-active bg-secondary font-medium text-foreground`
   - AMC view switcher: `bg-secondary text-foreground`
   - Web nav: no active state (no current page indicator in web nav)
   - The `bg-secondary` pattern is consistent. The active *marker* is not — Suite sidebar has the brand fill edge marker; location chips have no edge marker; AMC has none either.

6. **Spacing rhythm in compound rows is inconsistent:**
   - Suite header rows use `gap-3` (12px) between breadcrumb elements
   - AMC glass panel inner padding is `p-3` (12px)
   - Web hero CTA row uses `gap-3` (12px)
   - BUT Suite detail inspector uses `gap-2` (8px) between label/value
   - OS firmware chip row uses `gap-1` (4px)
   - There's no clear rule for which gap scale applies at which hierarchy level.

---

## 3. Brand coherence

**Does it feel like one system?** Partially — and the split is predictable.

**Where it feels like one system:**
- AMC night mode + Suite dark = unmistakably the same design language. The dark ground, the monochrome identity, the amber accent in darknight — this is coherent and distinctive. If someone asks "what does an Auterion product look like," these two screens answer it.
- The status ladder is perfectly consistent across all surfaces. Alarm is always red, caution always amber-yellow, nominal always green. This is the most important cross-surface consistency and it's working.
- The `ix-label` small-caps + tracked typography reads as Auterion across every surface that uses it.

**Where coherence breaks down:**

1. **The web site has a different visual character from the apps.** The web site reads as a contemporary dark tech startup site — it could be Vercel, Linear, or any other modern SaaS. The apps (especially AMC in night mode) feel like aerospace instruments. The gap between these two is large. The guidance calls for the web site to be "world-class brand" quality — right now it's good but not *distinctively Auterion*. The hero type is excellent; the rest of the page doesn't live up to it.

2. **AMC feels like a separate product, not a surface of the same system.** The glass panel idiom, the full-bleed dark stage, the military map terrain — this is visually distinctive and operationally correct. But when you switch from Suite to AMC in the demo, it feels like loading a different app. Some visual bridge (shared nav chrome, shared brand mark at same position, shared type treatment) would make it feel like one platform.

3. **Light mode is orphaned.** The light theme exists and works technically, but it has no distinctive character within the Auterion language. It's generic gray-scale. If light mode is meant to be used, it needs a personality. If it's purely an OEM/white-label affordance, that should be documented and it should be visually minimal by design (which it is, arguably).

4. **Icon vocabulary spans two registers.** The system icons (drone, bars, chevron, etc.) are geometric and work well at operational scale. The web product card icons (house, X, gear, bars as generic placeholders) use those same icons but in a SaaS-card container that undoes the aerospace character. The icon set is correct; the usage context on the web undermines it.

---

## Priority ranking for polish passes

Ranked by impact on the mono-neutral thesis and brand coherence:

**P0 — Breaks the thesis**
- Map terrain hardcoded hex colors (AMC): these bypass the token system and give the map a bespoke identity. Should be documented as intentional bespoke or replaced with token-derived values.
- Circular gauges in OS: unreadable without color. Fails operational legibility.

**P1 — Significant visual quality**
- `TelemetryValue precision: 0` for count data — easy code fix, high perceptual impact
- Suite light surface contrast — sidebar/main distinction needs work
- AMC glass panel coverage of camera viewport — structural layout issue
- Web product card icon treatment — most generic-SaaS moment in the system
- Activity feed dual status encoding — noise reduction

**P2 — Consistency and rhythm**
- Card corner radius normalization (rounded-xl vs rounded-2xl)
- Breadcrumb pattern normalization (app name caps, separator spacing)
- Waypoint active/completed distinction in AMC map
- Suite topbar hierarchy (location vs. range picker)
- Web `Watch the demo` button contrast

**P3 — Nice to have**
- Suite stat card "hard edge" direction
- OS node diagram label sizing
- Web partner row — text → marks
- Delta badge color vs. alarm ambiguity
