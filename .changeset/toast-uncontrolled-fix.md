---
'@auxiliary/vue': patch
---

Fix Toast uncontrolled mode: the wrapper hand-bound `:open`, so Vue's boolean
casting turned an absent `open` into `false` and forced Reka into
controlled-closed mode — `<Toast default-open>` and duration-driven toasts could
never display. Toast now forwards props/emits via `useForwardPropsEmits` like
every other Reka wrapper, and accepts the full `ToastRootProps` surface.
