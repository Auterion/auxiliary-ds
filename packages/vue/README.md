# @auxiliary/vue

Vue 3 components for Auxiliary, built on [Reka UI](https://reka-ui.com/) and styled via [@auxiliary/css](../css/README.md).

## Status

Scaffold only. Step 5 of the build plan lands the first three primitives — Button, Input, Label — as copy-and-own source (not a dependency) ported from shadcn-vue with `class-variance-authority` swapped for `@auxiliary/css/recipes/*`.

## Discipline

- Components consume tokens **only** through CSS variables emitted by `@theme`. No `@auxiliary/tokens` TS imports at runtime.
- Reka UI carries ARIA, focus, keyboard. Auxiliary owns styling and the prop API.
- Pre-1.0: no compat shims, no deprecation layers.
