---
---

Docs (Phase 6.4 slice 10): add the **Mission-critical instruments** pattern — the Level-4 bespoke widgets, maximal scope. An attitude indicator (artificial horizon: token-driven SVG, rolls/pitches with the aircraft, driven by Sliders), a heading compass (rotating rose + mono readout), and the payload action cluster where STRIKE composes `GuardedAction` (hold-to-confirm — a stray click can't fire it). DS owns the widget; AHRS/gimbal/video data + the map/video engines stay product-owned. Added to the Patterns catalog + sidebar. No package changes.
