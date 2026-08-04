# design-team

The design agent team for Auxiliary. `roster.md` is the source of truth; everything else is
generated.

```bash
node design-team/build.mjs           # regenerate
node design-team/build.mjs --check   # fail if generated output is stale
```

## Layout

```txt
design-team/
  roster.md          source of truth — shared context, 10 roles, routing, conflict resolution
  build.mjs          generator + validator
  dist/
    personas.md      paste-ready personas (Claude Projects, or any platform)
  reviews/           Design Director writes here
  audits/            UI Designer writes here
  copy/              Content Designer writes here
.claude/agents/      generated subagents — the 5 repo-tier roles
.crystl/heroes/      generated crystl Local Heroes — all 10 roles, committed
```

Heroes emit into `.crystl/heroes/` rather than a staging dir under `dist/`, because that is
the only path crystl reads project-local heroes from. They are committed on purpose: crystl
carries them into every isolated worktree, and anyone who clones the repo gets the same team.
`.crystl/.gitignore` ignores everything in that folder *except* `heroes/*.json`, so session
caches and quest scratch stay local.

## The two-team problem — resolved 2026-08-03

There used to be **two agent teams defined against this repo**, overlapping on ownership:

| | Defined in | Roles | Runtime |
|---|---|---|---|
| A | `AGENTS.md` | Wizard, Warrior, Ranger, Rogue, Healer | crystl quest parties |
| B | `design-team/roster.md` | 10 design job titles (5 repo-tier) | Claude Code subagents |

They collided directly — Warrior and the Design Systems Designer both claimed `packages/tokens`,
Rogue and the Design Engineer both claimed `packages/vue/src/primitives` — and the collision was
live rather than theoretical, because the Design Director and Design Systems Designer ship with
`guardrail: true` and so auto-join every crystl party.

**Resolved in favour of option 1: subagents primary.** Team A is retired. This roster is the only
one, and it drives *both* runtimes — `.claude/agents/` and `.crystl/heroes/` are generated from the
same file, so a party and a subagent session cannot disagree about who owns what. crystl is kept
for the one thing it is uniquely good at: parallel isolated worktrees when several agents must
touch overlapping files at once. `AGENTS.md` now points here.

The two rejected options, recorded so they are not re-proposed:

- **Relabel and merge** — keep the five heroes but rename them to design job titles. crystl does
  separate `hero` (class) from `role_name`, so this was mechanically possible; the cost was two
  teams' worth of maintenance for one team's worth of work.
- **Keep both, partition by path** — split `packages/*` ownership down the middle and keep two
  rosters honest by hand. Least good; the honesty is manual and therefore temporary.

## Why only five subagents

Tier answers one question: *does this role's output land in this repo?*

- **repo tier** (Design Director, Design Systems Designer, Design Engineer, UI Designer, Content
  Designer) — writes files, gets a subagent with scoped tools and exclusive write paths.
- **advisory tier** (Brand Strategist, Brand Designer, Art Director, UX Researcher, Product
  Designer) — output is judgment, a document, or a critique. Persona only, no write access.

Auxiliary is a design system, not a product and not a brand book. Product Designer has no flows to
own here and Art Director has no image pipeline; giving them write access would produce markdown
nobody reads. Tier is per-repo — in a Mission Control repo, Product Designer is `repo` tier.

The generator enforces that no two repo-tier roles claim the same write path, that advisory roles
declare none, and that models resolve to real strings.

## Model strings

`roster.md` uses short aliases (`opus`, `sonnet`) which the generator resolves to
`claude-opus-5` / `claude-sonnet-5`. Aliases exist because model strings rot: this repo currently
contains 65 references to `claude-sonnet-4-6`, 8 to `claude-opus-4-6`, and 1 to `claude-opus-4-8`
across `AGENTS.md`, `.crystl/`, and the superseded roster files. None of those are real models. Only
`claude-haiku-4-5-20251001` is valid.

**Not yet fixed:** the stale strings in `AGENTS.md` and `.crystl/**`. Those drive the live crystl
team, so they were left alone rather than edited silently. Fix them when you resolve the two-team
question.

## Optional CI wiring

To gate drift the way the icon, brand, and docs registries already are, add to the root
`package.json`:

```json
"scripts": { "design-team:check": "node design-team/build.mjs --check" }
```

…and call it from `pnpm test` or the CI workflow. Skip this if the roster will churn daily.

## Attribution

Three pieces of methodology in `roster.md` are adapted from
[MengTo/Skills](https://github.com/MengTo/Skills) (MIT): the evidence ladder from
`audit-verify-explain-grade-5`, the one-variable-at-a-time iteration discipline from
`design-first-ui-prompting`, and the `SKILL.md` / `REFERENCES.md` folder contract. No files were
vendored — only the ideas, restated for this repo.
