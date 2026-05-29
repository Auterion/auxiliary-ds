# Button

A native `<button>` styled by the `button` recipe — four variants, three sizes, a loading state.

<div class="auxiliary-demo vp-raw">
  <Button variant="primary">Launch</Button>
  <Button variant="secondary">Cancel</Button>
  <Button variant="ghost">Skip</Button>
  <Button variant="danger">Abort mission</Button>
</div>

## When to use

- For any clickable action a user initiates.
- For form submission (`type="submit"`).
- For destructive operations — reach for `variant="danger"` so the visual weight matches the impact.

## When *not* to use

- For navigation between pages — use a styled `<a>` instead. Buttons that act like links break browser conventions (middle-click, copy URL, back button).
- For toggles — reach for `<Switch>` or `<Checkbox>`. A button that flips on click loses the affordance.
- As a wrapper for icons alone — use a plain icon-button pattern (`<button><Icon /></button>`) with `aria-label`, or reach for an icon component built for that purpose.

## Props

<PropsTable name="Button" />

The component forwards `$attrs`, so `@click`, `aria-*`, `data-*`, `id` etc. all just work.

## Examples

### Variant matrix

<div class="auxiliary-demo vp-raw">
  <Button variant="primary">Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="ghost">Ghost</Button>
  <Button variant="danger">Danger</Button>
</div>

```vue
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
```

### Sizes

<div class="auxiliary-demo vp-raw">
  <Button size="sm">Small</Button>
  <Button size="md">Medium</Button>
  <Button size="lg">Large</Button>
</div>

```vue
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### Loading

<div class="auxiliary-demo vp-raw">
  <Button :loading="true">
    <Spinner /> Saving…
  </Button>
</div>

```vue
<Button :loading="true">
  <Spinner /> Saving…
</Button>
```

`loading=true` reduces opacity and blocks pointer events. The spinner inside the slot is the visual cue — Button doesn't render one automatically.

## Accessibility

- Default `type="button"` — buttons inside `<form>` won't submit unless explicitly `type="submit"`. This is intentional and is a frequent source of bugs in other libraries that default to `type="submit"`.
- `disabled` and `loading` both block click. Use `disabled` when the action is *unavailable* (gated by state), `loading` when the action *is in progress*.
- Focus ring is `ring-2 ring-ring`, visible only on `:focus-visible` so mouse clicks don't show it. Keyboard navigation does.
- Icon-only buttons must carry an `aria-label`:

```vue
<Button variant="ghost" aria-label="Close dialog">
  <Icon name="xmark" />
</Button>
```

## Tokens consumed

The button recipe binds to these semantic tokens — change the underlying values in [`@auxiliary/tokens`](/foundations/colors) and Button updates automatically:

| Variant | Background | Text | Hover |
| --- | --- | --- | --- |
| `primary` | `--primary` | `--primary-foreground` | `--primary` @ 90% opacity |
| `secondary` | `--secondary` | `--secondary-foreground` | `--secondary` @ 80% opacity |
| `ghost` | transparent | `--foreground` | bg `--accent`, text `--accent-foreground` |
| `danger` | `--destructive` | `--destructive-foreground` | `--destructive` @ 90% opacity |

Plus `--ring` (focus outline) and `--radius-md` (corner radius) on every variant.
