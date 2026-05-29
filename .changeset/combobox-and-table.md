---
'@auxiliary/css': minor
'@auxiliary/vue': minor
---

Add two primitives from the Phase 6.1 backlog: `Combobox` and `Table`.

**Combobox** — type-ahead select on Reka UI's headless `Combobox`, for large option sets where
`Select` is too slow to scan. Parts: `Combobox`, `ComboboxInput`, `ComboboxContent`, `ComboboxItem`,
`ComboboxEmpty`, `ComboboxSeparator`. `ComboboxInput` shares the form-control `size` + `invalid`
vocabulary and forwards `$attrs` (aria-label / id) onto the `role="combobox"` input. New `combobox`
recipe + `ComboboxVariants`.

**Table** — composable, styled semantic table parts: `Table`, `TableHeader`, `TableBody`,
`TableRow`, `TableHead`, `TableCell`, `TableCaption`. Owns structure/surface/density; sorting and
row selection are wired by the consumer through the slots (kept out of the primitive by design).
`TableHeader` has a `sticky` option; `TableHead` defaults to `scope="col"`. New `table` recipe +
`TableVariants`.

13 new tree-shakeable subpaths; docs pages, nav, and overview entries for both.
