---
'@auxiliary/css': minor
---

Keyboard-visibility fixes in the recipes, each locked by a new gate:

- **Menu/listbox highlight**: `data-[highlighted]` items in dropdown-menu,
  select, and combobox now paint `bg-primary text-primary-foreground` (the
  native-menu convention) instead of the faint `bg-accent` tint, which
  measured 1.19–2.17:1 against the popover — invisible exactly where
  arrow-key users need it. Gated at ≥ 3:1 vs popover in all four themes.
- **Focus ring offset**: solid-fill focusables (button, checkbox, switch,
  tabs trigger, guarded-action) gain `ring-offset-2 ring-offset-background`.
  Without the gap the ring could vanish against a primary fill (sunlight's
  ring IS primary — black on black at 1.00:1). The gap's visibility is gated
  via background vs primary ≥ 3:1.
- New `recipes-a11y` test asserts the recipes actually carry these classes,
  so a recipe edit can't drop an affordance while the token gates stay green.
