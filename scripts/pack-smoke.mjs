#!/usr/bin/env node
/**
 * Publish smoke test: pack the public packages exactly as `changeset publish`
 * would, then assert the tarballs are sane. Catches the failure modes that are
 * invisible in-workspace and only surface for npm consumers:
 *
 *  1. stray files in dist/ getting published (e.g. macOS conflict copies
 *     like "tokens 3.css" — `files: ["dist"]` ships everything in there);
 *  2. an entry point that plain Node can't load (a raw .ts entry dies with
 *     ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING under node_modules);
 *  3. exports-map targets missing from the tarball.
 *
 * Requires a prior `pnpm build`. Run via `pnpm pack:smoke`.
 */
import { execFileSync } from 'node:child_process';
import { mkdtempSync, rmSync, mkdirSync, cpSync, existsSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const PACKAGES = ['packages/tokens', 'packages/css', 'packages/vue'];

const work = mkdtempSync(join(tmpdir(), 'auxiliary-pack-smoke-'));
let failures = 0;
const fail = (msg) => {
  failures++;
  console.error(`  ✘ ${msg}`);
};

try {
  for (const pkgDir of PACKAGES) {
    const pkgPath = join(root, pkgDir);
    const pkg = JSON.parse(readFileSync(join(pkgPath, 'package.json'), 'utf8'));
    console.log(`\n${pkg.name}`);

    const tarball = execFileSync('pnpm', ['pack', '--out', join(work, '%s.tgz')], {
      cwd: pkgPath,
      encoding: 'utf8',
    })
      .trim()
      .split('\n')
      .pop();

    const fileList = execFileSync('tar', ['-tzf', tarball], { encoding: 'utf8' })
      .trim()
      .split('\n');

    // 1. No conflict-copy strays ("name 2.ext") and nothing outside package/.
    const strays = fileList.filter((f) => / \d+(\.[a-z]+)?$/i.test(f.replace(/\/$/, '')));
    if (strays.length) fail(`stray conflict-copy files in tarball: ${strays.join(', ')}`);
    else console.log(`  ✓ no stray files (${fileList.length} entries)`);

    // 2. Every exports-map file target exists in the tarball.
    const targets = new Set();
    const collect = (v) => {
      if (typeof v === 'string') targets.add(v.replace(/^\.\//, 'package/'));
      else if (v && typeof v === 'object') Object.values(v).forEach(collect);
    };
    collect(pkg.exports);
    if (pkg.main) targets.add(pkg.main.replace(/^\.\//, 'package/'));
    const inTarball = new Set(fileList);
    const missing = [...targets].filter((t) => !t.includes('*') && !inTarball.has(t));
    if (missing.length) fail(`exports targets missing from tarball: ${missing.join(', ')}`);
    else console.log(`  ✓ all exports targets present`);

    // 3. Plain Node can import the entry from an installed layout (tokens only —
    //    css is CSS/recipes-source, vue needs a bundler for .vue dist anyway).
    if (pkg.name === '@auxiliary/tokens') {
      const consumer = join(work, 'consumer');
      const installed = join(consumer, 'node_modules', ...pkg.name.split('/'));
      mkdirSync(installed, { recursive: true });
      execFileSync('tar', ['-xzf', tarball, '-C', work, 'package']);
      cpSync(join(work, 'package'), installed, { recursive: true });
      try {
        const out = execFileSync(
          'node',
          // Assert the four GTC groups, not one key: this is the only check that sees
        // the published tier layout, and the rename that moved `color` under `global`
        // is exactly the shape of breakage a single-key probe misses.
        [
          '--input-type=module',
          '-e',
          `const m = await import('${pkg.name}');` +
            `const missing = ['global', 'theme', 'register', 'component'].filter((g) => !m.tokens?.[g]);` +
            `if (missing.length) throw new Error('token groups missing: ' + missing.join(', '));` +
            `if (!m.tokens.global.color) throw new Error('tokens.global.color missing');` +
            `if (!m.tokens.theme.light) throw new Error('tokens.theme.light missing');` +
            `console.log('loaded');`,
        ],
          { cwd: consumer, encoding: 'utf8' },
        );
        if (!out.includes('loaded')) fail('tokens entry did not load');
        else console.log('  ✓ plain Node imports the entry from node_modules');
      } catch (e) {
        fail(`plain Node failed to import entry: ${e.stderr || e.message}`);
      }
      if (!existsSync(join(installed, 'dist/tokens.d.ts'))) fail('dist/tokens.d.ts missing');
    }
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}

if (failures) {
  console.error(`\npack-smoke: ${failures} failure(s)`);
  process.exit(1);
}
console.log('\npack-smoke: all checks passed');
