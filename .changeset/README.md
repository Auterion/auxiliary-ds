# Changesets

This directory is managed by [Changesets](https://github.com/changesets/changesets) — it controls how Auxiliary packages are versioned and published.

## What goes here

Every PR that changes a publishable package (anything under `packages/*`) must include a changeset file. Run:

```bash
pnpm changeset
```

Pick the affected packages, the bump type (`patch` / `minor` / `major`), and write a one-line summary. Commit the generated `.changeset/*.md` along with your code.

CI will fail PRs that touch `packages/*` without a changeset.

## Why

Pre-1.0 we're still iterating fast, but the changelog discipline lands in Step 1 of the build plan ([.claude/plans/let-s-review-and-pick-warm-flamingo.md](../.claude/plans/let-s-review-and-pick-warm-flamingo.md), Plan Addition F) so every change is traceable when the first tagged release ships.

`@auxiliary/docs` is excluded from the changeset flow — it's an internal app, not a published package.
