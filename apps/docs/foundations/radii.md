# Radii

A six-step radius scale. Restraint: most surfaces use `sm` (4 px) or `md` (6 px); pills use `full`; rounded squares are a deliberate visual choice, never a default.

## Scale

<div class="aux-radius-grid">
  <div class="row">
    <code>none</code>
    <span class="sample" style="border-radius: 0;"></span>
    <span class="value">0</span>
    <span class="usage">Tables, raw data grids, mission timelines — anything that should feel mechanical.</span>
  </div>
  <div class="row">
    <code>sm</code>
    <span class="sample" style="border-radius: 0.25rem;"></span>
    <span class="value">0.25rem · 4px</span>
    <span class="usage">Form inputs, small interactive elements. Default for buttons.</span>
  </div>
  <div class="row">
    <code>md</code>
    <span class="sample" style="border-radius: 0.375rem;"></span>
    <span class="value">0.375rem · 6px</span>
    <span class="usage">Cards, panels, popovers, dropdowns. The general-purpose container radius.</span>
  </div>
  <div class="row">
    <code>lg</code>
    <span class="sample" style="border-radius: 0.5rem;"></span>
    <span class="value">0.5rem · 8px</span>
    <span class="usage">Large surfaces, dialogs, modal containers, marketing hero cards.</span>
  </div>
  <div class="row">
    <code>xl</code>
    <span class="sample" style="border-radius: 0.75rem;"></span>
    <span class="value">0.75rem · 12px</span>
    <span class="usage">Marketing only. Soft, generous corners that read as "consumer."</span>
  </div>
  <div class="row">
    <code>full</code>
    <span class="sample full" style="border-radius: 9999px;"></span>
    <span class="value">9999px</span>
    <span class="usage">Pills. StatusBadge, avatar, dot indicators, sliders, switches.</span>
  </div>
</div>

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

<style>
.aux-radius-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  margin: 1.5rem 0;
}
.aux-radius-grid .row {
  display: grid;
  grid-template-columns: 4rem 4rem 8rem 1fr;
  gap: 1rem;
  align-items: center;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  background: var(--card);
}
.aux-radius-grid code {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--foreground);
  background: transparent;
  padding: 0;
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
</style>
