---
'@auxiliary/css': patch
---

Slider and Progress tracks switch from `bg-muted` (1.0–1.2:1 against
surfaces — identical to `card` in dark) to `bg-input`, the gated ≥3:1
control-boundary color the Switch track already uses. A recipes-a11y
assertion locks all three tracks on `input`.
