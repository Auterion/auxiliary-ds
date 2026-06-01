---
'@auxiliary/vue': minor
---

a11y (Phase 6.4 slice 9): add an opt-in `label` prop to **Checkbox** and **Switch**. A checkbox/switch has no visible text of its own, so without an associated `<Label for>` (or `aria-label`) it can ship nameless; `label` sets `aria-label` to close that gap, and is consumed (not leaked as a DOM attribute). Prefer a visible `<Label>` when there is one. Closes the highest-impact part of the §6.1 accessible-name backlog (RadioGroupItem/Avatar remain). Verified along the way that the Checkbox checked state is a glyph (shape cue, not color-only) and SelectSeparator is already `aria-hidden`.
