---
"@auxiliary/tokens": minor
---

Author the full primitive token layer (Step 3a):

- **Colors** (OKLCH): 11-stop neutral gray ramp (hue 250, very low chroma), 10-stop amber accent ramp (hue 75→45 across lightness), and 3-stop ramps (300/500/700) for five status hues (red, orange, yellow, blue, green) that the semantic layer in Step 3b will alias into Alarm/Warning/Caution/Advisory/Nominal.
- **Spacing**: 16-step scale (`0` through `24`, including half-steps `0_5`/`1_5`/`2_5` that emit as `--spacing-0-5` etc.).
- **Radii**: `none/xs/sm/md/lg/xl/full`.
- **Shadows**: `sm/md/lg`.
- **Motion**: `fast/base/slow` durations + `out/in-out` cubic-bezier easings.
- **Typography**: Inter Variable + Geist Mono families; 4 weights; 7 sizes (`xs` through `display`); 4 line-heights; 3 letter-spacings.
- **Density**: 4-step scale (`compact/default/comfortable/editorial`) as both a scalar multiplier and an absolute control-height in px.

95 primitive tokens total. All four build artifacts (`tailwind-v4.css`, `tokens.css`, `tokens.ts`, `figma.tokens.json`) emit cleanly. Tailwind v4 namespaces (`--color-*`, `--spacing-*`, `--radius-*`, `--shadow-*`, `--duration-*`, `--ease-*`, `--font-*`, `--text-*`, `--leading-*`, `--tracking-*`) resolve correctly so utilities like `bg-primitive-amber-500`, `p-4`, `rounded-md`, `shadow-md`, `text-display`, `font-mono` work out of the box once the CSS preset (Step 4) consumes the theme file.

Semantic layer (the 4 themes — Light, Dark, Sunlight, Darknight — and status aliases) lands in Step 3b.
