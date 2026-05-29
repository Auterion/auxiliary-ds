# Popover

A floating panel anchored to a trigger, built on Reka UI's `PopoverRoot` and styled by the `popover` recipe. Use it for richer content than a tooltip can hold — forms, menus, filters — dismissible with Escape or an outside click.

<div class="auxiliary-demo vp-raw">
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="secondary" size="sm">Open popover</Button>
    </PopoverTrigger>
    <PopoverContent>
      <div class="space-y-2">
        <div class="font-medium text-foreground">Quick settings</div>
        <p class="text-muted-foreground">
          Popovers hold richer content than tooltips — forms, menus, filters.
          Press Escape or click outside to dismiss.
        </p>
        <div class="flex gap-2 pt-1">
          <Button variant="ghost" size="sm">Reset</Button>
          <Button variant="primary" size="sm">Apply</Button>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</div>

## When to use

- For **interactive content anchored to a control** — a settings panel, a small form, a filter group, a date picker.
- When the content is too rich for a `<Tooltip>` (which is hint-only and never holds focusable elements).
- When the panel should dismiss on outside click or Escape and return focus to the trigger automatically.

## When *not* to use

- For a **hint or label on hover** — reach for `<Tooltip>`. Popovers open on click and can trap focus; tooltips are passive.
- For a **list of actions or commands** — use `<DropdownMenu>`, which carries menu roles, roving focus, and type-ahead that a bare popover does not.
- For a **modal task that blocks the page** — use `<Dialog>`. A popover is anchored and dismissible; a dialog owns the screen until resolved.
- For **always-visible content** — if it never closes, it isn't a popover, it's a panel. Render it inline.

## Examples

### Basic composition

The three parts are always present: `Popover` owns state, `PopoverTrigger` is the anchor, `PopoverContent` is the floating panel (portaled to the body).

<div class="auxiliary-demo vp-raw">
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="secondary" size="sm">Quick settings</Button>
    </PopoverTrigger>
    <PopoverContent>
      <div class="space-y-2">
        <div class="font-medium text-foreground">Quick settings</div>
        <p class="text-muted-foreground">
          Tab through the panel — focus stays inside while it is open.
        </p>
        <div class="flex gap-2 pt-1">
          <Button variant="ghost" size="sm">Reset</Button>
          <Button variant="primary" size="sm">Apply</Button>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</div>

```vue
<Popover>
  <PopoverTrigger as-child>
    <Button variant="secondary" size="sm">Quick settings</Button>
  </PopoverTrigger>
  <PopoverContent>
    <div class="space-y-2">
      <div class="font-medium text-foreground">Quick settings</div>
      <p class="text-muted-foreground">
        Tab through the panel — focus stays inside while it is open.
      </p>
      <div class="flex gap-2 pt-1">
        <Button variant="ghost" size="sm">Reset</Button>
        <Button variant="primary" size="sm">Apply</Button>
      </div>
    </div>
  </PopoverContent>
</Popover>
```

`as-child` on the trigger merges the trigger behavior onto your `<Button>` rather than wrapping it in an extra element — so you get a real button as the anchor, with the popover's ARIA wiring attached.

### Placement

`PopoverContent` forwards Reka UI's positioning props. `side` picks the edge, `align` the alignment along that edge, and `sideOffset` / `alignOffset` nudge it in pixels.

<div class="auxiliary-demo vp-raw">
  <Popover>
    <PopoverTrigger as-child>
      <Button variant="secondary" size="sm">Open to the right</Button>
    </PopoverTrigger>
    <PopoverContent side="right" align="start" :side-offset="10">
      <p class="text-muted-foreground">
        Anchored to the right edge, aligned to the start, nudged 10px out.
      </p>
    </PopoverContent>
  </Popover>
</div>

```vue
<Popover>
  <PopoverTrigger as-child>
    <Button variant="secondary" size="sm">Open to the right</Button>
  </PopoverTrigger>
  <PopoverContent side="right" align="start" :side-offset="10">
    <p class="text-muted-foreground">
      Anchored to the right edge, aligned to the start, nudged 10px out.
    </p>
  </PopoverContent>
</Popover>
```

Reka UI flips the panel automatically when the requested side would overflow the viewport, so `side` is a preference, not a guarantee.

### Open by default

`defaultOpen` renders the popover open on mount without you owning the state — useful for onboarding hints or a static documentation demo.

<div class="auxiliary-demo vp-raw">
  <Popover :default-open="true">
    <PopoverTrigger as-child>
      <Button variant="secondary" size="sm">Already open</Button>
    </PopoverTrigger>
    <PopoverContent>
      <div class="space-y-1">
        <div class="font-medium text-foreground">Heads up</div>
        <p class="text-muted-foreground">
          This panel opened on mount via <code>default-open</code>. Click outside or
          press Escape to dismiss.
        </p>
      </div>
    </PopoverContent>
  </Popover>
</div>

```vue
<Popover :default-open="true">
  <PopoverTrigger as-child>
    <Button variant="secondary" size="sm">Already open</Button>
  </PopoverTrigger>
  <PopoverContent>
    <div class="space-y-1">
      <div class="font-medium text-foreground">Heads up</div>
      <p class="text-muted-foreground">
        This panel opened on mount via <code>default-open</code>.
      </p>
    </div>
  </PopoverContent>
</Popover>
```

For full control, bind `:open` and listen to `@update:open` instead of using `defaultOpen`.

### Modal

`modal` disables interaction with everything behind the popover and hides outside content from screen readers while it is open — for a focused, dialog-like flow that still anchors to its trigger.

<div class="auxiliary-demo vp-raw">
  <Popover :modal="true">
    <PopoverTrigger as-child>
      <Button variant="secondary" size="sm">Modal popover</Button>
    </PopoverTrigger>
    <PopoverContent>
      <div class="space-y-2">
        <div class="font-medium text-foreground">Confirm action</div>
        <p class="text-muted-foreground">
          With <code>modal</code>, the page behind is inert until you dismiss this.
        </p>
        <div class="flex gap-2 pt-1">
          <Button variant="ghost" size="sm">Cancel</Button>
          <Button variant="danger" size="sm">Delete</Button>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</div>

```vue
<Popover :modal="true">
  <PopoverTrigger as-child>
    <Button variant="secondary" size="sm">Modal popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    <div class="space-y-2">
      <div class="font-medium text-foreground">Confirm action</div>
      <p class="text-muted-foreground">
        With <code>modal</code>, the page behind is inert until you dismiss this.
      </p>
      <div class="flex gap-2 pt-1">
        <Button variant="ghost" size="sm">Cancel</Button>
        <Button variant="danger" size="sm">Delete</Button>
      </div>
    </div>
  </PopoverContent>
</Popover>
```

If the interaction genuinely demands a blocking overlay with a backdrop, prefer `<Dialog>` — `modal` on a popover is for the rare case where you want dialog-like containment but still need the anchored, arrow-to-trigger relationship.

## Props

### Popover

<PropsTable name="Popover" />

### PopoverTrigger

<PropsTable name="PopoverTrigger" />

### PopoverContent

<PropsTable name="PopoverContent" />

## Accessibility

- The composition wires the ARIA relationship for you: the trigger gets `aria-haspopup="dialog"` and `aria-expanded`, and `aria-controls` pointing at the content. Use `as-child` so those land on a real, focusable element (a `<Button>`), not a non-interactive wrapper.
- **Focus moves into the panel** when it opens and **returns to the trigger** when it closes — so keyboard users never lose their place.
- **Escape** closes the popover; an **outside click** closes it too. Both return focus to the trigger.
- `modal` makes outside content inert and `aria-hidden` to screen readers while open. Leave it off for the common, non-blocking case so users can still interact with the page around the panel.
- The panel is portaled to the document body, so it escapes parent `overflow: hidden` and stacking contexts — its `z-50` and `--ring` focus outline come from the `popover` recipe.
- The popover has no implicit label. If the panel is a self-contained task, give its content a heading and reference it (e.g. `aria-labelledby`) so assistive tech announces what the panel is for.
