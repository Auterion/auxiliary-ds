---
'@auxiliary/vue': minor
---

**Breaking (pre-1.0):** `Input`'s `modelValue` narrows to `string` (was
`string | number`). The emit was always string-typed, so a number model
silently became a string after the first keystroke. For numeric values use
`NumberField`, which owns parsing, stepping, and min/max.
