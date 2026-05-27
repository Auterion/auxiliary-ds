# @auxiliary/figma-sync

One-way push of Auxiliary tokens into Figma Variables. **Code is the source of truth.** This package never pulls Figma into the repo.

## Status

Scaffold only. Step 7 of the build plan documents the manual sync flow using the **Tokens Studio for Figma** plugin (free tier), pointed at `packages/tokens/dist/figma.tokens.json`.

When Auterion goes Figma Enterprise, this package will host the GitHub Action that uses the Figma Variables REST API to replace the manual flow.

## Why this exists as a package

Even on the manual flow, the script (and later the action) live with the rest of the system so the round-trip is reproducible and version-controlled — not a one-off in someone's local Figma.
