---
id: AD-D-032
date: 2026-06-06
title: Map terrain fills are the one sanctioned token exemption
status: ratified
owner: Yasen
ratified_by: ""
---

## Context

The Mission Control map renders military-topographic terrain — elevation bands, vegetation, water.
Rendering that through the mono-neutral token system produces a monochrome map, which is illegible
for operational use. This is a functional requirement, not an aesthetic preference, and it is the
only place in the system where the token contract loses.

Migrated from `DECISIONS.md` (2026-06-06 entry).

## Options

- **A — hardcoded terrain hex, scoped narrowly and named as an exemption** — honest about the
  boundary, and reviewable because it is written down.
- **B — add a terrain palette to the token system** — consistent, but bloats the semantic layer
  with values that serve exactly one data layer and re-resolve meaninglessly across four themes.
- **C — force terrain through the neutral ramp** — consistent and unusable.

## Decision

AMC map terrain fills (`#6f7a48`, `#57633a`, `#444f2e`, and the rest of that set) are hardcoded and
intentionally bypass the token system.

**Scope is map terrain only.** Every other AMC surface — glass panels, telemetry, status
indicators, controls — uses tokens. The distinction: terrain is a **data layer**, not UI chrome.

This is the *only* sanctioned exemption. Any other hardcoded colour is a defect. Display-only hex
labels in palette swatches are not colour usage and are out of scope.

## Revoked when

A token-expressible terrain model is proposed that keeps elevation and vegetation bands
distinguishable at operational zoom levels across all four themes.
