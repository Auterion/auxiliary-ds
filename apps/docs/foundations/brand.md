# Brand

Auterion's marks, wordmarks, and lockups — plus the **usage rules that travel with them**.
Auterion is multi-product, so this is a small brand *system*, not one logo: the org mark
(`auterion`) and a mark per product (`mission-control`, `suite`, `os`), each in three tones
across four kinds.

The brand layer ships as [`@auxiliary/brand`](https://github.com/Auterion/auxiliary-ds/tree/main/packages/brand),
parallel to icons in the dependency graph. It's kept separate from functional iconography
because marks carry different licensing and usage rules — you can recolor an icon freely; you
cannot recolor a logo.

::: warning Awaiting artwork
The package is scaffolded and the usage manifest is authoritative, but the master SVGs aren't
in the repo yet. Every `<Logo>` below therefore renders a **labelled placeholder** — that's by
design, so the missing slot is visible and nothing fake ships. Drop masters into
`packages/brand/assets/` and run `pnpm --filter @auxiliary/brand sync`.
:::

## The component

`<Logo>` resolves the correct asset from the manifest and renders it. `tone="auto"` (the
default) draws the single-color master via `currentColor`, so it inherits the surface's themed
text color and stays legible on any theme without JS.

<div class="not-prose flex flex-wrap items-center gap-6 my-4">
  <Logo id="auterion" kind="lockup-horizontal" />
  <Logo id="auterion" kind="mark" />
  <Logo id="mission-control" kind="mark" tone="inverse" />
  <Logo id="suite" kind="lockup-horizontal" />
  <Logo id="os" kind="mark" />
</div>

```vue
<script setup>
import { Logo } from '@auxiliary/brand';
</script>
<template>
  <Logo id="auterion" kind="lockup-horizontal" />        <!-- theme-legible via currentColor -->
  <Logo id="mission-control" kind="mark" tone="inverse" />
  <Logo id="suite" decorative />                          <!-- removed from the a11y tree -->
</template>
```

| Prop | Values | Default | Notes |
|---|---|---|---|
| `id` | `auterion` · `mission-control` · `suite` · `os` | — | Which logo |
| `kind` | `mark` · `wordmark` · `lockup-horizontal` · `lockup-stacked` | `lockup-horizontal` | Which form |
| `tone` | `auto` · `color` · `mono` · `inverse` | `auto` | `auto` = currentColor; `color` = full-color master |
| `title` | string | `"<Name> logo"` | Accessible name |
| `decorative` | boolean | `false` | Removes it from the accessibility tree |

## The manifest (why this is designable-against)

`brand.manifest.json` is the machine-readable source of truth for *which mark to use where*.
For each logo it records clearspace, min-size, the themes it's cleared for, the tone to use per
theme, and forbidden contexts. An agent — or `<Logo>` — consults it to pick the right asset for
a surface instead of guessing.

```ts
import { resolveLogo } from '@auxiliary/brand';

resolveLogo({ id: 'mission-control', kind: 'mark', theme: 'dark' });
// → { entry, kind: 'mark', tone: 'inverse', status: 'pending' | 'available', svg?, minSize }
```

## Usage rules

- **Clearspace** — keep clear space around the mark of at least half its height. Don't crowd it.
- **Min-size** — don't render below the per-kind `minSize` (marks 16px, lockups 24px); legibility
  fails first at small sizes.
- **Tone by theme** — light/sunlight surfaces use the color or dark mark; dark/darknight use the
  inverse. `tone="auto"` handles this for you.
- **Operational chrome** — in L3/L4 Mission-Control surfaces use the bare **mark**, mono or inverse,
  at min-size — not the full-color marketing lockup.
- **Don't** recolor outside the provided tones, stretch, rotate, or alter proportions.

### Over imagery

The operational basemap is **satellite/terrain photography, not a flat fill**. Marks (and the
viz palettes) placed over it need a contrast scrim or halo to stay legible against high-variance
backgrounds. Full treatment is tracked with the operational-map work in the roadmap.

## Brand color

Note: the system's `primary` currently resolves to a neutral (`zinc`), not an Auterion brand hue
— introducing a brand color is a tokens-level follow-up tracked in `ROADMAP.md`. The brand layer
*references* color tokens; it never redefines them.

## App icons

Favicons, PWA/maskable icons, the apple-touch-icon, desktop app icons, and an OG-image template
all derive from each logo's mark. The manifest declares the required outputs per target
(`auterion`, `mission-control`, `suite`, `os`); the export step lands once the master marks do.
