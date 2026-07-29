# Radii & borders

Corner radius and stroke, the two token families that give a surface its edge.
Restraint: most surfaces use `sm` or `md`; pills use `full`; rounded squares are a
deliberate visual choice, never a default.

## Radius scale

Seven rungs. The middle three **flex by register** — `[data-register="operational"]`
tightens `sm`/`md`/`lg` by one step, so operational surfaces read as more mechanical
without any per-component change (see [Registers](/foundations/registers)). The
samples below are live: the left one resolves in this page's register, the right one
carries `data-register="operational"`.

<div class="aux-radius-grid">
  <div class="row head">
    <code>token</code>
    <span class="lbl">expr</span>
    <span class="lbl">oper</span>
    <span class="value">value · operational</span>
    <span class="usage">Use for</span>
  </div>
  <div class="row">
    <code>none</code>
    <span class="sample" style="border-radius: var(--radius-none);"></span>
    <span class="sample" data-register="operational" style="border-radius: var(--radius-none);"></span>
    <span class="value">0 · 0</span>
    <span class="usage">Tables, raw data grids, mission timelines — anything that should feel mechanical.</span>
  </div>
  <div class="row">
    <code>xs</code>
    <span class="sample" style="border-radius: var(--radius-xs);"></span>
    <span class="sample" data-register="operational" style="border-radius: var(--radius-xs);"></span>
    <span class="value">2px · 2px</span>
    <span class="usage">The tightest visible corner. Mostly reached indirectly — it is what <code>sm</code> resolves to in the operational register.</span>
  </div>
  <div class="row">
    <code>sm</code>
    <span class="sample" style="border-radius: var(--radius-sm);"></span>
    <span class="sample" data-register="operational" style="border-radius: var(--radius-sm);"></span>
    <span class="value">4px · 2px</span>
    <span class="usage">Form inputs, small interactive elements, menu items.</span>
  </div>
  <div class="row">
    <code>md</code>
    <span class="sample" style="border-radius: var(--radius-md);"></span>
    <span class="sample" data-register="operational" style="border-radius: var(--radius-md);"></span>
    <span class="value">6px · 4px</span>
    <span class="usage">Cards, panels, popovers, dropdowns, buttons. The general-purpose container radius.</span>
  </div>
  <div class="row">
    <code>lg</code>
    <span class="sample" style="border-radius: var(--radius-lg);"></span>
    <span class="sample" data-register="operational" style="border-radius: var(--radius-lg);"></span>
    <span class="value">8px · 6px</span>
    <span class="usage">Large surfaces, dialogs, modal containers, marketing hero cards.</span>
  </div>
  <div class="row">
    <code>xl</code>
    <span class="sample" style="border-radius: var(--radius-xl);"></span>
    <span class="sample" data-register="operational" style="border-radius: var(--radius-xl);"></span>
    <span class="value">12px · 12px</span>
    <span class="usage">Marketing only. Soft, generous corners that read as "consumer."</span>
  </div>
  <div class="row">
    <code>full</code>
    <span class="sample full" style="border-radius: var(--radius-full);"></span>
    <span class="sample full" data-register="operational" style="border-radius: var(--radius-full);"></span>
    <span class="value">9999px · 9999px</span>
    <span class="usage">Pills. StatusBadge, avatar, dot indicators, sliders, switches.</span>
  </div>
</div>

Never hardcode a corner. `border-radius: 0.375rem` is 6 px in every register — it
looks correct on this page and is wrong the moment the surface is dropped into an
operational console. Use `rounded-md` or `var(--radius-md)`.

## Usage

```vue
<button class="rounded-sm">Cancel</button>
<div class="rounded-md border border-border bg-card p-4">…</div>
<StatusBadge level="alarm">Link lost</StatusBadge>   <!-- rounded-full internally -->
```

## Shape signals semantic

The radius choice is part of the system's visual vocabulary, not an aesthetic toggle. Two examples:

- **`<Badge>` uses `rounded` (sm)** — it's a metadata tag (`Version 1.0`, `Beta`). Square-ish corners read as "static label."
- **`<StatusBadge>` uses `rounded-full`** — it's a live operational indicator (`Link lost`, `Battery low`). Pill shape reads as "live state."

Don't reach across that distinction. If you're tempted to give Badge pill corners "for consistency," ask first whether you actually want StatusBadge.

## Border width

Stroke thickness. Numeric keys are factual — the key **is** the pixel value.

| Token | Value | Used for |
| --- | --- | --- |
| `--border-width-0` | 0px | No border. This — not a `none` stroke style — is how you remove an edge. |
| `--border-width-1` | 1px | The default hairline: card edges, separators, input boundaries, table rules. |
| `--border-width-2` | 2px | Emphasis edges — and the value `focus` resolves to. |
| `--border-width-4` | 4px | Heavy rules. No consumer today; the rung exists so the ladder is complete. |
| `--border-width-focus` | → `2` | Focus-indicator thickness — the single source for every `focus-visible:ring-2`. WCAG 2.2 SC 2.4.13 asks for an area at least equivalent to a 2 px perimeter of the control. |

Tailwind v4 has **no** `--border-width-*` theme namespace — border and ring widths are
hardcoded in its utility definitions — so these generate no utilities. Consume them
via an arbitrary value, plain CSS, or a Figma variable binding. `border` and `ring-2`
still work as before; the tokens exist so the *values* have one owner, and so design
tools carry the same vocabulary.

## Border style

DTCG [§9.2](https://tr.designtokens.org/format/#stroke-style) `strokeStyle` keywords:

| Token | Value |
| --- | --- |
| `--border-style-solid` | `solid` |
| `--border-style-dashed` | `dashed` |
| `--border-style-dotted` | `dotted` |

No consumers today — the group exists for token-type completeness and so design tools
carry the vocabulary. Two notes:

- **`none` is deliberately absent.** It is not a DTCG `strokeStyle` keyword. Express
  "no border" as `--border-width-0`.
- **A `strokeStyle` cannot be a Figma Variable** — it is a keyword, not a number or a
  colour. It is skipped by the Figma export, so designers set stroke style by hand.

<style>
.aux-radius-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  margin: 1.5rem 0;
}
.aux-radius-grid .row {
  display: grid;
  grid-template-columns: 4rem 2.5rem 2.5rem 9rem 1fr;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--card);
}
.aux-radius-grid .row.head {
  background: transparent;
  border-color: transparent;
  padding-top: 0;
  padding-bottom: 0;
}
.aux-radius-grid code {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--foreground);
  background: transparent;
  padding: 0;
}
.aux-radius-grid .lbl {
  font-family: var(--font-mono);
  font-size: 0.625rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--muted-foreground);
}
.aux-radius-grid .sample {
  width: 2.5rem;
  height: 2.5rem;
  background: var(--primary);
}
.aux-radius-grid .sample.full {
  width: 2rem;
  height: 1.25rem;
}
.aux-radius-grid .value {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--muted-foreground);
}
.aux-radius-grid .usage {
  font-size: 0.8125rem;
  color: var(--muted-foreground);
}
.aux-radius-grid .usage code {
  font-size: 0.75rem;
  color: var(--muted-foreground);
}
</style>
