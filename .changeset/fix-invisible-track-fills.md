---
'@auxiliary/css': patch
---

Fix controls whose fill vanished on the light/sunlight themes. The `slider` track and
`progress` track used `bg-background` (white on light), so the unfilled portion of a slider
and the empty portion of a progress bar were invisible — and the `switch` unchecked track was
`bg-background` with a white thumb, so the off-state pill nearly disappeared. Tracks now use
`bg-muted` and the switch off-state uses `bg-input`, so each reads as a visible filled element
against the page. Also syncs the components index (adds GuardedAction, Alert model,
CoordinateValue, Register) and cross-links the conformance page from the colors foundation.
