---
'@auxiliary/tokens': minor
'@auxiliary/css': minor
'@auxiliary/vue': patch
'@auxiliary/viz': patch
'@auxiliary/figma-sync': minor
---

Adopt the GTC token model (Global / Theme / Component) from
[buninux.com/design-tokens](https://buninux.com/design-tokens).

**Tiers renamed, emitted names unchanged.** `src/primitive/` → `src/global/`,
`src/semantic/` → `src/theme/`, and the register axis is now `register.operational.*`.
Every pre-existing CSS custom property keeps its exact name (`--card-foreground`,
`--spacing-4`), and Figma variable paths stay tier-stripped — a renamed Figma path
does not move bound instances, it orphans them. Verified: `tailwind-v4.css`,
`tokens.css` and `figma-native.json` were byte-identical across the rename.

**New `component.*` tier** — 181 structural tokens across 31 components (size,
padding, gap, radius, icon size, surface width; never colour, never typography).
Component tokens emit as `var()` *references* rather than resolved literals, and each
`[data-register]` block re-emits the ones that depend on a var it shadows — without
that, a subtree carrying `[data-register]` would inherit the already-substituted
`:root` value and silently keep the expressive geometry. Recipes consume them with
Tailwind v4's `px-(--component-button-padding-x-md)` shorthand.

**New global types:** `opacity` (role keys), `blur` (values match Tailwind's built-in
`--blur-*` exactly, which these override), `border-width`, `border-style`
(`$type: strokeStyle`, excluded from Figma), plus `size.icon.*` and `size.container.*`.
`size.container.*` is deliberately not emitted as `--container-*`, which is a Tailwind
namespace we would otherwise silently redefine.

**New gates:** `gtc-validate.mjs` (13 GTC rules over the raw source, run before Style
Dictionary hydration so dangling refs and reference cycles fail legibly),
`assertComponentTier`, `component-flex.test.ts`, a Tailwind-resolution gate that
compiles the real `theme.css` against the real recipe class set, a docs
token-coverage drift gate, and `no-bare-scale-utilities.test.ts` — which forbids a
bare Tailwind scale utility (`gap-2`, `p-4`, `h-8`) in a recipe, since such a value
renders fine and so fails nothing while living only in a class string: unpushable to
Figma, absent from the docs table, invisible to the next person.

That last gate found six survivors of the migration, each with a bare gap sitting on
the same line as an already-tokenised padding and radius — invisible precisely because
the line looked done. Now `component.card.footer.gap`,
`component.alert-manager.{root,stack}.gap`, `component.radio-group.gap`,
`component.dialog.gap` and `component.toast.viewport.gap` (187 component tokens, up
from 181).

**Bugs fixed along the way:**

- The fractional spacing rungs were dead code. `--spacing-2-5` was emitted but Tailwind
  looks up `--spacing-2\.5`, so `px-2.5`, `gap-1.5` and friends silently used Tailwind's
  own multiplier instead of our scale.
- Seven bare `rounded` sites compiled to a hardcoded `0.25rem` with no `var()`, making
  those corners immune to the operational register's radius override — a Badge kept 4px
  while surrounding Cards went to 2px.
- `tabs.list` was `h-9` (36px) but must contain a 28px trigger plus padding and borders
  (38px), so the trigger overflowed its own list by 2px. The height is now derived.
- `control.height.xs` had no operational override, so anything aliasing it would have
  silently stopped flexing.
- `select`/`combobox` item text inset and the switch thumb throw were literals derived
  from other tokens; both are now `calc()` over the tokens they depend on, so bumping an
  icon or a track can no longer desync them.
- The Figma push renamed `modes[0]` unconditionally, which would have rewritten an
  existing `dark` mode into a second `light` and orphaned every dark value.
- `pack-smoke` probed the published tokens entry for `tokens.color`, which the tier
  rename moved to `tokens.global.color` — the one gate that sees the published tier
  layout was asserting the shape it exists to catch. It now asserts all four groups.
