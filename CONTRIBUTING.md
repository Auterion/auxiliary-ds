# Contributing to Auxiliary

Auxiliary is Auterion's design system. Pre-1.0 we're iterating fast — but a few disciplines land from day one so the system stays coherent as it grows.

## Requirements

- **Node 22+** (see [.nvmrc](.nvmrc))
- **pnpm 10+** (`corepack enable` will pin the right version from [package.json](package.json))

## Workflow

1. Branch from `main`.
2. Make your change.
3. Add a changeset: `pnpm changeset`. Pick the affected packages, bump type, and write a one-line summary.
4. Open a PR. CI runs `build`, `lint`, `typecheck`, `test`, the accessibility gate, and a changeset-presence check.
5. Merge once green.

## Changeset discipline

Every PR that touches `packages/*` must include a `.changeset/*.md` file. CI fails PRs without one. This is non-negotiable pre-1.0 — it's how we keep a clean release history when we cut the first tagged version.

`@auxiliary/docs` is excluded — it's an internal app, not a published package.

## Accessibility

The system runs an axe-core gate against every docs page on every PR. Zero violations to merge. Reka UI handles primitive ARIA/keyboard; styling and prop API choices that break a11y land on the author to fix, not on a follow-up.

## Token discipline

Tokens are the source of truth. Components consume them only via CSS variables emitted from `@theme` — never by importing the TypeScript export at runtime. Figma mirrors what's in code; we don't sync the reverse direction.

## Scope discipline

This is not a kitchen-sink library. Prefer not adding a component over adding a marginal one. If you're unsure, open an issue before the PR.
