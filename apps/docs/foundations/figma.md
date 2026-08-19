# Designing in Figma

Auxiliary is a **code-first** system. Figma mirrors it, not the other way round — no tool
writes from Figma into `packages/tokens`, and none ever will. That is a deliberate
constraint, not a missing feature: one source of truth, or two sources and a standing
argument.

But "code is the source of truth" is not the same as "Figma is read-only for humans".
Figma is where the exploring happens. This page is how to explore there in a way that
**survives the trip back** — where "back" means a change a person applies to the recipes,
guided by a machine-readable report rather than by memory.

## What actually flows, in each direction

```
                     tokens + component schema
     code  ──────────────────────────────────────────▶  Figma
              push.figma.js · push-components.figma.js
              variables · text styles · effect styles
              component sets

     code  ◀──────────────────────────────────────────  Figma
                        pnpm figma:diff
              a REPORT — a worklist for a human.
              nothing is applied automatically.
```

Two commands. `pnpm figma:diff` tells you what a Figma file contains that the code does
not, and vice versa. Whether any of it should become code is your call, made by editing
the recipes and tokens.

## The three collections, and what each one governs

Every value in the file comes from one of three Variable collections, named for the token
tiers they carry.

| Collection | Modes | Holds | Change it when |
| --- | --- | --- | --- |
| **Global** | `Base` | The raw scale — every spacing rung, radius, size, duration, colour primitive | You need a value the ramp does not have |
| **Theme** | `light` · `dark` · `sunlight` · `darknight` | Every semantic role — `primary`, `card`, `border`, `alarm` — aliased into Global, once per theme | A role should look different, in one or more themes |
| **Component** | `sm` · `md` · `lg` | Per-component structure — `button/height`, `card/padding-x` | One component's geometry is wrong, without moving the scale |

Three rules follow from that table, and they are the ones worth internalising:

1. **Colour lives in Theme. Always.** A colour placed in the Component collection cannot
   re-resolve when the theme switches — it would survive a dark-mode toggle unchanged.
   The build refuses to emit one, so a Component colour variable in Figma is drift by
   construction and `figma:diff` will say so.
2. **Size is a mode, not three variables.** `Component/button/height` is one variable
   whose value differs per mode. A `md` Button is the same variable resolved at the `md`
   mode. If you find yourself making `button/height-md`, stop — the mode already does it.
3. **Never rename a variable's path.** Figma binds by id, so a rename does not move your
   instances: it orphans them and silently creates a duplicate. (Renaming a *collection*
   is safe, for the same reason.) Rename in the token source and re-push instead.

## Designing a new component

Start from what the system already has, then say what is genuinely new. In practice:

**1. Build it from bound variables, not typed numbers.**
Every fill, stroke, radius, padding, gap and height should be bound to a variable — the
picker is filtered by scope, so the right ones are the ones offered. A typed `16` is
invisible to the whole pipeline: it cannot re-resolve per theme, it will not tighten under
the operational register, and it reads back as untokenised drift.

**2. Set the Component mode on the frame, once.**
Selecting `md` on the component's frame resolves every bound structural variable at that
size together. This is what keeps a size variant coherent instead of thirty independent
numbers that agree today.

**3. Name variants as `Property=value`.**
`Variant=primary, Size=md, State=rest`. These become the component's props in code, so
the vocabulary matters: `variant` is a design *treatment*; `level` is operational
*severity* (`alarm` · `warning` · `caution` · `advisory` · `nominal`). They are different
axes and must not be conflated — a status hue is never a decorative choice.

**4. Design the resting state, and `disabled`.**
Hover and active are deliberately absent from the generated sets. They are opacity
modifiers over a token (`bg-primary/90`) with no token of their own, so putting one in
Figma means writing a literal colour — which then reports, correctly, as untokenised.
Disabled is different: it is carried by `Global/opacity/disabled`, so it stays true when
the token moves.

**5. If you need a value that does not exist, add it to the ramp — in code.**
A one-off `13px` in a frame is the thing this system exists to prevent. Either an existing
rung is right, or the ramp has a gap worth naming. Both are conversations; neither is a
typed number.

## Getting it back into code

```bash
pnpm --filter @auxiliary/tokens build
pnpm --filter @auxiliary/figma-sync build
# run dist/pull.figma.js through the Figma MCP, save the result to dist/figma-actual.json
pnpm figma:diff
```

The report names every difference by kind: `changed`, `new-in-figma`, `missing-in-figma`,
`type-mismatch`, `mode-mismatch`, and `probable-rename` (a value that moved path, paired
by identical value across all modes — labelled probable, never applied).

That report is a **worklist**, not a patch. Applying it means editing
`packages/tokens/src` and the recipes, then re-pushing so Figma matches again. The
round trip is closed by a person, on purpose.

## What is not synced, and why

- **`register.*`** — the `[data-register]` axis (expressive ↔ operational). Figma has one
  mode axis per collection and the size axis already uses it. Density is a runtime
  concern; design at `expressive` and trust the register.
- **Easings.** A cubic-bezier has no Figma Variable type. Motion is specified in
  [Motion](/foundations/motion) and implemented in code.
- **Slotted components** — Card, Dialog, Table and the other 22. Their schema is
  generated, but no Figma component is: Card ships as six separate Vue components, so how
  they nest is the consumer's choice, not the component's. Generating a plausible guess
  would put a component in the file that quietly disagrees with every real usage.
- **Interaction and layout behaviour.** Focus order, keyboard handling, live regions.
  Figma cannot express them and they are not negotiable — see
  [Conformance](/foundations/conformance).

## The component schema

`packages/css/component-schema.json` is the generated contract behind all of this: for
every component, every variant, every slot — which token binds to which CSS property.

```jsonc
// button, variant=primary size=md
{
  "background-color": { "figma": "Theme/primary" },
  "color":            { "figma": "Theme/primary-foreground" },
  "border-radius":    { "figma": "Component/button/radius" },
  "padding-inline":   { "figma": "Component/button/padding-x", "mode": "md" }
}
```

It is generated from the recipes by the real Tailwind compiler — so it cannot describe a
component differently from how that component renders — and it is committed, so a recipe
change shows up in review as a design diff rather than a class-string diff. It is also
what the Figma component generator reads, which is why a component pushed to Figma is
the same component that ships.
