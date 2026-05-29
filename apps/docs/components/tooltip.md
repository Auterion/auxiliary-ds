# Tooltip

A floating hint anchored to a trigger, built on Reka UI's tooltip primitive and styled by the `tooltip` recipe. It's a compound component: a single `TooltipProvider` wraps the app (or a section), then each `Tooltip` pairs a `TooltipTrigger` with a `TooltipContent`.

<div class="auxiliary-demo vp-raw">
  <TooltipProvider>
    <Tooltip :default-open="true">
      <TooltipTrigger as-child>
        <Button variant="secondary" size="sm">Hover for tooltip</Button>
      </TooltipTrigger>
      <TooltipContent>
        Mission integrity — all sensors green
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</div>

## When to use

- For **short, supplementary hints** about a control — what an icon button does, what a truncated label says in full, why a field is disabled.
- For **labelling icon-only controls** visually, on top of (never instead of) an `aria-label`.
- When the information is *nice to have* and the user can complete the task without it. Tooltips are progressive disclosure, not primary content.

## When *not* to use

- For **essential information** a user needs to act — tooltips are hover/focus-gated and vanish, so they fail anyone on touch or in a hurry. Put critical text inline.
- For **rich or interactive content** — forms, menus, multi-line bodies, links. Reach for `<Popover>` instead; it's focusable, dismissible, and built to hold structure.
- For **anything triggered by click** — a tooltip opens on hover and keyboard focus, not click. If you need a click-to-open hint, that's a Popover.
- On **mobile-first surfaces** where hover doesn't exist. Don't hide a label behind a hover affordance that touch users can't reach.

## Examples

### Basic tooltip

A `TooltipProvider` near the root, then a `Tooltip` wrapping the trigger and content. Use `as-child` on the trigger so the tooltip attaches to your own element (here a `Button`) instead of injecting an extra `<button>`.

<div class="auxiliary-demo vp-raw">
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button variant="secondary" size="sm">Hover me</Button>
      </TooltipTrigger>
      <TooltipContent>
        Mission integrity — all sensors green
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</div>

```vue
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger as-child>
      <Button variant="secondary" size="sm">Hover me</Button>
    </TooltipTrigger>
    <TooltipContent>
      Mission integrity — all sensors green
    </TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### Placement

`TooltipContent` takes `side` (`top` | `right` | `bottom` | `left`, default `top`) and `align` (`start` | `center` | `end`, default `center`). Use `side-offset` to nudge the gap between trigger and content.

<div class="auxiliary-demo vp-raw">
  <TooltipProvider>
    <Tooltip :default-open="true">
      <TooltipTrigger as-child>
        <Button variant="ghost" size="sm">Top</Button>
      </TooltipTrigger>
      <TooltipContent side="top">Above the trigger</TooltipContent>
    </Tooltip>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button variant="ghost" size="sm">Right</Button>
      </TooltipTrigger>
      <TooltipContent side="right">To the right</TooltipContent>
    </Tooltip>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button variant="ghost" size="sm">Bottom</Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" :side-offset="8">Below, offset 8px</TooltipContent>
    </Tooltip>
  </TooltipProvider>
</div>

```vue
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger as-child>
      <Button variant="ghost" size="sm">Top</Button>
    </TooltipTrigger>
    <TooltipContent side="top">Above the trigger</TooltipContent>
  </Tooltip>

  <Tooltip>
    <TooltipTrigger as-child>
      <Button variant="ghost" size="sm">Bottom</Button>
    </TooltipTrigger>
    <TooltipContent side="bottom" :side-offset="8">Below, offset 8px</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

### Tuning the open delay

`TooltipProvider` sets the timing for every tooltip beneath it. `delayDuration` (default `400`ms) is how long the pointer must rest before opening; `skipDelayDuration` (default `200`ms) is the window in which moving to a *neighbouring* tooltip opens it instantly, so a row of icons feels responsive rather than re-arming the delay each time.

<div class="auxiliary-demo vp-raw">
  <TooltipProvider :delay-duration="0" :skip-delay-duration="0">
    <Tooltip>
      <TooltipTrigger as-child>
        <Button variant="ghost" size="sm">Instant</Button>
      </TooltipTrigger>
      <TooltipContent>Opens with no delay</TooltipContent>
    </Tooltip>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button variant="ghost" size="sm">Also instant</Button>
      </TooltipTrigger>
      <TooltipContent>Neighbours open instantly too</TooltipContent>
    </Tooltip>
  </TooltipProvider>
</div>

```vue
<TooltipProvider :delay-duration="0" :skip-delay-duration="0">
  <Tooltip>
    <TooltipTrigger as-child>
      <Button variant="ghost" size="sm">Instant</Button>
    </TooltipTrigger>
    <TooltipContent>Opens with no delay</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

A single `delayDuration` on an individual `<Tooltip>` overrides the provider for just that one.

### Labelling an icon-only control

The most common production use: a tooltip echoes the `aria-label` of an icon button for sighted users. The label still carries the accessible name — the tooltip is the visual reinforcement, not the source of truth.

<div class="auxiliary-demo vp-raw">
  <TooltipProvider>
    <Tooltip :default-open="true">
      <TooltipTrigger as-child>
        <Button variant="ghost" size="sm" aria-label="Return to launch">
          <Icon name="house" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Return to launch</TooltipContent>
    </Tooltip>
  </TooltipProvider>
</div>

```vue
<TooltipProvider>
  <Tooltip>
    <TooltipTrigger as-child>
      <Button variant="ghost" size="sm" aria-label="Return to launch">
        <Icon name="house" />
      </Button>
    </TooltipTrigger>
    <TooltipContent>Return to launch</TooltipContent>
  </Tooltip>
</TooltipProvider>
```

## Props

### TooltipProvider

Mount this once, high in the tree. It carries the shared timing for every tooltip beneath it and has no visual output of its own.

<PropsTable name="TooltipProvider" />

### Tooltip

The root for a single tooltip. Controllable via `open` / `update:open`, or left uncontrolled with `defaultOpen`.

<PropsTable name="Tooltip" />

### TooltipTrigger

The element the tooltip is anchored to. Pass `as-child` to merge the trigger behaviour onto your own element (e.g. a `<Button>`) instead of rendering a wrapper.

<PropsTable name="TooltipTrigger" />

### TooltipContent

The floating panel. Styled by the `tooltip` recipe and rendered in a portal so it escapes overflow/clipping. Positioning props (`side`, `align`, `sideOffset`) forward to Reka UI.

<PropsTable name="TooltipContent" />

## Accessibility

- The trigger gets `aria-describedby` pointing at the content, so a screen reader announces the tooltip text as a description of the control — not as its name. The content is a *description*, never the accessible name.
- Tooltips open on **hover and keyboard focus**, and close on blur, `Escape`, or pointer-leave. Tab to the trigger and the tooltip appears without a mouse.
- `Escape` dismisses the open tooltip, matching the standard overlay contract.
- For icon-only triggers, always supply an `aria-label` on the control itself. The tooltip text is supplementary; the label is what assistive tech reads as the name (WCAG 1.1.1, 4.1.2).
- `defaultOpen` is shown in several demos above purely so the static page renders the content — don't ship tooltips forced open; let hover and focus drive them.
- Set `disableHoverableContent` only with care: it stops content staying open while the pointer is over it, which makes selectable tooltip text unreachable. Reka UI flags this as an accessibility regression, so the default keeps content hoverable.
- `TooltipContent` portals to the document body, so it isn't clipped by `overflow: hidden` ancestors and layers above other content at `z-50`.
