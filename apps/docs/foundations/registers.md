# Registers — expressive ↔ operational

Auxiliary serves two worlds from one library: **expressive** surfaces (marketing,
web, brand, onboarding) and **operational** surfaces (ground-control stations,
telemetry, command & control). Rather than ship two parallel systems, the
difference is modelled as a single **register** axis — a token-mode layer that
re-resolves the *non-color* design tokens, exactly the way `data-theme`
re-resolves color.

## Two orthogonal axes

| Axis | Attribute | Controls | Values |
|---|---|---|---|
| **Theme** | `data-theme` | **color** | `light` · `dark` · `sunlight` · `darknight` |
| **Register** | `data-register` | **everything non-color** (control density, radius, motion) | `expressive` · `operational` |

They compose freely and never overlap — **register never touches color; theme
never touches density or motion**. A build-time assertion plus a CSS gate
(`register-orthogonality.test.ts`) enforce this, so the two axes can be combined
without surprises:

```html
<div data-theme="darknight" data-register="operational">
  <!-- night palette + dense, tight, motion-restrained controls -->
</div>
```

## The default is expressive

`expressive` is the system default and needs **no attribute** — every existing
surface stays exactly as it is. `operational` is **opt-in**, mirroring the
air-gap / defense-layer philosophy (additive, never imposed). Set it on any
subtree:

```html
<section data-register="operational">…</section>
```

Or use the ergonomic wrapper (pure convenience over the attribute — the
token layer remains the source of truth):

```vue
<script setup>
import { Register } from '@auxiliary/vue';
</script>

<template>
  <Register> <!-- defaults to operational -->
    <Button>Arm</Button>
    <Input placeholder="Altitude (m)" />
  </Register>
</template>
```

You can also nest an `expressive` island inside an operational region with
`<Register register="expressive">` to opt a subtree back out.

## What flexes by register

These *flex tokens* re-resolve under `data-register="operational"`. Color, the
**type scale**, and the reserved status ladder are deliberately **invariant** —
but type *features* (glyph disambiguation and numeric legibility, never size or
leading) do gain an operational treatment; see
[Type in the operational register](#type-in-the-operational-register) below.

| Lever | Token(s) | Expressive (default) | Operational |
|---|---|---|---|
| Control height | `--control-height-{sm,md,lg}` | 32 / 36 / 40 px | 28 / 32 / 36 px |
| Radius | `--radius-{sm,md,lg}` | 4 / 6 / 8 px | 2 / 4 / 6 px |
| Motion duration | `--duration-{fast,base,slow}` | 120 / 200 / 320 ms | 80 / 120 / 200 ms |
| Type features | `font-feature-settings` · `font-variant-numeric` | square-punctuation base set | + `I/l/1` disambiguation · slashed-zero · 500 label weight |

Because radius and motion are read through CSS variables that Tailwind utilities
already resolve (`rounded-md` → `var(--radius-md)`, `transition-colors` →
`var(--duration-base)`), components inherit the operational treatment with no
per-component code. Control height is wired through `--control-height-*`, which
the form-control recipes consume.

### Type in the operational register

The type **scale** is invariant (above), but operational surfaces are read at a
glance under glare and at night, where `I`/`l`/`1` and `0`/`O` collisions in an
asset ID or call-sign are a safety problem, not an aesthetic one. So
`data-register="operational"` adds a **feature-level** type treatment — never
size or leading:

- **Glyph disambiguation** — the sans switches on Inter's tailed `l` (`cv05`) and
  serif `I` (`cv08`) so `I`/`l`/`1` read as three distinct shapes, plus single-story
  `a` (`cv11`) as a general legibility alternate. (The expressive base set keeps the
  cleaner mixed-case letterforms.)
- **Slashed zero** — `font-variant-numeric: slashed-zero` across the subtree, so
  every `0` is unmistakable even outside a `.tabular` block.
- **Label weight** — `label` / `.caption` / `figcaption` / `legend` step from
  regular (400) to the 500 house weight to hold glance-weight on dense chrome.

<div class="aux-reg-demo">
  <div><span class="k">expressive (default)</span><span class="v">Capital-I lowercase-l one: Il1 · zero/oh: 0O</span></div>
  <div data-register="operational"><span class="k">operational</span><span class="v">Capital-I lowercase-l one: Il1 · zero/oh: 0O</span></div>
</div>

This is the same mechanism as `data-theme`: components don't know which register
is active; the cascade re-resolves the features. It's hand-authored CSS (not a
token) because OpenType feature strings are composite values, not the scalar
dimensions the token build emits.

<style>
.aux-reg-demo { display: flex; flex-direction: column; border: 1px solid var(--border); border-radius: 6px; background: var(--card); margin: 1.25rem 0; }
.aux-reg-demo > div { display: grid; grid-template-columns: 12rem 1fr; gap: 1rem; padding: 0.75rem 1rem; align-items: baseline; }
.aux-reg-demo > div + div { border-top: 1px solid var(--border); }
.aux-reg-demo .k { font-family: var(--font-mono); font-size: 0.6875rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--muted-foreground); }
.aux-reg-demo .v { font-size: 18px; }
</style>

### Decisions (locked in Phase 6.2)

- **Motion is shortened, not zeroed.** Operational keeps motion short enough that
  a state-change still reads, but never decorative. Full-zero is reserved for
  `prefers-reduced-motion` — an *accessibility* override that always wins,
  independent of register (a *design* choice).
- **Type scale does not flex.** Glance-ability under glare (`sunlight`), scotopic
  constraints (`darknight`), and human-engineering legibility minimums all argue
  against shrinking type. Operational density comes from height, radius, and
  motion — not smaller text. Type *features* (glyph disambiguation, slashed zero,
  label weight) **do** gain an operational treatment — that's legibility, not
  scale; see [above](#type-in-the-operational-register).
- **Two poles, no neutral middle.** `expressive` and `operational` are enough for
  the first cut. The underlying four-rung `density` scale
  (`compact`/`default`/`comfortable`/`editorial`) remains available for explicit
  per-surface use; the registers simply map onto two of its rungs.

## Register-*guided*, not register-*tokenized*

Some of the expressive/operational split can't be a token and stays **convention
+ per-component guidance**, enforced by review rather than the cascade:

- **Decorative imagery / photography / illustration** — allowed expressive,
  **forbidden** operational (no decoration in a GCS).
- **Animation choreography** — *what* animates, not just how fast.
- **Copy voice & tone** — see [Voice & lexicon](./voice-and-lexicon).
