---
"@auxiliary/vue": minor
"@auxiliary/demo": patch
---

**Step 5b — Dialog (earns the Reka UI dependency).**

This is the first primitive that genuinely needs headless behavior — focus trap, ARIA dialog semantics, scroll lock, Escape-to-close, click-outside, and portal teleport. Re-implementing those correctly would be hundreds of lines; Reka UI provides them out of the box. We wrap Reka's primitives with our styling and prop API.

New components (all in `@auxiliary/vue`):

- `<Dialog>` — `DialogRoot` with controlled (`v-model:open`) and uncontrolled (`default-open`) variants
- `<DialogTrigger>` — wraps `DialogTrigger`, supports `as-child` for composition with `<Button>`
- `<DialogContent>` — bundled composite: `DialogPortal` + `DialogOverlay` (canvas-tinted backdrop with blur) + `DialogContent` (centered card, our `bg-surface` + `border-default` + `shadow-lg`) + a built-in close `<button>` (top-right X)
- `<DialogTitle>` — `text-lg font-medium text-primary`
- `<DialogDescription>` — `text-sm text-muted`
- `<DialogClose>` — bare `DialogClose`, `as-child` for triggering close from any button

Usage:

```vue
<Dialog>
  <DialogTrigger as-child>
    <Button intent="secondary">Confirm abort</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogTitle>Abort mission?</DialogTitle>
    <DialogDescription>This will terminate the flight plan…</DialogDescription>
    <DialogClose as-child><Button intent="danger">Abort</Button></DialogClose>
  </DialogContent>
</Dialog>
```

`@auxiliary/demo` — new "Dialog" section showing a confirm-abort mission flow. Same demo doubles as the Reka focus-trap + portal smoke test.

`pnpm-workspace.yaml` — allow `vue-demi` postinstall (Reka transitive dep).
