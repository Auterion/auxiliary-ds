---
"@auxiliary/vue": minor
"@auxiliary/demo": patch
---

**@auxiliary/vue** — first three primitives (Step 5):

- `<Button>` — wraps `<button>` with the `button` recipe from `@auxiliary/css/recipes`. Props: `intent` (primary/secondary/ghost/danger), `size` (sm/md/lg), `loading`, `disabled`, `type`.
- `<Input>` — wraps `<input>` with our `bg-input`/`border-input` utilities and `ring-focus`. `v-model` support; props: `type`, `placeholder`, `disabled`, `id`.
- `<Label>` — wraps `<label>` with `text-sm font-medium text-secondary`. Prop: `for`.

Total source: 65 lines across three SFCs. No Reka UI dependency — these primitives don't need headless behavior (native elements handle a11y). Reka enters in Step 5b when the first composite (Dialog) earns it.

Build wired with Vite library mode + `vue-tsc` for declaration emit; consumers `import { Button, Input, Label } from '@auxiliary/vue'`.

**@auxiliary/demo** — updated:

- Button matrix now uses `<Button>` instead of raw `<button>` + recipe class strings.
- New "Form composition" section: `<Label>` + `<Input>` + `<Button>` in a real form layout with `v-model` echo so reviewers can see two-way binding working live.
