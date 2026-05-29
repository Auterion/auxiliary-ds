---
'@auxiliary/css': minor
'@auxiliary/vue': minor
---

Phase 6.1 cleanup — form-control states + interaction feedback.

- **Validation (`invalid`):** `Input`, `Textarea`, `Select` (trigger), `Checkbox`, and `Switch` gain
  an `invalid` prop that sets `aria-invalid` and a destructive border/focus-ring. `RadioGroup`
  exposes `invalid` as `aria-invalid` on the group (pair with a field-level error message). The error
  message and `aria-describedby` stay in consumer markup — the prop adds the typed flag + styling a
  fallthrough attribute can't drive.
- **Shared `size` axis:** `Input`, `Textarea`, and `Select` accept `size` (`sm | md | lg`) drawn from
  the system size vocabulary, so dense layouts can shrink fields without hand-rolled classes. (Note:
  `size` shadows the rarely-used native character-width attribute, which is not exposed.)
- **Active/pressed feedback:** the `Button` recipe gains distinct `active:` states for all variants;
  `AlertBanner`'s action/dismiss buttons get a pressed background.
- **`Skeleton` `loading` prop** (default `true`): when `false`, renders the default slot instead of
  the shimmer, so a parent can swap placeholder → content without a `v-if` wrapper.

New recipe type exports: `InputVariants`, `TextareaVariants`, `SelectVariants`.
