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
font-feature-settings: "ss01", "ss03", "ss07", "ss08",
  "cv02", "cv03", "cv04", "cv06", "cv09", "cv12", "cv13", "calt", "liga";
```

Globally that buys the **square / straight-punctuation register** — geometric dots, straight quotes and commas, squared punctuation: the engineered, IBM-/Swiss-leaning voice that rhymes with the mark's faceted geometry. Strong `I/l/1` glyph disambiguation in the sans is deliberately **not** global — it's an [operational-register feature](./registers#type-in-the-operational-register) (the safety context that actually needs it), while the always-unambiguous path for identifiers stays the mono face below.

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

Mission IDs in the wild contain combinations that humans cannot reliably distinguish in default fonts. Two layers handle them: the **mono face** (always unambiguous, by design) and the **operational register** (which switches on Inter's disambiguation glyphs in the sans). Default expressive Inter keeps the cleaner mixed-case letterforms.

| Concern | Default Inter (expressive) | Inter · operational | Geist Mono |
| --- | --- | --- | --- |
| `I` vs `l` vs `1` | I l 1 | <span data-register="operational">I l 1</span> | <span style="font-family: var(--font-mono);">I l 1</span> |
| `O` vs `0` | O 0 | <span data-register="operational">O 0</span> | <span style="font-family: var(--font-mono);">O 0</span> |
| `5` vs `S` | 5 S | 5 S | <span style="font-family: var(--font-mono);">5 S</span> |

In Mission Control surfaces, identifiers go to the mono treatment by default. The **operational register** additionally disambiguates `I/l/1` and slashes the zero in the sans (`cv05`/`cv08`/`cv11` + slashed-zero), so an ID that surfaces in operational chrome — a label, a status badge — still reads unambiguously without switching faces. `5`/`S` stays a mono-only fix.

## Numeric & label legibility

Two register-aware refinements for operational readouts — both additive, neither touches the type scale.

**Slashed zero on tabular.** The `.tabular` helper (mission IDs, coordinates, telemetry) now runs `font-variant-numeric: slashed-zero tabular-nums` — the aviation/flight-strip convention — so a glanced `0` can never be read as `O`. It rides the semantic numeric property, composing with the global feature set rather than replacing it.

<div class="aux-type-spec">
  <div class="row">
    <span class="label">.tabular</span>
    <span class="sample tabular" style="font-size:16px;">ALT 00420 m · BAT 100% · 47.3769, 8.5417</span>
  </div>
</div>

**Caps micro-labels.** `.caps` is the one place tracking goes *positive* — `--tracking-caps` (+0.05em). The house baseline is negative, which is right for mixed-case display but cramps all-caps eyebrows, axis labels and status pills; `.caps` also enables `case` so punctuation aligns to cap height.

<div class="aux-type-spec">
  <div class="row">
    <span class="label">plain uppercase</span>
    <span class="sample" style="font-size:14px;text-transform:uppercase;letter-spacing:-0.02em;">Armed · RTL · AGL · GPS-fix</span>
  </div>
  <div class="row">
    <span class="label">.caps</span>
    <span class="sample caps" style="font-size:14px;">Armed · RTL · AGL · GPS-fix</span>
  </div>
</div>

`I/l/1` disambiguation and the 500 label-weight bump are scoped to the [operational register](./registers#type-in-the-operational-register) — glyph shape and weight only, never scale.

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

Each role is a **composite** (`type/*` tokens, DTCG `typography` type) bundling
family + size + weight + line-height + tracking into one named intent. The composite is
the single source of truth: it generates the **Figma Text Styles** (`Type/…`) one-to-one.
Size by intent, not by number.

Roles split into **two families on the two surfaces** (README Principle 4 — *one library,
many surfaces*), mirroring the `expressive` / `operational` register axis. The marketing
headline voice is tuned toward **Neue Haas Grotesk**: Inter's **Display** optical cut
(`font/display`), **Medium** weight, **tight tracking**, and a clean feature set (the
operational square/disambiguation alternates are dropped — see [features](#identifiers-tabular-numerals)).
Product keeps Inter's **Text** optical cut for operational legibility.

### Marketing — `type/marketing/*` (expressive: web & brand · Inter Display)

| Role | Figma style | Font | Size | Weight | Leading | Tracking |
| --- | --- | --- | --- | --- | --- | --- |
| `display` | `Type/Marketing/Display` | Inter Display | 60px (`{text.6xl}`) | medium | `display` 1.0 | `tighter` −0.05em |
| `h1` | `Type/Marketing/H1` | Inter Display | 48px (`{text.5xl}`) | medium | `title` 1.1 | `tighter` −0.05em |
| `h2` | `Type/Marketing/H2` | Inter Display | 40px (`{text.4xl}`) | medium | `heading` 1.15 | `display` −0.04em |
| `h3` | `Type/Marketing/H3` | Inter Display | 30px (`{text.3xl}`) | medium | `tight` 1.2 | `display` −0.04em |
| `lead` | `Type/Marketing/Lead` | Inter | 20px (`{text.xl}`) | regular | `normal` 1.5 | `tight` −0.01em |
| `body` | `Type/Marketing/Body` | Inter | 18px (`{text.lg}`) | regular | `normal` 1.5 | `tight` −0.01em |
| `caption` | `Type/Marketing/Caption` | Inter | 14px (`{text.sm}`) | semibold | `snug` 1.35 | `tight` −0.01em |

### Product — `type/product/*` (operational: Suite · OS · Mission Control · Inter Text)

| Role | Figma style | Font | Size | Weight | Leading | Tracking |
| --- | --- | --- | --- | --- | --- | --- |
| `display` | `Type/Product/Display` | Inter | 32px | semibold | `tight` 1.2 | `subhead` −0.03em |
| `heading` | `Type/Product/Heading` | Inter | 24px (`{text.2xl}`) | semibold | `heading` 1.15 | `tight` −0.01em |
| `title` | `Type/Product/Title` | Inter | 20px (`{text.xl}`) | semibold | `subhead` 1.25 | `tight` −0.01em |
| `body-lg` | `Type/Product/Body Large` | Inter | 18px (`{text.lg}`) | medium | `normal` 1.5 | `normal` 0 |
| `body` | `Type/Product/Body` | Inter | 16px (`{text.base}`) | regular | `normal` 1.5 | `normal` 0 |
| `label` | `Type/Product/Label` | Inter | 14px (`{text.sm}`) | medium | `snug` 1.35 | `normal` 0 |
| `caption` | `Type/Product/Caption` | Inter | 12px (`{text.xs}`) | regular | `snug` 1.35 | `normal` 0 |

**Inter Display vs Text.** The two are the ends of Inter's optical-size (`opsz`) axis. On the
web this is automatic (`font-optical-sizing: auto` on `html`), so large headlines already get
the display rendering; the `font-display` utility pins `opsz 32` and the clean feature set
explicitly. **Figma** doesn't auto-apply `opsz`, so the marketing heading Text Styles use the
separate `Inter Display` family to get the same display cut. No extra font binary ships — web
falls through `Inter Display → Inter Variable` and resolves the cut via the axis.

```vue
<!-- marketing headline — NHG-leaning display voice -->
<h1 class="font-display text-5xl">Autonomy at scale</h1>
<!-- product -->
<h2 class="text-2xl font-semibold leading-[1.15] tracking-[-0.01em]">Fleet telemetry</h2>
<p class="text-base leading-normal">Altitude holding at 408 m AGL.</p>
```

In Figma, these land as **Text Styles** grouped under `Type/Marketing/*` and `Type/Product/*`
(pushed by `figma-sync`, the same path shadows take to Effect Styles); each style's font size
is bound to its `Primitives/text/*` variable.

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
