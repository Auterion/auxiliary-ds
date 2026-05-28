# Spacing

A linear 4 px scale. Every value is a multiple of `0.25rem` so layouts compose cleanly at any nesting depth without odd fractional gaps.

The scale is consumed via Tailwind utilities — `p-*`, `m-*`, `gap-*`, `space-y-*`, etc. — using the standard Tailwind numeric token (each step = one `0.25rem` unit).

## Scale

<div class="aux-space-grid">
  <div class="row"><code>1</code><span class="bar" style="width: 0.25rem"></span><span class="value">0.25rem · 4px</span></div>
  <div class="row"><code>2</code><span class="bar" style="width: 0.5rem"></span><span class="value">0.5rem · 8px</span></div>
  <div class="row"><code>3</code><span class="bar" style="width: 0.75rem"></span><span class="value">0.75rem · 12px</span></div>
  <div class="row"><code>4</code><span class="bar" style="width: 1rem"></span><span class="value">1rem · 16px</span></div>
  <div class="row"><code>5</code><span class="bar" style="width: 1.25rem"></span><span class="value">1.25rem · 20px</span></div>
  <div class="row"><code>6</code><span class="bar" style="width: 1.5rem"></span><span class="value">1.5rem · 24px</span></div>
  <div class="row"><code>8</code><span class="bar" style="width: 2rem"></span><span class="value">2rem · 32px</span></div>
  <div class="row"><code>10</code><span class="bar" style="width: 2.5rem"></span><span class="value">2.5rem · 40px</span></div>
  <div class="row"><code>12</code><span class="bar" style="width: 3rem"></span><span class="value">3rem · 48px</span></div>
  <div class="row"><code>16</code><span class="bar" style="width: 4rem"></span><span class="value">4rem · 64px</span></div>
  <div class="row"><code>20</code><span class="bar" style="width: 5rem"></span><span class="value">5rem · 80px</span></div>
  <div class="row"><code>24</code><span class="bar" style="width: 6rem"></span><span class="value">6rem · 96px</span></div>
  <div class="row"><code>32</code><span class="bar" style="width: 8rem"></span><span class="value">8rem · 128px</span></div>
</div>

## When which step

| Range | Use for |
| --- | --- |
| `1` – `2` (4 – 8 px) | Inline gaps inside a single component — text + adjacent icon, dot + label. |
| `3` – `4` (12 – 16 px) | Padding inside cards, panels, small surfaces. Vertical rhythm between siblings. |
| `5` – `6` (20 – 24 px) | Larger paddings; spacing between distinct content blocks. |
| `8` – `12` (32 – 48 px) | Section margins; large gaps between dense regions and breathing room. |
| `16`+ (64 px+) | Page-level vertical rhythm; marketing-style hero spacing. |

## Usage

```vue
<div class="p-6 space-y-4">
  <h2>Vehicle MX-01</h2>
  <div class="flex items-center gap-2">
    <Icon name="circle-check" />
    <span>All systems go</span>
  </div>
</div>
```

The same scale is exposed as raw CSS via `--spacing: 0.25rem` on the root — Tailwind utilities multiply against it. Downstream consumers can override the base unit globally for density modes:

```css
[data-density="compact"] {
  --spacing: 0.1875rem; /* every Tailwind spacing utility shrinks proportionally */
}
```

A density-mode token is not shipping in v1.0 but the door is reserved.

<style>
.aux-space-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.25rem;
  margin: 1.5rem 0;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 0.375rem;
  background: var(--card);
}
.aux-space-grid .row {
  display: grid;
  grid-template-columns: 3rem 12rem 1fr;
  gap: 1rem;
  align-items: center;
  padding: 0.375rem 0;
}
.aux-space-grid code {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--muted-foreground);
  background: transparent;
  padding: 0;
}
.aux-space-grid .bar {
  height: 1rem;
  background: var(--primary);
  border-radius: 2px;
}
.aux-space-grid .value {
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  color: var(--muted-foreground);
}
</style>
