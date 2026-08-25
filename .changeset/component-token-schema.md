---
'@auxiliary/tokens': major
'@auxiliary/css': minor
'@auxiliary/figma-sync': minor
---

Component token schema — one source for agents, humans, and Figma

A recipe already says everything: `button.ts` binds geometry to component tokens and
colour to theme roles. But it says it in Tailwind classes, so nothing except a browser
could read it — pushing Button into Figma meant a human hand-deriving the bindings, which
does not generalise past one component and goes stale on the next edit.

**`packages/css/component-schema.json`** (new, generated, committed) closes that. For
every component, every variant combination, every slot: which token binds to which CSS
property. Derived by tv() introspection → the real Tailwind compiler → an index built
from the tokens build, so it cannot describe a component differently from how it renders.
Exported as `@auxiliary/css/schema`. An unresolvable `var()` fails the build rather than
being quietly omitted (`test/component-schema.test.ts`).

**BREAKING (`@auxiliary/tokens`) — Figma collections renamed** `Primitives` → `Global`
and `Semantic` → `Theme`, matching both the GTC tiers and the auxiliary-ds file, so a
binding path and a token path finally read the same. `pnpm figma:diff` no longer needs
`--map`. Safe in Figma: bindings are by variable id, not qualified name — unlike a
variable *path*, which still must never be renamed.

**`@auxiliary/figma-sync` builds component sets** from the schema
(`dist/push-components.figma.js`, run after the token push). Nine flat recipes, 88
variants, idempotent. Size variants bind the Component collection's **mode** rather than
three separate variables; `rest`/`disabled` become variants while `hover`/`active`
deliberately do not, since materialising an opacity modifier would write an untokenised
literal into the file.

Two pre-existing motion defects surfaced by the new checks, both fixed:

- `--default-transition-timing-function` was never bridged to the motion tokens, so every
  `transition-colors` ran on Tailwind's own curve while `--ease-out` sat unused. **This
  changes the easing of every transition in the library.**
- Six animation classes in `accordion.ts` and `dialog.ts` (`animate-accordion-up`,
  `animate-in`, `fade-in-0`, …) generated no CSS and never had: they are the
  shadcn/radix vocabulary and `tw-animate-css` was never a dependency. The accordion had
  never slid; the dialog scrim had never faded. `theme.css` now defines
  `--animate-fade-in`/`-out` and `--animate-accordion-down`/`-up` from the motion tokens
  (so they follow the operational register), and `dialog.ts` uses the named pair instead
  of composing `animate-in` + `fade-in-0` at the call site. The dependency was not added
  deliberately — per-call-site composition is the thing one named ladder per axis exists
  to prevent.

Also fixes a test-ordering race: `packages/tokens` rebuilt into `dist/` during its own
test run, wiping a directory concurrent suites now read. It builds into a private
directory instead (`AUX_TOKENS_OUT`).

Docs: new **Designing in Figma** foundations page — the three collections, how to build a
component so it survives the round trip, and what is deliberately not synced.
