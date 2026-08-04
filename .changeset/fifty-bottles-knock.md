---
---

Governance and gates, no package API change.

- **Decision log** — `decisions/` replaces the flat `DECISIONS.md`: 19 `AD-D-###` entries (15
  back-filled from decisions already enforced in code, 4 new), Appendix-C template in YAML
  frontmatter, and a `pnpm decisions:check` gate wired into CI.
- **Visual regression** — 48 committed screenshots covering the operational-critical components ×
  4 themes × 2 registers, hosted in `apps/docs` (`/specimens`) and run as its own CI job.
- **Direction review harness** — `apps/demo/src/direction/`: one shared content set rendered as the
  mono-neutral incumbent and as the "Anno 1965" challenger, with the buildability audit that feeds
  `AD-D-013`.
- **Reference audit** — `references/`: shortlist, queued, admired-not-adopted, not-assessed
  (`AD-D-003`).
- **One agent team** — the `AGENTS.md` five-hero party is retired; `design-team/roster.md` drives
  both runtimes.
- Docs: token naming do/don't pairs, and the whole `*-emphasis` tier off the coverage allowlist.
