---
'@auxiliary/figma-sync': minor
---

Add a read-only Figma → code **drift report** (`pnpm figma:diff`).

Brand exploration happens by hand in Figma, and until now that work was invisible to the repo
until someone re-typed it from memory. This reads a file back and reports how it diverged from
the token contract. It applies nothing — a human moves values into `packages/tokens` through
the normal gates.

**Principle 1 is narrowed, not reversed.** It read "do not introduce sync paths that flow
Figma → code"; the line is now drawn at *application* rather than *observation*. Writes still
only ever flow code → Figma.

**The shape is the trick.** `pull-logic.mjs` returns the same shape `figma-native.json`
already uses, so the comparator never has to invert the lossy parts of the export — the
component size segment that became a Figma *mode*, and the dimensions that became unitless
FLOATs. Two transports match `push-logic.mjs` exactly, or everything would report as drift:
colours round-trip through the same `round(x * 255)` hex, and aliases resolve to a qualified
`Collection/name` rather than a file-local id.

The pull chunks per collection for the opposite reason the push does — the push's *code* is
too large once data is inlined, the pull's *response* is at ~617 variables.

Findings: `changed`, `new-in-figma`, `missing-in-figma`, `type-mismatch`, `mode-mismatch`,
`missing-collection`, `changed`/`missing-text-style`, `changed`/`missing-effect-style`, and
`probable-rename`. Two deliberate refusals to overclaim:

- `new-in-figma` does not distinguish "the designer added this" from "a code-side rename
  orphaned this". That needs history nobody has.
- `probable-rename` only fires when exactly one candidate exists on each side — "renamed to
  one of these four" helps nobody — and is never applied.

**No CI gate, honestly.** The Figma MCP is interactively authenticated and the Variables REST
API is Enterprise-only while Auterion is Organization tier, so no automated job can answer "is
Figma in sync?". CI gates the *comparator* instead: `src/diff.mjs` is pure, and
`test/diff.test.mjs` covers every finding kind plus a positive control that fails if the
comparison ever goes silent — the failure mode where "no drift" and "compared nothing" look
identical. The pull program additionally has a test asserting it calls no mutating API.
