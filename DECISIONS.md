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
