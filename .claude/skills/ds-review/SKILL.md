---
name: ds-review
description: Thorough pre-1.0 review of the Auxiliary design system — token architecture, API surface, accessibility, build pipeline, and drift. Use when the user asks to review or audit the design system as a whole.
---

# Auxiliary design system — thorough review

## Why this review exists

Auxiliary is Auterion's design system (pnpm + Turborepo monorepo: `tokens → css → vue → docs`,
plus `icons`, `figma-sync`, and the `docs`/`demo` apps). It's pre-1.0 and approaching its first
tagged release, after which breaking changes get expensive. The review's job is to find what
would embarrass us or hurt consumers if shipped as-is — real problems, ranked by how much
they'd cost to fix after 1.0 versus now. The audience is the maintainers; they'll act directly
on what you report.

## What to review

Review the system as a whole, not file-by-file. Judge it against its own stated principles
(README / CLAUDE.md): code is the source of truth, tokens are framework-agnostic, restraint
over reach, one library serving many surfaces. A violation of those principles is a finding
even if the code "works."

Dimensions, roughly in priority order:

1. **Token architecture integrity.** Do downstream packages truly derive from
   `packages/tokens`, or do hardcoded values / redefinitions leak in (`css` recipes, `vue`
   components, demo app)? Does the theme axis (`data-theme`) vs register axis
   (`data-register`) separation actually hold everywhere — including the composite tokens
   (shadows, `type/*`) that bypass CSS variables?
2. **API surface quality before 1.0.** Inconsistent prop vocabularies across components,
   the `level` vs `variant` distinction being respected, naming that will be hard to live
   with, exports that shouldn't be public.
3. **Accessibility.** Beyond the axe tests passing: contrast across all four themes
   (especially `sunlight` and `darknight`), focus handling, keyboard paths in the Reka-based
   components.
4. **Correctness and robustness** of the build pipeline: token build, CSS generation, the
   icons registry sync, figma-sync's one-way contract.
5. **Drift**: docs vs actual component behavior, ROADMAP vs reality, generated files
   committed out of sync.

Read whatever you need. If a dimension turns out to be clean, say so in one line and move
on — coverage matters, but padding doesn't.

## How to work

Dispatch parallel subagents per dimension and keep working while they run. Before a finding
makes the report, have a fresh-context subagent try to refute it against the actual code;
drop what doesn't survive. Audit every claim in the report against a file actually read
this session — cite `path:line` for each finding, and if something is suspected but
unverified, label it as such rather than asserting it.

This is an assessment, not a fix-up: don't edit any files. When you have enough information
to judge a dimension, judge it — don't re-survey.

## Report

Lead with the outcome: one short paragraph — is this system ready to tag 1.0, and what are
the top 3 things to fix first? Then findings grouped by severity (blocks 1.0 / fix soon /
nice-to-have), each with the evidence cite and the cost of fixing it later versus now.

Write the report for a maintainer who didn't watch you work: complete sentences, no arrow
chains or shorthand labels invented mid-review, identifiers introduced in plain language.
If you have to choose between short and clear, choose clear.
