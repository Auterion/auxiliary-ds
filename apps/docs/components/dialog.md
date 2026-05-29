# Dialog

A modal overlay built on Reka UI's `Dialog` and styled by the `dialog` recipe. The family is a compound set — `Dialog` provides state, `DialogTrigger` opens it, and `DialogContent` portals a focus-trapped panel with `DialogTitle`, `DialogDescription`, and `DialogClose` inside.

<div class="auxiliary-demo vp-raw">
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="secondary">Confirm abort</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogTitle>Abort mission?</DialogTitle>
      <DialogDescription>
        This will terminate the active flight plan and return the vehicle to home. The aircraft will not resume the mission automatically.
      </DialogDescription>
      <div style="display: flex; justify-content: flex-end; gap: 0.5rem; padding-top: 0.5rem;">
        <DialogClose as-child>
          <Button variant="ghost" size="sm">Cancel</Button>
        </DialogClose>
        <DialogClose as-child>
          <Button variant="danger" size="sm">Abort</Button>
        </DialogClose>
      </div>
    </DialogContent>
  </Dialog>
</div>

## When to use

- For a **decision the user must resolve before continuing** — confirming a destructive action, acknowledging a warning, completing a short focused form.
- For **destructive confirmation** — pair the danger action with a `DialogTitle` that states the consequence ("Abort mission?"), not a vague "Are you sure?".
- When the task is **self-contained and brief** — a dialog steals focus from the whole page, so the payoff has to justify the interruption.

## When *not* to use

- For **non-blocking, contextual UI** — a menu, a date picker, a small form anchored to a control. Reach for `<Popover>` or `<DropdownMenu>`; they don't trap focus or dim the page.
- For **transient, dismissable feedback** — "Saved", "Upload failed". That's a `<Toast>`, which announces itself and disappears on its own.
- For **long or multi-step flows** — if the content scrolls or spans several screens, it isn't a dialog anymore. Use a dedicated route or page.
- For **passive information that doesn't require a decision** — an inline `<AlertBanner>` keeps the user in context instead of blocking them.

## Examples

### Destructive confirmation

The default composition: a trigger, a titled panel, a description, and two close buttons. `DialogClose` with `as-child` wraps a `<Button>` so the action both runs *and* dismisses the dialog.

<div class="auxiliary-demo vp-raw">
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="danger">Delete waypoint</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogTitle>Delete waypoint?</DialogTitle>
      <DialogDescription>
        Waypoint 4 will be removed from the active route. This cannot be undone.
      </DialogDescription>
      <div style="display: flex; justify-content: flex-end; gap: 0.5rem; padding-top: 0.5rem;">
        <DialogClose as-child>
          <Button variant="ghost" size="sm">Cancel</Button>
        </DialogClose>
        <DialogClose as-child>
          <Button variant="danger" size="sm">Delete</Button>
        </DialogClose>
      </div>
    </DialogContent>
  </Dialog>
</div>

```vue
<Dialog>
  <DialogTrigger as-child>
    <Button variant="danger">Delete waypoint</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogTitle>Delete waypoint?</DialogTitle>
    <DialogDescription>
      Waypoint 4 will be removed from the active route. This cannot be undone.
    </DialogDescription>
    <div class="flex justify-end gap-2 pt-2">
      <DialogClose as-child>
        <Button variant="ghost" size="sm">Cancel</Button>
      </DialogClose>
      <DialogClose as-child>
        <Button variant="danger" size="sm">Delete</Button>
      </DialogClose>
    </div>
  </DialogContent>
</Dialog>
```

### Open by default

`defaultOpen` mounts the dialog already open without taking control of its state — Reka UI still manages opening and closing from there. Useful for onboarding moments, or for a static demo where you want the panel visible.

<div class="auxiliary-demo vp-raw">
  <Dialog :default-open="true">
    <DialogTrigger as-child>
      <Button variant="secondary">Pre-flight check</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogTitle>Pre-flight checklist</DialogTitle>
      <DialogDescription>
        Confirm GPS lock, battery level, and clear airspace before arming the vehicle.
      </DialogDescription>
      <div style="display: flex; justify-content: flex-end; gap: 0.5rem; padding-top: 0.5rem;">
        <DialogClose as-child>
          <Button variant="primary" size="sm">Acknowledge</Button>
        </DialogClose>
      </div>
    </DialogContent>
  </Dialog>
</div>

```vue
<Dialog :default-open="true">
  <DialogTrigger as-child>
    <Button variant="secondary">Pre-flight check</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogTitle>Pre-flight checklist</DialogTitle>
    <DialogDescription>
      Confirm GPS lock, battery level, and clear airspace before arming the vehicle.
    </DialogDescription>
    <div class="flex justify-end gap-2 pt-2">
      <DialogClose as-child>
        <Button variant="primary" size="sm">Acknowledge</Button>
      </DialogClose>
    </div>
  </DialogContent>
</Dialog>
```

### Controlled open state

Bind `v-model:open` when the *parent* owns whether the dialog is shown — for example to open it programmatically after an async event, or to keep it open while a save is in flight. The `update:open` event fires on every Reka-driven change (Escape, click-outside, close button), so your state stays in sync.

```vue
<script setup>
import { ref } from 'vue';
const open = ref(false);
</script>

<template>
  <Button variant="secondary" @click="open = true">Edit geofence</Button>

  <Dialog v-model:open="open">
    <DialogContent>
      <DialogTitle>Geofence radius</DialogTitle>
      <DialogDescription>
        Set the maximum distance the vehicle may travel from home.
      </DialogDescription>
      <div class="flex justify-end gap-2 pt-2">
        <DialogClose as-child>
          <Button variant="ghost" size="sm">Cancel</Button>
        </DialogClose>
        <Button variant="primary" size="sm" @click="open = false">Save</Button>
      </div>
    </DialogContent>
  </Dialog>
</template>
```

When the dialog is controlled you can drop `DialogTrigger` entirely and open it from any control — here a plain `@click` sets `open` to `true`.

### Non-modal dialog

`modal` defaults to `true` (the page behind is inert and hidden from screen readers). Set `:modal="false"` for a panel the user can interact *around* — outside clicks no longer dismiss it, and background content stays in the accessibility tree.

```vue
<Dialog :modal="false">
  <DialogTrigger as-child>
    <Button variant="ghost">Telemetry details</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogTitle>Live telemetry</DialogTitle>
    <DialogDescription>
      This panel stays open while you keep working with the map behind it.
    </DialogDescription>
  </DialogContent>
</Dialog>
```

Reach for non-modal only when the user genuinely needs the background — for a true blocking decision, keep the default modal behavior.

## Props

### Dialog

<PropsTable name="Dialog" />

### DialogTrigger

<PropsTable name="DialogTrigger" />

### DialogContent

<PropsTable name="DialogContent" />

### DialogTitle

<PropsTable name="DialogTitle" />

### DialogDescription

<PropsTable name="DialogDescription" />

### DialogClose

<PropsTable name="DialogClose" />

`Dialog` forwards the full Reka UI `DialogRoot` prop and emit surface; the table above covers the ones you'll reach for. `DialogContent` and the text parts forward `class` so you can extend the recipe with `cn()`-friendly utilities.

## Accessibility

Almost everything here comes from Reka UI's headless `Dialog` — Auxiliary only supplies the styling and the always-present close affordance.

- **Roles and labelling.** `DialogContent` renders `role="dialog"` with `aria-modal="true"` when modal. `DialogTitle` is wired as `aria-labelledby` and `DialogDescription` as `aria-describedby` automatically — always include a `DialogTitle` so the dialog has an accessible name.
- **Focus management.** Opening moves focus into the panel and traps it there; closing returns focus to the element that opened the dialog (the `DialogTrigger`). This is the contract that makes a dialog keyboard-usable.
- **Keyboard.** `Escape` closes the dialog, `Tab`/`Shift+Tab` cycle within the focus trap, and the built-in close button is reachable in tab order.
- **The close button is built in.** `DialogContent` always renders an icon close button in the top-right with `aria-label="Close"`; the `<svg>` is `aria-hidden`. You don't need to add your own — add explicit `DialogClose` buttons only for labelled actions like "Cancel".
- **Modality.** With `modal` (the default), background content is inert and hidden from screen readers. With `:modal="false"`, the background stays in the accessibility tree and outside clicks don't dismiss — only use it when the user must keep interacting with what's behind.
- **Reduced motion.** The overlay fades and the recipe's enter/exit animations are driven by `data-[state]` transitions; respect the user's `prefers-reduced-motion` setting at the app level so the open/close transition doesn't trigger motion sensitivity.
