---
layout: home

hero:
  name: 'Auxiliary'
  text: 'Auterion design system'
  tagline: 'Vue 3 · Tailwind v4 · framework-agnostic tokens · aerospace-grade alarm hierarchy'
  actions:
    - theme: brand
      text: Get started
      link: /foundations/colors
    - theme: alt
      text: Live demo
      link: http://localhost:5174

features:
  - title: One library, many surfaces
    details: One token set drives Mission Control, the marketing site, and internal tools. Same primitives, same vocabulary, same upgrade path.

  - title: shadcn vocabulary
    details: background / foreground, card, popover, primary, muted, accent, destructive. Anyone fluent in shadcn-vue reads this system in five minutes.

  - title: 5-level alarm hierarchy
    details: alarm · warning · caution · advisory · nominal — FAA 14 CFR Part 25.1322 compliant. Red, orange, yellow, cyan, green. Reserved colors stay reserved.

  - title: Restraint over reach
    details: ~20 primitives, not 60. Every component is a deliberate addition. Removing complexity is part of the work.

  - title: Code is the source of truth
    details: Tokens emit DTCG JSON · Tailwind v4 @theme · raw CSS vars · typed TS exports. Figma consumes from code, never the reverse.

  - title: Zero FA dependency at consumer install
    details: Icons compile FA Pro Sharp path data into a static registry at build time. Consumers install one package, get every icon, never touch FA Pro.
---

<div style="max-width: 64rem; margin: 4rem auto 0; padding: 0 2rem;">

## Where you are

This documentation site is **pre-1.0** — APIs and tokens will change without notice until the first tagged release.

If you're a designer, the [Foundations](/foundations/colors) section is the right starting point. It documents the tokens that everything else is built from.

If you're an engineer integrating a primitive, the [Components](/components/button) section gives you the full picture per component: when to use it, when not to, props, examples, accessibility notes, and the tokens it consumes.

If you're contributing to the system itself, read the [README at the repo root](https://github.com/Auterion/auxiliary-ds#readme) and [CLAUDE.md](https://github.com/Auterion/auxiliary-ds/blob/main/CLAUDE.md) for the architectural constraints.

## Architecture at a glance

```
packages/tokens      DTCG source of truth — primitives + 4 themes (light/dark/sunlight/darknight)
       ↓
packages/css         Tailwind v4 preset + @theme bridge + recipes
       ↓
packages/vue         Vue 3 components on Reka UI, styled via @auxiliary/css
       ↓
packages/icons       <Icon> over Font Awesome Pro Sharp + Auterion custom kit
       ↓
apps/docs            This site
apps/demo            Living showcase at http://localhost:5174
```

The arrow goes one way. `packages/tokens` doesn't know Vue exists; `packages/vue` doesn't know how Figma renders. Each layer can be replaced without rewriting the one above.

</div>
