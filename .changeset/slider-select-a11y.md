---
"@auxiliary/vue": patch
---

Accessibility: `Slider` and `Select` can now be given an accessible name.

- **Slider** — `aria-label` / `aria-labelledby` are now routed to the `role="slider"` thumb instead
  of landing on the role-less root element (which was an invalid-ARIA placement). Pass `aria-label`
  on `<Slider>` as usual.
- **Select** — `<SelectContent>` now forwards `aria-label` / `aria-labelledby` onto the
  `role="listbox"` element, so the listbox has an accessible name.

Both were surfaced by the Phase 1 a11y test gate and are now covered by passing (no longer skipped) tests.
