---
'@auxiliary/css': minor
'@auxiliary/vue': minor
---

**Breaking (pre-1.0):** Badge variant vocabulary aligns with Button's.
`accent` → `primary` (it is the `bg-primary` treatment — same word, same
meaning as Button) and `default` → `neutral` (says what it looks like instead
of colliding with the defaultVariants concept). Final set:
`neutral | secondary | outline | primary`, default `neutral`.
