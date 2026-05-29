# Colors

The Auxiliary color system has three layers: **primitives** (the raw OKLCH palette, never used in components directly), **semantic** (`background`, `card`, `primary`, `alarm`, etc. — what components consume), and **themes** (light, dark, sunlight, darknight — different value sets bound to the same semantic names).

> Toggle the theme switcher in the page header to see every swatch on this page recompute against a different theme.

## Surfaces

Background hierarchy and the elements that sit on it. Every surface has a paired `-foreground` token that's guaranteed to meet contrast against it.

<div class="aux-token-grid">
  <TokenRow token="background" note="page background" />
  <TokenRow token="foreground" note="primary text on background" />
  <TokenRow token="card" note="card / panel surface" />
  <TokenRow token="card-foreground" note="text on card" />
  <TokenRow token="popover" note="popover / dropdown surface" />
  <TokenRow token="popover-foreground" note="text on popover" />
  <TokenRow token="muted" note="subdued surface (search field, code block)" />
  <TokenRow token="muted-foreground" note="secondary / supporting text" />
  <TokenRow token="border" note="default divider / border color" />
  <TokenRow token="input" note="form input border" />
  <TokenRow token="ring" note="focus ring" />
</div>

## Intents

Action verbs. These are the colors that say "click me" or "this is destructive."

<div class="aux-token-grid">
  <TokenRow token="primary" note="primary action — call to action" />
  <TokenRow token="primary-foreground" />
  <TokenRow token="secondary" note="secondary action" />
  <TokenRow token="secondary-foreground" />
  <TokenRow token="accent" note="highlight / hover backdrop" />
  <TokenRow token="accent-foreground" />
  <TokenRow token="destructive" note="destructive action (delete, abort)" />
  <TokenRow token="destructive-foreground" />
</div>

## Alarm hierarchy

The 5-level operational hierarchy, constrained by aerospace alerting regulations. **Do not change these color assignments without consulting the relevant references** ([FAA 14 CFR Part 25.1322](https://www.ecfr.gov/current/title-14/chapter-I/subchapter-C/part-25), EASA AMC 25.1322, MIL-STD-1472H §5.2.4).

<div class="aux-token-grid">
  <TokenRow token="alarm" note="red — immediate corrective action required" />
  <TokenRow token="alarm-foreground" />
  <TokenRow token="warning" note="orange — between Warning and Caution" />
  <TokenRow token="warning-foreground" />
  <TokenRow token="caution" note="yellow — abnormal, awareness" />
  <TokenRow token="caution-foreground" />
  <TokenRow token="advisory" note="cyan — out-of-range, no immediate action. Red/amber/yellow/green prohibited." />
  <TokenRow token="advisory-foreground" />
  <TokenRow token="nominal" note="green — Normal Operations (EICAS/ECAM convention). Never used for hazards." />
  <TokenRow token="nominal-foreground" />
</div>

## Usage in components

Components consume tokens through Tailwind utilities, never by direct CSS variable reference:

```vue
<!-- ✓ -->
<div class="bg-card text-card-foreground border border-border">…</div>
<span class="text-alarm">Link lost</span>

<!-- ✗ -->
<div :style="{ background: 'var(--card)' }">…</div>
```

The Tailwind preset in [`@auxiliary/css`](https://github.com/Auterion/auxiliary-ds/tree/main/packages/css) maps every semantic token to a `--color-*` utility, so the full set of `bg-*`, `text-*`, `border-*`, `ring-*` work for every name above.

## Themes

The same semantic name resolves to different OKLCH values per theme:

- **light** — default; bright neutral surfaces, dark text. Cool gray-zinc.
- **dark** — inverted; dark surfaces, near-white text. Same hue family.
- **sunlight** — high-contrast variant of light for outdoor / direct-sun operation.
- **darknight** — cockpit-night-vision variant of dark, tuned toward OpenBridge night (warm black + bat-signal gold). Pure-black background; amber/gold foreground, accents, and warm amber-brown neutrals (`secondary`/`accent`/`border`/`input`); a brighter gold focus `ring`. `nominal` reads as a clear "safe" signal — dim green surface with vivid mint text — while the other status tiers stay as in dark. Low-blue throughout to preserve scotopic dark adaptation.

A consumer switches themes by setting `data-theme` on `<html>`:

```ts
document.documentElement.setAttribute('data-theme', 'darknight');
```

`data-theme` unset = `light`.

## Pre-1.0 status

Token names are still moving. The `IconName` union, the alarm-tier names, and the shadcn surface vocabulary (`background`, `card`, `primary`, etc.) are unlikely to change before 1.0 — the rest is fair game.

<style>
.aux-token-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(20rem, 1fr));
  gap: 0.5rem;
  margin: 1.5rem 0;
}
</style>
