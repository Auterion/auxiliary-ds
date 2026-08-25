# @auxiliary/icons

A typed `<Icon name size weight>` Vue component over a **static, generated registry**
of Auterion glyphs.

## Why a wrapper

The wrapper owns the icon contract. Consumers depend on `<Icon name="..." />` with a
TS-typed `name` union. The underlying set can swap behind the contract without
breaking a single consumer.

## Why a generated, static registry

The package carries **no icon-vendor dependency at all**. SVG source lives in
[`inputs/`](inputs/), path data is extracted at sync time and committed to
[`src/registry.ts`](src/registry.ts). Nothing here needs registry auth, a private
scope, or a vendor subscription — to consume the package *or* to extend it.

This also means:

- Zero runtime tree-shaking concerns. The registry is one const map; bundlers can
  determine reachability statically.
- Diffs are reviewable. Adding a new icon shows up as a registry hunk in code review,
  not a transitive lockfile change.
- No round-trip to a CDN, no hydration mismatch, no per-icon network request.

## Usage

```vue
<script setup lang="ts">
import { Icon } from '@auxiliary/icons';
</script>

<template>
  <Icon name="drone" size="md" />
  <Icon name="circle-check" weight="solid" size="lg" />
  <Icon name="xmark" size="sm" label="Close" />
</template>
```

### Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `name` | `IconName` (typed union) | — | Generated from the registry — autocomplete in your IDE. |
| `weight` | `'thin' \| 'light' \| 'regular' \| 'solid'` | `'regular'` | Falls back to the closest available weight if the requested one isn't in the registry. |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| number` | `'md'` | `xs=12, sm=14, md=16, lg=20, xl=24` (px). Pass a number to opt out of the scale. |
| `label` | `string` | `undefined` | If set: `role="img"` + `aria-label`. If omitted: `aria-hidden="true"` (assumes adjacent text carries meaning). |

### Theming

Icons inherit `currentColor`. Set color via Tailwind / CSS on a parent:

```vue
<span class="text-alarm"><Icon name="triangle-exclamation" /></span>
<span class="text-nominal"><Icon name="circle-check" weight="solid" /></span>
```

This pairs cleanly with the 5-level alarm hierarchy in [`@auxiliary/tokens`](../tokens/README.md).

## Adding icons

> **The round-trip**
>
> - **Local**: edit `src/config.ts` (or drop an SVG in `inputs/`), run `pnpm --filter @auxiliary/icons sync`, commit the regenerated `src/registry.ts`.
> - **CI**: re-runs `sync` and fails the PR if you forgot to commit.
> - **Consumers**: install the package and get every icon baked in — zero vendor dependency at their end.

### Adding a glyph

1. Drop the SVG at `inputs/<name>.svg`. See [`inputs/README.md`](inputs/README.md) for
   the format contract (viewBox required, fill-only preferred, no defs/gradients/IDs).

2. Add an entry to `ICONS` in [`src/config.ts`](src/config.ts):

   ```ts
   { name: 'geofence' }
   ```

3. Run sync and commit:

   ```bash
   pnpm --filter @auxiliary/icons sync
   ```

### Per-weight glyphs

A flat `inputs/<name>.svg` is a single shape rendered at every weight. When a source
ships real weight variants, use per-weight directories instead:

```
inputs/
  thin/chevron-right.svg
  light/chevron-right.svg
  regular/chevron-right.svg
  solid/chevron-right.svg
```

Sync prefers per-weight files when present and falls back to the flat file otherwise.
`config.ts` is unchanged either way — the layout on disk is the only difference.

## Current glyph source

> **Interim set.** The shipped glyphs are hand-authored 24×24 placeholders drawn to
> hold the `IconName` contract while the icon set moves to **Nucleo**. They are
> deliberately plain. Replace them name-for-name by dropping Nucleo SVGs into
> `inputs/` (per-weight directories where the Nucleo pack provides them) and running
> sync — no consumer change, no API change.

There is no vendor package, no private registry, and no token in this pipeline. A
fresh clone installs with a plain `pnpm install`.

## Restraint

The Step-0 set deliberately ships a tight, opinionated list: navigation chevrons +
arrows, action verbs (`xmark`, `check`, `plus`, etc.), the status circle/triangle
family that pairs with our alarm hierarchy, and a handful of identity glyphs.

Adding an icon is a commitment to maintaining it across every weight and every theme
forever. Verify the glyph exists in the upstream set before adding, and reach for
restraint before adding at all.

## Status

- **Currently ships**: 37 glyphs — 36 interim placeholders pending the Nucleo swap, plus the Auterion `drone` mark. See [`src/config.ts`](src/config.ts) for the canonical allow-list.
- **Pre-1.0**: APIs subject to change. The `IconName` union is the contract — if it
  doesn't move, your code doesn't break.
