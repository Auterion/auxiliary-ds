/**
 * Generate package.json "exports" from src/index.ts.
 *
 * Every component re-exported by the barrel gets its own subpath
 * (`@auxiliary/vue/Button`) pointing at the preserveModules output, alongside the
 * "." barrel. Run `pnpm --filter @auxiliary/vue gen:exports` after adding a
 * component; CI's exports-sync test fails if package.json drifts from index.ts
 * (same discipline as the icon registry).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const pkgRoot = resolve(here, '..');

/** Parse `export { default as Name, ... } from './path.vue';` → { Name, path }. */
export function parseComponents(indexSrc) {
  const re = /export\s*\{\s*default as (\w+)[^}]*\}\s*from\s*'(\.\/[^']+)\.vue';/g;
  const out = [];
  for (const m of indexSrc.matchAll(re)) out.push({ name: m[1], path: m[2].slice(2) });
  return out;
}

/** Build the full exports map (barrel + one subpath per component). */
export function buildExports(components) {
  const exports = {
    '.': { types: './dist/index.d.ts', import: './dist/index.js' },
  };
  for (const { name, path } of components.sort((a, b) => a.name.localeCompare(b.name))) {
    exports[`./${name}`] = {
      types: `./dist/${path}.vue.d.ts`,
      import: `./dist/${path}.vue.js`,
    };
  }
  return exports;
}

// Run as a script (skip when imported by the sync test).
if (import.meta.url === `file://${process.argv[1]}`) {
  const indexSrc = readFileSync(resolve(pkgRoot, 'src/index.ts'), 'utf8');
  const pkgPath = resolve(pkgRoot, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
  pkg.exports = buildExports(parseComponents(indexSrc));
  writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`✓ wrote ${Object.keys(pkg.exports).length - 1} component subpaths to package.json`);
}
