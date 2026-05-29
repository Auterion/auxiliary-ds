# DropdownMenu

A compound action menu built on Reka UI's `DropdownMenuRoot` and styled by the `dropdownMenu` recipe. Compose a trigger and a portalled content panel of items, labels, and separators.

<div class="auxiliary-demo vp-raw">
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="secondary" size="sm">Mission actions ▾</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Flight plan</DropdownMenuLabel>
      <DropdownMenuItem>New mission</DropdownMenuItem>
      <DropdownMenuItem>Import waypoints</DropdownMenuItem>
      <DropdownMenuItem>Export telemetry</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuLabel>Vehicle</DropdownMenuLabel>
      <DropdownMenuItem>Calibrate sensors</DropdownMenuItem>
      <DropdownMenuItem disabled>Firmware update (in flight)</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>

## When to use

- For a menu of **actions** triggered from a button — "New mission", "Export telemetry", "Calibrate sensors". Each item *does* something.
- When the actions are secondary or overflow — keeping them behind a trigger frees the surface, and the menu only renders when opened.
- When you need keyboard-navigable, focus-trapped action lists for free (↑/↓, Home/End, type-ahead, Esc to close) — Reka UI handles all of it.
- To group related actions under section `<DropdownMenuLabel>`s with `<DropdownMenuSeparator>`s between them.

## When *not* to use

- For **selecting a value** from a set — that's `<Select>`. A dropdown menu fires actions; it doesn't hold a value or report a selection back via `v-model`.
- For **navigation between pages** — use real `<a>` links (in a nav, list, or menubar). Menu items aren't anchors and break middle-click, copy-URL, and the back button.
- For a **single action** — just render a `<Button>`. Don't hide one item behind a trigger.
- For **rich, multi-control panels** (forms, sliders, filters) — reach for `<Popover>`. DropdownMenu items are single-line, single-action rows by design.
- For **toggleable settings** that should stay open while flipping — DropdownMenu closes on select. Use a Popover with `<Checkbox>`/`<Switch>` rows instead.

## Examples

### Basic menu

The minimum composition: a `<DropdownMenu>` provider wrapping a `<DropdownMenuTrigger>` and a `<DropdownMenuContent>` of items. Use `as-child` on the trigger to render your own `<Button>` as the trigger element rather than nesting a button inside one.

<div class="auxiliary-demo vp-raw">
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="secondary" size="sm">Open menu ▾</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>New mission</DropdownMenuItem>
      <DropdownMenuItem>Import waypoints</DropdownMenuItem>
      <DropdownMenuItem>Export telemetry</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>

```vue
<DropdownMenu>
  <DropdownMenuTrigger as-child>
    <Button variant="secondary" size="sm">Open menu ▾</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem>New mission</DropdownMenuItem>
    <DropdownMenuItem>Import waypoints</DropdownMenuItem>
    <DropdownMenuItem>Export telemetry</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Labels and separators

Group items into sections with `<DropdownMenuLabel>` (a non-interactive, uppercased caption) and divide groups with `<DropdownMenuSeparator>`. Neither is focusable — they're structure, not actions.

<div class="auxiliary-demo vp-raw">
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="secondary" size="sm">Mission actions ▾</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuLabel>Flight plan</DropdownMenuLabel>
      <DropdownMenuItem>New mission</DropdownMenuItem>
      <DropdownMenuItem>Import waypoints</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuLabel>Vehicle</DropdownMenuLabel>
      <DropdownMenuItem>Calibrate sensors</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>

```vue
<DropdownMenu>
  <DropdownMenuTrigger as-child>
    <Button variant="secondary" size="sm">Mission actions ▾</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Flight plan</DropdownMenuLabel>
    <DropdownMenuItem>New mission</DropdownMenuItem>
    <DropdownMenuItem>Import waypoints</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuLabel>Vehicle</DropdownMenuLabel>
    <DropdownMenuItem>Calibrate sensors</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Disabled items and the `select` event

An item gated by state takes `disabled` — it dims, drops out of keyboard navigation, and won't fire. Listen to `@select` on an item to run its action; the event payload is the native DOM event.

<div class="auxiliary-demo vp-raw">
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="secondary" size="sm">Vehicle ▾</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem>Calibrate sensors</DropdownMenuItem>
      <DropdownMenuItem>Arm motors</DropdownMenuItem>
      <DropdownMenuItem disabled>Firmware update (in flight)</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>

```vue
<DropdownMenu>
  <DropdownMenuTrigger as-child>
    <Button variant="secondary" size="sm">Vehicle ▾</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem @select="calibrate">Calibrate sensors</DropdownMenuItem>
    <DropdownMenuItem @select="arm">Arm motors</DropdownMenuItem>
    <DropdownMenuItem disabled>Firmware update (in flight)</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Positioning the content

`<DropdownMenuContent>` is portalled and positioned relative to the trigger. Tune it with `side` (`top` / `right` / `bottom` / `left`), `align` (`start` / `center` / `end`), and `sideOffset` (gap in px). Defaults are `side="bottom"`, `align="start"`, `sideOffset="4"`.

<div class="auxiliary-demo vp-raw">
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="secondary" size="sm">End-aligned ▾</Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" :side-offset="8">
      <DropdownMenuItem>Profile</DropdownMenuItem>
      <DropdownMenuItem>Settings</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem>Sign out</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>

```vue
<DropdownMenu>
  <DropdownMenuTrigger as-child>
    <Button variant="secondary" size="sm">End-aligned ▾</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" :side-offset="8">
    <DropdownMenuItem>Profile</DropdownMenuItem>
    <DropdownMenuItem>Settings</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Sign out</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## Props

### DropdownMenu

The root provider. It holds open state and emits `update:open`, so it can be controlled with `v-model:open`. Set `modal` to block interaction with the rest of the page while the menu is open.

<PropsTable name="DropdownMenu" />

### DropdownMenuTrigger

The element that opens the menu. Use `as-child` to render your own component (e.g. `<Button>`) as the trigger instead of nesting one inside a default button.

<PropsTable name="DropdownMenuTrigger" />

### DropdownMenuContent

The portalled panel that holds the items. Positioned with `side`, `align`, and `sideOffset`.

<PropsTable name="DropdownMenuContent" />

### DropdownMenuItem

A single action row. `disabled` removes it from interaction; `@select` fires when it's chosen by click or keyboard.

<PropsTable name="DropdownMenuItem" />

### DropdownMenuLabel

A non-interactive section caption. No props — content goes in the default slot.

<PropsTable name="DropdownMenuLabel" />

### DropdownMenuSeparator

A horizontal divider between groups. No props or slot — render it self-closing.

<PropsTable name="DropdownMenuSeparator" />

## Accessibility

- The trigger exposes `aria-haspopup="menu"` and `aria-expanded`, and the content carries `role="menu"` with each `<DropdownMenuItem>` as `role="menuitem"` — Reka UI wires this for you. Don't override the roles.
- **Full keyboard support out of the box:** Enter/Space or ↓ opens the menu; ↑/↓ move between items; Home/End jump to first/last; type-ahead matches item text; Esc closes and returns focus to the trigger.
- **Focus is managed automatically.** Opening moves focus into the menu; closing (by select, Esc, or outside click) returns it to the trigger, so keyboard users never lose their place.
- `disabled` items are skipped during keyboard navigation and announced as disabled — `disabled` is the correct way to gate an action, not hiding it on `pointer-events`.
- `<DropdownMenuLabel>` and `<DropdownMenuSeparator>` are non-interactive structure: labels are read as group captions, separators are presentational. They never receive focus.
- Set `modal` on the root when the menu must own the page — it disables outside interaction and hides the rest of the tree from screen readers while open. Leave it off for lightweight overflow menus.
- The highlighted item uses `--accent` as its background (via `data-[highlighted]`), which tracks both keyboard and pointer focus — so the visible focus cue and the screen-reader focus stay in sync.
