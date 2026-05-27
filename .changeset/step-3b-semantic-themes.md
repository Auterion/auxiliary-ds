---
"@auxiliary/tokens": minor
---

Author the semantic token layer with 4 themes (Step 3b).

**Primitive layer changes:**
- Replaced the cool gray ramp with a **zinc** ramp (hue ~286, low chroma) matching shadcn-zinc OKLCH values. Added `color.primitive.white` and `color.primitive.black` as standalone primitives for theme references.
- Removed the amber accent ramp — Auxiliary now follows a zinc-on-zinc aesthetic where the accent is derived from the same neutral ramp as the surfaces.

**Semantic layer (new):**

Structured naming under flat namespaces (NOT shadcn's flat `color.*` convention), with custom utilities to land in `@auxiliary/css` (Step 4). Emitted CSS vars:

- `--bg-{canvas,surface,elevated,muted,hover}`
- `--text-{primary,secondary,muted,inverse}`
- `--accent-{default,foreground,hover}`
- `--border-{default,strong,focus}`
- `--input-{bg,border}`
- `--status-{alarm,warning,caution,advisory,nominal}-{bg,fg,border}`

**4 themes:**

- **Light** (default, in `@theme` block) — zinc-on-white, matches shadcn-zinc light values
- **Dark** (`@media (prefers-color-scheme: dark)` + `[data-theme="dark"]`) — zinc-on-zinc-950, matches shadcn-zinc dark
- **Sunlight** (`[data-theme="sunlight"]`) — pure black on pure white, vivid status colors, sharper borders for outdoor/glare readability
- **Darknight** (`[data-theme="darknight"]`) — near-black backgrounds with warm/red-shifted text (hue ~30, low luminance) for night-vision preservation; status colors retain hue but at very low luminance

Mode resolution:
1. No `data-theme` attribute → system preference picks Light or Dark
2. `data-theme="light|dark|sunlight|darknight"` → explicit override

**Build script (`build.mjs`):**
- Rewrote with theme-aware emission across all four artifact types
- Primitives + light semantics go in `@theme` so Tailwind v4 generates utilities (utilities themselves land in Step 4 via custom `@utility` declarations)
- Dark/sunlight/darknight overrides emit as selector blocks; CSS vars resolve dynamically through utilities
