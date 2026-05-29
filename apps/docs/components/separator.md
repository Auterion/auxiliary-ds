# Separator

A thin rule that divides content, styled by the `separator` recipe and built on Reka UI's `Separator` primitive. Horizontal by default, decorative by default.

<div class="auxiliary-demo" style="flex-direction: column; align-items: stretch; gap: 0.75rem; max-width: 320px;">
  <span style="font-size: 0.875rem;">Telemetry</span>
  <Separator />
  <span style="font-size: 0.875rem;">Mission log</span>
  <Separator />
  <span style="font-size: 0.875rem;">Settings</span>
</div>

## When to use

- To divide groups of related content — sections of a card, items in a settings list, clusters in a toolbar.
- As a lightweight vertical divider between inline items (status, battery, signal) in a telemetry strip — reach for `orientation="vertical"`.
- When the division is purely visual. The default `decorative` is exactly right for a rule that adds no meaning a screen reader needs.

## When *not* to use

- To create vertical rhythm or spacing between blocks — that's the job of margin/gap, not a visible line. A separator should mean "these two regions are distinct," not "add some air here."
- Inside a `<DropdownMenu>` or `<Select>` — those have their own menu-aware dividers (`<DropdownMenuSeparator>`, `<SelectSeparator>`) that carry the correct menu semantics. Don't drop a bare `<Separator>` into a menu.
- As a heavy visual frame — Separator is a 1px hairline bound to `--border`. If you need a filled panel edge, that's a `<Card>` boundary, not a separator.

## Props

<PropsTable name="Separator" />

The component forwards `class`, so you can size a vertical separator (`class="h-4"`) or override the rule color per instance.

## Examples

### Horizontal (default)

<div class="auxiliary-demo" style="flex-direction: column; align-items: stretch; gap: 0.75rem; max-width: 320px;">
  <span style="font-size: 0.875rem;">Flight controls</span>
  <Separator />
  <span style="font-size: 0.875rem;">Payload</span>
</div>

```vue
<span>Flight controls</span>
<Separator />
<span>Payload</span>
```

A horizontal separator stretches to fill its container's width (`w-full`) and sits at 1px tall. No props are needed — `orientation` defaults to `horizontal`.

### Vertical

<div class="auxiliary-demo">
  <div style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.875rem;">
    <span>Connected</span>
    <Separator orientation="vertical" class="h-4" />
    <span>Battery 74%</span>
    <Separator orientation="vertical" class="h-4" />
    <span>Signal -87 dBm</span>
  </div>
</div>

```vue
<div class="flex items-center gap-2 text-sm">
  <span>Connected</span>
  <Separator orientation="vertical" class="h-4" />
  <span>Battery 74%</span>
  <Separator orientation="vertical" class="h-4" />
  <span>Signal -87 dBm</span>
</div>
```

A vertical separator is `w-px` and stretches to `h-full`, so it needs a height to render against. Inside a flex row, give it an explicit height (`class="h-4"`) or let it inherit from an aligned parent. This is the canonical telemetry-strip divider.

### Semantic (non-decorative)

<div class="auxiliary-demo" style="flex-direction: column; align-items: stretch; gap: 0.75rem; max-width: 320px;">
  <span style="font-size: 0.875rem;">Pre-flight checklist</span>
  <Separator :decorative="false" />
  <span style="font-size: 0.875rem;">In-flight telemetry</span>
</div>

```vue
<section>Pre-flight checklist</section>
<Separator :decorative="false" />
<section>In-flight telemetry</section>
```

Set `:decorative="false"` when the rule marks a genuine boundary between two regions of content. The separator then exposes `role="separator"` to assistive tech (and `aria-orientation` when vertical), so the division is announced rather than silent.

## Accessibility

- **Decorative by default.** With `decorative` left at its default `true`, the element renders with `role="none"` and no ARIA orientation — it's invisible to screen readers, which is correct for a purely visual rule.
- **Semantic when it carries meaning.** Pass `:decorative="false"` and the element gains `role="separator"`. A non-decorative vertical separator also sets `aria-orientation="vertical"` so the boundary's direction is conveyed.
- **No focus or keyboard interaction.** A separator is never a tab stop and has no keyboard behavior — it's a static divider, not a control.
- **Don't lean on the line alone for structure.** If two regions are meaningfully distinct, prefer real landmarks or headings; reserve the semantic separator for cases where a heading would be overkill but the boundary still matters.

## Tokens consumed

The separator recipe binds a single semantic token — change it in [`@auxiliary/tokens`](/foundations/colors) and every separator updates:

| Aspect | Token |
| --- | --- |
| Rule color (border) | `--border` |

The fill is always transparent; the visible line is the 1px border (`border-t` horizontal, `border-l` vertical) drawn in `--border`.
