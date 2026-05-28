# Button

A native `<button>` styled by the `button` recipe — four intent levels, three sizes, a loading state.

<div class="auxiliary-demo">
  <Button intent="primary">Launch</Button>
  <Button intent="secondary">Cancel</Button>
  <Button intent="ghost">Skip</Button>
  <Button intent="danger">Abort mission</Button>
</div>

## When to use

- For any clickable action a user initiates.
- For form submission (`type="submit"`).
- For destructive operations — reach for `intent="danger"` so the visual weight matches the impact.

## When *not* to use

- For navigation between pages — use a styled `<a>` instead. Buttons that act like links break browser conventions (middle-click, copy URL, back button).
- For toggles — reach for `<Switch>` or `<Checkbox>`. A button that flips on click loses the affordance.
- As a wrapper for icons alone — use a plain icon-button pattern (`<button><Icon /></button>`) with `aria-label`, or reach for an icon component built for that purpose.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `intent` | `'primary' \| 'secondary' \| 'ghost' \| 'danger'` | `'primary'` | Visual weight + token bindings. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Height + horizontal padding + text size. |
| `loading` | `boolean` | `false` | Reduces opacity, disables pointer events. Pair with a `<Spinner>` slot. |
| `disabled` | `boolean` | `false` | Forwards to native `disabled`. |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | Forwards to native attribute. **Default is `button`, not `submit`** — buttons in forms don't submit unless asked. |

The component forwards `$attrs`, so `@click`, `aria-*`, `data-*`, `id` etc. all just work.

## Examples

### Intent matrix

<div class="auxiliary-demo">
  <Button intent="primary">Primary</Button>
  <Button intent="secondary">Secondary</Button>
  <Button intent="ghost">Ghost</Button>
  <Button intent="danger">Danger</Button>
</div>

```vue
<Button intent="primary">Primary</Button>
<Button intent="secondary">Secondary</Button>
<Button intent="ghost">Ghost</Button>
<Button intent="danger">Danger</Button>
```

### Sizes

<div class="auxiliary-demo">
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

<div class="auxiliary-demo">
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
<Button intent="ghost" aria-label="Close dialog">
  <Icon name="xmark" />
</Button>
```

## Tokens consumed

The button recipe binds to these semantic tokens — change the underlying values in [`@auxiliary/tokens`](/foundations/colors) and Button updates automatically:

| Intent | Background | Text | Hover |
| --- | --- | --- | --- |
| `primary` | `--primary` | `--primary-foreground` | `--primary` @ 90% opacity |
| `secondary` | `--secondary` | `--secondary-foreground` | `--secondary` @ 80% opacity |
| `ghost` | transparent | `--foreground` | bg `--accent`, text `--accent-foreground` |
| `danger` | `--destructive` | `--destructive-foreground` | `--destructive` @ 90% opacity |

Plus `--ring` (focus outline) and `--radius-md` (corner radius) on every intent.
