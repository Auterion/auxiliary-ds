import { readFileSync, readdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * Cascade-isolation guard (docs bugfix).
 *
 * Tailwind v4 puts utilities in `@layer utilities`; VitePress's base.css ships
 * UNLAYERED element resets (button/input { background:transparent }) which beat
 * any layer, leaving live demo components unstyled. The fix: `postcssIsolateStyles()`
 * (config.ts) confines those resets to `:not(:where(.vp-raw, .vp-raw *))`, and every
 * `.auxiliary-demo` wrapper carries `vp-raw` so utilities win inside demos.
 *
 * This guards both halves so a new page (or a config edit) can't silently regress it.
 */
const here = dirname(fileURLToPath(import.meta.url));
const docsRoot = resolve(here, '..');
const componentsDir = resolve(docsRoot, 'components');

describe('docs cascade isolation', () => {
  it('config wires postcssIsolateStyles', () => {
    const config = readFileSync(resolve(docsRoot, '.vitepress/config.ts'), 'utf8');
    expect(config).toMatch(/postcssIsolateStyles\(\)/);
  });

  it('every .auxiliary-demo wrapper is isolated with vp-raw', () => {
    const offenders: string[] = [];
    for (const file of readdirSync(componentsDir).filter((f) => f.endsWith('.md'))) {
      const text = readFileSync(resolve(componentsDir, file), 'utf8');
      for (const m of text.matchAll(/class="(auxiliary-demo[^"]*)"/g)) {
        if (!m[1]!.split(/\s+/).includes('vp-raw')) {
          const line = text.slice(0, m.index).split('\n').length;
          offenders.push(`${file}:${line}`);
        }
      }
    }
    expect(
      offenders,
      `demo wrappers missing the vp-raw isolation class:\n${offenders.join('\n')}`,
    ).toEqual([]);
  });
});
