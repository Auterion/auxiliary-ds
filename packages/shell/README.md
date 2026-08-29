# `@auxiliary/shell`

The Auterion **ecosystem layer** — the chrome that is identical across every
Auterion surface, and nothing else.

```
tokens → css → vue → docs
              ↘ icons ↗
              ↘ viz, brand ↗
                    ↘ shell
```

## Why it is a package

Ratified separately from the docs-first blocks decision (`AD-D-038`), for two
reasons:

1. **Its value is being singular.** The §6.4 app-shell is *intra-product*
   layout — a top bar and a sidebar a product composes for its own screens, and
   a recipe plus documentation serves that well. This is *inter-product* chrome:
   the strip that must be the **same artifact** in Suite, Control, Nemyx, the
   device app and the launcher. A recipe copied into five repos is five
   artifacts that drift, which is the failure the layer exists to prevent.
2. **It cannot live in `@auxiliary/vue`.** The bar renders the Auterion mark and
   per-surface glyphs, so it depends on `@auxiliary/brand` and
   `@auxiliary/icons`. `vue` depends on neither; putting the bar there would
   make `vue → brand` and invert the layered flow.

## What is in it

| Export | What it is |
| --- | --- |
| `IdentityBar` | The strip: mark · AUTERION · / · SURFACE · apps · tabs · org · account |
| `Launcher` | The ecosystem's own screen — every surface as a tile that declares the theme and register it will hand you |
| `SurfaceGlyph` | The drawn hairline mark per surface. Identity by silhouette, never by hue |
| `SURFACES`, `Surface`, … | The one surface declaration table the rest read |

## What is deliberately not in it

Page layout, sidebars, content regions, panels, routing — anything a product
renders **below** the bar. The moment a shared shell reaches further down,
product teams refuse it and they are right to. That boundary is the package's
whole design, not an omission to be corrected later.

## The bar's contract

Four invariants, each gated by a test rather than asserted in a doc:

- **Order** — `mark · AUTERION · / · SURFACE · apps · tabs · org · account`.
  Never rearranged. A bar that reorders itself per surface is five bars wearing
  one name.
- **Height** — a ladder off `--component-identity-bar-height`, which aliases
  `--control-height-lg`, so `[data-register="operational"]` makes it denser
  (48px → 44px) without this package knowing it happened. Under
  `[data-input="coarse"]` the 44px touch floor composes *over* that density.
- **Colour** — semantic tokens only. The bar never learns which theme is on.
- **Reach** — it renders the tabs it is handed and owns nothing below itself.

## Usage

```vue
<script setup lang="ts">
import { IdentityBar, SURFACE_BY_ID } from '@auxiliary/shell';
</script>

<template>
  <div data-theme="dark" data-register="operational">
    <IdentityBar :surface="SURFACE_BY_ID.control" org="45th CAB" />
  </div>
</template>
```

The current tab is uncontrolled by default. A product with a router owns it:

```vue
<IdentityBar :surface="surface" :org="org" :tab="route.name" @update:tab="go" />
```

## Styling

Via the `identityBar` and `launcher` recipes in `@auxiliary/css`, over the
`--component-identity-bar-*` and `--component-launcher-*` token tiers. No
component in here hand-rolls a Tailwind class string, and no measurement lives
only in one — `packages/css/test/no-bare-scale-utilities.test.ts` gates that.

Consumers must let Tailwind scan this package. `@auxiliary/css/theme.css`
already does so for a pnpm workspace and an npm install; an app whose
`node_modules` layout defeats both should add:

```css
@source "../node_modules/@auxiliary/shell/dist/**/*.js";
```
