---
id: AD-D-014
date: 2026-08-03
title: The five-level status ladder is reserved and regulated
status: ratified
owner: Yasen
ratified_by: ""
---

## Context

Auterion ships ground-control and mission-critical surfaces. Status colour misuse there is a safety
issue, not a taste issue, and it is governed by standards — MIL-STD-1472 for the severity
hierarchy, IEC 62288 for the alert model — rather than by brand preference. Without a reserved set,
the first marketing surface that wants a warm highlight steals `caution` yellow and the operational
vocabulary silently degrades.

Back-filled: enforced in code since the Phase 1 gate. The lexicon is written at
`apps/docs/foundations/voice-and-lexicon.md`; the tokens are the `--alarm/--warning/--caution/
--advisory/--nominal` families in every `packages/tokens/src/theme/*.tokens.json`.

## Options

- **A — adopt MIL-STD-1472's five levels as a reserved set** — standards-backed, externally
  reviewable, and unavailable to brand or chart use.
- **B — a generic semantic set** (`error`/`warn`/`info`/`success`) — familiar to web engineers, but
  it does not map to the operational hierarchy and invites decorative reuse.
- **C — no reservation; status is just more palette** — cheapest, and the failure mode the
  standards exist to prevent.

## Decision

The ladder is `alarm → warning → caution → advisory → nominal`, in that severity order. It is
**reserved**: these hues may not be used as chart series, brand accents, or decorative highlights.
One word per concept — never *critical*, *error*, *info*, *success*, or any other paraphrase (the
full do-not-call table is in `voice-and-lexicon.md`).

Three invariants ride with it:

1. **Never colour-alone.** Every status cue carries a non-colour signal — icon, shape, or label —
   so it survives colour-vision deficiency, glare, and night modes. Asserted by the axe suite in
   `packages/vue/src/primitives/__tests__/`.
2. **Fill is not ink.** The `-emphasis` variants exist because a fill gated only against its own
   `-foreground` is not safe as on-surface text. Ink is gated ≥4.5:1 against both `background`
   and `card`.
3. **`level` carries it, `variant` never does** (`AD-D-031`).

## Revoked when

The governing standard is superseded, or an external conformance review finds the mapping wrong.
Never revoked for a visual-design reason.
