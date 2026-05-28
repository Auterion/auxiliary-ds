---
---

Phase 1 — quality gate: make CI catch behavioral and a11y regressions, not just type errors.

- **Testing:** Vitest + `@vue/test-utils` + happy-dom + `vitest-axe` in `@auxiliary/vue`. 26 test
  files / 195 cases cover every component's behavior, prop→class/attr mappings, and accessibility,
  including the load-bearing invariant that operational status (`StatusBadge`/`AlertBanner`/
  `Progress`/`TelemetryValue`) is never conveyed by color alone. Shared scoped axe runner at
  `src/test-utils/a11y.ts`. Coverage floor enforced (baseline ~95%).
- **Linting:** root ESLint flat config (`typescript-eslint` + `eslint-plugin-vue` +
  `eslint-config-prettier`); every package's `lint`/`test` stub replaced with real commands at
  `--max-warnings 0`.
- **Surfaced (not yet fixed):** two real a11y gaps the gate caught — `Slider` can't receive an
  accessible name (label falls through to the role-less root), and `Select`'s listbox has no
  accessible name. Both documented via `it.skip` and queued for the Phase 2 component work.

Tooling/test-only — no public API or token changes.
