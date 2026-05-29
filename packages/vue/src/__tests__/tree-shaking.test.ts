import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { build, type Rollup } from 'vite';

/**
 * Tree-shaking smoke test (ROADMAP Phase 3: library-grade packaging).
 *
 * Proves the published shape actually tree-shakes: importing ONE component from
 * the barrel must not drag the others in. This is the guarantee behind
 * `sideEffects: false` + Vite `preserveModules` — without it those are just
 * claims. Bundles the built `dist` with a real bundler that honors
 * `sideEffects: false` and asserts unrelated components are dropped.
 *
 * CI builds before testing (ci.yml: build → test), so `dist` is present.
 */

const here = dirname(fileURLToPath(import.meta.url));
const distIndex = resolve(here, '..', '..', 'dist', 'index.js');

async function bundleOnly(named: string): Promise<string> {
  const entry = '\0virtual:tree-shake-entry';
  const result = (await build({
    configFile: false,
    logLevel: 'silent',
    build: {
      write: false,
      minify: false,
      rollupOptions: {
        input: entry,
        external: ['vue', 'reka-ui', /^@auxiliary\//],
        treeshake: { moduleSideEffects: false },
        // Keep the bundle's exports (Button) so its code is retained; without
        // this Vite's app-mode default drops "unused" entry exports entirely.
        preserveEntrySignatures: 'strict',
        output: { format: 'es', inlineDynamicImports: true },
      },
    },
    plugins: [
      {
        name: 'virtual-tree-shake-entry',
        resolveId(id) {
          return id === entry ? id : null;
        },
        load(id) {
          // Re-export a single component; a tree-shaking bundler should keep only it.
          return id === entry
            ? `export { ${named} } from ${JSON.stringify(distIndex)};`
            : null;
        },
      },
    ],
  })) as Rollup.RollupOutput;

  const chunk = result.output.find((o): o is Rollup.OutputChunk => o.type === 'chunk');
  if (!chunk) throw new Error('no chunk emitted');
  return chunk.code;
}

describe('tree-shaking: a single import excludes other components', () => {
  it('declares sideEffects:false so consumers may drop unused exports', () => {
    const pkg = JSON.parse(readFileSync(resolve(here, '..', '..', 'package.json'), 'utf8'));
    expect(pkg.sideEffects).toBe(false);
  });

  it('dist is built (ci builds before test)', () => {
    expect(existsSync(distIndex), `expected built ${distIndex} — run \`pnpm --filter @auxiliary/vue build\``).toBe(true);
  });

  it('importing Button does not pull in unrelated components', async () => {
    const code = await bundleOnly('Button');
    expect(code).toContain('"Button"'); // the one we asked for (its __name)
    for (const other of ['TelemetryValue', 'AlertBanner', 'StatusBadge', 'Slider', 'Accordion']) {
      expect(code, `${other} should have been tree-shaken out`).not.toContain(`"${other}"`);
    }
  }, 30_000);
});
