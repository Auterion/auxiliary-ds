# @auxiliary/icons

A typed `<Icon name size weight>` Vue component over a **static, generated registry**
of Font Awesome Pro Sharp glyphs + an Auterion operational kit.

## Why a wrapper

The wrapper owns the icon contract. Consumers depend on `<Icon name="..." />` with a
TS-typed `name` union. The underlying set can swap behind the contract without
breaking a single consumer.

## Why a generated, static registry

The runtime carries **no dependency on `@fortawesome/*`**. SVG path data is extracted
once at sync time and committed to [`src/registry.ts`](src/registry.ts). Consumers
install `@auxiliary/icons` and get the icons — no FA Pro license required *to consume*
the package, only *to add or update* icons.

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

### From Font Awesome Pro Sharp

1. Add an entry to `FA_ICONS` in [`src/config.ts`](src/config.ts):

   ```ts
   { name: 'wrench', fa: 'wrench' }
   ```

   Use the FA-canonical name in `fa`; `name` is what consumers will type — keep them
   in sync unless there's a reason to rename.

2. Ensure `FONTAWESOME_PACKAGE_TOKEN` is set in your environment (see below).

3. Run sync:

   ```bash
   pnpm --filter @auxiliary/icons sync
   ```

4. Commit the regenerated `src/registry.ts`.

### From a hand-authored Auterion glyph

1. Drop the SVG at `inputs/<name>.svg`. See [`inputs/README.md`](inputs/README.md) for
   the format contract (viewBox required, fill-only preferred, no defs/gradients/IDs).

2. Add an entry to `CUSTOM_ICONS` in [`src/config.ts`](src/config.ts):

   ```ts
   { name: 'geofence' }
   ```

3. Run sync and commit.

## Font Awesome Pro setup

The FA Sharp packages are private — install requires a token bound to your FA Pro
subscription.

1. Get the token from [fontawesome.com/account](https://fontawesome.com/account) →
   *Subscriptions* → *npm.fontawesome.com*.

2. Export it (do **not** commit a `.npmrc` with the token inlined):

   ```bash
   export FONTAWESOME_PACKAGE_TOKEN=YOUR_TOKEN
   ```

3. Run `pnpm install` from the repo root.

The committed [`.npmrc`](.npmrc) references the token via `${FONTAWESOME_PACKAGE_TOKEN}`
and points the `@fortawesome` scope at FA's private registry.

## Restraint

The Step-0 set deliberately ships a tight, opinionated list: navigation chevrons +
arrows, action verbs (`xmark`, `check`, `plus`, etc.), the status circle/triangle
family that pairs with our alarm hierarchy, and a handful of identity glyphs.

Adding an icon is a commitment to maintaining four weight variants forever. Reach for
[the FA library](https://fontawesome.com/icons) to verify a glyph exists in Sharp
before adding, and reach for restraint before adding at all.

## Status

- **Initial state**: 1 custom glyph (`drone`). FA-sourced icons require a one-time
  `pnpm sync` with `FONTAWESOME_PACKAGE_TOKEN` set; the resulting registry is
  committed and ships with the package.
- **Pre-1.0**: APIs subject to change. The `IconName` union is the contract — if it
  doesn't move, your code doesn't break.
