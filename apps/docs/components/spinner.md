# Spinner

An indeterminate, spinning loading indicator built on the `spinner` recipe — three sizes, a built-in accessible label, and a color it inherits from the surrounding text.

<div class="auxiliary-demo vp-raw">
  <Spinner size="sm" />
  <Spinner size="md" />
  <Spinner size="lg" />
</div>

## When to use

- For **indeterminate waits** — a request is in flight and you can't show meaningful progress. The spinner says "working," not "X% done."
- **Inline, next to or inside the thing that's loading** — a button mid-submit, a panel fetching data, a row refreshing.
- For **short, sub-second-to-a-few-seconds** operations where a skeleton would feel heavier than the wait itself.

## When *not* to use

- When you **can** report progress — use `<Progress>` instead. A determinate bar that climbs toward done is far less anxiety-inducing than a spinner that could mean five seconds or five minutes.
- For **page- or section-level content loading** — reach for `<Skeleton>` placeholders. They preserve layout and hint at the shape of what's arriving; a lone spinner on an empty page tells the user nothing about what they're waiting for.
- As a **persistent status decoration** — a spinner means "in progress right now." If something is merely "syncing in the background" indefinitely, that's a `<StatusBadge>`, not a spinner.

## Examples

### Sizes

<div class="auxiliary-demo vp-raw">
  <Spinner size="sm" />
  <Spinner size="md" />
  <Spinner size="lg" />
</div>

```vue
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
```

`sm` (12 px) sits cleanly inside `sm` buttons and dense table rows; `md` (16 px) is the default for body-text contexts; `lg` (24 px) suits a centered panel-level wait.

### Inside a button

<div class="auxiliary-demo vp-raw">
  <Button :loading="true">
    <Spinner size="sm" /> Saving…
  </Button>
</div>

```vue
<Button :loading="true">
  <Spinner size="sm" /> Saving…
</Button>
```

Button doesn't render its own spinner — `loading` only dims the button and blocks clicks. Drop a `<Spinner>` into the slot to supply the visual cue. It inherits the button's text color, so it matches every variant automatically.

### Custom label

<div class="auxiliary-demo vp-raw">
  <Spinner size="lg" aria-label="Fetching telemetry" />
</div>

```vue
<Spinner size="lg" aria-label="Fetching telemetry" />
```

The `ariaLabel` is announced to screen readers and is *not* visible on screen. Always set it to describe the specific operation ("Fetching telemetry", "Uploading log") rather than leaving the generic default.

### On a colored surface

<div class="auxiliary-demo vp-raw">
  <div style="display: flex; align-items: center; gap: 0.5rem; padding: 0.5rem 0.75rem; border-radius: var(--radius-md); background: var(--primary); color: var(--primary-foreground);">
    <Spinner size="sm" /> Connecting…
  </div>
</div>

```vue
<div class="flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-primary-foreground">
  <Spinner size="sm" /> Connecting…
</div>
```

The spinner draws with `currentColor`, so it picks up whatever text color its container sets — no variant prop needed to recolor it. Put it on a dark or accent surface and it follows the foreground.

## Props

<PropsTable name="Spinner" />

The track and the spinning arc both stroke with `currentColor` — the arc at full opacity, the track at 20% — so a single text color drives the whole shape.

## Accessibility

- The root renders as `<span role="status">`, the polite ARIA live role. When the spinner appears, assistive technology announces its label without interrupting the user.
- The `ariaLabel` (default `"Loading"`) is exposed twice for redundancy — as `aria-label` on the `role="status"` element and as visually-hidden `sr-only` text inside it. Set it to something specific; "Loading" alone rarely tells a screen-reader user *what* is loading.
- The `<svg>` is `aria-hidden="true"` — it's purely decorative, so the label text is the sole announcement and the shape is never read out as graphics.
- The spinner animates continuously via `animate-spin`. For users with `prefers-reduced-motion`, ensure the surrounding page respects the global reduced-motion contract; never make the spinner the *only* signal that work is happening — pair it with text ("Saving…", "Connecting…") so the state is legible without motion.
