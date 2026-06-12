# Badge

A small, rounded label styled by the `badge` recipe — four variants, two sizes. Use it for static metadata: version numbers, environment tags, counts, categories.

<div class="auxiliary-demo vp-raw">
  <Badge variant="neutral">neutral</Badge>
  <Badge variant="secondary">secondary</Badge>
  <Badge variant="outline">outline</Badge>
  <Badge variant="primary">primary</Badge>
</div>

## When to use

- For **static metadata** that labels something — a version (`v4.2.1`), an environment (`staging`), a category, a tag.
- For **counts** that annotate another element — unread totals, item quantities, result counts.
- For **domain status** that doesn't map to the alarm hierarchy — `draft`, `published`, `archived`, `beta`. The rounded-square shape reads as "label," not "live state."

## When *not* to use

- For **live operational state** — link health, battery level, mission phase. Reach for `<StatusBadge>`: pills signal live state, rounded squares signal labels. Don't blur that distinction.
- For **anything clickable** — a Badge is a `<span>`, not an interactive element. If it filters, dismisses, or navigates, use a `<Button>` or a styled link with a real focus ring and keyboard handling.
- For **long-form text** — Badge is a fixed-height chip (20–24 px). Body copy, sentences, or wrapping content belong elsewhere.

## Props

<PropsTable name="Badge" />

The component forwards `$attrs`, so `aria-*`, `data-*`, `id`, `title` etc. all land on the underlying `<span>`.

## Examples

### Variant matrix

<div class="auxiliary-demo vp-raw">
  <Badge variant="neutral">neutral</Badge>
  <Badge variant="secondary">secondary</Badge>
  <Badge variant="outline">outline</Badge>
  <Badge variant="primary">primary</Badge>
</div>

```vue
<Badge variant="neutral">neutral</Badge>
<Badge variant="secondary">secondary</Badge>
<Badge variant="outline">outline</Badge>
<Badge variant="primary">primary</Badge>
```

`neutral` and `secondary` are the everyday neutrals — both carry a border, with `secondary` reading quieter on muted text. `outline` drops the fill entirely for the lightest weight. `primary` fills with the primary color and is the only variant that draws attention — save it for the one badge that matters in a row.

### Sizes

<div class="auxiliary-demo vp-raw">
  <Badge size="sm">v4.2.1</Badge>
  <Badge size="md">v4.2.1</Badge>
</div>

```vue
<Badge size="sm">v4.2.1</Badge>
<Badge size="md">v4.2.1</Badge>
```

`sm` is 20 px tall with 10 px text — the right call inside dense tables or alongside small labels. `md` (24 px, 12 px text) is the default and pairs cleanly with body copy.

### Version and environment tags

<div class="auxiliary-demo vp-raw">
  <Badge size="sm">v4.2.1</Badge>
  <Badge size="sm" variant="outline">beta</Badge>
  <Badge size="sm" variant="primary">new</Badge>
</div>

```vue
<Badge size="sm">v4.2.1</Badge>
<Badge size="sm" variant="outline">beta</Badge>
<Badge size="sm" variant="primary">new</Badge>
```

A common pattern: a neutral version chip, a quiet outline tag for the build channel, and a single `primary` badge to flag what's new.

### In situ

<div class="auxiliary-demo vp-raw" style="flex-direction: column; align-items: flex-start; gap: 0.75rem;">
  <div style="display: flex; align-items: center; gap: 0.5rem;">
    <span style="font-size: 0.875rem;">Auterion OS</span>
    <Badge size="sm" variant="secondary">v4.2.1</Badge>
  </div>
  <div style="display: flex; align-items: center; gap: 0.5rem;">
    <span style="font-size: 0.875rem;">Notifications</span>
    <Badge size="sm" variant="primary">12</Badge>
  </div>
  <div style="display: flex; align-items: center; gap: 0.5rem;">
    <span style="font-size: 0.875rem;">Mission plan</span>
    <Badge size="sm" variant="outline">draft</Badge>
  </div>
</div>

Badges annotate a neighbor — they rarely stand alone. The `sm` size keeps the chip subordinate to the label it sits beside.

## Accessibility

- The badge renders as a `<span>` — screen readers read the slot content as inline text. The text *is* the meaning; never lean on the variant color to convey it. A red-ish chip with no readable label means nothing to a screen reader.
- When a badge encodes status the surrounding text doesn't (`primary` for "new", `outline` for "draft"), make sure the word is in the slot, not just implied by color — this is WCAG 1.4.1 (use of color).
- A count badge like `12` next to "Notifications" reads as "Notifications 12," which is usually fine. If the count needs explicit framing, add a `title` or `aria-label` (e.g. `aria-label="12 unread notifications"`) — it forwards through `$attrs`.
- Badge is **not** interactive and has no focus ring. If you need a clickable chip, don't add a click handler to Badge — use a `<Button>` so keyboard and focus behavior come for free.

## Tokens consumed

The badge recipe binds to these semantic tokens — change the underlying values in [`@auxiliary/tokens`](/foundations/colors) and Badge updates automatically:

| Variant | Background | Text | Border |
| --- | --- | --- | --- |
| `neutral` | `--muted` | `--foreground` | `--border` |
| `secondary` | `--card` | `--muted-foreground` | `--border` |
| `outline` | transparent | `--muted-foreground` | `--border` |
| `primary` | `--primary` | `--primary-foreground` | none |

Plus `--radius` (corner radius) on every variant.
