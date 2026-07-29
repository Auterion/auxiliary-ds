# Tokens — the GTC model

Every value in Auxiliary — a colour, a gap, a radius, a duration — is a **design
token** authored as [DTCG](https://tr.designtokens.org/format/) JSON in
`packages/tokens`. Nothing downstream redefines a value; `@auxiliary/css`,
`@auxiliary/vue`, `@auxiliary/viz` and the Figma library all derive from this one
source.

How those tokens are *organised* follows the **GTC model**
([Global · Theme · Component](https://buninux.com/design-tokens), rulebook
[bunind/gtc-tokens](https://github.com/bunind/gtc-tokens)). GTC's premise is that a
token's name should tell you where it may be changed and what changing it will move.
Auxiliary adopts that premise, with a small number of documented divergences —
listed below with their reasons, so nobody "fixes" them back.

## The four groups

GTC has three groups. Auxiliary has four: `register.*` is a **second orthogonal
non-colour axis** (`[data-register]` — density, radius, motion) that GTC does not
model. It is not a variant of Theme; it re-resolves a disjoint set of tokens under a
different attribute, and the two compose freely (see
[Registers](/foundations/registers)).

```
packages/tokens/src/
│
├── global/                        THE VALUE LAYER — fixed, axis-free.
│   ├── color/                       global.color.primitive.blue.700   OKLCH palette (291)
│   ├── spacing.tokens.json           global.spacing.4                  → --spacing-4
│   ├── radius.tokens.json            global.radius.md                  → --radius-md
│   ├── size.tokens.json              global.size.icon.md               → --size-icon-md
│   ├── control.tokens.json           global.control.height.md          → --control-height-md
│   ├── typography.tokens.json        global.text.sm · global.type.product.body
│   ├── motion.tokens.json            global.duration.base · global.ease.out
│   ├── opacity.tokens.json           global.opacity.disabled           → --opacity-disabled
│   ├── blur.tokens.json              global.blur.sm                    → --blur-sm
│   ├── border-width.tokens.json      global.border-width.focus         → --border-width-focus
│   ├── border-style.tokens.json      global.border-style.dashed        → --border-style-dashed
│   ├── shadow.tokens.json            composites — Figma Effect Styles, not variables
│   ├── breakpoint.tokens.json        global.breakpoint.lg              → --breakpoint-lg
│   ├── z-index.tokens.json           global.z.modal                    → --z-modal
│   └── input.tokens.json             global.target.min / .floor        → --target-min / --target-floor
│
├── theme/                         COLOUR ONLY — re-resolved by [data-theme].
│   ├── light.tokens.json             theme.light.card-foreground       → --card-foreground
│   ├── dark.tokens.json              …the same 53 roles, four times over
│   ├── sunlight.tokens.json
│   └── darknight.tokens.json
│
├── register/                      NON-COLOUR ONLY — re-resolved by [data-register].
│   └── operational.tokens.json       register.operational.radius.md    → --radius-md (override)
│                                     `expressive` is the default: it *is* the global
│                                     value, so it ships no file.
│
└── component/                     PER-COMPONENT STRUCTURE — 181 tokens, 31 components.
    ├── button.tokens.json            component.button.padding-x.md
    │                                 → --component-button-padding-x-md: var(--spacing-4)
    ├── dialog.tokens.json
    └── … 29 more, one file per shipped component
```

867 tokens across 51 files: **464 global**, **212 theme** (53 roles × 4 modes),
**10 register**, **181 component**.

## Where does a token go?

Key the decision on **what the value varies by** — not on what it is used for.

| The value… | Group | Authored as | Emits |
| --- | --- | --- | --- |
| is the same everywhere — it *is* the number | **global** | `global.radius.md` | `--radius-md: 6px` |
| changes with `[data-theme]` (light / dark / sunlight / darknight) | **theme** | `theme.dark.card` | `--card` per theme block |
| changes with `[data-register]` (expressive ↔ operational) | **register** | `register.operational.radius.md` | `--radius-md` inside the override block |
| changes per component, or per size within a component | **component** | `component.button.padding-x.md` | `--component-button-padding-x-md` |

Two corollaries fall out of that table, and both are build-time gates:

- **Colour is the theme axis's exclusive property.** A colour in `component/` or
  `register/` would be invisible to the four per-theme contrast, CVD and
  blue-energy gates and would not re-resolve under `[data-theme]`. So there are no
  colours outside `global.color.*` and `theme.*`.
- **The theme axis carries nothing but colour.** A dimension under `theme.dark.*`
  would couple density to palette and break the "themes × registers compose freely"
  contract.

## Alias direction

References point **inward, toward global** — never sideways, never outward:

```
theme.dark.card      ──▶ global.color.primitive.ink.900
register.operational
  .radius.md         ──▶ global.radius.sm
component.button
  .padding-x.md      ──▶ global.spacing.4
global.size.icon.md  ──▶ global.spacing.4          (intra-tier, allowed)
```

- Theme, register and component tokens **never store a raw value** — each one is a
  `{alias}`. A literal there would define a value that tier has no authority to
  define.
- Global may alias **within** global (the role layer: `global.text.caption` →
  `global.text.xs`, and the `type/*` composites) but never **out** of it.
- **No cycles**, anywhere. The cycle check runs against the raw merged source
  *before* Style Dictionary hydrates, because SD's resolver would otherwise blow the
  stack with no token path in the message.

## Documented divergences from canonical GTC

Each of these is a deliberate departure. The authoritative copy of this list lives in
the header of `packages/tokens/gtc-validate.mjs`; it is reproduced here so the reason
travels with the docs.

| Divergence | Canonical GTC | Auxiliary | Why |
| --- | --- | --- | --- |
| **No `$extensions.mode`** | modes are metadata on a token; one value per mode | mode is a **path segment** — `theme.dark.card`, `component.button.padding-x.md` | Style Dictionary's pipeline keys off the path, and the emitted CSS variable names had to stay byte-identical through the restructure. The cost is that GTC's "all modes present" guarantee is no longer free, so the validator re-earns it: `size-suffix-parity` fails a component whose `padding-x` declares an `lg` that its `height` does not. |
| **Four groups, not three** | Global · Theme · Component | + `register.*` | `[data-register]` is a second orthogonal axis over the *non-colour* tokens. Folding it into Theme would make density a function of palette; leaving it in Global would make it un-overridable. GTC has no fourth-group concept, so this is an addition rather than a reinterpretation. |
| **Four theme modes, not two** | light / dark | light · dark · **sunlight** · **darknight** | `sunlight` is glare-hardened, `darknight` is scotopic low-blue. These are operational requirements, not preferences — see [Colors](/foundations/colors). A parity assertion forces all four to define the identical role set. |
| **Tailwind-indexed spacing keys** | numeric key `N` means `Npx` | `spacing.4` = `16px` (Tailwind step index on a 4 px base) | The property GTC's rule protects is that *the key is the value* — computable without a lookup. A base-4 step key still has that property, and matching Tailwind's index is what lets `p-4` and `--spacing-4` mean the same thing. The validator enforces the base-4 arithmetic rather than dropping the rule. |
| **Role keys for radius, leading, z-index** | numeric scale keys | `radius.sm`, `leading.tight`, `z.modal` | Canonical GTC scopes its factual-key rule to numeric keys only, so role keys are already outside it. Kept because these ladders are semantic: `z.modal` sits above `z.overlay` for a reason a number would not carry. |
| **`global-self-contained` replaces `global-is-source`** | Global aliases nothing | Global may alias **within** global, never outside it | Auxiliary's global tier carries a role-alias layer (`text.caption` → `text.xs`) and 14 `type/*` typography composites — 83 intra-tier references. What GTC's rule protects is a global tier that is self-contained and acyclic; those references don't threaten it. So the rule is **narrowed**, not dropped. |

## What the validator checks — and what it cannot

`packages/tokens/gtc-validate.mjs` enforces thirteen rules against the raw merged
source. `build.mjs` calls it **before** Style Dictionary hydrates, so a dangling
`{ref}` or a reference cycle surfaces as a named token path instead of an opaque SD
throw. `test/gtc-taxonomy.test.ts` reports one `it()` per rule, so CI says
*"GTC: theme tokens store no raw values — FAILED"* rather than *"build.mjs threw"*.

| Rule | Asserts |
| --- | --- |
| `alias-resolves` | every `{ref}` names an existing token |
| `no-cycles` | the reference graph is acyclic |
| `global-self-contained` | global never aliases outside global |
| `no-raw-outside-global` | theme / register / component store aliases only |
| `no-component-color` | the component tier is structural, never colour |
| `axis-orthogonality` | theme is colour-only; register never touches colour |
| `group-first` | every name starts with a group, and `theme.` with a real mode |
| `no-value-lead` | outside global, a name never leads with a digit |
| `kebab-levels` | a dot separates levels; a hyphen joins words inside one |
| `state-terminal` | an interaction state (`hover`, `disabled`, …) is always last |
| `factual-scale-keys` | a numeric key equals its value (base-4 for spacing) |
| `size-suffix-parity` | a component's size families are internally complete |
| `component-element-known` | a component Element names a component actually exported from `@auxiliary/vue` or `@auxiliary/viz` |

That last rule is what mechanically enforces GTC's "design role, not screen": you
cannot author `component.sidebar.*` or `component.login.*`, because no such component
is exported.

**Three GTC rules are not mechanically checkable, and the validator does not pretend
otherwise:**

- **Classifier-vs-Identifier ordering.** Both are *open* vocabularies by GTC's own
  definition — a Classifier is "an alternative variant", an Identifier "a
  distinguishing tag or property". In `theme.button.primary.alpha.hover` nothing in
  the string distinguishes `primary` (Classifier) from `alpha` (Identifier). Swap
  them and no algorithm can tell. Catching it would need a hand-maintained
  per-Element vocabulary whose upkeep would exceed the defects it caught. Deliberately
  not attempted — and not to be faked with a heuristic.
- **"Why before where"** (GTC rule 1). A semantic judgement about intent. Review
  catches it; a parser does not.
- **"Use the minimum number of levels."** Ambiguity is not computable. There is no
  depth budget standing in for this rule.

A validator that overclaims is worse than one that scopes itself, so these stay in
prose and in review.

## Emitted names are the contract

The GTC restructure moved every source path — `color.primitive.*` became
`global.color.primitive.*`, `light.*` became `theme.light.*` — and changed **not one
emitted CSS variable name**. Recipes, demos and docs consume the emitted names, and
those names are the public API:

```
global.spacing.4                 →  --spacing-4                       (drops 1 segment)
theme.light.card-foreground      →  --card-foreground                 (drops 2)
register.operational.radius.md   →  --radius-md                       (drops 2)
component.button.padding-x.md    →  --component-button-padding-x-md   (drops 0)
```

Theme and register **strip their group and axis segments** so the same variable name
is what gets shadowed inside a `[data-theme]` or `[data-register]` block — that
shadowing is the whole mechanism. The component tier **keeps** its group segment, so
`--component-button-radius` can never collide with `--radius-md`.

The same strip happens on the way to Figma, for a harder reason. GTC's own taxonomy
rule puts the Group on the **collection**, not the variable path, so
`{global.color.primitive.red.700}` becomes `Primitives/color/primitive/red/700`. That
also keeps every existing Figma variable path stable across the migration — and it
has to be stable, because **renaming a Figma variable path does not move the bound
instances, it orphans them** and silently creates a duplicate alongside. A path is
cheap to get right once and expensive to change later.

## Component tokens

The component tier is new with the GTC pass: **181 structural tokens across 31
components**, one file per component.

**Shape:**

```
--component-<element>-<property>[-<size>]

--component-button-radius            (no size axis — one radius for all sizes)
--component-button-padding-x-md      (sm | md | lg)
--component-status-badge-icon-size-sm
```

**What belongs here** — structure that a designer would resize:

| Property family | Example |
| --- | --- |
| Control height | `--component-input-height-md` |
| Padding | `--component-card-padding-x`, `--component-toast-padding` |
| Gap | `--component-button-gap` |
| Radius | `--component-dialog-radius` |
| Icon size | `--component-accordion-icon-size` |
| Surface width / max-width | `--component-popover-width`, `--component-tooltip-max-width` |

**What never belongs here:**

- **Colour** — that is the theme axis, exclusively. `component.button.background`
  would be invisible to every per-theme contrast gate. Build fails on it.
- **Typography** — sizes, leading and tracking come from the global type scale
  (`--text-sm`, `--leading-tight`) so the scale stays one ladder rather than 31
  private ones.
- **`global.target.*`** — the touch floor is re-declared by the
  `@media (pointer: coarse)` and `[data-input]` blocks, which do not re-emit the
  component tier. A component var pointing at it would inherit its `:root`-substituted
  value and silently ignore the floor. Compose it with `max()` at the point of use
  instead; see [Input & touch](/foundations/input-and-touch).

### They emit as references, not literals

Every other tier resolves to a literal, because a literal is what it means. A
component token means *"this button's md height **is** the global md control
height"* — a redirect. So it emits `var()`:

```css
:root {
  --component-button-height-md: var(--control-height-md);   /* not 36px */
  --component-button-radius:    var(--radius-md);
}
```

Baking `36px` would freeze it: under `[data-register="operational"]`
`--control-height-md` becomes 32 px, and a literal would not follow. A `var()` follows
by construction — and carries no fallback, since the target is declared in the same
generated file and the fallback would be exactly the frozen literal being eliminated.

There is one consequence worth knowing. Custom properties substitute `var()` at the
element the declaration applies to, and descendants inherit the *already-substituted*
value. A `:root`-only `--component-button-height-md` would therefore compute once, at
`:root`, and a mid-tree `<Register>` subtree would inherit that number — silently
ignoring the register. So the build **re-emits**, inside each register block, exactly
those component tokens that point at a variable the block shadows. That is why the
`[data-register="operational"]` block in `tailwind-v4.css` restates
`--component-button-radius` and friends.

### Consuming them

Recipes read component tokens with Tailwind v4's arbitrary-property shorthand, which
needs no `@theme` entry:

```ts
// packages/css/recipes/button.ts
'inline-flex items-center justify-center gap-(--component-button-gap)',
'rounded-(--component-button-radius) font-medium',
// … size variants
md: 'h-[max(var(--component-button-height-md),var(--target-floor))] px-(--component-button-padding-x-md) text-sm',
```

The tier is emitted in a plain `:root` block, deliberately **not** inside `@theme{}`:
Tailwind tree-shakes theme variables against the utilities it generates, and
`--component-*` is not a Tailwind namespace, so the whole tier would be dropped.

### In Figma

The component tier exports as a third Variable collection, **Component**, with
`sm` / `md` / `lg` as **Figma modes** — the size axis that the source carries as a
path segment. A designer flips one frame's mode and every bound radius, padding and
height resizes together. A two-size component (Badge, StatusBadge) carries its nearest
declared rung outward rather than inventing a third size: *"Badge at lg looks like
Badge at md"* is the truth. See
[`@auxiliary/figma-sync`](https://github.com/Auterion/auxiliary-ds/tree/main/packages/figma-sync).
