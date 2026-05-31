# Input & touch

Auxiliary treats **input modality** as a first-class axis, the same way it treats theme and register. A control system built only for a mouse fails in the field: Auterion Mission Control runs on rugged **touch tablets and handheld controllers**, where a 28-pixel target tuned for a cursor is unusable and unsafe. So the system carries a **touch-target floor** that activates on coarse pointers and **wins over** the operational register's density.

## The three axes

| Axis | Attribute / query | Controls |
|---|---|---|
| **Theme** | `[data-theme]` / `prefers-color-scheme` | color (light · dark · sunlight · darknight) |
| **Register** | `[data-register]` | non-color density (control height, radius, motion — expressive ↔ operational) |
| **Input** | `[data-input]` / `@media (pointer: coarse)` | the **touch-target floor** |

They are orthogonal and compose freely. A surface can be `darknight` + `operational` + coarse-pointer at once: dark and dense, but with every control floored to a safe touch size.

## How it works

A single token, `--target-min` (**44px** — the [WCAG 2.5.5](https://www.w3.org/WAI/WCAG22/Understanding/target-size-enhanced.html) AAA / MIL-STD-1472 target), is the floor. A toggle variable `--target-floor` is `0px` by default and rises to `--target-min` on a coarse pointer:

```css
@media (pointer: coarse) {
  :root { --target-floor: var(--target-min); }   /* detect the device */
}
[data-input="coarse"] { --target-floor: var(--target-min); }  /* override: force on  */
[data-input="fine"]   { --target-floor: 0px; }                /* override: force off */
```

Recipes size controls through `max()`, so the floor composes with whatever height the register resolved:

```
height: max(var(--control-height-md), var(--target-floor))
```

- **Fine pointer (mouse):** `--target-floor` is `0`, so `max()` returns the register height — operational stays a tight 28–36px.
- **Coarse pointer (touch):** `--target-floor` is `44px`, so any control shorter than 44px is floored up. The touch floor **wins over register density** — and because it's a `max()`, a control already taller than 44px keeps its height.

Because the floor is a `max()` against a separate toggle (not an override of the height var itself), it resolves correctly at any depth in the tree — even when `<Register>` sets a denser height on a mid-tree subtree.

## Detection vs. override

- **Default — detection.** `@media (pointer: coarse)` adapts automatically. A phone, tablet, or touch-screen laptop gets the floor; a desktop with a mouse does not. Nothing to author.
- **Override — `[data-input]`.** Set the attribute when you *know* the deployment and shouldn't trust detection: `[data-input="coarse"]` for a fixed field tablet or kiosk, `[data-input="fine"]` for a known desk station. It mirrors how `[data-theme]` overrides `prefers-color-scheme`.

```html
<!-- A rugged field tablet: force touch targets regardless of what the OS reports -->
<body data-theme="darknight" data-register="operational" data-input="coarse">
```

## Responsive & breakpoints

Touch sizing is about the *pointer*, not the *viewport* — they're independent. A large touchscreen is still coarse; a small window on a laptop is still fine. For viewport-driven layout, use the breakpoint tokens (see [Layering & breakpoints](/foundations/layering)) and Tailwind's responsive variants. Design **mobile-first**: start from the single-column, touch-floored case and add `md:`/`lg:` layout as space allows.

## Scope & gate

- The floor currently applies to controls sized by `--control-height-*` (Button, Input, Select, Textarea, NumberField, Combobox, GuardedAction). Box-sized controls (Checkbox, Switch) and icon-only hit areas expand their touch target separately — tracked as follow-up.
- A CI gate (`packages/css/test/touch-target-floor.test.ts`) asserts both halves: the generated CSS raises `--target-floor` on coarse pointer, and **every** recipe `--control-height` usage is wrapped in the `max(…, --target-floor)` floor — so a new control can't silently ship below 44px on a touch device.

> Status against [Conformance](/foundations/conformance): this moves WCAG 2.5.5 (Target Size, Enhanced) from a documented aspiration toward a built-in guarantee for floored controls.
