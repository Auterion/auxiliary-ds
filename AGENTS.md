# Agents

**The standing team is defined in [`design-team/roster.md`](design-team/roster.md).** That file is
the single source of truth: ten design roles, their shared grounding, write scopes, routing table,
and conflict resolution. Read it before dispatching work. This file only covers what the roster
does not: which runtime to use, and the repo-level constraints every agent inherits.

## Why this file used to say something else

Until 2026-08-03 there were **two** teams defined against this repo — five crystl heroes here
(Wizard, Warrior, Ranger, Rogue, Healer) and ten design roles in `design-team/roster.md` — with
overlapping ownership of `packages/tokens`, `packages/vue/src/primitives`, and the decision log.
Running both against the same paths was a live hazard.

Resolved in favour of the roster (`design-team/README.md`, option 1). The old five roles are
retired; their file ownership is superseded by the roster's write-scope table. `.crystl/heroes/`
now holds the ten roster roles, generated.

## Two runtimes, one roster

Everything below is generated from `design-team/roster.md` by `node design-team/build.mjs`, and
CI fails if any of it drifts (`pnpm design-team:check`). **Never hand-edit a generated file.**

| Runtime | Files | Use it for |
| --- | --- | --- |
| **Claude Code subagents** (default) | `.claude/agents/*.md` — the 5 repo-tier roles | Almost everything. One agent at a time, or several on non-overlapping scopes. |
| **crystl heroes** | `.crystl/heroes/*.json` — all 10 roles | Only what it is uniquely good at: **parallel isolated worktrees**, when several agents must touch overlapping files at once. |
| **Any other platform** | `design-team/dist/personas.md` | Paste-ready personas for Claude Projects and the like. |

Heroes are committed on purpose — crystl carries them into every isolated worktree, so a clone
gets the same team. Operational notes for the crystl runtime are in
[`CRYSTL-WORKFLOW.md`](CRYSTL-WORKFLOW.md).

## Standing instructions for every agent

These apply on top of the role prompt.

1. **Cite decisions by ID.** The log is [`decisions/`](decisions/) — every load-bearing choice has
   an `AD-D-###` entry with options and a revocation condition. Reference the ID; do not restate
   the rationale, and do not re-litigate a ratified entry without naming it and arguing for
   supersession.
2. **Propose; do not ratify.** An agent may draft a decision entry at `status: proposed`. Only
   Yasen moves one to `ratified`. `pnpm decisions:check` gates the format.
3. **Rank your evidence.** Say what you checked and what you did not, cite `path:line`, and never
   call something "verified" that was only inferred. The evidence ladder is in the roster.
4. **Do not invent unknowns.** The roster's "Unknowns protocol" lists what is genuinely unsettled
   (positioning, verbal identity, imagery direction, the research evidence base). If a task needs
   one, say which fact is missing — or proceed under an explicitly labelled assumption.

## Repo constraints

Architecture, commands, and component patterns live in [`CLAUDE.md`](CLAUDE.md). The four that
most often bite:

1. **Generated artifacts must be committed in sync.** The icon registry
   (`pnpm --filter @auxiliary/icons sync`), the brand registry
   (`pnpm --filter @auxiliary/brand sync`), the docs props
   (`node apps/docs/scripts/gen-props.mjs`), and the design team (`pnpm design-team`). Each has a
   CI gate that fails on drift.
2. **Every PR needs a changeset** — `pnpm changeset`. CI runs
   `changeset status --since=origin/main`.
3. **Pre-1.0: clean breaks, no shims** (`AD-D-035`). Record a non-obvious reason as a decision
   entry, not a code comment.
4. **`FONTAWESOME_PACKAGE_TOKEN` must be set locally** for `pnpm install` and the icon sync. In
   crystl, set it under Settings → API keys so every shard inherits it.
