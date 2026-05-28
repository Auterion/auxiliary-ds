# @auxiliary/tokens

Design tokens for Auxiliary, authored in [DTCG](https://tr.designtokens.org/format/) JSON. **The source of truth.** Every other package in the system derives from these — none redefine values.

## Output artifacts

Style Dictionary v5 emits four artifacts on `pnpm --filter @auxiliary/tokens build`:

- `dist/tailwind-v4.css` — `@theme { … }` block driving Tailwind v4 utility generation. Imported by `@auxiliary/css`.
- `dist/tokens.css` — raw `--*` custom properties on `:root` + `[data-theme]` selectors per theme.
- `dist/tokens.ts` — typed const export for tooling (never imported into runtime components).
- `dist/tokens.json` — DTCG-spec single-file export consumed by downstream design tools (Paper, Magic Path, Pencil, …). Aliases preserved as `{path}` strings; OKLCH literals passed through.

The build also asserts a **primitive-purity invariant**: every semantic theme token must be a `{color.primitive.*}` alias. If a contributor introduces a literal RGB/hex/oklch value in a theme file, the build throws with a list of offenders.

## Naming

**Primitives** — the full Tailwind v4 OKLCH palette: 22 hues × 11 stops + white + black = 244 color primitives. Names match Tailwind: `color.primitive.{slate,gray,zinc,neutral,stone,red,orange,amber,yellow,lime,green,emerald,teal,cyan,sky,blue,indigo,violet,purple,fuchsia,pink,rose}.{50..950}`.

**Semantic tokens** — shadcn-ui vocabulary, theme-mode aware:

- Surfaces: `background`, `foreground`, `card`, `card-foreground`, `popover`, `popover-foreground`
- Actions: `primary`, `primary-foreground`, `secondary`, `secondary-foreground`, `muted`, `muted-foreground`, `accent`, `accent-foreground`
- Inputs: `border`, `input`, `ring`
- Generic negative state: `destructive`, `destructive-foreground` (kept as alias of `alarm` for shadcn-vue component drop-in compatibility)
- **Auterion operational extensions** — MIL-STD-1472H 5-level alarm hierarchy: `alarm/warning/caution/advisory/nominal` each paired with a `-foreground`.

Themes: `light`, `dark`, `sunlight`, `darknight`. Every cell in every theme is a primitive alias.

## Customization (override anywhere)

Every semantic token is exposed as a `:root` CSS variable. To customize, override in your own `:root`:

```css
:root {
  --primary: oklch(0.6 0.2 30);
  --primary-foreground: oklch(0.98 0 0);
}
```

The override propagates everywhere — every Vue component that uses the semantic class (`bg-primary`, `text-primary-foreground`, etc.) picks up the new value. For per-theme overrides, scope to a `[data-theme="..."]` selector.

**Semantic tokens are the stable contract; primitives are implementation details.** Override semantics freely; treat primitives as private.

A scaffolding CLI (`@auxiliary/cli`) for one-command project init + theme generation is on the roadmap; today, consumers import `@auxiliary/css` + `@auxiliary/vue` as dependencies and override CSS variables.

## Status color regulations — DO NOT REASSIGN WITHOUT REVIEW

The 5-level status hierarchy (`alarm` / `warning` / `caution` / `advisory` / `nominal`) is constrained by **aerospace alerting regulations**. Auterion ships flight-deck and ground-control surfaces; colour mis-use here is a safety issue, not an aesthetic preference.

| Level | Color | Regulatory basis |
|---|---|---|
| `alarm` | red | FAA 14 CFR Part 25.1322 — Warning tier (immediate corrective action) |
| `warning` | orange | Between Warning and Caution in our 5-level granularity; hue-differentiated from `alarm` |
| `caution` | yellow | FAA Caution tier (abnormal, awareness, potential future action) |
| `advisory` | **cyan** | FAA Advisory tier (out-of-range, no immediate action). **Red, amber, yellow, and green are prohibited for this tier.** |
| `nominal` | green | Reserved exclusively for Normal Operations per EICAS/ECAM convention. **Never used for hazards, warnings, or attention-required states.** |

**Do not change these color assignments without consulting the relevant regulatory references:** FAA 14 CFR Part 25.1322, EASA AMC 25.1322, MIL-STD-1472H §5.2.4. The most common violation is using blue for `advisory` (blue is not strictly cyan) or using green for anything other than `nominal` (green is exclusively a "safe" signal in cockpit conventions).
