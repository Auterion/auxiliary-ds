import { readFileSync, readdirSync } from 'node:fs';
import { dirname, extname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

/**
 * Air-gap-first gate (ROADMAP cross-cutting).
 *
 * Auterion deployments are frequently disconnected. The design system must
 * carry its own assets — no runtime CDN for fonts, styles, or scripts — so an
 * offline/air-gapped consumer never silently degrades (e.g. fonts falling back
 * to system-ui, breaking tabular-nums / mission-ID disambiguation).
 *
 * This scans source CSS / Vue / HTML across the monorepo for runtime external
 * references and fails if any reappear. It is the durable guard behind the
 * font-vendoring change: principle → enforced invariant.
 *
 * Scope note: scans SOURCE only (built dist/ artifacts are downstream of source
 * and regenerate). Comments/strings referencing https docs are fine — only
 * asset-loading vectors are flagged.
 */

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..', '..', '..');
const ROOTS = ['packages', 'apps'];

const SCAN_EXT = new Set(['.css', '.scss', '.sass', '.vue', '.html', '.htm']);
const SKIP_DIRS = new Set([
  'node_modules',
  'dist',
  '.git',
  '.turbo',
  'coverage',
  'cache', // .vitepress/cache
]);

/** Hosts that are not real runtime dependencies (dev servers, doc fixtures). */
const ALLOWED_HOST = /^(localhost|127\.0\.0\.1|example\.(com|org))(?::\d+)?$/i;

/** CSS `url(http...)` — covers `@import url(...)` and `src: url(...)`. */
const CSS_URL = /url\(\s*['"]?(https?:\/\/[^'")\s]+)/gi;
/** Markup `<link href=http...>` / `<script src=http...>` (incl. preconnect/prefetch). */
const TAG_REF = /<(?:link|script)\b[^>]*\b(?:href|src)\s*=\s*['"]?(https?:\/\/[^'"\s>]+)/gi;

function walk(dir: string, out: string[]): void {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (SKIP_DIRS.has(entry.name)) continue;
      walk(join(dir, entry.name), out);
    } else if (SCAN_EXT.has(extname(entry.name))) {
      out.push(join(dir, entry.name));
    }
  }
}

function hostOf(url: string): string {
  try {
    return new URL(url).host;
  } catch {
    return '';
  }
}

function findViolations(): string[] {
  const files: string[] = [];
  for (const root of ROOTS) walk(join(repoRoot, root), files);

  const hits: string[] = [];
  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    for (const re of [CSS_URL, TAG_REF]) {
      re.lastIndex = 0;
      for (const m of text.matchAll(re)) {
        const url = m[1];
        if (!url || ALLOWED_HOST.test(hostOf(url))) continue;
        const line = text.slice(0, m.index).split('\n').length;
        hits.push(`${relative(repoRoot, file)}:${line} → ${url}`);
      }
    }
  }
  return hits;
}

describe('air-gap: no runtime external dependencies in source', () => {
  it('has no CDN @import / url() / <link>/<script> refs', () => {
    const violations = findViolations();
    expect(
      violations,
      `Runtime external reference(s) found — vendor the asset instead (see packages/css/scripts/sync-fonts.mjs):\n${violations.join('\n')}`,
    ).toEqual([]);
  });
});
