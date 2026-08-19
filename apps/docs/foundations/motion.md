<script setup>
import { ref } from 'vue';
const on = ref(false);
const rungs = [
  ['fast', '--duration-fast', '120ms', '80ms'],
  ['base', '--duration-base', '200ms', '120ms'],
  ['slow', '--duration-slow', '320ms', '200ms'],
];
</script>

# Motion

Motion in Auxiliary is a **signal, not a flourish**. In an operational surface a panel appearing isn't a chance for a transition — it's a *data event*, and it must read instantly. So motion is short, purposeful, and tied to tokens; it earns its place on expressive surfaces and gets out of the way on operational ones. And it always yields to the user: `prefers-reduced-motion` wins over everything.

## The tokens

Two scales, both framework-agnostic and register-aware.

**Duration** — three rungs. The operational register shortens each (a state change still reads, but there's no dwell); the values resolve automatically from `[data-register]`, you just use the token.

<div class="auxiliary-demo vp-raw" style="flex-direction:column; align-items:stretch; gap:1rem;">
  <div><Button size="sm" @click="on = !on">{{ on ? 'Reset' : 'Play' }}</Button></div>
  <div style="display:flex; flex-direction:column; gap:0.625rem;">
    <div v-for="r in rungs" :key="r[0]" style="display:flex; align-items:center; gap:0.75rem;">
      <code style="width:3rem; font-size:0.8125rem;">{{ r[0] }}</code>
      <div style="flex:1; height:1.5rem; background:var(--muted); border-radius:0.375rem; position:relative;">
        <div :style="{ position:'absolute', top:'0.25rem', left: on ? 'calc(100% - 1.25rem)' : '0.25rem', width:'1rem', height:'1rem', borderRadius:'0.25rem', background:'var(--primary)', transition: 'left var(' + r[1] + ') var(--ease-out)' }"></div>
      </div>
    </div>
  </div>
</div>

| Token | Expressive | Operational | Use for |
|---|---|---|---|
| `--duration-fast` | `120ms` | `80ms` | Hovers, presses, small state flips (checkbox, switch) |
| `--duration-base` | `200ms` | `120ms` | The default — dropdowns, popovers, tabs, most transitions |
| `--duration-slow` | `320ms` | `200ms` | Larger surfaces entering — dialogs, drawers, sheets |

`--default-transition-duration` is wired to `--duration-base`, so Tailwind's bare `transition-*` utilities pick up the register-correct default for free.

**Easing** — two curves. Default to `ease-out`: motion that's quick to start and settles gently, so a UI element feels like it *arrives* rather than drifts.

| Token | Curve | Use for |
|---|---|---|
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | Enters and the common case — decisive, settles softly |
| `--ease-in-out` | `cubic-bezier(0.65, 0, 0.35, 1)` | Symmetric moves — something that travels from A to B |

```css
/* Use the tokens, not magic numbers — they flex by register automatically. */
transition: transform var(--duration-base) var(--ease-out);
```

## The purpose model

Duration is chosen by **what the motion is for**, not by taste:

- **Micro-feedback ≤ 150 ms** — hovers, presses, toggles. `fast`. Confirms the input happened; anything longer feels laggy.
- **Surface transitions** — menus, popovers, dialogs entering/leaving. `base`/`slow`. Orients the eye to where content came from.
- **Flight-critical path: 0–80 ms, effectively instant.** A vehicle status flip, an alarm appearing, a telemetry value updating — these must *not* wait on a transition. Animate the affordance (a color/border change is visible), never delay the information. This is the operational register's whole point.
- **Expressive earns its motion.** On marketing/brand surfaces, purposeful animation that communicates scale or system behaviour is welcome — but never decorative parallax that serves only itself.

## Named animations

Transitions cover state changes on something already on screen. Entering and leaving need
keyframes, and those are **named in the layer, not composed at the call site**:

| Utility | Used by | Built from |
| --- | --- | --- |
| `animate-fade-in` / `animate-fade-out` | dialog scrim | `duration-fast` · `ease-out` |
| `animate-accordion-down` / `animate-accordion-up` | accordion panel | `duration-base` · `ease-out` |

Duration and easing reach them through `var()`, so they shorten under the operational
register exactly as transitions do, and `prefers-reduced-motion` still collapses them.

The deliberate omission is the shadcn/radix vocabulary — `animate-in` composed with
`fade-in-0` and `slide-in-from-top-2` at the point of use. That is a second motion system
assembled per call site, which is the thing one named ladder per axis exists to prevent.
Adding a behaviour means naming an animation here, not stacking three utilities in a
recipe.

::: warning A dropped animation class is silent
Those five shadcn names sat in `accordion.ts` and `dialog.ts` for months while
`tw-animate-css` was never a dependency. An unmatched Tailwind class produces no rule, no
warning and no error — so the accordion had never slid and the scrim had never faded, and
everything looked fine. The component-schema build now fails on a class that generates no
CSS, which is how it was found.
:::

## Register vs. reduced-motion — two different things

These are independent and both can suppress motion; don't conflate them.

- **Register motion** (`[data-register="operational"]`) is a **design** choice: operational surfaces are calmer and faster *by intent*. It shortens durations; it doesn't zero them.
- **`prefers-reduced-motion`** is an **accessibility** override the user (or OS) asks for. Auxiliary honors it globally: a single unlayered, `!important` rule collapses all durations to ~0 and stops looping, so a state-bearing change is never hidden behind or obscured by motion. It overrides Tailwind's `transition-*`/`animate-*` utilities regardless of cascade layer, and a gate (`reduced-motion.test.ts`) keeps it in place.

> **The user always wins.** When `prefers-reduced-motion: reduce` is set, motion stops — in every theme and register. Register can make motion shorter; only the user can turn it off. (Try it: with reduced motion on, the Play demo above snaps instead of sliding.)

## Do / don't

- **Do** animate the *affordance* of a state change (color, border, icon) — instantly — and let the data update without delay.
- **Do** use `ease-out` and a token duration; reach for `slow` only when a large surface enters.
- **Don't** put motion on the flight-critical path, or animate anything an operator is reading for a decision.
- **Don't** hand-roll durations/easings — use the tokens so register flex and the reduced-motion contract both apply.
- **Don't** loop or auto-play decorative motion on operational surfaces (no decoration in a GCS).
