---
'@auxiliary/tokens': patch
'@auxiliary/css': patch
---

Publish correctness: `@auxiliary/tokens` now ships a compiled `dist/tokens.js`
entry plus `dist/tokens.d.ts` instead of raw TypeScript — a published `.ts`
entry fails under plain Node (`ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING`
inside node_modules). The exports map gains proper `types`/`import`
conditions. Both packages now wipe `dist/` before building so stray files
(e.g. macOS conflict copies) can never reach a published tarball, and a new
`pnpm pack:smoke` CI gate packs tokens/css/vue and asserts tarball sanity,
including a plain-Node import of the tokens entry.
