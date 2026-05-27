# Auxiliary: A 2026 Build Plan for Auterion's Vue + Tailwind v4 Design System

## TL;DR

- **Build Auxiliary as a pnpm-workspaces + Turborepo monorepo** with a framework-agnostic `@auxiliary/tokens` package (DTCG 2025.10 JSON), a `@auxiliary/css` Tailwind v4 preset, a `@auxiliary/vue` components package built on **reka-ui** primitives + **tailwind-variants**, and a Vue/VitePress docs site. **Use shadcn-vue's source as starter scaffolding (MIT, copy-and-own), not as a runtime dependency.**
- **Token pipeline: code → DTCG JSON → Style Dictionary v4 → CSS (`@theme`), JS, and Figma Variables**, with Figma sync driven by **Tokens Studio's free Figma plugin + GitHub sync** (not the Variables REST API — that requires an Enterprise seat the user shouldn't need to buy). Skip Specify (shut down November 2024), skip Knapsack (enterprise-priced, not for a one-designer team), skip Supernova for now (defer to v1.1 if docs outgrow VitePress).
- **Aesthetic target: dark-first OKLCH neutrals + amber/orange accent in the Anduril neighborhood, Inter Variable (opsz 14..32) + Geist Mono type, 4px spacing, radii {0, 2, 4, 8, 12}, soft shadows, 3-step motion scale.** A solo designer can ship v1.0 in 12 weeks if they ruthlessly defer themes-beyond-dark, data-table polish, and motion choreography to v1.1.

---

## Key Findings

1. **The W3C DTCG spec hit 2025.10 stable on October 28, 2025** (per the official W3C Community Group announcement). Mike Kamminga of Tokens Studio summarized the significance in that announcement: *"By solving multi-file support, theming, and including advanced color support, it unlocks an agnostic design systems and tooling ecosystem."* Style Dictionary v4, Tokens Studio, Penpot, Figma (via Variables), Knapsack, Supernova, Framer, and zeroheight all support or are implementing it. Adopt DTCG; it is no longer a gamble.
2. **Tailwind v4's `@theme` directive is the right substrate**, but it is *not* itself a token spec — it's a CSS-variable emitter. The clean pattern is: DTCG JSON is authored; Style Dictionary transforms it into a Tailwind v4 `@theme` block, a plain CSS custom-property block (for non-Tailwind consumers like web components / QML interop), and Figma-Variables-ready JSON. Style Dictionary v4 is stable; the `tokens-studio/sd-tailwindv4` repo is explicitly an "exploration and experiment" — copy and adapt it, don't depend on it.
3. **Reka UI (formerly Radix Vue) is the unambiguous headless primitive layer in 2026.** shadcn-vue's `@latest` registry was migrated to Reka UI when Reka UI v2 shipped. Use shadcn-vue's components as **scaffolding you copy in and own**, then re-skin and re-token them to Auxiliary — same pattern shadcn pioneered for React, now first-class in Vue.
4. **Figma Variables REST API is still gated to Enterprise full seats** as of May 2026 (Figma's docs: *"To use this API, you must have a Full seat in an Enterprise org; guests cannot use the API."*). For a single designer at Auterion, the pragmatic path is **Tokens Studio's free Figma plugin reading from your GitHub repo**, not direct REST API writes. If/when Auterion's Figma plan is upgraded to Enterprise, you can swap in the official `figma/variables-github-action-example` workflow without touching the rest of the pipeline.
5. **Tokens Studio's free tier covers everything Auxiliary needs at this scale** (Git sync, DTCG-compliant JSON, multi-token-type support). The paid "Starter PLUS" tier lists at **€49/user/month billed monthly, with a 20% discount on annual billing (effectively ~€39/mo)** per tokens.studio/starter-plus, and adds multi-file sync, advanced token types, and Slack support — only worth it once M or engineers start editing tokens in Figma.
6. **The shortest viable agent bench is six skills** (critique, spec/handoff, token-drift watchdog, docs writer, pattern librarian, intake triage) wired to Figma MCP, Atlassian MCP, and GitHub MCP. Build on Anthropic's `frontend-design` skill from the official `anthropics/skills` repo rather than starting from zero.
7. **Anduril's actual product UI (Lattice OS) leans monochrome with amber/orange accents and Helvetica Now**, per the Fonts In Use entry (contributed by Eli Guerron, April 30, 2020): *"Anduril Industries uses Helvetica Now for its website and branding as a metaphor for their position in the defense sector. […] Their website is clear and very minimal with a black and white palette where the only color contribution comes from their products in their different environments."* The cliché "glowing cyan HUD" is not what Anduril does — that is what *imitators* do. Auxiliary should follow the actual signal: near-black canvas, off-white text, hairline borders, a single warm accent.

---

## A) Repo Structure and Monorepo Decision

### Recommendation: pnpm workspaces + Turborepo

**Not Nx, not Moon.** Nx is overpowered for a 4–6 package design system maintained by one designer with engineering help, and its plugin-driven mental model fights you when you're doing pure library publishing. Moon is interesting but ecosystem-thin in May 2026 — most token tooling examples (Style Dictionary, Tokens Studio CLI, Reka UI itself) assume pnpm workspaces. Turborepo's only job here is cached `build`/`test`/`lint` across packages, which it does in one `turbo.json`.

### Layout

```
auxiliary/
├── packages/
│   ├── tokens/              # @auxiliary/tokens — DTCG 2025.10 JSON, source of truth
│   │   ├── src/
│   │   │   ├── primitive/   # color, spacing, radius, type primitives
│   │   │   ├── semantic/    # bg-surface, text-primary, border-default…
│   │   │   └── component/   # button.bg.hover, input.border.focus
│   │   ├── build.mjs        # Style Dictionary v4 config
│   │   └── dist/            # css, js, figma.tokens.json
│   ├── css/                 # @auxiliary/css — Tailwind v4 preset + @theme exports
│   │   ├── theme.css        # imports tokens/dist/tailwind-v4.css
│   │   └── preset.css       # plugins, custom variants, @utility blocks
│   ├── vue/                 # @auxiliary/vue — components
│   │   └── src/
│   │       ├── primitives/  # Button, Input, Dialog… (Reka UI wrappers)
│   │       ├── patterns/    # ToolbarSearchBar, EmptyState, DataGrid…
│   │       └── composables/ # useTheme, useTokens, useDensity
│   ├── icons/               # @auxiliary/icons — SVG sprite + tree-shakeable exports
│   ├── react/               # placeholder, gitignored except README.md
│   ├── svelte/              # placeholder
│   ├── web-components/      # placeholder (for QML/Qt interop later)
│   └── figma-sync/          # @auxiliary/figma-sync — Node scripts + GH Actions
├── apps/
│   └── docs/                # VitePress site, deployed to docs.auxiliary.auterion.com
├── .changeset/              # versioning
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

The three placeholder packages (`react/`, `svelte/`, `web-components/`) are *empty folders with README stubs* on day one. Their job is to keep the door open architecturally: when an engineer later writes `<AuxButton>` for React, they will consume `@auxiliary/tokens` and `@auxiliary/css` unchanged — only the component wrapper is rewritten. This is the entire reason for the monorepo over a single `auxiliary-vue` repo.

### Is DTCG 2025.10 mature enough to adopt as canonical?

**Yes — but with one caveat about Style Dictionary.** The W3C DTCG 2025.10 stable release on October 28, 2025 specifically solved the three things that blocked production adoption: multi-file support, theming, and modern color spaces (OKLCH, OKLab, P3). Style Dictionary v4 has "first-class support for the DTCG format" per its docs but explicitly notes "the latest format 2025.10 does not have full support yet in Style Dictionary. This is a work in progress in v5." That means: author Auxiliary's tokens against the 2025.10 *shape* (the `$type`/`$value` structure, the OKLCH color space), but be prepared to pin Style Dictionary to the latest 4.x and either patch a transformer or wait for v5 for any edge case 2025.10 feature you actually need.

### How DTCG interacts with Tailwind v4's `@theme`

They are not competing — they are different stages of the pipeline. DTCG JSON describes design decisions; `@theme` is a Tailwind-specific CSS emitter. The transform that matters lives in your Style Dictionary config and writes blocks like:

```css
@import "tailwindcss";

@theme {
  --color-bg-canvas: oklch(0.16 0.005 250);
  --color-bg-surface: oklch(0.22 0.006 250);
  --color-text-primary: oklch(0.92 0.004 250);
  --color-accent-default: oklch(0.70 0.18 40);
  --spacing-1: 0.25rem; /* 4px */
  --radius-md: 0.5rem;  /* 8px */
  --font-sans: "Inter", "Inter Variable", system-ui, -apple-system, sans-serif;
  --font-mono: "Geist Mono", GeistMono, ui-monospace, monospace;
}
```

Every other consumer (web components, future React app, marketing Webflow site) reads the plain-CSS-custom-property output instead. **Token references inside the DTCG JSON use `{color.primitive.gray.900}` form**, not `var(--…)` — that's the tokens-studio/sd-tailwindv4 convention and it's the correct one, because references are resolved at build time, not runtime.

---

## B) The Tailwind v4 → tokens.json → Figma Variables Pipeline

### The exact toolchain

```
[ packages/tokens/src/*.tokens.json   ← DTCG 2025.10, edited by hand or via Tokens Studio plugin ]
                  │
                  ▼
[ Style Dictionary v4 build (build.mjs in packages/tokens) ]
                  │
       ┌──────────┼──────────────┬─────────────────────┐
       ▼          ▼              ▼                     ▼
[ tailwind-v4.css ]  [ tokens.css ]  [ tokens.ts ]  [ figma.tokens.json ]
   (@theme block)   (raw --vars)    (typed export)  (DTCG-shaped)
                                                          │
                                                          ▼
                            [ Tokens Studio Figma plugin reads from GitHub repo ]
                                                          │
                                                          ▼
                                  [ Figma Variables in the Auxiliary library file ]
```

### Tool-by-tool opinionated verdicts

- **Style Dictionary v4 — use it. Pin to latest 4.x.** It's the only token transformer with a real ecosystem, real maintainers (now Tokens Studio), and DTCG-aware transforms. Copy the structure of `tokens-studio/sd-tailwindv4` (the `createTailwindV4Plugin` factory with `themeSelectors`, `tokenTypeMapping`, etc.) but treat that repo as a recipe, not a dependency.

- **Tokens Studio Figma plugin — use it on the free tier.** It is the only plugin in 2026 that does Git sync of DTCG-spec JSON for free. The "Starter PLUS" tier (€49/user/month billed monthly, ~€39/mo effective with annual billing's 20% discount, per tokens.studio/starter-plus) adds multi-file sync, advanced token types, and Slack support — buy it only once M or an engineer needs to edit tokens *in Figma*. For the first six months, only the user edits tokens, and they edit them in code, so the free tier is enough.

- **Specify — dead.** Sunset November 2024. Don't open a tab to specifyapp.com expecting a product.

- **Supernova — skip for now.** Supernova is a docs/governance platform with token management bolted on. For a one-designer build, VitePress + Markdown + JSDoc covers the docs need. Revisit in v1.2 only if Auterion's engineering org grows past ~50 consumers of Auxiliary and you need approval workflows.

- **Knapsack — skip.** Per TechCrunch's October 9, 2025 coverage of Knapsack's $10M Series A (techcrunch.com/2025/10/09/knapsack-picks-up-10m-to-help-bridge-the-gap-between-design-and-engineering-teams/), CEO Chris Strahl says directly that it is "an enterprise product with enterprise pricing." That's a wrong-fit signal for a solo-designer setup. The SoftwareAdvice (Gartner Digital Markets) review on Knapsack frames it bluntly: *"Pricing is based on the number of users, with three packages — Starter, Business, Premium with varied prices. Proves expensive for small groups."*

- **Penpot's design tokens — interesting but irrelevant here.** Penpot is the first design tool with *native* DTCG support and the cleanest implementation. If Auterion ever sours on Figma's Variables/Enterprise gating, Penpot becomes the escape hatch. Today, Figma is where M and the engineers already live, so the migration cost isn't worth it.

- **Figma Variables REST API direct from CI — not yet.** Variables endpoints require an Enterprise full seat per Figma's docs. Don't build the pipeline against an API the user can't authenticate to. The Tokens Studio plugin + GitHub sync gets the same result through a different door, no Enterprise seat needed. **Architect the pipeline so the Figma side is swappable** — when Auterion's Figma plan upgrades, drop in the official `figma/variables-github-action-example` workflow and remove the plugin step.

- **Figma Code Connect — not useful for Auxiliary.** Code Connect maps Figma components → code component names so designers see the right import path in dev mode. The user's direction is code → Figma, not Figma → code. Skip it.

### Setup-time estimate

For one designer plus ~4 hours of an engineer's time:
- Day 1 (4h): Monorepo scaffold, Style Dictionary v4 wired, first three primitive token files (color, spacing, radius), CI runs `pnpm build` and publishes preview artifacts.
- Day 2 (4h): `@theme` output verified in a Vite playground; Tokens Studio plugin connected to the GitHub repo; first round-trip (edit `color.primitive.gray.900` in code → push → pull in Figma → see updated variable).
- Day 3 (4h): Semantic + component token layers added; CI step that fails the build if `node_modules` of `@auxiliary/vue` reach into raw primitives instead of semantic tokens (the "token-drift watchdog" prototype).

You can be one week in with a working pipeline.

---

## C) Vue 3 Component Architecture That Stays Framework-Portable

### The three layers (and which framework-specific code belongs in each)

| Layer | Concern | Framework-specific? |
|---|---|---|
| **Tokens** (`@auxiliary/tokens`) | Design decisions | No — DTCG JSON |
| **Styling** (`@auxiliary/css`) | Tailwind v4 preset, `@theme` block, `tailwind-variants` recipes | No — pure CSS + utility recipes |
| **Behavior** (`@auxiliary/vue`) | Composition, ARIA, focus, events | Yes — Vue 3 wrappers around Reka UI |

The discipline is that **`tailwind-variants` recipes are written in TypeScript and exported from `@auxiliary/css`**, not from `@auxiliary/vue`. That way the React/Svelte/Solid wrappers later import the same `buttonVariants` recipe from `@auxiliary/css/recipes/button` and only the component shell is rewritten per framework. This is the key portability move.

### Headless primitive library: Reka UI (formerly Radix Vue)

**No serious competition.** Headless UI for Vue (Tailwind Labs') has stagnated — its component coverage is small and the team's energy has moved to Catalyst on the React side. Ark UI's Vue port works but is the secondary citizen behind the Solid/React builds and lags on releases. Melt UI for Vue isn't a real port. Reka UI is a Vue port of Radix UI Primitives that ships 40+ accessible components, was actively rebranded from Radix Vue, and is the layer shadcn-vue migrated to with Reka UI v2. Use Reka UI.

### Use shadcn-vue's source as scaffolding, not as a dependency

The shadcn pattern is "you own the code." shadcn-vue (MIT) ships components like `Button`, `Dialog`, `Sheet`, `Combobox`, `DropdownMenu` built on Reka UI primitives, styled with Tailwind, and exposed via a CLI that *copies* the source into your repo. Don't `npm install shadcn-vue` — there is no such runtime package by design. Instead:

1. `pnpm dlx shadcn-vue@latest init` in a *throwaway* scratch app once.
2. `pnpm dlx shadcn-vue@latest add button card dialog dropdown-menu input select…` to pull in the components you want.
3. Copy the resulting `.vue` files into `packages/vue/src/primitives/`, replace shadcn's CSS variables with Auxiliary's tokens, replace `class-variance-authority` with `tailwind-variants` (the v4-aware variant lib used by shadcn-vue's New York style anyway), and re-export.

You inherit the accessibility hardening, keyboard handling, and ARIA wiring; you control the styling and own the API.

### CVA story for Vue: pick `tailwind-variants`

The choice is between `class-variance-authority` (cva), `tailwind-variants` (tv), and the newer `css-variants` (cv). Recommendation: **`tailwind-variants`**. Reasons:
- It's the variant lib already used in shadcn-vue's New York style and in the broader Nuxt UI v4 ecosystem.
- It has first-class slots, compound variants, responsive variants, and a `tailwind-merge` integration that prevents class collisions inside Tailwind v4 utility soup.
- `css-variants` is faster on micro-benchmarks but is younger and ecosystem-thin in May 2026; revisit in 12 months.
- Plain CVA works but lacks tailwind-merge built-in, which becomes a real pain when component consumers pass `class="…"` and your defaults conflict.

### How to expose tokens to Vue components: CSS variables, period.

Don't import JS token objects into components. Don't generate per-component Tailwind classes from JS. The clean pattern in 2026:

- Components author against **Tailwind v4 utility classes that consume `@theme`-emitted CSS variables**: `<button class="bg-bg-canvas text-text-primary border-border-default">`.
- For dynamic values (e.g., a custom user-set accent color), components read `var(--color-accent-default)` via Tailwind's arbitrary-value syntax or via a `style` binding.
- The JS token export (`tokens.ts`) exists for *engineering tooling* — token-drift linters, Storybook stories, generated docs — not for component runtime.

This means **theme switching (light/dark, density, future Auterion sub-brands) is a single class swap on `<html>`** and zero JS rerenders. Tailwind v4's `@theme` supports this via `:root` and `[data-theme="…"]` selectors; the `themeSelectors` config in `sd-tailwindv4`'s example is the right shape.

### Multi-theme support

For Auxiliary v1.0, ship two modes:
- `:root` — default Auterion dark
- `[data-theme="light"]` — light mode (lower priority, but you need it for the marketing Webflow site)

In v1.1: add density (`[data-density="compact"]` overrides spacing primitives), and possibly a `[data-brand="…"]` axis if Auterion ever ships a sub-product with a different accent. The architecture supports it; just don't build the variants until they're asked for.

---

## D) The Figma Library Structure

### File structure: three files, not one

1. **Auxiliary — Foundations** (library). Holds Figma Variables only — colors, spacing, radii, type, motion, semantic aliases, component-token layer. No frames, no components. This is the file that gets re-published when tokens change in code.
2. **Auxiliary — Primitives** (library). Holds the atomic components: Button, Input, Select, Checkbox, Switch, Avatar, Badge, Tooltip, Dialog, Sheet, DropdownMenu, Tabs, Toast, Empty, Spinner, Kbd, etc. Consumes the Foundations file.
3. **Auxiliary — Patterns** (library). Holds the assembled patterns Auterion actually uses: app shell, command bar, entity-list-with-detail (the Lattice-style three-column layout), data grid, empty-state catalog, login/auth flows, settings page templates. Consumes Primitives.

This three-file split matters because variable updates re-publish *only* the Foundations file, which keeps Figma's library-update notifications targeted and avoids force-republishing 200 component instances every time you tweak `color.accent.default`.

A separate **Marketing** file (for the Webflow site work) lives outside the library set — it consumes Foundations only and never consumes Primitives, because marketing UI is intentionally different from product UI.

### Figma Variables structure mirroring the token layers

Apply Nathan Curtis's `category-concept-property-variant-state` taxonomy from his EightShapes "Naming Tokens in Design Systems" article, simplified:

```
Collection: Primitive
  color.gray.50  …  color.gray.950
  color.amber.50 …  color.amber.950
  color.red.500  /  color.green.500  / color.yellow.500  (status only)
  spacing.0      …  spacing.16
  radius.none, .xs, .sm, .md, .lg
  font.size.xs … .2xl  /  font.weight.regular/medium/semibold

Collection: Semantic  (modes: dark, light)
  bg.canvas, bg.surface, bg.elevated, bg.overlay
  text.primary, text.secondary, text.muted, text.disabled, text.inverse
  border.default, border.strong, border.focus
  accent.default, accent.hover, accent.muted
  status.success, status.warning, status.danger, status.info

Collection: Component
  button.primary.bg.default → {accent.default}
  button.primary.bg.hover   → {accent.hover}
  input.border.default      → {border.default}
  input.border.focus        → {border.focus}
  …
```

This is exactly the three-tier Curtis/Baldwin/Speek consensus. The Primitive collection has *no modes* (a gray is a gray); the Semantic collection has dark/light modes; the Component collection is mode-agnostic and just aliases into Semantic. Brad Frost's writing on "global vs alias vs component" maps cleanly onto this — global = primitive, alias = semantic, component = component.

### Tailwind Plus content: import once, rebuild natively

The Tailwind Plus Figma kit (yes, it exists) is **reference material** — open it, learn from the layout decisions, copy nothing into the Auxiliary library files. Rebuild each pattern you pull from Tailwind Plus in Auxiliary's idiom: Auxiliary's optical-size-aware Inter setup (opsz 14..32, `ss02`, custom feature settings) instead of stock Inter, OKLCH neutrals instead of Tailwind's default gray, your radii scale, your spacing. If you import Tailwind Plus components directly, you import Tailwind Plus's defaults and pollute the look. The discipline is: **Tailwind Plus tells you *which* patterns matter for a tech-tooling product (sidebars-with-nav, command palettes, fly-out filters, multi-step forms). You then build them in Auxiliary's voice.**

### M's onboarding flow

Junior designer M consumes the library day-to-day like this:
1. Library files are auto-enabled in M's team library settings.
2. M designs in product files, drags components in from `Primitives` and `Patterns`.
3. When M needs a new pattern, they open a "Pattern Request" Jira ticket using the intake template (see Section E).
4. The user reviews; either approves the pattern for Auxiliary, or hands M a one-off solution that lives in their product file.

**M never edits the library files directly.** Library edits require a Jira ticket, a Figma branch, and a review pass. This is non-negotiable for a one-designer-owned system.

### Recommended plugins

- **Tokens Studio for Figma** (free) — Git-synced DTCG variables.
- **Iconify** (free) — single source for icons until you ship `@auxiliary/icons`.
- **Design Lint** (free) — catches detached styles and rogue hex values in M's files before they ship.
- **Stark** (free tier) — quick contrast checks against the dark palette.
- **Variables Importer / Variables to CSS** plugins — useful for ad-hoc verification, not part of the pipeline.

Skip Figma's "Code Connect" plugin (covered above) and skip anything that auto-generates Vue/React from Figma (you said no code-gen tools).

---

## E) The Claude Agent Bench

Build six skills, in this order. Each is a folder under `~/.claude/skills/auxiliary-*/SKILL.md` (Anthropic's standard skill structure, per `anthropics/skills` on GitHub), referenceable from Claude Code, Claude Desktop, and the API. Each gets a slash command alias.

### 1. `/auxiliary-critique` — design critique

**Inputs:** a Figma frame URL (resolved via the Figma MCP), or a Vue file path.
**MCPs called:** Figma MCP (`get_design_context`, `get_variable_defs`), filesystem.
**Skill prompt skeleton:**
```
You are a senior design-systems reviewer for Auxiliary at Auterion.
Auxiliary references: ../tokens/dist/figma.tokens.json, ../vue/src/primitives/*.vue.
Against the supplied frame or file, check:
 1. Tokens — any raw hex, raw px, raw font-family, raw shadow? Flag with exact location.
 2. Component coverage — is the user reinventing a primitive that already exists in @auxiliary/vue?
 3. Density and rhythm — does spacing align to the 4px scale; do font sizes resolve to the scale?
 4. Contrast — text/background pairs against WCAG 2.2 AA in OKLCH.
 5. Defense-tech voice — is this restrained (Linear/Anduril neighborhood) or did it drift toward consumer-SaaS warmth?
Return: a numbered list of findings, each with severity (blocker/major/minor) and a one-line fix.
```

### 2. `/auxiliary-handoff` — spec to Jira + Confluence

**Inputs:** a Figma frame URL.
**MCPs called:** Figma MCP, Atlassian MCP (`createJiraIssue`, `createConfluencePage`).
**Skill prompt skeleton:**
```
You are producing engineering-ready specs for Auterion's Vue engineers building against @auxiliary/vue.
For the supplied Figma frame:
 1. List every component used, mapped to @auxiliary/vue exports.
 2. List every token used, mapped to its semantic name.
 3. Note states (hover, focus, disabled, loading, empty, error) and which are designed vs. need a designer follow-up.
 4. Generate a Jira issue (project AUX or per-product project) with summary, description, acceptance criteria, and a link to the Confluence page.
 5. Generate a Confluence page in the Auxiliary space with the spec, screenshots (linked, not embedded), and a "Questions for design" section.
```

### 3. `/auxiliary-drift` — token-drift watchdog

**Where it runs:** as a GitHub Action in the consumer repos (Auterion product apps), not in Auxiliary itself.
**MCPs called:** GitHub MCP, optionally Slack MCP for digest delivery.
**Job:** ripgrep across `.vue` / `.ts` / `.css` files in consumer repos for raw hex (`#[0-9a-f]{6}`), raw rem/px outside known scale steps, raw `font-family`, and produces a weekly Slack-and-Confluence drift report.
**Skill prompt skeleton:**
```
You are auditing repo $REPO for drift away from @auxiliary/tokens.
Read packages/tokens/dist/tokens.ts to learn the legal token names.
Scan: src/**/*.{vue,ts,css}.
For each violation, output: file:line, the offending value, the closest semantic token, and a one-line refactor.
Group by severity (blocker = raw color in product UI; major = raw spacing; minor = raw shadow).
Post the summary to #design-system on Slack via the Slack MCP. Open one Jira ticket per blocker.
```

### 4. `/auxiliary-docs` — docs writer

**Inputs:** a Vue component file path.
**MCPs called:** filesystem, Figma MCP (to fetch the matching Figma component's description).
**Skill prompt skeleton:**
```
You are writing the docs page for a single @auxiliary/vue component, published to the VitePress docs site.
Read: packages/vue/src/primitives/$NAME.vue and its sibling .stories.ts.
Read: the Figma component description for the same name via Figma MCP.
Produce: a Markdown file with:
  - One-sentence summary
  - When to use / when not to use (3 bullets each)
  - Props table generated from defineProps + JSDoc
  - Slots table
  - Three usage examples (default, with-icon, full-form-context)
  - Accessibility notes (what Reka UI handles, what consumers must handle)
  - Tokens consumed (resolved from tailwind-variants recipe)
Output to apps/docs/src/components/$NAME.md.
```

### 5. `/auxiliary-librarian` — pattern librarian

**Inputs:** a stakeholder question ("do we have a pattern for telemetry tables?").
**MCPs called:** Figma MCP (search Auxiliary library files), filesystem (search Auxiliary docs), Tailwind Plus access (cached HTML or screenshots — Tailwind Plus has no API, so this is curl-cached locally).
**Skill prompt skeleton:**
```
Question: "$QUERY"
Step 1. Search the Auxiliary Patterns Figma library file for matching frames.
Step 2. Search apps/docs for matching pages.
Step 3. Search the local Tailwind Plus cache for adjacent patterns we have not yet pulled in.
Step 4. Output:
  - "We have it" — link to the Figma frame and docs page
  - "We don't have it, but Tailwind Plus does" — link to the reference + a one-line recommendation on whether to adopt
  - "We don't have it and nobody does in our register" — propose what designing it would entail
```

### 6. `/auxiliary-intake` — Jira/Rovo intake triage

**Inputs:** new tickets in the AUX project, or @-mentions in #design-system Slack.
**MCPs called:** Atlassian MCP (read tickets, edit labels, comment), Slack MCP.
**Skill prompt skeleton:**
```
For new tickets in project AUX, classify into:
  - "Token request" — needs a token added/changed
  - "Primitive request" — needs a new @auxiliary/vue primitive
  - "Pattern request" — needs a new pattern in Auxiliary - Patterns
  - "Product question" — answer inline, close
  - "Bug" — reproduce, link to the affected component
Add labels accordingly. Estimate effort (XS/S/M/L). If XS-S and a "Product question", auto-respond with the answer and link to docs. Otherwise, queue for human triage with a one-line summary.
```

### Ecosystem to lean on

- **`anthropics/skills` repo** — install `frontend-design`, `brand-guidelines`, and `skill-creator`. `frontend-design` in particular pushes Claude away from generic "AI-slop" aesthetics, which matters when an agent might draft a spec.
- **`ComposioHQ/awesome-claude-skills`** — useful as a browse-able shelf.
- **`vercel-labs/agent-skills`** — `web-design-guidelines` and `react-best-practices` are Vue-applicable in spirit; cherry-pick patterns, don't install whole.
- Don't install third-party "UI/UX Pro Max"–style mega-skills. They drag Claude toward generic SaaS aesthetics, which is the exact opposite of Auxiliary's brief.

---

## F) Aesthetic Direction and Customization Plan

### What to change from Tailwind defaults

| Token | Default Tailwind v4 | Auxiliary | Why |
|---|---|---|---|
| **Font family — sans/display** | `ui-sans-serif, system-ui…` | `Inter Variable` with `opsz 14..32` axis | Closest free Google Fonts neo-grotesque to Neue Haas Grotesk Pro. The `opsz` axis gives a real Display (opsz 32) vs Text (opsz 14) optical-size split from one variable file — shape changes, not CSS letter-spacing fakery. Renders natively in Google Slides. |
| **Font family — mono** | `ui-monospace…` | `Geist Mono` (Vercel + Basement Studio + Andrés Briganti, OFL, Google Fonts Q4 2024) | Restrained, neutral-geometric, Swiss-grotesque-adjacent. Pairs with Inter natively — both share Helvetica/grotesque-on-screens lineage. Slashed-zero capable. Renders in Slides. Reserved strictly for code, terminals, and identifier strings — telemetry data uses Inter's `tabular-nums`. |
| **Color space** | OKLCH (already default in v4) | OKLCH | Keep. Tailwind v4 ships OKLCH; the perceptual uniformity is what makes dark mode contrast predictable. |
| **Neutral ramp** | `gray` / `slate` / `zinc` | Custom `gray` — a cool-neutral 10-stop OKLCH ramp, hue ~250, very low chroma | Tailwind's default neutrals are tuned for consumer SaaS; they're too warm and too saturated for a defense-tech dark UI. |
| **Accent** | Default `blue` | Single `amber` accent (oklch ~0.70 0.18 40), one tone, hover/active derived | Avoids the cyan-HUD cliché while landing in the Anduril neighborhood; the warm accent on cool neutrals is the contrast move. |
| **Status colors** | Default red/yellow/green | Curated 3 tones each (success/warning/danger/info) | Don't ship the full Tailwind palette. Status tones only. |
| **Spacing** | 1px..96 (29 steps) | Keep 0,1,2,3,4,5,6,8,10,12,16,20,24,32,40,48,64,96 (18 steps) | Most product UI never uses 7, 9, 11, 13, 14, 15. Curate. |
| **Radii** | 0..3xl, 9 steps | `none(0), xs(2), sm(4), md(8), lg(12)`. No `xl/2xl/3xl/full` except for avatars (`full`). | The Vercel/Linear discipline — defense-tech UIs go small on radii. |
| **Shadows** | xs..2xl, 6 steps | Two shadows: `shadow-sm` (1px hairline + 2px soft) for elevated surface, `shadow-md` (4px + 16px soft) for popovers/modals. Plus a focus ring (`outline 2px solid var(--color-border-focus) offset 2px`). | No material-design heavy elevations. |
| **Motion** | n/a | Three durations: `duration-fast 120ms`, `duration-base 200ms`, `duration-slow 320ms`. Two easings: `ease-out-quad` for entrances, `ease-in-out-quad` for state changes. | Defense-tech motion is purposeful, not decorative. |

### Typography setup in detail

**Google Fonts URL** (construct manually — the default snippet strips axes):
https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&family=Geist+Mono:wght@100..900&display=swap

**Tailwind v4 `@theme` block** in `packages/css/theme.css`:

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,100..900&family=Geist+Mono:wght@100..900&display=swap");

@theme {
  --font-sans:    "Inter", "Inter Variable", system-ui, -apple-system, sans-serif;
  --font-display: "Inter", "Inter Variable", system-ui, -apple-system, sans-serif;
  --font-mono:    "Geist Mono", GeistMono, ui-monospace, "SF Mono", Menlo, monospace;
}

:root {
  font-optical-sizing: auto;
  font-feature-settings:
    "cv01" 1,   /* 1 with foot serif — NHG-ier */
    "cv10" 1,   /* G without spur — NHG-ier */
    "ss02" 1,   /* disambiguation: clearer I/l/1/O/0 */
    "ss03" 1,   /* square punctuation — colder, more technical */
    "calt" 1, "liga" 1;
}

.font-display, h1, h2, h3 {
  font-family: var(--font-display);
  font-variation-settings: "opsz" 32;
  letter-spacing: -0.022em;
}

.font-body, body, p {
  font-family: var(--font-sans);
  font-variation-settings: "opsz" 14;
  letter-spacing: 0;
}

.font-mono, code, pre, kbd, samp {
  font-family: var(--font-mono);
  font-feature-settings: "zero" 1, "ss01" 1, "calt" 1;
}

.tabular {
  font-variant-numeric: tabular-nums slashed-zero;
}
```

**Rules for components consuming these tokens:**

1. **Headlines use `opsz 32`** automatically via the `.font-display` class (or via `font-optical-sizing: auto` if the heading's `font-size` is large enough).
2. **Body text uses `opsz 14`** — taller x-height, more open apertures, screen-tuned.
3. **`ss02` is non-negotiable.** UAV ground control cannot tolerate `O`/`0` or `I`/`l`/`1` ambiguity in mission IDs, coordinates, or status codes. Always on.
4. **Do not enable `cv11`** (single-story `a`). It tips Inter toward Geist Sans / Mona Sans geometric-humanist territory, away from the Swiss-grotesque target.
5. **`.tabular` on telemetry, tables, timestamps, coordinates.** Inter Variable's `tabular-nums slashed-zero` gives you fixed-width digits inside a humanist sans — no temperature shift between sans labels and mono digits in the same row. Reserve `--font-mono` strictly for code blocks, terminal output, IPv4 addresses, hex colors, hashes, and identifier strings where alignment of non-numeric characters matters.

**DTCG token shape** in `packages/tokens/src/primitive/typography.tokens.json`:

```json
{
  "font": {
    "family": {
      "sans":    { "$value": "Inter, 'Inter Variable', system-ui, sans-serif",    "$type": "fontFamily" },
      "display": { "$value": "Inter, 'Inter Variable', system-ui, sans-serif",    "$type": "fontFamily" },
      "mono":    { "$value": "'Geist Mono', GeistMono, ui-monospace, monospace",  "$type": "fontFamily" }
    },
    "weight": {
      "regular":  { "$value": 400, "$type": "fontWeight" },
      "medium":   { "$value": 500, "$type": "fontWeight" },
      "semibold": { "$value": 600, "$type": "fontWeight" },
      "bold":     { "$value": 700, "$type": "fontWeight" }
    },
    "opticalSize": {
      "text":    { "$value": 14, "$type": "number" },
      "display": { "$value": 32, "$type": "number" }
    }
  }
}
```

Style Dictionary v4 transforms this into the `@theme` block, the JS export, and the Figma Variables JSON for Tokens Studio to push.

**One verification step before locking the URL:** confirm Google Fonts is serving Geist Mono as a variable font (continuous weight slider in the type tester at `fonts.google.com/specimen/Geist+Mono`) and not as static instances. The CSS above works either way — browsers snap to the nearest weight — but the tokens-as-source-of-truth purity wants the variable file.

### OKLCH: use it. No HSL.

Tailwind v4 supports OKLCH natively. The perceptual-uniformity property means that if you fix L at 0.92 across `text.primary` on a `bg.canvas` of L 0.16, contrast is predictable across hue shifts. That predictability is what lets you ship sub-brands later without re-checking every contrast pair. HSL is a non-starter — every Vercel/Linear case study from 2025 onward calls out OKLCH as the upgrade move.

### Dark mode as default

Two patterns in Tailwind v4:

1. **`:root` is the dark theme.** The `@theme` block under `:root` sets the dark variables. A `[data-theme="light"]` selector sets the light overrides. This is the cleanest pattern for a dark-first product because nothing has to opt into dark; everything opts into *light* when needed (marketing site, embed contexts).
2. The light theme is *not* a v1.0 requirement for the product. It IS a requirement for the marketing Webflow site, but Webflow consumes the CSS-custom-property output and can be light without affecting the product.

### Recommended starter Auterion palette (OKLCH-friendly)

These values are calibrated to live in the same neighborhood as Anduril Lattice (per Lauren Park's portfolio screenshots and Anduril's own product marketing), without copying. The Fonts In Use entry on Anduril is explicit that the brand uses *"a black and white palette where the only color contribution comes from their products in their different environments"* — so the accent stays sparing, used for primary action and selection only, not for decoration.

| Token | Hex | OKLCH | Purpose |
|---|---|---|---|
| `bg.canvas` | `#0A0B0D` | `oklch(0.16 0.005 250)` | App background. Near-black, not pure. |
| `bg.surface` | `#14161A` | `oklch(0.22 0.006 250)` | Cards, panels. |
| `bg.elevated` | `#1C1F25` | `oklch(0.27 0.007 250)` | Popovers, modals. |
| `border.default` | `#262A30` | `oklch(0.32 0.008 250)` | Hairline borders. |
| `border.strong` | `#3A4049` | `oklch(0.43 0.009 250)` | Emphasized dividers. |
| `text.primary` | `#E6E8EB` | `oklch(0.92 0.004 250)` | Body text, headings. Off-white. |
| `text.secondary` | `#8A9099` | `oklch(0.65 0.008 250)` | Labels, captions. |
| `text.muted` | `#5A6068` | `oklch(0.50 0.008 250)` | Placeholder, disabled. |
| `accent.default` | `#FF6A1F` | `oklch(0.70 0.18 40)` | Primary action, selected, brand moments. |
| `accent.muted` | `#3D2415` | `oklch(0.30 0.06 40)` | Selected-row tint, subtle highlight. |
| `status.success` | `#3FB873` | `oklch(0.71 0.16 150)` | |
| `status.warning` | `#E0A92B` | `oklch(0.76 0.14 85)` | |
| `status.danger` | `#E5484D` | `oklch(0.65 0.20 25)` | |
| `status.info` | `#4D8FE0` | `oklch(0.65 0.15 240)` | A *cool* info color — keeps cyan out of the brand, in the status role only. |

The accent specifically dodges the "defense-clichéd glowing blue HUD" by sitting at hue 40 (amber-orange), which is what Anduril actually does in product marketing. Anduril does not publish an official accent hex, so the amber above is a credible "neighborhood" choice, not a copy — verify with Auterion brand leadership before locking it in.

---

## G) The 12-Week Solo Build Plan

Time budget assumption: the user has ~50% capacity for Auxiliary (the other 50% is product). Engineering pairs in for ~4 hours/week for pipeline work. M is product-only for the first 8 weeks and joins Auxiliary in week 9.

### Week 0 (pre-flight, 2 days)
- Archive `github.com/Auterion/auxiliary-ds`. Tag `final-archive`. Add a README pointing to the new repo.
- Create `github.com/Auterion/auxiliary`. Empty repo, MIT or proprietary as Auterion legal prefers.
- Decide repo visibility (internal recommended; you can open-source after v1.0 if Auterion approves).

### Week 1 — Skeleton
- Scaffold pnpm-workspaces + Turborepo. Push `chore: monorepo skeleton`.
- Create `packages/tokens`, `packages/css`, `packages/vue`, `packages/icons`, `apps/docs`.
- Wire Style Dictionary v4 with a single primitive color (`color.primitive.gray.900`) that emits `tailwind-v4.css`. PR: `feat(tokens): style-dictionary pipeline scaffold`.
- VitePress site shows the one token. Deploy to Vercel.
- **Gate:** the pipeline round-trips for one token. If it doesn't, stop and fix; don't add more tokens.

### Week 2 — Primitive tokens layer (color + spacing + radii)
- Author the full OKLCH neutral ramp, status palette, accent.
- Author spacing scale (curated, 18 steps), radius scale (5 steps).
- Output: `@theme` block + `tokens.css` + `tokens.ts`.
- PR: `feat(tokens): primitive color, spacing, radius`.
- **Figma milestone:** Create the `Auxiliary — Foundations` Figma file. Install Tokens Studio. Connect to GitHub. Import primitives. Verify round-trip.

### Week 3 — Type, shadow, motion + semantic layer
- Type scale (Inter Variable opsz 14..32 + Geist Mono), font weights, line heights, letter spacing.
- Shadows (2) and motion (3 durations + 2 easings).
- Semantic layer (`bg.canvas`, `text.primary`, etc.) with dark/light modes.
- PR: `feat(tokens): typography, shadows, motion, semantic layer`.
- **Decision gate:** Is light mode required for v1.0 product? Recommendation: no. Defer to v1.1. Keep the light-mode variables but don't QA them.

### Week 4 — First primitives in Vue
- `pnpm dlx shadcn-vue add` Button, Input, Label, Field, Spinner, Kbd into a scratch app.
- Copy into `packages/vue/src/primitives/`. Replace `cva` with `tailwind-variants`. Replace shadcn-vue's tokens with Auxiliary's semantic tokens.
- VitePress docs page for Button.
- PR: `feat(vue): button, input, label, field, spinner, kbd`.
- **Figma milestone:** Create `Auxiliary — Primitives` file. Build Button, Input (variants matched to the code).

### Week 5 — Overlays + selection primitives
- Dialog, Sheet, Popover, Tooltip, DropdownMenu, Select (via Reka UI Combobox), Tabs, Toast (Sonner).
- PR: `feat(vue): overlays and selection primitives`.
- **Figma milestone:** Same primitives in Figma.
- **Decision gate:** Storybook or VitePress-only for component playground? Recommendation: VitePress with Twoslash + a tiny `<ComponentPreview>` block. Storybook adds maintenance you don't need at solo scale.

### Week 6 — Layout + nav primitives
- Card, Separator, ScrollArea, Switch, Checkbox, RadioGroup, Avatar, Badge, NavigationMenu.
- PR: `feat(vue): layout, form controls, nav`.
- **Figma milestone:** Layout primitives in Figma.

### Week 7 — Tailwind Plus pass; pattern triage
- Sit down with Tailwind Plus. Walk every Application UI section. Make a "yes / no / later" list.
- For each "yes": create a Jira ticket in AUX with a screenshot, a name, and a target week.
- Set up `Auxiliary — Patterns` Figma file. Build the three highest-priority patterns: app shell (sidebar + top bar), entity-list-detail (the Lattice-style three-column layout), and the command palette.
- PR: `feat(patterns): app shell, entity-list-detail, command palette`.

### Week 8 — Documentation + initial agent bench
- Write docs for all primitives (the `/auxiliary-docs` agent does the first pass; you edit).
- Stand up agents 1, 2, 3 (`/auxiliary-critique`, `/auxiliary-handoff`, `/auxiliary-drift`).
- Token-drift watchdog runs as a GitHub Action on the first Auterion product repo. First report.
- PR: `docs: primitive docs site v1`.

### Week 9 — M onboarding + first engineering consumer
- M is brought onto Auxiliary. 90-minute onboarding: read the docs, walk the Figma files, install Tokens Studio (read-only initially).
- One Auterion engineer is paired with you to migrate one screen of a real product to `@auxiliary/vue`. This is the test of the API.
- Pull observations into a `breaking-changes-before-1.0.md` doc.
- **Decision gate:** Did the migration reveal a need to rename / restructure any token or primitive? If yes, do it now. After 1.0, breaking changes are expensive.

### Week 10 — Patterns sprint + library polish
- Build the remaining v1.0 patterns: empty states catalog, settings page template, auth flows, data grid (basic — no virtualization, defer to v1.1), notifications shelf.
- Polish: hover/focus/disabled states across all primitives; verify in Figma.
- PR: `feat(patterns): v1 set complete`.

### Week 11 — Marketing site refresh in Webflow
- Webflow site consumes `tokens.css` via a CDN-hosted build of `@auxiliary/css` (Vercel-deployed, versioned URL).
- Build the light-mode overrides and ship the marketing site swap.
- **Decision gate:** Did Webflow surface any tokens we don't have? Add only what marketing actually uses, not aspirational. Defer the rest.

### Week 12 — Cut v1.0 + post-mortem
- Publish `@auxiliary/tokens`, `@auxiliary/css`, `@auxiliary/vue`, `@auxiliary/icons` to Auterion's internal npm registry (Verdaccio or GitHub Packages).
- Tag `v1.0.0`. Cut a Confluence release page. Slack #design-system.
- Spin up the remaining three agents (`/auxiliary-docs`, `/auxiliary-librarian`, `/auxiliary-intake`).
- Write the v1.1 roadmap: light mode for product, density variants, virtualized data grid, motion choreography, accessibility audit, second sub-brand if applicable.
- **Decision gate:** If you missed >25% of the v1.0 scope, do not push the deadline. Cut scope, tag what you have, ship v1.0 with a clean v1.1 list.

### Explicit deferrals to v1.1
- Light mode QA (variables exist, not validated).
- Density variants.
- Data grid virtualization.
- Charts (use a separate `@auxiliary/charts` package later, built on something like ECharts or VisX-equivalent for Vue).
- React/Svelte/web-components packages (folders only).
- Motion choreography (`<Transition>` wrappers).
- A second brand / sub-product theme.

### Things to NOT do during these 12 weeks
- Do not let agents write production component code. They write specs, docs, critique. Engineering writes the components.
- Do not turn on the Variables REST API workflow even if Auterion upgrades Figma. Wait until the plugin-based sync proves insufficient — it won't, for a long time.
- Do not pull every Tailwind Plus component. The whole point is curation.
- Do not let M edit the Foundations or Primitives files. Pattern Requests go through Jira.
- Do not add JS-token-import to components. CSS variables only.

---

## Recommendations (staged)

**Now (this week):**
1. Archive `auxiliary-ds`. Create the new `auxiliary` repo. Scaffold the monorepo per Section A.
2. Buy zero new SaaS subscriptions. Tokens Studio free tier covers the Figma side. Style Dictionary is OSS. Reka UI and shadcn-vue are MIT.
3. Install `frontend-design`, `brand-guidelines`, and `skill-creator` from `anthropics/skills`. Start drafting `/auxiliary-critique` against them.

**Within 30 days:**
4. Have the primitive token layer + first three primitives (Button, Input, Dialog) shipping through the full pipeline, including Figma.
5. Stand up the token-drift watchdog against one Auterion product repo. The first report is going to be alarming. Triage it.

**Within 90 days:**
6. Cut Auxiliary v1.0 with primitives + the first 8–10 patterns + docs + 6 agents.
7. Migrate one full product screen and the Webflow marketing site to consume Auxiliary tokens.

**Defer until benchmark X is met:**
- Tokens Studio paid tier (~€39–49/user/month) — defer until M or an engineer needs to edit tokens *in Figma*. They won't for ~6 months.
- Knapsack / Supernova — defer until Auterion has 5+ Auxiliary-consuming products and needs centralized governance/approval workflows.
- Figma Variables REST API — defer until Auterion's Figma plan is Enterprise *and* the plugin-based sync proves a bottleneck.
- React/Svelte/web-components packages — defer until a real consumer exists.
- A Vue-component → Figma-component generator — never. Code-to-Figma component generation is the wrong direction; tokens auto-sync, components stay manual.

---

## Caveats

- **Style Dictionary's DTCG 2025.10 support is partial in v4.** The Style Dictionary docs explicitly note "the latest format 2025.10 does not have full support yet in Style Dictionary. This is a work in progress in v5." If you hit a 2025.10-specific feature (e.g., advanced gradient tokens, certain composite shadow tokens), you may need to write a custom Style Dictionary transformer or wait for v5. Author Auxiliary's tokens against the *common subset* (color, dimension, font-family, font-weight, duration, shadow) that v4 handles cleanly.
- **Figma Variables REST API is Enterprise-only.** Confirmed against Figma's official Variables docs ("To use this API, you must have a Full seat in an Enterprise org"). Don't architect against it unless Auterion commits to the Enterprise plan.
- **shadcn-vue is community-maintained, not a Tailwind Labs project.** This is fine — it has been stable through the Reka UI v2 migration — but treat it as a starter codebase, not a vendor.
- **Anduril does not publish an official accent-color hex.** The amber/orange neighborhood is inferred from Fonts In Use's documentation of Anduril's brand (Helvetica Now), Lauren Park's portfolio screenshots of Lattice, and Yashas Mitta's case study of Anduril's website. The proposed accent is a *neighborhood* choice, not a clone — verify it with Auterion brand leadership before locking it in.
- **The 12-week plan assumes ~50% capacity.** If product work eats more than that, slip cleanly: cut pattern scope from v1.0 and keep primitive + token quality non-negotiable. A clean primitive layer with 5 patterns beats a noisy primitive layer with 15.
- **The Tokens Studio plugin's GitHub sync is reliable but not real-time.** Designers pull from GitHub manually (or on schedule). For sub-minute round-trips you'd need the Variables REST API workflow, which (see above) requires Enterprise.
- **VitePress vs. Storybook for docs is a real fork.** This plan chooses VitePress. If Auterion engineering already standardized on Storybook elsewhere, switch — the work is small.