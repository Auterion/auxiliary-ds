# Card

A surface container built from the `card` recipe — a bordered, rounded panel on `bg-card` with a small family of slot components (`CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`) that give its regions consistent spacing and type.

<div class="auxiliary-demo">
  <Card style="width: 320px;">
    <CardHeader>
      <CardTitle>Vehicle MX-01</CardTitle>
      <CardDescription>Quadcopter · firmware v4.2.1</CardDescription>
    </CardHeader>
    <CardContent>
      <div class="flex flex-wrap items-center gap-2 text-sm">
        <StatusBadge level="nominal" size="sm" dot>Connected</StatusBadge>
        <Separator orientation="vertical" class="h-4" />
        <span class="text-muted-foreground">Battery</span>
        <TelemetryValue :value="74" unit="%" :precision="0" size="sm" />
      </div>
    </CardContent>
    <CardFooter>
      <Button variant="ghost" size="sm">Details</Button>
      <Button variant="primary" size="sm" class="ml-auto">Launch</Button>
    </CardFooter>
  </Card>
</div>

## When to use

- To group related content and actions into a single visual unit — a vehicle summary, a settings panel, a metric tile.
- When you want a consistent surface treatment (border, radius, `bg-card`) across a grid or list of items.
- For dashboard layouts where each unit owns a title, a body, and a row of actions — the header / content / footer split maps cleanly onto that.

## When *not* to use

- For page-level layout regions — a card is a content container, not a page chrome primitive. Don't nest your whole app inside one.
- For interactive overlays — a panel that floats over content and traps focus is a `<Dialog>` or `<Popover>`, not a Card.
- For a single value or label with no structure — reach for `<TelemetryValue>`, `<Badge>`, or `<StatusBadge>`. A card around one number is overhead.
- For deeply nested cards-within-cards. If you're stacking surfaces, the hierarchy is probably telling you to flatten the layout or reach for `<Separator>` / `<Accordion>` inside one card instead.

## Examples

### Anatomy

The full family composes top-to-bottom: a `CardHeader` (which holds `CardTitle` and `CardDescription`), a `CardContent` body, and a `CardFooter` for actions. Every piece is optional — use only the regions you need.

<div class="auxiliary-demo">
  <Card style="width: 340px;">
    <CardHeader>
      <CardTitle>Mission Bravo</CardTitle>
      <CardDescription>Survey · 4.2 km route · 21 min est.</CardDescription>
    </CardHeader>
    <CardContent>
      <p class="text-sm text-muted-foreground">
        Waypoints uploaded and validated. Ready to arm when the operator confirms.
      </p>
    </CardContent>
    <CardFooter>
      <Button variant="secondary" size="sm">Edit route</Button>
      <Button variant="primary" size="sm" class="ml-auto">Arm</Button>
    </CardFooter>
  </Card>
</div>

```vue
<Card>
  <CardHeader>
    <CardTitle>Mission Bravo</CardTitle>
    <CardDescription>Survey · 4.2 km route · 21 min est.</CardDescription>
  </CardHeader>
  <CardContent>
    <p class="text-sm text-muted-foreground">
      Waypoints uploaded and validated. Ready to arm when the operator confirms.
    </p>
  </CardContent>
  <CardFooter>
    <Button variant="secondary" size="sm">Edit route</Button>
    <Button variant="primary" size="sm" class="ml-auto">Arm</Button>
  </CardFooter>
</Card>
```

`CardFooter` carries a top border, so it reads as a distinct action bar. Push the primary action to the right with `class="ml-auto"`.

### Header only

Drop `CardContent` and `CardFooter` when the card is purely a labeled tile — a status summary or a navigation target.

<div class="auxiliary-demo">
  <Card style="width: 280px;">
    <CardHeader>
      <CardTitle>GPS lock</CardTitle>
      <CardDescription>12 satellites · HDOP 0.7</CardDescription>
    </CardHeader>
    <CardContent>
      <StatusBadge level="nominal" dot>Acquired</StatusBadge>
    </CardContent>
  </Card>
</div>

```vue
<Card>
  <CardHeader>
    <CardTitle>GPS lock</CardTitle>
    <CardDescription>12 satellites · HDOP 0.7</CardDescription>
  </CardHeader>
  <CardContent>
    <StatusBadge level="nominal" dot>Acquired</StatusBadge>
  </CardContent>
</Card>
```

### Composed with other primitives

The card is a host surface — it composes with everything else. Here it wraps an `Accordion` for a progressively-disclosed checklist. Pass `class` to any slot to tune spacing locally (here `px-1` so the accordion sits flush).

<div class="auxiliary-demo">
  <Card style="width: 380px;">
    <CardHeader>
      <CardTitle>Pre-flight checks</CardTitle>
      <CardDescription>Confirm before takeoff. Expand each for details.</CardDescription>
    </CardHeader>
    <CardContent class="px-1">
      <Accordion type="single" collapsible default-value="airspace">
        <AccordionItem value="airspace">
          <AccordionTrigger>Airspace authorization</AccordionTrigger>
          <AccordionContent>
            Class G uncontrolled airspace below 120m AGL. No NOTAMs active. Cleared for VLOS.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="weather">
          <AccordionTrigger>Weather window</AccordionTrigger>
          <AccordionContent>
            Wind 6.2 m/s gusting 9.8 m/s — within limits. Visibility &gt;10 km.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="vehicle">
          <AccordionTrigger>Vehicle systems</AccordionTrigger>
          <AccordionContent>
            Battery 74% (~21 min). GPS 12 sats, HDOP 0.7. IMU calibrated &lt;24h ago.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </CardContent>
  </Card>
</div>

```vue
<Card>
  <CardHeader>
    <CardTitle>Pre-flight checks</CardTitle>
    <CardDescription>Confirm before takeoff. Expand each for details.</CardDescription>
  </CardHeader>
  <CardContent class="px-1">
    <Accordion type="single" collapsible default-value="airspace">
      <AccordionItem value="airspace">
        <AccordionTrigger>Airspace authorization</AccordionTrigger>
        <AccordionContent>
          Class G uncontrolled airspace below 120m AGL. No NOTAMs active. Cleared for VLOS.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="weather">
        <AccordionTrigger>Weather window</AccordionTrigger>
        <AccordionContent>
          Wind 6.2 m/s gusting 9.8 m/s — within limits. Visibility &gt;10 km.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="vehicle">
        <AccordionTrigger>Vehicle systems</AccordionTrigger>
        <AccordionContent>
          Battery 74% (~21 min). GPS 12 sats, HDOP 0.7. IMU calibrated &lt;24h ago.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  </CardContent>
</Card>
```

### Grid of cards

Cards earn their keep in a grid — a uniform surface treatment across many units. Lay them out with your own grid container; the card doesn't impose width.

<div class="auxiliary-demo" style="flex-direction: column; align-items: stretch;">
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; width: 100%;">
    <Card>
      <CardHeader>
        <CardTitle>MX-01</CardTitle>
        <CardDescription>Quadcopter</CardDescription>
      </CardHeader>
      <CardContent>
        <StatusBadge level="nominal" size="sm" dot>Connected</StatusBadge>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <CardTitle>MX-02</CardTitle>
        <CardDescription>Quadcopter</CardDescription>
      </CardHeader>
      <CardContent>
        <StatusBadge level="caution" size="sm" dot>Weak signal</StatusBadge>
      </CardContent>
    </Card>
  </div>
</div>

```vue
<div class="grid grid-cols-2 gap-4">
  <Card>
    <CardHeader>
      <CardTitle>MX-01</CardTitle>
      <CardDescription>Quadcopter</CardDescription>
    </CardHeader>
    <CardContent>
      <StatusBadge level="nominal" size="sm" dot>Connected</StatusBadge>
    </CardContent>
  </Card>
  <Card>
    <CardHeader>
      <CardTitle>MX-02</CardTitle>
      <CardDescription>Quadcopter</CardDescription>
    </CardHeader>
    <CardContent>
      <StatusBadge level="caution" size="sm" dot>Weak signal</StatusBadge>
    </CardContent>
  </Card>
</div>
```

## Props

Every component in the Card family is a styling-only wrapper: it renders an element with recipe classes and a single default slot, and forwards a `class` prop that merges (via `cn()`) so you can tune spacing locally. None take behavioral props.

### Card

<PropsTable name="Card" />

### CardHeader

<PropsTable name="CardHeader" />

### CardTitle

<PropsTable name="CardTitle" />

### CardDescription

<PropsTable name="CardDescription" />

### CardContent

<PropsTable name="CardContent" />

### CardFooter

<PropsTable name="CardFooter" />

## Accessibility

- The Card family carries **no implicit ARIA roles** — `Card`, `CardHeader`, `CardContent`, and `CardFooter` render plain `<div>`s, `CardDescription` renders a `<p>`. The container is a visual grouping, not a landmark. If a card *is* a landmark region (e.g. a complementary panel), add `role` / `aria-label` on the `Card` yourself; `$attrs` are forwarded to the root element.
- **`CardTitle` renders an `<h3>`.** That gives the card a real heading in the document outline, but it also means you're responsible for the surrounding heading levels — don't drop an `<h3>` under an `<h1>` page title with no `<h2>` between them if your page relies on a strict outline. Override the element with `class` styling only; the tag itself is fixed at `<h3>`.
- For a card that is itself **clickable** (navigates or selects), don't put a click handler on the bare `<div>` — a div isn't keyboard-focusable and screen readers won't announce it as actionable. Put a `<Button>` or a focusable link inside the card, or make the title a link.
- Content inside the card inherits the normal focus order. The recipe applies no focus styling to the card itself — focusable children (buttons, inputs, accordion triggers) keep their own `:focus-visible` rings.
- Color contrast is handled by the tokens: `bg-card` against `text-foreground` for body copy and `text-muted-foreground` for the description, both bound in [`@auxiliary/tokens`](/foundations/colors).
