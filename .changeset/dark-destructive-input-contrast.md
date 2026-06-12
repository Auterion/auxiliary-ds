---
'@auxiliary/tokens': minor
---

Contrast fixes for state indicators (WCAG 2.2 SC 1.4.11), each locked by a new
gate:

- **Dark `destructive`** moves red.800 → red.600 with a white foreground. The
  old value sat at 2.38:1 against the background and 2.12:1 against cards —
  below the 3:1 floor — while being the invalid-state border/ring on every
  form control. New gate: destructive vs background and card ≥ 3:1 in all
  four themes.
- **`input`** (the only boundary of text fields) moves to ink.500 in light and
  dark (was 1.30/1.34:1 vs background; now ≥ 4.1:1). The structural-contrast
  gate now covers input in all four themes; decorative `border` stays subtle
  in light/dark by design. Side effect: the unchecked switch track (`bg-input`)
  is now clearly visible in light/dark.
