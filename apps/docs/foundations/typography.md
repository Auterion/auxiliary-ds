# Typography

Two typefaces. One has all the work; the other has a specific job.

## Sans — Inter Variable

The primary voice. Inter Variable with optical sizing axis `opsz 14..32` so larger sizes drop to a tighter, more headline-appropriate rendering automatically. Weight axis `100..900`.

<div class="aux-type-spec">
  <div class="row">
    <span class="label">Display · 32px / opsz 32</span>
    <span class="sample" style="font-size: 32px; font-variation-settings: 'opsz' 32; font-weight: 500; letter-spacing: -0.02em;">Mission Control</span>
  </div>
  <div class="row">
    <span class="label">H1 · 24px / opsz 24</span>
    <span class="sample" style="font-size: 24px; font-variation-settings: 'opsz' 24; font-weight: 500;">Pre-flight checks</span>
  </div>
  <div class="row">
    <span class="label">H2 · 18px / opsz 18</span>
    <span class="sample" style="font-size: 18px; font-variation-settings: 'opsz' 18; font-weight: 500;">Telemetry</span>
  </div>
  <div class="row">
    <span class="label">Body · 16px / opsz 16</span>
    <span class="sample" style="font-size: 16px; font-variation-settings: 'opsz' 16;">The quick brown fox jumps over the lazy dog · 0123456789</span>
  </div>
  <div class="row">
    <span class="label">Small · 14px / opsz 14</span>
    <span class="sample" style="font-size: 14px; font-variation-settings: 'opsz' 14;">Auto-dismisses after 4s · ARIA live-region</span>
  </div>
  <div class="row">
    <span class="label">Caption · 12px / opsz 14</span>
    <span class="sample" style="font-size: 12px; font-variation-settings: 'opsz' 14; color: var(--muted-foreground);">SYSTEM STATUS · OK · 14:32:18 UTC</span>
  </div>
</div>

The body voice runs with these OpenType features turned on globally via [`@auxiliary/css/theme.css`](https://github.com/Auterion/auxiliary-ds/tree/main/packages/css):

```css
font-feature-settings: 'cv01' 'cv10' 'ss02' 'ss03' 'calt' 'liga';
```

That gives you disambiguated `I/l/1` and `O/0` for any text — not just identifiers. The `ss02` stylistic set is the load-bearing one for aerospace: see the [identifier section](#identifiers-tabular-numerals) below.

## Mono — Geist Mono

Reserved for **identifiers, hex strings, coordinates, IPv4, mission IDs, machine output**. Never used for body voice.

The job here is unambiguous disambiguation. Geist Mono was designed for code editors; its `I`, `l`, `1`, `O`, `0` are visually distinct without needing OpenType features. We pair it with `tabular-nums` so digit widths align across rows in telemetry tables.

<div class="aux-type-spec">
  <div class="row">
    <span class="label">Mission ID</span>
    <span class="sample mono">MSN-IO1l0-2026-05-27</span>
  </div>
  <div class="row">
    <span class="label">Coordinates</span>
    <span class="sample mono">LAT 47.3769° N · LON 8.5417° E · ALT 408 m</span>
  </div>
  <div class="row">
    <span class="label">Hex / Hash</span>
    <span class="sample mono">0x1A2B3C4D · sha1:af041c8d2b2de12e</span>
  </div>
  <div class="row">
    <span class="label">IPv4</span>
    <span class="sample mono">192.168.10.34:8080</span>
  </div>
</div>

## Identifiers, tabular numerals

Mission IDs in the wild contain combinations that humans cannot reliably distinguish in default fonts. The combination of Geist Mono + `tabular-nums` + Inter's `ss02` stylistic set kills three common failure modes:

| Concern | Default Inter | Inter + `ss02` | Geist Mono |
| --- | --- | --- | --- |
| `I` vs `l` vs `1` | I l 1 | <span style="font-variation-settings: 'ss02' 1;">I l 1</span> | <span style="font-family: var(--font-mono);">I l 1</span> |
| `O` vs `0` | O 0 | <span style="font-variation-settings: 'ss02' 1;">O 0</span> | <span style="font-family: var(--font-mono);">O 0</span> |
| `5` vs `S` | 5 S | <span style="font-variation-settings: 'ss02' 1;">5 S</span> | <span style="font-family: var(--font-mono);">5 S</span> |

In Mission Control surfaces, all identifiers go to the mono treatment by default. The body voice picks up `ss02` everywhere so prose that incidentally contains an ID still reads unambiguously.

## Usage

Tailwind utility classes for both faces:

```vue
<!-- Sans (default — no class needed) -->
<h1>Mission Control</h1>

<!-- Mono — identifiers, telemetry, hex -->
<span class="font-mono">MSN-IO1l0-2026-05-27</span>

<!-- Tabular numerals — align digit columns -->
<table class="tabular-nums">
  <tr><td>408.2</td></tr>
  <tr><td>12.4</td></tr>
</table>
```

The `font-display` utility shifts to the optical-sizing display rendering for headlines that should feel typographically distinct from body:

```vue
<h1 class="font-display text-2xl">Auxiliary</h1>
```

## Semantic roles

Named text-size roles alias the t-shirt scale so you size by intent, not by number.
They generate `text-*` utilities (`text-body`, `text-heading`, …); pair each with the
recommended `leading` and `font-*` weight.

| Role | Size token | Pair with |
| --- | --- | --- |
| `text-display` | 32px | `leading-tight` · `font-semibold` |
| `text-heading` | 24px (`{text.2xl}`) | `leading-tight` · `font-semibold` |
| `text-title` | 20px (`{text.xl}`) | `leading-snug` · `font-medium` |
| `text-body-lg` | 18px (`{text.lg}`) | `leading-normal` |
| `text-body` | 16px (`{text.base}`) | `leading-normal` |
| `text-label` | 14px (`{text.sm}`) | `leading-snug` · `font-medium` |
| `text-caption` | 12px (`{text.xs}`) | `leading-snug` · `text-muted-foreground` |

```vue
<h2 class="text-heading leading-tight font-semibold">Telemetry</h2>
<p class="text-body leading-normal">Altitude holding at 408 m AGL.</p>
<span class="text-caption text-muted-foreground">Updated 2 s ago</span>
```

<style>
.aux-type-spec {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  background: var(--card);
  margin: 1.5rem 0;
}
.aux-type-spec .row {
  display: grid;
  grid-template-columns: 14rem 1fr;
  gap: 1rem;
  padding: 0.875rem 1rem;
  border-bottom: 1px solid var(--border);
  align-items: baseline;
}
.aux-type-spec .row:last-child { border-bottom: none; }
.aux-type-spec .label {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--muted-foreground);
}
.aux-type-spec .sample.mono {
  font-family: var(--font-mono);
  font-size: 14px;
  font-variant-numeric: tabular-nums;
}
</style>
