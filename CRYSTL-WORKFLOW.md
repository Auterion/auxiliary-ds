<!-- crystl-cli:begin -->
## Crystl CLI (agent-callable)

You're running inside Crystl. You can inspect and control sibling gems and shards via the `crystl` CLI:

- `crystl gems` / `crystl shards --gem <name>` — discover what's open
- `crystl screen --gem <name> --shard <name>` — read another shard's terminal output
- `crystl send --gem <name> --shard <name> "<text>"` — type into another shard
- `crystl shard create --gem <name> [--isolated] [-c "<cmd>"]` — fan out parallel work into a new shard
- `crystl pending` / `crystl approve <id>` / `crystl deny <id>` — handle pending tool approvals
- `crystl wait pending [--timeout SECS]` — block until a permission request appears (built on SSE; no polling)
- `crystl events [--type pending_changed,notification]` — stream live bridge events as JSON lines

Full reference: https://crystl.dev/docs/cli
<!-- crystl-cli:end -->

# Crystl workflow for auxiliary-ds

How to run Crystl Quest on this repo without crashes, swap-death, or token burn.
Written 2026-06-07 against Crystl 2.45.0.

> **The roster below is superseded (2026-08-03).** The wizard/warrior/paladin/healer party was
> retired when the two-team collision was resolved — see `design-team/README.md`. The standing
> team is `design-team/roster.md`, and `.crystl/heroes/*.json` is generated from it, so the party
> you summon and the subagent you invoke are the same ten roles. Model IDs in the sections below
> are also stale; the generator sets them.
>
> **Everything from "Mode: open vs sealed" down is still current** — it is about the crystl
> runtime, not about who is on the team. That is what this file is for now: use crystl for
> parallel isolated worktrees, and read the stability rules before running a party.

## Party: "Studio Lite" — SUPERSEDED, kept for the sizing rationale

Four heroes, not nine. On a 16 GB machine, 8–9 agents ≈ 1.5–2 GB RAM + 8× token
burn, and more agents = more injection races and stale-state churn. Four covers
this repo's real work: direction, tokens, implementation, context health.

*(The party-size argument still holds and is why you should summon a subset of the ten roles
rather than all of them. The role definitions below are not the ones that ship.)*

### wizard — Creative direction & planning — `claude-opus-4-6`

> You own the brief. Break work into agent-sized tasks and assign each to the
> right hero. Arbitrate cross-product consistency vs product-specific needs —
> consistency wins unless there is a documented reason. Record settled decisions
> in DECISIONS.md so nothing gets re-litigated. You direct and review; you do
> not implement. You also cover UX review in this small party: layout, spacing
> rhythm, and the unglamorous states (empty, error, loading, disabled). Push
> back on anything that drifts from the brand or the system.

### warrior — Tokens, contracts, governance — `claude-sonnet-4-6`

> You own the DTCG token layer (`packages/tokens`) and component contracts.
> Evaluate every change for blast radius across all products. Nothing primitive
> changes without a semantic alias. Tokens stay framework-agnostic — no
> Vue/Tailwind specifics in `packages/tokens`. Code is the source of truth;
> Figma mirrors code, never the reverse. Reject one-off values that should be
> tokens.

(Sonnet, not Opus: governance here is mostly pattern-checking against
CLAUDE.md/ROADMAP.md. Bump to Opus only for token-architecture redesigns.)

### paladin — Frontend implementation — `claude-sonnet-4-6`

> Implement components in Vue 3 + Tailwind v4 consuming the DTCG tokens. Style
> via recipes from `@auxiliary/css/recipes` with `cn()` — never hand-rolled
> class strings. Every component gets an axe a11y test. `level` (status
> severity) and `variant` (design treatment) are distinct axes — never conflate.
> Run the dev server and screenshot before declaring anything done. Add a
> changeset (`pnpm changeset`) with every PR. After touching icons config or
> inputs, run `pnpm --filter @auxiliary/icons sync` and commit `registry.ts`.

### healer — Context health — `claude-haiku-4-5-20251001`

> Context health specialist. Monitor `cat .crystl/quest/status.json`. When any
> agent drops below 50%, write a compressed summary to QUEST-LOG.md, a
> HANDOFF.md for agents near their limit, and update DECISIONS.md. Proactive,
> not reactive.

## Mode: open vs sealed

- **Open Chat** (default for this repo): docs work, single-package changes,
  review passes. Agents see each other's edits immediately.
- **Sealed Chat** when ≥2 agents will touch `packages/*` at once. Two hard
  conflict points in this repo: `packages/icons/src/registry.ts` (generated,
  must be committed in sync) and `.changeset/` (every PR needs one — in sealed
  mode each agent's branch needs its own changeset before merging).

## Stability rules (until the 2.45.x bugs are fixed)

1. **Don't switch party templates over live quest state.** The 2026-06-07 crash
   (`QuestPanel.applyContentTab`, duplicate key) was stale heroes from a
   previous quest surviving in `.crystl/quest/` and colliding with the new
   party. Before summoning a *different* party: quit Crystl, delete (or archive)
   `.crystl/quest/`, relaunch, then summon.
2. **Never put the same hero in a template twice.** The template editor allows
   it; the quest panel crashes on it (both 2026-06-07 crashes were this).
3. **If an agent says "helper is missing"**, the `quest_msg` injection raced.
   The agent can write to `.crystl/quest/messages.jsonl` directly — messages
   still route. Don't restart the quest for this.
4. **One quest at a time** per machine. Close the quest (merge/keep/discard
   branches) before starting the next.
5. Backup of the old 9-hero state lives at `.crystl/quest.bak-2026-06-07`
   (full Studio party config in `v2/party.json`). Delete when no longer needed.

## One-time machine setup (do on every Mac you run Crystl on)

1. **API keys** (Settings > API keys): store `FONTAWESOME_PACKAGE_TOKEN` so it
   auto-injects into every shard. Without it, any agent running
   `pnpm install` or `pnpm --filter @auxiliary/icons sync` fails — CI has the
   secret, local shards don't.
2. **Facet inserts** (saved prompts, reusable across gems) — create these three:
   - `verify` — "Run `pnpm lint && pnpm typecheck && pnpm test && pnpm build`.
     Report only failures, with file:line."
   - `pr-ready` — "Confirm: changeset added (`pnpm changeset status`), icons
     registry committed in sync, no hand-rolled Tailwind classes outside recipes."
   - `health` — "Read `.crystl/quest/status.json` and summarize party context health."
3. **Project Optimizer**: run it on this gem once — it audits agent-instruction
   readiness and the recommendations are usually cheap to apply.
4. **Templates**: delete or fix "New Party" (it shipped with a duplicate ranger
   — see stability rule 2). Create "Studio Lite" from this doc instead.
5. **MCP servers** (Settings > MCP servers): add the Figma MCP to the global
   catalog and sync to this gem — paladin/warrior need it for Figma↔code checks.

## Conventions

- `decisions/` — committed. The decision log; one `AD-D-###` file per settled choice.
  Agents cite the ID before re-litigating, and may draft entries at `status: proposed`
  but never ratify. `pnpm decisions:check` gates it.
- `QUEST-LOG.md`, `HANDOFF.md` — gitignored quest scratch, written by healer.
  Never commit; never reference from product docs.

## Settings checklist (Settings > crystl quest)

- Default mode: **Open**
- Sounds: join **off**, send **off**
- Identity: keep "Design Lead / Principal" — direct critique works well
- Approval mode (per-gem): manual approval for `git push` and anything touching
  `.github/` or release scripts; auto-approve reads.

## Reporting upstream

Three live bugs to post in crystl.dev/community (all observed 2026-06-07, v2.45.0):

1. Duplicate-key crash: `QuestPanel.applyContentTab` →
   `Dictionary(uniqueKeysWithValues:)` trap when quest state contains the same
   hero twice (stale state or a template with a duplicated hero). Crash report
   saved from the 10:06 EEST session.
2. Template editor allows adding the same hero to a party twice — no
   validation, then crash (1) fires later in the quest panel.
3. `quest_msg` helper occasionally not injected into a shard at summon time
   (race; worked around via direct `messages.jsonl` writes).
