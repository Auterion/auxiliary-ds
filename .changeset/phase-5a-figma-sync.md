---
'@auxiliary/tokens': minor
---

Phase 5a — figma-sync, unparked (MCP-driven, one-way code → Figma Variables).

`@auxiliary/tokens` now emits a `json/figma-native` build artifact (`dist/figma-native.json`):
a **Primitives** collection (single mode) + a **Semantic** collection with 4 modes
(light/dark/sunlight/darknight) and cross-collection aliases, mapping 1:1 onto Figma's
Variable model. An integrity test guards it (two collections, the 4 modes, no dangling
aliases, shadow/cubicBezier excluded).

`@auxiliary/figma-sync` (private) is unparked: it turns that artifact into a self-contained,
idempotent `use_figma` push program (`dist/push.figma.js`) plus a `/figma-sync` Claude skill
that applies it one-way to a target Figma file via the Figma MCP — Primitives + 4-mode
Semantic collections (with aliases) + shadow Effect Styles. Session/agent-triggered (Org tier
has no headless REST path). Validated live against the Auterion `auxiliary-ds` file: 2
collections, 29 semantic roles aliasing across 4 modes, 3 effect styles, idempotent re-runs.
