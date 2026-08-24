---
'@auxiliary/tokens': minor
'@auxiliary/css': minor
---

Explore a monochrome-neutral identity: a `mono` neutral ramp + a non-status `brand` accent.

- **`@auxiliary/tokens`** — adds a `mono` primitive ramp (50–950, cool-gray hue 252) and re-points
  the neutral semantic mappings (background/foreground/card/popover/primary/secondary/muted/accent/
  border/input/ring) from `zinc` onto it across `light` and `dark`. Adds a new **`brand` /
  `brand-foreground`** semantic token to all four themes — the Auterion identity accent, kept
  **distinct from the status ladder**: monochrome in `light`/`dark`, `black` in `sunlight`, and a
  low-blue `amber` in `darknight` so the accent never compromises night vision. The five-level
  status hues (alarm/warning/caution/advisory/nominal) and `destructive` are unchanged — color
  stays reserved for severity.

- **`@auxiliary/css`** — exports the new `brand` token as `--color-brand` / `--color-brand-foreground`
  (Tailwind `bg-brand`, `text-brand`, …), documented as a non-severity accent. Also lands the Auterion
  Inter type scale (Figma "Medium" ramp): the `text-xs…9xl` utilities now carry paired line-height +
  progressively-negative letter-spacing, with a matching `html` baseline and `font-feature-settings`
  update; monospace/`code`/`pre` opt out of the negative tracking to keep telemetry tabular.
