---
id: AD-D-016
date: 2026-08-28
title: Nemyx enters the brand hierarchy as a product under Auterion
status: proposed
owner: Yasen
ratified_by: ""
---

## Context

`packages/brand/brand.manifest.json` declares four entries: the `auterion` org mark and three
products — `mission-control`, `suite`, `os`. Nemyx is absent, and it is a shipping surface:
`nemyx-command-control-interface@0.0.55-beta`, Vue 3.5.24 on Tailwind 4.1.17
(`trellys-command-control-interface/package.json:2,3,39,60`).

Its absence is not cosmetic. Nemyx already renders a brand watermark over the map
(`--color-c2-map-watermark`, `src/assets/main.css:93`) with no mark in the manifest to render, so
the one product drawing Auterion identity onto a live operational surface is the one product the
brand layer does not know about. The repo contains no Nemyx logo asset of any kind.

Nemyx is also the surface that makes the brand rules bite hardest: it is the tablet-held-outdoors
product, so it is the first real consumer of the `sunlight` theme, which ships in the token set
with no consumer today. And it composes the constraint recorded in `AD-D-032` — identity drawn
over satellite imagery needs a scrim, not a flat fill.

One correction this surfaces: the ecosystem demo's surface table declares Nemyx's themes as
`['dark', 'darknight', 'sunlight']` (`apps/demo/src/eco/surfaces.ts:222`), omitting the light
theme Nemyx actually ships today — `main.css:52` documents "Two themes: dark (NEMYX brand, the
default) and light". The demo table is aspirational where it should be observational.

## Options

- **A — add `nemyx` as a `product` entry with `parent: auterion`, declaring all four themes.**
  Matches how `mission-control`, `suite` and `os` are already modelled, and makes the watermark a
  first-class asset slot instead of an undeclared one.
- **B — leave Nemyx out until it has real artwork.** Every product entry in the manifest is
  currently `"pending"` art anyway, so this holds the entry hostage to a condition the existing
  entries do not meet.
- **C — model Nemyx as a peer brand, not a product under Auterion.** Would be right if Nemyx were
  a separate company; it is not, and a second top-level brand would fork the hierarchy for no
  organisational fact.

## Decision

Adopt **A**. `brand.manifest.json` gains a `nemyx` entry: `type: "product"`,
`parent: "auterion"`, `coLockup: "Auterion Nemyx"`, all four art slots `"pending"` (as with every
other product), and:

- **`themes: ["dark", "darknight", "sunlight", "light"]`** — all four. `dark` is its default and
  `light` is shipped today; `darknight` and `sunlight` are the operational pair it is the natural
  first consumer of. Declaring a theme commits the manifest to a tone for it, not the product to
  a release date.
- **`context`** naming it L4 Mission-Critical, keyboard-first, and the first `sunlight` consumer.
- **`forbidden`** carrying the watermark rule explicitly: the mark is never drawn over map imagery
  without a scrim (`AD-D-032`), and never in a product hue — identity on the map is a tint of the
  neutral, which is what `--color-c2-map-watermark` already does.

`apps/demo/src/eco/surfaces.ts` is corrected in the same change to declare Nemyx's themes as
shipped rather than as hoped.

This entry is art-pending like its siblings; ratifying it settles Nemyx's **place in the
hierarchy**, not its artwork.

## Revoked when

Nemyx is renamed, absorbed into Mission Control, or spun out as a brand that no longer sits under
Auterion.
