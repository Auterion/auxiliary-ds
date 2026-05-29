# Tabs

A compound tab set built on Reka UI's `TabsRoot` family and styled by the `tabs` recipe — one `Tabs` provider wrapping a `TabsList` of `TabsTrigger`s and a `TabsContent` panel per trigger. The active trigger fills with `--primary`; keyboard navigation and ARIA wiring come from the primitive.

<div class="auxiliary-demo">
  <Tabs default-value="telemetry" class="max-w-2xl">
    <TabsList>
      <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
      <TabsTrigger value="waypoints">Waypoints</TabsTrigger>
      <TabsTrigger value="logs">Logs</TabsTrigger>
    </TabsList>
    <TabsContent value="telemetry">
      <div class="rounded-md border border-border bg-card p-5">
        <p class="text-sm text-muted-foreground">Live sensor readings.</p>
        <p class="mt-2 font-mono tabular text-sm">BAT 74% &nbsp; SPD 12.4 m/s &nbsp; HDG 247°</p>
      </div>
    </TabsContent>
    <TabsContent value="waypoints">
      <div class="rounded-md border border-border bg-card p-5">
        <p class="text-sm text-muted-foreground">5 waypoints queued.</p>
      </div>
    </TabsContent>
    <TabsContent value="logs">
      <div class="rounded-md border border-border bg-card p-5">
        <p class="text-sm text-muted-foreground">Last 3 events.</p>
      </div>
    </TabsContent>
  </Tabs>
</div>

## When to use

- For switching between **peer views of the same context** — telemetry / waypoints / logs for one mission, where each panel is an alternate lens on the same subject.
- When all panels are **roughly equal in importance** and the user will move between them freely during a session.
- When the set is **small and stable** (two to about five panels). Tabs read at a glance and fit on one line.
- For **in-place** content switching where a full page navigation would lose surrounding state (a side panel, a card, a dialog body).

## When *not* to use

- For **navigation between pages or routes** — use real links. Tabs swap content within a view; they don't change the URL or support back/forward, middle-click, or copy-link.
- For a **linear sequence** the user must complete in order — that's a stepper or wizard, not tabs. Tabs imply free movement, not a path.
- When panels are **many or open-ended** — a long, wrapping tab strip is hard to scan. Reach for a list, a select, or a sidebar.
- To **hide primary content** a user needs to see at once — if two panels must be compared side by side, don't split them across tabs.

## Examples

### Basic composition

The full shape: a `Tabs` provider with `default-value` set to the tab that should open first, a `TabsList` of `TabsTrigger`s, and one `TabsContent` per trigger. The `value` on each trigger must match the `value` on its content.

<div class="auxiliary-demo">
  <Tabs default-value="telemetry" class="max-w-2xl">
    <TabsList>
      <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
      <TabsTrigger value="waypoints">Waypoints</TabsTrigger>
      <TabsTrigger value="logs">Logs</TabsTrigger>
    </TabsList>
    <TabsContent value="telemetry">
      <div class="rounded-md border border-border bg-card p-5">
        <p class="text-sm text-muted-foreground">Live sensor readings.</p>
        <p class="mt-2 font-mono tabular text-sm">BAT 74% &nbsp; SPD 12.4 m/s &nbsp; HDG 247°</p>
      </div>
    </TabsContent>
    <TabsContent value="waypoints">
      <div class="rounded-md border border-border bg-card p-5">
        <p class="text-sm text-muted-foreground">5 waypoints queued.</p>
        <p class="mt-2 font-mono tabular text-sm text-muted-foreground">WP-01 → WP-02 → WP-03 → WP-04 → WP-05 (HOME)</p>
      </div>
    </TabsContent>
    <TabsContent value="logs">
      <div class="rounded-md border border-border bg-card p-5">
        <p class="text-sm text-muted-foreground">Last 3 events.</p>
        <p class="mt-2 font-mono tabular text-xs text-muted-foreground">12:04:18 INFO link established</p>
      </div>
    </TabsContent>
  </Tabs>
</div>

```vue
<Tabs default-value="telemetry">
  <TabsList>
    <TabsTrigger value="telemetry">Telemetry</TabsTrigger>
    <TabsTrigger value="waypoints">Waypoints</TabsTrigger>
    <TabsTrigger value="logs">Logs</TabsTrigger>
  </TabsList>

  <TabsContent value="telemetry">Live sensor readings.</TabsContent>
  <TabsContent value="waypoints">5 waypoints queued.</TabsContent>
  <TabsContent value="logs">Last 3 events.</TabsContent>
</Tabs>
```

### Disabled trigger

A single trigger can be gated with `disabled` — it stays visible but is skipped by both pointer and keyboard. Use it when a panel exists in the layout but isn't yet available (no data, insufficient permissions).

<div class="auxiliary-demo">
  <Tabs default-value="overview" class="max-w-2xl">
    <TabsList>
      <TabsTrigger value="overview">Overview</TabsTrigger>
      <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
      <TabsTrigger value="export" disabled>Export</TabsTrigger>
    </TabsList>
    <TabsContent value="overview">
      <div class="rounded-md border border-border bg-card p-5">
        <p class="text-sm text-muted-foreground">Vehicle nominal.</p>
      </div>
    </TabsContent>
    <TabsContent value="diagnostics">
      <div class="rounded-md border border-border bg-card p-5">
        <p class="text-sm text-muted-foreground">No active faults.</p>
      </div>
    </TabsContent>
    <TabsContent value="export">
      <div class="rounded-md border border-border bg-card p-5">
        <p class="text-sm text-muted-foreground">Export ready.</p>
      </div>
    </TabsContent>
  </Tabs>
</div>

```vue
<Tabs default-value="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="diagnostics">Diagnostics</TabsTrigger>
    <TabsTrigger value="export" disabled>Export</TabsTrigger>
  </TabsList>

  <TabsContent value="overview">Vehicle nominal.</TabsContent>
  <TabsContent value="diagnostics">No active faults.</TabsContent>
  <TabsContent value="export">Export ready.</TabsContent>
</Tabs>
```

### Controlled with `v-model`

Bind `Tabs` with `v-model` (the `modelValue` / `update:modelValue` pair) when something outside the tab strip needs to read or set the active tab — deep-linking, a "next" button, or syncing with app state. Omit `v-model` and use `default-value` when the component can own its own state.

<div class="auxiliary-demo">
  <Tabs default-value="map" class="max-w-2xl">
    <TabsList>
      <TabsTrigger value="map">Map</TabsTrigger>
      <TabsTrigger value="video">Video</TabsTrigger>
    </TabsList>
    <TabsContent value="map">
      <div class="rounded-md border border-border bg-card p-5">
        <p class="text-sm text-muted-foreground">Top-down tactical view.</p>
      </div>
    </TabsContent>
    <TabsContent value="video">
      <div class="rounded-md border border-border bg-card p-5">
        <p class="text-sm text-muted-foreground">Forward camera feed.</p>
      </div>
    </TabsContent>
  </Tabs>
</div>

```vue
<script setup>
import { ref } from 'vue'
const active = ref('map')
</script>

<template>
  <Tabs v-model="active">
    <TabsList>
      <TabsTrigger value="map">Map</TabsTrigger>
      <TabsTrigger value="video">Video</TabsTrigger>
    </TabsList>

    <TabsContent value="map">Top-down tactical view.</TabsContent>
    <TabsContent value="video">Forward camera feed.</TabsContent>
  </Tabs>
</template>
```

### Manual activation

By default a tab activates as soon as it receives keyboard focus (`activation-mode="automatic"`). Set `activation-mode="manual"` so arrow keys only *move* focus and the user confirms with <kbd>Enter</kbd> or <kbd>Space</kbd> — the right call when each panel is expensive to render or fetches on mount.

<div class="auxiliary-demo">
  <Tabs default-value="summary" activation-mode="manual" class="max-w-2xl">
    <TabsList>
      <TabsTrigger value="summary">Summary</TabsTrigger>
      <TabsTrigger value="raw">Raw feed</TabsTrigger>
      <TabsTrigger value="audit">Audit</TabsTrigger>
    </TabsList>
    <TabsContent value="summary">
      <div class="rounded-md border border-border bg-card p-5">
        <p class="text-sm text-muted-foreground">Aggregated mission report.</p>
      </div>
    </TabsContent>
    <TabsContent value="raw">
      <div class="rounded-md border border-border bg-card p-5">
        <p class="text-sm text-muted-foreground">Unprocessed telemetry stream.</p>
      </div>
    </TabsContent>
    <TabsContent value="audit">
      <div class="rounded-md border border-border bg-card p-5">
        <p class="text-sm text-muted-foreground">Operator action history.</p>
      </div>
    </TabsContent>
  </Tabs>
</div>

```vue
<Tabs default-value="summary" activation-mode="manual">
  <TabsList>
    <TabsTrigger value="summary">Summary</TabsTrigger>
    <TabsTrigger value="raw">Raw feed</TabsTrigger>
    <TabsTrigger value="audit">Audit</TabsTrigger>
  </TabsList>

  <TabsContent value="summary">Aggregated mission report.</TabsContent>
  <TabsContent value="raw">Unprocessed telemetry stream.</TabsContent>
  <TabsContent value="audit">Operator action history.</TabsContent>
</Tabs>
```

## Props

### Tabs

<PropsTable name="Tabs" />

`Tabs` forwards the full Reka UI `TabsRoot` prop and emit set. The two you'll reach for most are `default-value` (uncontrolled) and `v-model` (controlled). `orientation="vertical"` switches arrow-key navigation to up/down for vertical layouts.

### TabsList

<PropsTable name="TabsList" />

`TabsList` takes no props of its own — it's the styled `role="tablist"` container. Pass `class` to adjust layout (the recipe sets an inline flex row with a bordered card background).

### TabsTrigger

<PropsTable name="TabsTrigger" />

`value` is required and is the key that links a trigger to its panel. Set `disabled` to gate an individual tab.

### TabsContent

<PropsTable name="TabsContent" />

`value` is required and must match its trigger. By default a hidden panel is left in the DOM but inert; pass `force-mount` to keep it mounted unconditionally (useful when an inner component must preserve state or animate on its own).

## Accessibility

- The primitive emits the full WAI-ARIA tabs pattern: `TabsList` is `role="tablist"`, each `TabsTrigger` is `role="tab"` with `aria-selected` and `aria-controls`, and each `TabsContent` is `role="tabpanel"` with `aria-labelledby` pointing back at its trigger. The `value` you pass on a trigger and its content is what wires `aria-controls` ↔ `aria-labelledby` together — mismatched values break the relationship.
- **Keyboard:** <kbd>←</kbd>/<kbd>→</kbd> move between triggers (<kbd>↑</kbd>/<kbd>↓</kbd> when `orientation="vertical"`), <kbd>Home</kbd>/<kbd>End</kbd> jump to the first/last trigger, and the active panel is reachable with <kbd>Tab</kbd>. Disabled triggers are skipped.
- With the default `activation-mode="automatic"`, focusing a trigger activates it. Choose `activation-mode="manual"` when activation is costly so arrow keys only move focus and the user commits with <kbd>Enter</kbd> or <kbd>Space</kbd>.
- The roving tabindex keeps a single tab stop in the strip — arrow keys, not <kbd>Tab</kbd>, move between triggers, so the tab order stays short.
- Focus is visible only on `:focus-visible` (`ring-2 ring-ring` on both triggers and the active panel), so mouse clicks don't flash a ring while keyboard navigation does.
- Give the trigger label enough text to stand on its own — a screen reader announces it as "`label`, tab, selected, N of M." Don't rely on an icon alone; pair it with text or an `aria-label`.
