## Overview

Four-agent team working on the Auxiliary design system (Auterion's monorepo). Each agent has a distinct specialty.

**Team spec:** See `.crystl/quest/spec.json` for dev environment, packages, token definitions, themes, current focus, and CI gates. This file is the single source of truth for shared configuration.
- **Wizard**: Creative direction, brand, design review
- **Warrior**: Tokens, governance, blast-radius analysis
- **Ranger**: Brand & visual polish, consistency audits
- **Healer**: Context health, documentation, coordination

Operating in "Open Chat" mode. All agents see edits immediately. Sealed chat mode activates only when ≥2 agents will touch `packages/*` simultaneously.

## Agent Roles

### Wizard — Creative direction & planning
**Model:** `claude-opus-4-6` (largest)

Owns the brief. Breaks work into agent-sized tasks and routes each to the right hero. Arbitrates cross-product consistency vs product-specific needs — consistency wins unless there's a documented reason (append to `DECISIONS.md`). Directs and reviews; does not implement hands-on. Covers UX review: layout, spacing rhythm, unglamorous states (empty, error, loading, disabled).

**Current tasks (2026-06-07):**
- Polish brand visual language with Ranger
- Ensure token integration across components
- Review Suite & Mission Control interactivity flow (with Rogue)
- Update `DECISIONS.md` with settled questions

### Warrior — Tokens, contracts, governance
**Model:** `claude-sonnet-4-6`

Owns `packages/tokens` (DTCG spec, source of truth) and all component contracts. Evaluates every change for blast radius: does it break a downstream surface? Nothing primitive changes without a semantic alias. Tokens stay framework-agnostic — no Vue/Tailwind specifics in `packages/tokens`. Code is the source of truth; Figma mirrors code, never the reverse. Rejects one-off values that should be tokens.

**Current tasks (2026-06-07):**
- Ensure custom blue scale (`auterion-blue`) is used throughout brand
- Verify all new components derive from DTCG tokens, not ad-hoc values
- Audit token consumption in Suite & Mission Control surfaces

### Ranger — Brand & visual language
**Model:** `claude-sonnet-4-6`

Owns visual consistency and the brand idiom. Works with Wizard to polish typography, color narrative, spacing rhythm. Audits changes for visual coherence across the three product surfaces (Suite, OS, Mission Control). Enforces the design system's restraint principle: prefer not adding something over adding a marginal one.

**Current tasks (2026-06-07):**
- Polish brand type scale, color scale, and spacing rhythm with Wizard
- Audit visual consistency across Suite, OS, and Mission Control
- Verify blue-scale usage aligns with brand guidelines

### Rogue — Interaction, layout, states
**Model:** `claude-sonnet-4-6`

Implements interactive components in Vue 3 + Tailwind v4. Styles via recipes from `@auxiliary/css/recipes` with `cn()` — never hand-rolled class strings. Every component gets an axe a11y test. Manages `level` (status severity: alarm|warning|caution|advisory|nominal) and `variant` (design treatment) as distinct axes. Runs the dev server and screenshots before declaring done.

**Current tasks (2026-06-07):**
- Build Suite & Mission Control small-interactivity features
- Ensure all new components have a11y tests (axe runner, isolated mounts)
- Verify keyboard navigation and focus management across new controls

### Healer — Context health & coordination
**Model:** `claude-haiku-4-5-20251001` (smallest, context-efficient)

Monitors context health (`cat .crystl/quest/v2/progress/<shard>.json`). When any agent drops below 50%, writes compressed summaries to `QUEST-LOG.md`, handoff guidance to `HANDOFF.md`, and records settled decisions in `DECISIONS.md`. Also owns documentation alignment: CLAUDE.md, AGENTS.md, spec.json, ROADMAP.md stay in sync.

**Current tasks (2026-06-07):**
- Fill in AGENTS.md with real team structure and task assignments
- Create `.crystl/quest/spec.json` for team-wide coordination
- Monitor quest health and nudge agents near context limits
- Ensure documentation files reflect current state

## Workflow

### Daily patterns
- **Start of turn**: Healer checks health; nudges any agent below 20% context
- **Mid-quest**: Wizard routes new work via `quest_task` with priority tags
- **Before merging**: Rogue confirms changeset added; Warrior confirms token audit pass; Ranger confirms visual audit pass; Healer confirms documentation is current
- **End of quest**: Healer calls `quest_summary` with digest; if needed, `quest_handoff` to next session

### File ownership (checked via `quest_claim --list`)
- `packages/tokens` — Warrior (others: read-only, ask before touching)
- `packages/vue/src/primitives` — Rogue (others: read-only)
- `packages/css/recipes` — Warrior validates, Rogue uses, Wizard reviews
- `DECISIONS.md`, `AGENTS.md`, `spec.json` — Healer maintains; others read
- `ROADMAP.md` — Wizard owns; Healer keeps in sync with DECISIONS

## Constraints

1. **Icon registry must be committed in sync.** After changing `packages/icons/src/config.ts` or inputs, run `pnpm --filter @auxiliary/icons sync` and commit the regenerated `registry.ts` — CI fails if it drifts.

2. **Every PR needs a changeset.** CI runs `changeset status --since=origin/main`. Add one with `pnpm changeset` before merge.

3. **Pre-1.0: API breaking changes are OK.** No backwards-compatibility shims owed; prefer clean changes over deprecation layers. Record the reason in `DECISIONS.md` if it's non-obvious.

4. **One library, many surfaces.** Tokens must serve Suite, OS, and Mission Control. Don't bake product-specific assumptions into the DS. If a token is product-only, it lives in the product's own token set, not here.

5. **FONTAWESOME_PACKAGE_TOKEN required locally.** Set it in Crystl Settings > API keys so any shard running `pnpm install` or `pnpm --filter @auxiliary/icons sync` succeeds.

## Communication

### Quest channels
- `quest_msg "user" "..."` → the user (Design Lead)
- `quest_msg "<shard>" "..."` → a specific agent (updates shown on dashboard)
- `quest_announce "..."` → all agents at once (use for shared specs, decisions)
- **Never `quest_msg "all"`** — it's not a valid target

### Cross-team sync
- **High-stakes decisions**: post via `quest_announce` so all agents see it
- **Spec changes**: update `.crystl/quest/spec.json` and broadcast via `quest_announce`
- **Stuck patterns**: append to `DECISIONS.md` to prevent re-litigation
- **Handoff urgency**: use `quest_heartbeat --blocker "reason"` to signal a blocker

### Approved decision format (in DECISIONS.md)
```
## <decision title>

**Decision:** <what was decided>

**Why:** <the motivation, constraint, or incident that drove it>

**Scope:** <where/how it applies>

**Date:** YYYY-MM-DD
```

Example already in file: Map terrain colors (hardcoded) vs tokens; card radius (rounded-xl system-wide).
