<script setup>
import { ref } from 'vue';

// Drives the interactive demo in "Driving toasts from state" below.
const toastOpen = ref(false);
const toastVariant = ref('advisory');

const toastContent = {
  advisory: { title: 'Telemetry updated', body: '3 new sensor readings within the last 10s.' },
  nominal:  { title: 'Mission saved',     body: 'Waypoints stored to local mission cache.' },
  alarm:    { title: 'Link lost',         body: 'No telemetry packets received for over 3s. Check radio link.' },
};

function showToast(variant) {
  toastVariant.value = variant;
  toastOpen.value = false;
  // re-open on the next tick so repeat clicks restart the dismiss timer
  setTimeout(() => (toastOpen.value = true), 50);
}
</script>

# Toast

A transient, non-modal notification family built on Reka UI's Toast primitives and styled by the `toast` recipe. A `<ToastProvider>` manages timing and swipe behavior, a single `<ToastViewport>` anchors where toasts stack, and each `<Toast>` composes a title, description, and optional action/close controls.

<div class="auxiliary-demo vp-raw">
  <ToastProvider :duration="1000000">
    <Toast :default-open="true" :duration="1000000">
      <div>
        <ToastTitle>Telemetry updated</ToastTitle>
        <ToastDescription>3 new sensor readings within the last 10s.</ToastDescription>
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.25rem;">
        <ToastAction alt-text="View details" as-child>
          <Button variant="ghost" size="sm">View</Button>
        </ToastAction>
        <ToastClose>Close</ToastClose>
      </div>
    </Toast>
    <ToastViewport />
  </ToastProvider>
</div>

## When to use

- For **transient confirmation** of an action that already happened — "Mission saved", "Waypoints uploaded", "Settings applied". The user doesn't need to act; the toast just confirms and dismisses itself.
- For **asynchronous results** that arrive after the user moved on — an export finished, a background sync completed, a connection re-established.
- When a change should **announce itself** to assistive technology without stealing focus. Toasts live in an ARIA live region, so the message is read without interrupting the current task.
- For **time-critical operational alerts** that must interrupt — link lost, geofence breach — pair the toast with a `<StatusBadge>` so the state persists in the UI after the toast auto-dismisses.

## When *not* to use

- For **content the user must read or act on before continuing** — use `<Dialog>`. A toast that auto-dismisses is the wrong place for a required decision.
- For **persistent system state** that stays true until something changes — link health, battery level, vehicle mode. That's `<StatusBadge>` or `<AlertBanner>`, not a toast that vanishes after a few seconds.
- For **validation errors tied to a specific field** — surface those inline next to the input, where the eye already is.
- As a **log or history surface**. Toasts are ephemeral by design; if a user needs to scroll back through past events, render a list, not a stack of toasts.

## Examples

### Basic notification

Wrap the app once in a `<ToastProvider>`, render a single `<ToastViewport>`, and drive each `<Toast>` with `v-model:open`. The provider's `duration` controls how long a toast lingers before auto-dismissing.

<div class="auxiliary-demo vp-raw">
  <ToastProvider :duration="1000000">
    <Toast :default-open="true" :duration="1000000">
      <div>
        <ToastTitle>Mission saved</ToastTitle>
        <ToastDescription>Waypoints stored to local mission cache.</ToastDescription>
      </div>
      <ToastClose />
    </Toast>
    <ToastViewport />
  </ToastProvider>
</div>

```vue
<ToastProvider :duration="4000">
  <Toast v-model:open="open">
    <div>
      <ToastTitle>Mission saved</ToastTitle>
      <ToastDescription>Waypoints stored to local mission cache.</ToastDescription>
    </div>
    <ToastClose />
  </Toast>
  <ToastViewport />
</ToastProvider>
```

`<ToastClose>` renders a built-in × glyph when its slot is empty, and already carries `aria-label="Close"`.

### With an action

`<ToastAction>` requires an `alt-text` — the textual equivalent screen readers announce in place of the button's visuals. Use `as-child` to project a real `<Button>` as the action so it inherits the recipe styling.

<div class="auxiliary-demo vp-raw">
  <ToastProvider :duration="1000000">
    <Toast :default-open="true" :duration="1000000">
      <div>
        <ToastTitle>Link lost</ToastTitle>
        <ToastDescription>No telemetry packets received for over 3s. Check radio link.</ToastDescription>
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.25rem;">
        <ToastAction alt-text="Open diagnostics" as-child>
          <Button variant="ghost" size="sm">Diagnose</Button>
        </ToastAction>
        <ToastClose>Dismiss</ToastClose>
      </div>
    </Toast>
    <ToastViewport />
  </ToastProvider>
</div>

```vue
<ToastProvider :duration="6000">
  <Toast v-model:open="open">
    <div>
      <ToastTitle>Link lost</ToastTitle>
      <ToastDescription>No telemetry packets received for over 3s. Check radio link.</ToastDescription>
    </div>
    <div class="flex flex-col gap-1">
      <ToastAction alt-text="Open diagnostics" as-child>
        <Button variant="ghost" size="sm">Diagnose</Button>
      </ToastAction>
      <ToastClose>Dismiss</ToastClose>
    </div>
  </Toast>
  <ToastViewport />
</ToastProvider>
```

### Per-toast duration

`duration` on the provider sets the default for every toast; `duration` on an individual `<Toast>` overrides it. Set a longer duration for messages that warrant a second read, or shorter for low-signal confirmations.

<div class="auxiliary-demo vp-raw">
  <ToastProvider :duration="1000000">
    <Toast :default-open="true" :duration="1000000">
      <div>
        <ToastTitle>Export complete</ToastTitle>
        <ToastDescription>This toast carries its own duration, independent of the provider default.</ToastDescription>
      </div>
      <ToastClose />
    </Toast>
    <ToastViewport />
  </ToastProvider>
</div>

```vue
<ToastProvider :duration="4000">
  <!-- This one stays for 10s, overriding the 4s provider default -->
  <Toast v-model:open="open" :duration="10000">
    <div>
      <ToastTitle>Export complete</ToastTitle>
      <ToastDescription>This toast carries its own duration.</ToastDescription>
    </div>
    <ToastClose />
  </Toast>
  <ToastViewport />
</ToastProvider>
```

### Driving toasts from state

In a real app the `<Toast>` markup is static; you toggle its `open` model from an event handler. Re-firing the same toast is a flip-to-`false`-then-`true` so the timer restarts — and you can swap the content from the same handler to reuse one `<Toast>` for several messages.

<div class="auxiliary-demo vp-raw">
  <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
    <Button variant="ghost" size="sm" @click="showToast('advisory')">Show advisory</Button>
    <Button variant="secondary" size="sm" @click="showToast('nominal')">Show nominal</Button>
    <Button variant="danger" size="sm" @click="showToast('alarm')">Show alarm</Button>
  </div>
  <ToastProvider :duration="4000">
    <Toast v-model:open="toastOpen">
      <div>
        <ToastTitle>{{ toastContent[toastVariant].title }}</ToastTitle>
        <ToastDescription>{{ toastContent[toastVariant].body }}</ToastDescription>
      </div>
      <div style="display: flex; flex-direction: column; gap: 0.25rem;">
        <ToastAction alt-text="View details" as-child>
          <Button variant="ghost" size="sm">View</Button>
        </ToastAction>
        <ToastClose>Close</ToastClose>
      </div>
    </Toast>
    <ToastViewport />
  </ToastProvider>
</div>

```vue
<script setup>
import { ref } from 'vue';

const open = ref(false);
const variant = ref('advisory');

const content = {
  advisory: { title: 'Telemetry updated', body: '3 new sensor readings within the last 10s.' },
  nominal:  { title: 'Mission saved',     body: 'Waypoints stored to local mission cache.' },
  alarm:    { title: 'Link lost',         body: 'No telemetry packets received for over 3s. Check radio link.' },
};

function showToast(v) {
  variant.value = v;
  open.value = false;                          // flip off…
  setTimeout(() => (open.value = true), 50);   // …then on, so the dismiss timer restarts
}
</script>

<template>
  <Button variant="ghost" size="sm" @click="showToast('advisory')">Show advisory</Button>
  <Button variant="secondary" size="sm" @click="showToast('nominal')">Show nominal</Button>
  <Button variant="danger" size="sm" @click="showToast('alarm')">Show alarm</Button>

  <ToastProvider :duration="4000">
    <Toast v-model:open="open">
      <div>
        <ToastTitle>{{ content[variant].title }}</ToastTitle>
        <ToastDescription>{{ content[variant].body }}</ToastDescription>
      </div>
      <ToastClose />
    </Toast>
    <ToastViewport />
  </ToastProvider>
</template>
```

## Props

### ToastProvider

<PropsTable name="ToastProvider" />

### Toast

<PropsTable name="Toast" />

`<Toast>` emits the full Reka UI lifecycle set — `update:open`, `escapeKeyDown`, `pause`/`resume` (fired when the pointer enters/leaves and the dismiss timer is held), and the `swipeStart` / `swipeMove` / `swipeCancel` / `swipeEnd` gesture events. Use `v-model:open` for the common case.

### ToastViewport

<PropsTable name="ToastViewport" />

Takes no props of its own — render exactly one per app. It's the fixed, bottom-right container the recipe positions and into which every toast portals.

### ToastTitle

<PropsTable name="ToastTitle" />

### ToastDescription

<PropsTable name="ToastDescription" />

### ToastAction

<PropsTable name="ToastAction" />

### ToastClose

<PropsTable name="ToastClose" />

## Accessibility

- The provider wraps everything in an ARIA live region with a `label` (default `"Notification"`). When a toast opens, its content is announced without moving keyboard focus — the user's current task isn't interrupted.
- `type` on `<Toast>` maps to the politeness of that announcement. `"foreground"` (assertive) is for messages that warrant immediate attention; `"background"` (polite) waits for a natural pause. Default to `"background"` and reserve `"foreground"` for genuinely interruptive alerts.
- **`alt-text` on `<ToastAction>` is mandatory.** It's the accessible label a screen reader announces in place of the button's visuals, and it should describe the action as a complete instruction ("Open diagnostics", "Undo upload").
- `<ToastClose>` ships with `aria-label="Close"` and renders a decorative, `aria-hidden` × glyph when its slot is empty, so an icon-only close button is still announced.
- **Keyboard:** `Escape` dismisses the toast (emitting `escapeKeyDown`), and the viewport participates in focus order so keyboard users can `Tab` to the action and close controls. Hovering or focusing a toast pauses its auto-dismiss timer (`pause` / `resume`), so a message can't vanish while the user is reading or reaching for its button.
- **Don't rely on color alone.** Convey severity in the `<ToastTitle>` / `<ToastDescription>` text, not just a fill — a toast that is meaningful only because it's red fails WCAG 1.4.1. For operational severity, pair the wording with a persistent `<StatusBadge>` from the regulated alarm hierarchy.
- The focus ring on the toast root and close control is `ring-2 ring-ring`, shown only on `:focus-visible`.
