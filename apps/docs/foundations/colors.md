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
- **sunlight** — hardened high-contrast variant of light for direct-sun operation. Pure white/black body (≈9–13:1) with **deepened structure** (`border` zinc.500, `input` zinc.600) and **deeper status fills** so panels, fields, and severity blocks hold up under veiling glare. Caution darkens to yellow.600 — the deepest yellow whose black label still clears the theme's 7:1 text lean; it remains the one documented sub-3:1 fill (2.93 vs white), with the glyph carrying redundancy.
- **darknight** — cockpit-night-vision variant, amber-on-black and **low-blue throughout** to preserve scotopic dark adaptation. Pure-black background; amber/gold foreground and `ring`; warm amber neutrals with structural amber.700 `border`/`input`. Severity is a **monotonic luminance ladder** — at night, rod vision reads *intensity*, not warm hue (a dark red would vanish), so `alarm` is the brightest *status fill and persistent large surface* (a glowing red.400; brief interactive accents like the focus ring may peak brighter), stepping down through warning/caution/advisory to a nearly **extinguished** `nominal` (the absence of urgency reads as the absence of light). Glyph shapes carry redundant distinction.

A consumer switches themes by setting `data-theme` on `<html>`:

```ts
document.documentElement.setAttribute('data-theme', 'darknight');
```

`data-theme` unset = `light`.

## Operational legibility gates

axe checks WCAG *semantics* at the component level, but it never exercises the `sunlight` (glare) and `darknight` (scotopic) themes, and contrast ratios alone don't capture night-vision or color separation. So the **token layer** carries its own gates (`packages/tokens/test/`), computed from the OKLCH source — a palette edit that regressed any of them fails CI:

- **Per-theme text contrast** — every surface and status pair clears WCAG AA (4.5:1), with `sunlight` body raised toward AAA (7:1) to offset veiling glare.
- **Focus visibility (WCAG 1.4.11)** — the focus `ring` clears 3:1 against the background in *every* theme, so a keyboard operator never loses focus under sun or in the dark.
- **Structural UI contrast (1.4.11)** — `border` and `input` clear 3:1 in the operational themes, so panels and fields hold their geometry under glare / in the dark.
- **Night-vision (darknight)** — *every* token, not just status fills, stays below a linear-sRGB blue cap (bright blue bleaches rhodopsin and destroys dark adaptation), **and** the severity fills emit in a strictly monotonic luminance ladder (alarm brightest → nominal dimmest), since scotopic vision reads intensity rather than warm hue.
- **Severity separation** — the five ladder fills stay perceptually distinct from each other in OKLab (ΔEok), a color-channel complement to the grayscale-distinct status glyphs.

Floors only ever ratchet up — they lock the contract the palette meets today so it can't silently regress.

These gates are the evidence behind the system's [conformance posture](/foundations/conformance) — where they map to the specific WCAG 2.2 AA, Section 508, and MIL-STD-1472 criteria they satisfy.

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
