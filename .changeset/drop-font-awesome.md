---
'@auxiliary/icons': minor
---

Remove Font Awesome entirely — `inputs/*.svg` is now the only icon source.

The FA Pro Sharp packages, the committed `.npmrc` (private `@fortawesome` scope +
`${FONTAWESOME_PACKAGE_TOKEN}` credential), and the FA branch of `scripts/sync.mjs` are all
gone, along with the FA-derived path data in the generated registry. A fresh clone now
installs with a plain `pnpm install` — no token, no private registry, no CI secret. This
also fixes install on pnpm 11.4+, which refuses to expand env vars in registry credentials
that come from a project-level `.npmrc`, so the token was silently never applied and FA
requests 401'd.

The `IconName` contract is unchanged: all 37 names still resolve, so no consumer breaks.
The 36 non-`drone` glyphs are **interim hand-authored 24×24 placeholders** standing in until
the set moves to Nucleo. They are deliberately plain — replace them name-for-name by dropping
Nucleo SVGs into `inputs/` and running sync.

`sync.mjs` also gains per-weight source directories (`inputs/<weight>/<name>.svg`, preferred
over a flat `inputs/<name>.svg`) so a Nucleo weight pack is a pure asset drop with no code
change.
