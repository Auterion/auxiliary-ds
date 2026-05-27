---
"@auxiliary/vue": minor
"@auxiliary/demo": patch
---

**Step 5d — DropdownMenu + Select.** Menu/combobox patterns, both backed by Reka UI.

New `@auxiliary/vue` exports:

**DropdownMenu** — action menus triggered by a button.

- `<DropdownMenu>` — root, supports `v-model:open`, `default-open`, `modal`
- `<DropdownMenuTrigger>` — `as-child` slot for `<Button>` composition
- `<DropdownMenuContent>` — portaled, `bg-elevated` + `border-default` + `shadow-md`. Positions via `side` / `align` / `sideOffset`
- `<DropdownMenuItem>` — emits `select` event, `disabled` prop, highlight on hover/focus
- `<DropdownMenuLabel>` — uppercase muted section header
- `<DropdownMenuSeparator>` — top-border hairline divider

**Select** — single-value selection from a fixed list.

- `<Select>` — root, supports `v-model`, `default-value`, `name`, `disabled`. Emits `update:modelValue`
- `<SelectTrigger>` — styled like an input (`bg-input` + `border-input` + `ring-focus`), with a built-in chevron icon
- `<SelectValue>` — shows the current selection (or `placeholder` when none)
- `<SelectContent>` — portaled, popper-positioned, width-matched to trigger via `var(--reka-select-trigger-width)`
- `<SelectItem>` — with a left-side checkmark indicator that appears on the active item
- `<SelectSeparator>` — divider

Both: full keyboard nav (↑/↓, Home/End, type-ahead), ARIA-correct, portal-teleported so they escape parent overflow / z-index. Both use `as-child` for trigger composition.

`apps/demo` — new "Menus" section showing a `<DropdownMenu>` ("Mission actions" with sub-labels, disabled item, separator) and a `<Select>` for vehicle mode (Manual/Auto/Loiter/RTL/Land) with `v-model` echo.

Bundle impact: `@auxiliary/vue` 9.58 → 17.21 KB (wrappers only; Reka external). Demo 198 → 256 KB (Reka's menu/select primitives + dependencies).
