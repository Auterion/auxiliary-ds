---
'@auxiliary/icons': patch
---

`pnpm --filter @auxiliary/icons sync` now hard-fails when config.ts lists
FontAwesome icons but no FA packages resolve (previously it warned and wrote
a registry containing only custom icons — gutting the committed one locally
and producing a misleading "registry out of date" CI failure on forks
without the token). `--allow-partial` restores the old behavior for local
experiments.
