# @auxiliary/brand

The brand-asset layer: Auterion's org mark and the product marks (Mission Control,
AuterionSuite, AuterionOS) as marks / wordmarks / lockups, a **machine-readable usage
manifest**, and a typed `<Logo>` component. Sits parallel to `@auxiliary/icons` in the
graph (`tokens → brand → vue → docs`) — kept separate from functional iconography
because marks carry different licensing and usage rules (you can't freely recolor a logo).

## Why a manifest

`brand.manifest.json` is the source of truth for *which mark to use where*: per logo it
records clearspace, min-size, the themes it's cleared for, the tone to use per theme, and
forbidden contexts. An agent (or `<Logo>`) consults it to pick the correct asset for a
surface instead of guessing — that's what makes the brand layer designable-against, not
just a folder of files.

```ts
import { resolveLogo, getLogo } from '@auxiliary/brand';

resolveLogo({ id: 'mission-control', kind: 'mark', theme: 'dark' });
// → { entry, kind: 'mark', tone: 'inverse', status: 'available' | 'pending', svg?, minSize }
```

```vue
<script setup>
import { Logo } from '@auxiliary/brand';
</script>
<template>
  <Logo id="auterion" kind="lockup-horizontal" />   <!-- tone="auto": theme-legible via currentColor -->
  <Logo id="mission-control" kind="mark" tone="inverse" />
</template>
```

## Adding artwork

Masters live in `assets/` and are inlined into `src/registry.generated.ts` at sync time —
consumers ship no raw SVGs. See [`assets/README.md`](./assets/README.md) for the naming
contract and SVG conventions, then:

```bash
pnpm --filter @auxiliary/brand sync     # regenerate the registry from assets/ + manifest
```

The generated registry is committed and **drift-gated in CI** (same pattern as the icon
registry) — re-run `sync` and commit after touching `assets/` or `brand.manifest.json`.

Until a master lands, its slot is `"pending"` and `<Logo>` renders a labelled placeholder,
so the gap is visible in dev/docs and nothing fake ever ships.

## Status

Scaffold complete; **awaiting master artwork**. App-icon/favicon export
(`scripts/export-icons.mjs`) and brand-color tokens are tracked in `ROADMAP.md`.
