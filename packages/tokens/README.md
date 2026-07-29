# @auxiliary/tokens

Design tokens for Auxiliary, authored in [DTCG](https://tr.designtokens.org/format/) JSON. **The source of truth.** Every other package in the system derives from these — none redefine values.

The source is organised on the **GTC model** ([Global · Theme · Component](https://buninux.com/design-tokens), rulebook [bunind/gtc-tokens](https://github.com/bunind/gtc-tokens)), with a fourth group — `register.*` — for the second orthogonal non-colour axis GTC does not model. The model, the decision table for "where does this token go?", and every deliberate divergence from canonical GTC are documented in **[apps/docs/foundations/tokens.md](../../apps/docs/foundations/tokens.md)**. This file covers the package: what it emits, what it asserts, and how to consume it.

## Layout

867 tokens across 51 files under `src/`:

| Group | Files | Tokens | Re-resolved by | What it holds |
|---|---|---|---|---|
| `src/global/` | 15 | 464 | — | The value layer. Palette, spacing, radius, type, motion, opacity, blur, borders, sizes, z-index, breakpoints, touch targets. |
| `src/theme/` | 4 | 212 | `[data-theme]` | **Colour only.** 53 semantic roles × `light` / `dark` / `sunlight` / `darknight`. |
| `src/register/` | 1 | 10 | `[data-register]` | **Non-colour only.** Control height, radius, motion duration. `expressive` is the default and ships no file — it *is* the global value. |
| `src/component/` | 31 | 181 | (follows both) | Per-component structure: height, padding, gap, radius, icon size, surface width. One file per shipped component. Never colour, never typography. |

## Output artifacts

Style Dictionary v5 emits **six files across five platforms** on `pnpm --filter @auxiliary/tokens build`:

- `dist/tailwind-v4.css` — the `@theme { … }` block driving Tailwind v4 utility generation, plus the `[data-theme]`, `[data-register]` and input-modality override blocks and the `:root` component tier. Imported by `@auxiliary/css`.
- `dist/tokens.css` — the same cascade as raw `--*` custom properties, for consumers not on Tailwind.
- `dist/tokens.js` — typed const export for tooling (never imported into runtime components).
- `dist/tokens.d.ts` — its declaration file. The JS entry ships as **plain JS + `.d.ts`, not a raw `.ts` source**: Node refuses type-stripping under `node_modules`, so a published `.ts` entry breaks every non-bundler consumer. A JSON literal is valid TS type syntax, so the `.d.ts` preserves the exact `as const` literal types.
- `dist/tokens.json` — strict DTCG single-file export consumed by DTCG-aware design tools (Paper, Magic Path, Pencil, …). Aliases stay as `{path}` strings; colours become `{ colorSpace, components, hex }`; dimension/duration become `{ value, unit }`; `shadow` and `cubicBezier` emit their spec'd composite shapes.
- `dist/figma-native.json` — the contract for [`@auxiliary/figma-sync`](../figma-sync). Three Variable collections mapping 1:1 onto the Figma Plugin API model — **Primitives** (mode `Base`), **Semantic** (four theme modes), **Component** (`sm`/`md`/`lg` size modes) — plus the Text Styles derived from the `type/*` composites.

`dist` is wiped entirely before each build: `cleanAllPlatforms()` only removes declared destinations, so renamed outputs and stray files would otherwise survive into the published tarball (`files: ["dist"]`).

## The two runtime axes

Two orthogonal token-mode layers re-resolve tokens at runtime. They compose freely and never overlap.

| Axis | Attribute | Controls | Values |
|---|---|---|---|
| **Theme** | `[data-theme]` | colour | `light` · `dark` · `sunlight` · `darknight` |
| **Register** | `[data-register]` | everything non-colour (control height, radius, motion) | `expressive` (default) · `operational` |

A third, narrower layer sits above both: the **input-modality** floor. `--target-min` is 44 px (WCAG 2.5.5 AAA / MIL-STD-1472); `--target-floor` is `0px` by default and rises to `--target-min` under `@media (pointer: coarse)` or `[data-input="coarse"]`. Recipes compose it with `max(var(--control-height-md), var(--target-floor))`, so the touch floor wins over register density at any depth in the tree. It is emitted as static CSS after the theme and register blocks rather than derived from tokens, because it is a toggle, not a value.

```html
<body data-theme="darknight" data-register="operational" data-input="coarse">
```

## Emitted names

Source paths carry the GTC group; emitted CSS variable names do not. The strip is what makes the cascade work — a `[data-theme]` block has to shadow the *same* variable name it declares at `:root`.

```
global.spacing.4                →  --spacing-4                       (drops 1 segment)
theme.light.card-foreground     →  --card-foreground                 (drops 2)
register.operational.radius.md  →  --radius-md                       (drops 2)
component.button.padding-x.md   →  --component-button-padding-x-md   (drops 0)
```

The component tier deliberately keeps its group segment so a per-component variable can never collide with a global one, and it emits a **`var()` reference, not a literal** — `--component-button-height-md: var(--control-height-md)` — so it follows `[data-register]` by construction.

## Build gates

`build.mjs` runs a GTC model check against the **raw merged source** first, then five assertions against the hydrated Style Dictionary dictionary. Any of them fails the build with a list of offenders.

| Gate | Asserts |
|---|---|
| `assertGtc()` (`gtc-validate.mjs`) | 13 GTC taxonomy rules — alias resolution, no cycles, group-first naming, kebab levels, terminal states, factual scale keys, axis orthogonality, component size parity, and that every component Element names a component actually exported from `@auxiliary/vue` or `@auxiliary/viz`. Runs before hydration because Style Dictionary resolves aliases first: a dangling `{ref}` would throw without naming the token, and a reference cycle would blow the stack. Reported per-rule by `test/gtc-taxonomy.test.ts`. |
| `assertPrimitivePurity` | Every theme token is a `{global.color.primitive.*}` alias. Catches a literal RGB cell — and, since the GTC pass, also catches a theme role pointing at another theme role or at a non-colour global. |
| `assertRegisterOrthogonality` | No register token is a colour; no theme token is anything but a colour. |
| `assertThemeRoleParity` | All four themes define the identical role set, each role the same `$type` everywhere. A role missing from one theme would silently fall through to the light value — invisible to the per-theme gates, which iterate only the keys a theme *has*. |
| `assertComponentTier` | Component tokens carry no colour, always alias, alias only into `global.*`, and never alias `global.target.*` (the touch floor is not re-emitted under `[data-input]`, so a component var pointing at it would freeze at its `:root` value). |
| `assertSourceShapes` | Every token sits under a known GTC group with a known `$type` and a `$value` whose shape matches it — including DTCG §9.2 `strokeStyle` keywords and the 0..1 range on `opacity`. Without it an untyped token flows through as a Figma FLOAT with null values, and an object `$value` on a scalar type emits `--x: [object Object]`. |

Beyond the build, `test/` carries the per-theme legibility gates — contrast, focus visibility, structural UI contrast, `darknight` blue-energy and luminance-ladder, severity separation in OKLab, CVD, and viz-palette. Floors only ever ratchet up. See [Colors → operational legibility gates](../../apps/docs/foundations/colors.md).

## Naming

**Primitives** — `global.color.primitive.<family>.<step>`, **291 colours across 29 families**:

- The full Tailwind v4 OKLCH palette — 22 hues × 11 steps (`slate`, `gray`, `zinc`, `neutral`, `stone`, `red`, `orange`, `amber`, `yellow`, `lime`, `green`, `emerald`, `teal`, `cyan`, `sky`, `blue`, `indigo`, `violet`, `purple`, `fuchsia`, `pink`, `rose`), plus `white` and `black` — 244.
- `mono` (11) — the achromatic neutral spine.
- `auterion-blue` (11) — the ultramarine brand hue (~264°), regularized onto the shared lightness spine.
- `cadet` (11) — the brand cyan-grey neutral (~200°), distinct from advisory cyan.
- `ink` (12) — the ultramarine-tinted dark-UI neutral (~265°) the dark theme draws its surfaces from; carries an extra `850` step.
- `scrim` (2) — black at fixed alpha (`55`, `70`) for modal overlays, dark in every theme.

**Semantic roles** — 53 per theme, shadcn-ui vocabulary plus Auterion's operational extensions:

- Surfaces: `background`, `foreground`, `card`, `card-foreground`, `popover`, `popover-foreground`, `muted`, `muted-foreground`, `border`, `input`, `ring`, `overlay`
- Actions: `primary`, `secondary`, `accent`, `destructive`, `brand` — each with a `-foreground`
- **Operational status ladder** — MIL-STD-1472H 5-level hierarchy: `alarm` / `warning` / `caution` / `advisory` / `nominal`, each with a `-foreground` and an `-emphasis` (the high-contrast ink for status *text* on a neutral ground)
- Data-visualisation ramps: `viz-categorical-1..6`, `viz-sequential-1..5`, `viz-diverging-1..5`

`destructive` exists for shadcn-vue component drop-in compatibility. It is a *separate* red from `alarm` — one step deeper in every theme — so a destructive button never reads as an active alarm annunciator.

**Composites** — `shadow/*` (3) and the `type/*` typography roles (14: seven `product/*`, seven `marketing/*`) aren't single CSS values. They're excluded from the flat CSS exports and ship to Figma as Effect Styles and Text Styles respectively.

## Customization (override anywhere)

Every semantic token is exposed as a `:root` CSS variable. To customize, override in your own `:root`:

```css
:root {
  --primary: oklch(0.6 0.2 30);
  --primary-foreground: oklch(0.98 0 0);
}
```

The override propagates everywhere — every Vue component that uses the semantic class (`bg-primary`, `text-primary-foreground`, etc.) picks up the new value. For per-theme overrides, scope to a `[data-theme="..."]` selector; for per-register overrides, to `[data-register="..."]`.

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
