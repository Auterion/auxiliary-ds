---
'@auxiliary/tokens': minor
---

Phase 6.3 (Defense layer) — redesigned sunlight/darknight palettes + extended legibility gates (ROADMAP §6i).

**Palette redesign** (operational themes only; light/dark unchanged):

- **sunlight** — hardened for direct-sun glare: deepened structure (`border` zinc.400→zinc.500, `input`
  zinc.500→zinc.600) and deeper status fills (`warning` orange.600, `advisory` cyan.800) so panels, fields,
  and severity blocks survive veiling glare. Caution stays bright yellow (its luminance is the signal).
- **darknight** — fixes a latent scotopic hazard: the old severity ramp was luminance-*scrambled* (alarm
  red.800 was dimmer than caution), so the most urgent signal read near-black under rod vision. Severity is
  now a **monotonic luminance ladder** — `alarm` is the brightest element (a visible red.400, ~4× brighter),
  stepping down to a near-extinguished `nominal` (green.950). `advisory` moves off cyan (low-blue yellow.900),
  and `border`/`input` lift to amber.700 for structure. All tokens remain low-blue.

**New token-layer gates** (`packages/tokens/test/sunlight-night-gates.test.ts`, computed from the OKLCH
source) — a palette edit that regresses any of them fails CI:

- Focus `ring` ≥ 3:1 vs background in every theme (WCAG 1.4.11).
- `border` + `input` ≥ 3:1 in the operational themes (structural contrast under glare / dark).
- Darknight severity is a strictly monotonic luminance ladder (alarm brightest → nominal dimmest).
- Darknight blue-cap extended from status fills to **every** token (scotopic).
- Severity fills pairwise perceptually distinct in OKLab (ΔEok). Adds `oklab()` / `deltaEOk()` helpers.

Status-fill-vs-background 3:1 is deliberately *not* gated — physically impossible for bright hues like
yellow, and the darknight ladder requires a dim nominal. Floors only ratchet up.
