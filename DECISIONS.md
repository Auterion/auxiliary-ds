# Decisions

Settled design and architecture decisions. Reference this before re-litigating a resolved question.

---

## Map terrain uses bespoke hex colors, not tokens

**Decision:** AMC map terrain fills (`#6f7a48`, `#57633a`, `#444f2e`, etc.) are hardcoded and intentionally bypass the mono-neutral token system.

**Why:** Military-topographic map readability requires chromatic terrain differentiation (elevation bands, vegetation, water). A monochrome terrain map is illegible for operational use. This is a functional requirement, not an aesthetic preference.

**Scope:** Map terrain fills only. All other AMC surfaces (glass panels, telemetry, status indicators, controls) use the token system. The terrain is a data layer, not UI chrome.

**Date:** 2026-06-06

---

## Card corner radius: rounded-xl (12px) system-wide

**Decision:** All card and panel surfaces use `rounded-xl` (12px). AMC glass overlays may use `rounded-2xl` (16px) as a distinct idiom (glass != card).

**Why:** Cross-surface consistency. The demo had mixed `rounded-xl` (Suite, OS) and `rounded-2xl` (Web, AMC glass). Two radii in the same system reads as drift, not design.

**Scope:** Every `ix-panel`, card, popover, and bordered container. Does not apply to pill-shaped controls (nav toggles, badges) or AMC glass panels.

**Date:** 2026-06-06

---

## Brand accent directions: Mono and Ultramarine (Amber dropped)

**Decision:** The Auterion brand supports two accent modes: **Mono** (fully monochromatic, status colors the only chromatic elements) and **Ultramarine** (`auterion-blue.DEFAULT` on Space Cadet ground). The amber direction explored in Brand.vue is dropped from the toggle.

**Why:** Mono is the purest expression of the mono-neutral thesis — no competitor in autonomous systems owns this. Ultramarine (Space Cadet + electric blue) gives Auterion a distinctive identity with a navy ground that has character, not just darkness. Distinct from Anduril (near-black + warm orange), Helsing (near-black + white). Amber was dropped because it conflicts with the caution/warning status vocabulary.

**Scope:** Brand.vue accent toggle reduces from three options to two. Both directions must use the token system — no hardcoded oklch/hex for brand colors.

**Date:** 2026-06-07

---

## Demo brand surfaces must reference token vars, not hardcoded oklch

**Decision:** Brand surfaces (`apps/demo/src/brand/Brand.vue`, `apps/demo/src/web/pages/Brand.vue`) must reference CSS custom properties from the token system (`var(--color-primitive-auterion-blue-*)` or `var(--brand)`), not inline oklch/hex values.

**Why:** The brand page is the canonical showcase of the system. Three different blues were in use — Tailwind `blue.600`, stale draft values, and the actual `auterion-blue.DEFAULT` token — where there should be one. The web Brand page's `blueRamp` values had drifted from the actual tokens (e.g., DEFAULT shown as `oklch(0.46 0.285 265)` vs actual `oklch(0.500 0.235 264)`). Exemptions: display-only hex labels in palette swatches, SVG data layers (map terrain already exempted above).

**Scope:** All brand and web demo surfaces. Does not apply to map terrain or camera simulation fills.

**Date:** 2026-06-07
