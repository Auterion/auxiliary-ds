---
"@auxiliary/vue": minor
"@auxiliary/demo": patch
---

**Step 5c — Popover + Tooltip.** Anchored-floating pair, both backed by Reka UI.

New `@auxiliary/vue` exports:

- **`<Popover>`** / **`<PopoverTrigger>`** / **`<PopoverContent>`** — richer floating content (settings panels, filter forms, menu shells). `PopoverContent` accepts `side`, `align`, `sideOffset`, `alignOffset` for placement; styled with `bg-elevated` + `border-default` + `shadow-md`. Portal teleported, click-outside dismiss, Escape close.
- **`<TooltipProvider>`** — wraps the app once; manages delay/group state. Defaults: `delayDuration: 400ms`, `skipDelayDuration: 200ms`.
- **`<Tooltip>`** / **`<TooltipTrigger>`** / **`<TooltipContent>`** — hint text on hover/focus. Styled with `bg-accent` + `text-accent-fg` so it pops against any surface in any theme.

Both use the `as-child` slot pattern on triggers so any `<Button>` can serve as the anchor.

`apps/demo` — new "Floating UI" section demonstrating both, with a Popover containing nested `<Button>`s to verify focus mgmt inside the floating layer. The whole demo is wrapped in `<TooltipProvider>` so tooltips work everywhere.

Bundle impact: `@auxiliary/vue` 5.58 → 9.58 KB (wrappers only; Reka external). Demo 142 → 198 KB (Reka's Popper/Floating-UI runtime).
