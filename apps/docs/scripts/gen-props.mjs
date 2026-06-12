/**
 * Generate component props metadata for the docs from @auxiliary/vue's source types.
 *
 * Uses vue-component-meta (a real TS program) so prop types resolve through their
 * aliases — `ButtonVariants['variant']` → `'primary' | 'secondary' | …`,
 * `StatusKind` unions, Reka-forwarded props, `withDefaults` defaults, `required`,
 * and JSDoc descriptions. Output (.vitepress/data/props.generated.json) is consumed
 * by the <PropsTable> doc component and is COMMITTED — a drift test regenerates and
 * compares so it can't go stale (the same discipline as the icon registry). This
 * removes the second source of truth that let button.md drift (`intent`→`variant`).
 *
 * Run `pnpm --filter @auxiliary/docs gen:props` after changing component props.
 */
import pkg from 'vue-component-meta';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const { createChecker } = pkg;
const here = dirname(fileURLToPath(import.meta.url));
const vueRoot = resolve(here, '..', '..', '..', 'packages', 'vue');
const vizRoot = resolve(here, '..', '..', '..', 'packages', 'viz');
export const OUT_FILE = resolve(here, '..', '.vitepress', 'data', 'props.generated.json');

/** name → src-relative `.vue` path, parsed from a package barrel (same shape as gen-exports). */
function barrelComponents(pkgRoot) {
  const src = readFileSync(resolve(pkgRoot, 'src/index.ts'), 'utf8');
  const re = /export\s*\{\s*default as (\w+)[^}]*\}\s*from\s*'(\.\/[^']+\.vue)';/g;
  return [...src.matchAll(re)].map((m) => ({ name: m[1], file: m[2], pkgRoot }));
}

/** All documented component sources: @auxiliary/vue plus @auxiliary/viz charts. */
export function componentList() {
  return [...barrelComponents(vueRoot), ...barrelComponents(vizRoot)];
}

/** Strip the meta's quoted/encoded default down to a display string, or null. */
function normalizeDefault(raw) {
  if (raw == null) return null;
  const v = String(raw).trim();
  if (v === '' || v === 'undefined') return null;
  try {
    const parsed = JSON.parse(v);
    if (typeof parsed === 'string') return parsed;
  } catch {
    /* not a JSON literal — keep as-is (e.g. `false`, `0`, `'down'`) */
  }
  return v.replace(/^['"]|['"]$/g, '');
}

/** Collapse multiline JSDoc / types to a single trimmed line. */
const oneLine = (s) => (s ? String(s).replace(/\s*\n\s*/g, ' ').trim() : '');

/** Drop the `| undefined` that optional props carry — optionality is shown by `required`. */
const cleanType = (t) => oneLine(t).replace(/\s*\|\s*undefined\b/g, '').trim();

/** Build the full metadata object: { [Name]: { file, props, events, slots } }. */
export function generateProps() {
  // One checker per package — each is a real TS program over that package's tsconfig.
  const checkers = new Map();
  const checkerFor = (pkgRoot) => {
    if (!checkers.has(pkgRoot)) {
      checkers.set(pkgRoot, createChecker(resolve(pkgRoot, 'tsconfig.json'), { forceUseTs: true }));
    }
    return checkers.get(pkgRoot);
  };
  const out = {};
  for (const { name, file, pkgRoot } of componentList()) {
    const meta = checkerFor(pkgRoot).getComponentMeta(resolve(pkgRoot, 'src', file)); // file is relative to src/index.ts
    out[name] = {
      file,
      props: meta.props
        .filter((p) => !p.global) // drop inherited HTMLAttributes / DOM attrs
        .map((p) => ({
          name: p.name,
          type: cleanType(p.type),
          default: normalizeDefault(p.default),
          required: Boolean(p.required),
          description: oneLine(p.description),
        })),
      events: meta.events.map((e) => ({ name: e.name, type: oneLine(e.type), description: oneLine(e.description) })),
      slots: meta.slots.map((s) => s.name),
    };
  }
  return out;
}

export const serialize = (data) => JSON.stringify(data, null, 2) + '\n';

// Run as a script (skipped when imported by the drift test).
if (import.meta.url === `file://${process.argv[1]}`) {
  mkdirSync(dirname(OUT_FILE), { recursive: true });
  const data = generateProps();
  writeFileSync(OUT_FILE, serialize(data));
  console.log(`✓ wrote props metadata for ${Object.keys(data).length} components → .vitepress/data/props.generated.json`);
}
