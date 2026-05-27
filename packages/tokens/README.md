# @auxiliary/tokens

Design tokens for Auxiliary, authored in [DTCG](https://tr.designtokens.org/format/) JSON. **The source of truth.** Every other package in the system derives from these — none of them redefine values.

## Status

Scaffold only. Step 2 of the build plan wires Style Dictionary v4 with four output platforms:

- `tailwind-v4.css` — `@theme { … }` block for the CSS preset
- `tokens.css` — raw `--*` custom properties on `:root`
- `tokens.ts` — typed export (tooling only, never imported into runtime components)
- `figma.tokens.json` — DTCG-shaped output for Tokens Studio

## DTCG 2025.10 migration path

We author against the common subset of DTCG that Style Dictionary v4 supports today (color / dimension / font-family / font-weight / duration / shadow). Full 2025.10 spec support lands in Style Dictionary v5 — the upgrade will be a config bump, not a re-author of sources.

## Themes

The 4-theme target for the system:

| Theme | Status | Driver |
|---|---|---|
| `dark` | v0.1 (Step 3) | Primary product UIs — Mission Control, GCS, telemetry |
| `light` | v0.1 (Step 3) | Webflow marketing site, light internal tools |
| `sunlight` | Planned | Field-deployed ground control stations in direct sunlight |
| `night` | Planned | Low-light / NVG-compatible operations |

`sunlight` and `night` are intentionally not scaffolded as empty files. They land as real token files when their first consuming surface ships and we can do the field validation that gives them honest values.

## Status vocabulary

v0.1 ships standard 4-level semantic statuses: `success / warning / danger / info`. The MIL-STD-1472H 5-level alarm hierarchy (`alarm / warning / caution / advisory / nominal`) — and any parallel `severity-0..4` scale for Operational primitives — extends the token layer as new tokens when the first Operational primitive ships. They will not be a rename of the existing four.
