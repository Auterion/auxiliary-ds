# Skeleton

A placeholder shimmer for loading states, built on the `skeleton` recipe — a single `block animate-pulse rounded bg-muted` surface you size with utility classes to match the content it stands in for.

<div class="auxiliary-demo" style="flex-direction: column; align-items: flex-start; gap: 0.5rem;">
  <Skeleton class="h-3 w-32" />
  <Skeleton class="h-3 w-48" />
  <Skeleton class="h-3 w-24" />
</div>

## When to use

- While **content is loading** and you know its eventual shape — text lines, an avatar, a card. The skeleton reserves the layout so the page doesn't jump when data arrives.
- For **first paint of data-driven views** — telemetry tables, mission lists, asset grids — where a blank panel would read as "broken" but a spinner would read as "small wait."
- When you want the loading state to **mirror the real footprint**. Size each `<Skeleton>` to the element it replaces so the transition to loaded content is seamless.

## When *not* to use

- For an **indeterminate, short wait** with no known layout — reach for `<Spinner>`. A skeleton implies "structured content is coming"; a spinner implies "hold on a moment."
- For **determinate progress** (an upload, a long job) — use `<Progress>` so the user sees how far along they are.
- As a **permanent empty state**. If there's genuinely no data, render an empty-state message, not a skeleton that animates forever.
- For a **single tiny control** like a button label. The shimmer costs more attention than the wait it covers; just disable the control instead.

## Props

<PropsTable name="Skeleton" />

Skeleton takes no props of its own. It's a styling-only primitive: pass Tailwind sizing utilities (and any other classes) via `class`, and they merge over the recipe through `cn()`. `$attrs` forward to the underlying element, so `data-*` and `style` work too.

## Examples

### Text lines

Stack a few skeletons at text height with varied widths to suggest a paragraph or a label group.

<div class="auxiliary-demo" style="flex-direction: column; align-items: flex-start; gap: 0.5rem;">
  <Skeleton class="h-3 w-48" />
  <Skeleton class="h-3 w-40" />
  <Skeleton class="h-3 w-24" />
</div>

```vue
<div class="space-y-2">
  <Skeleton class="h-3 w-48" />
  <Skeleton class="h-3 w-40" />
  <Skeleton class="h-3 w-24" />
</div>
```

The last line is shorter on purpose — uneven widths read as text, even widths read as a table.

### Avatar + heading row

Compose skeletons into the shape of a list item: a round avatar placeholder next to two stacked lines.

<div class="auxiliary-demo">
  <div style="display: flex; align-items: center; gap: 0.75rem;">
    <Skeleton class="h-10 w-10 rounded-full" />
    <div style="display: flex; flex-direction: column; gap: 0.5rem;">
      <Skeleton class="h-3 w-32" />
      <Skeleton class="h-3 w-20" />
    </div>
  </div>
</div>

```vue
<div class="flex items-center gap-3">
  <Skeleton class="h-10 w-10 rounded-full" />
  <div class="flex flex-col gap-2">
    <Skeleton class="h-3 w-32" />
    <Skeleton class="h-3 w-20" />
  </div>
</div>
```

`rounded-full` on the avatar skeleton overrides the recipe's default `rounded` corner — `cn()` lets the class you pass win.

### Card placeholder

Match a card's footprint: a media block on top, then a title and supporting lines.

<div class="auxiliary-demo">
  <div style="width: 16rem; display: flex; flex-direction: column; gap: 0.75rem;">
    <Skeleton class="h-32 w-full rounded-md" />
    <Skeleton class="h-4 w-3/4" />
    <Skeleton class="h-3 w-full" />
    <Skeleton class="h-3 w-5/6" />
  </div>
</div>

```vue
<div class="w-64 flex flex-col gap-3">
  <Skeleton class="h-32 w-full rounded-md" />
  <Skeleton class="h-4 w-3/4" />
  <Skeleton class="h-3 w-full" />
  <Skeleton class="h-3 w-5/6" />
</div>
```

Keep the placeholder geometry close to the real card so swapping in loaded content doesn't shift the layout.

## Accessibility

- The element renders as a `<span aria-hidden="true">`, so screen readers skip it entirely. A shimmer is a *visual* cue — it carries no meaning for assistive tech, and announcing "loading" repeatedly per placeholder would be noise.
- For the **loading state as a whole**, put the semantics on the container, not the skeletons: mark the region `aria-busy="true"` while data loads, or expose a polite live-region status ("Loading mission list…") so screen-reader users get one clear signal instead of none.
- The `animate-pulse` animation honors the **reduced-motion** contract: under `prefers-reduced-motion: reduce`, Tailwind's motion-safe handling stops the pulse, leaving a static muted block. No extra prop is needed.
- Don't put focusable or interactive content inside a skeleton — it's a placeholder, and keyboard users shouldn't be able to tab into something that isn't real yet.

## Tokens consumed

The skeleton recipe binds a single semantic token — change it in [`@auxiliary/tokens`](/foundations/colors) and every placeholder updates:

| Surface | Token | Notes |
| --- | --- | --- |
| Fill | `--muted` | The placeholder block color, pulsed via `animate-pulse` opacity. |

Corner radius comes from the recipe's `rounded` default (`--radius`); override per instance with `rounded-full`, `rounded-md`, etc.
