import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';

/**
 * Integrity gate for the figma-native contract (ROADMAP Phase 5a).
 *
 * dist/figma-native.json is what @auxiliary/figma-sync pushes into Figma Variables.
 * A dangling alias or a missing mode would silently corrupt the synced library, so
 * we build fresh and assert the structure holds: three collections, the 4 theme
 * modes, every alias resolves to a real global, and the non-representable types
 * (shadow, cubicBezier) are excluded.
 *
 * Collections are named for the GTC tiers they carry — Global / Theme / Component —
 * so a Figma binding path and a token path read the same. Unlike a variable *path*,
 * a collection name is safe to change: Figma binds by variable id, not qualified name.
 */
const here = dirname(fileURLToPath(import.meta.url));
const tokensRoot = resolve(here, '..');

interface Variable {
  name: string;
  type: 'COLOR' | 'FLOAT' | 'STRING';
  valuesByMode: Record<string, unknown>;
}
interface Collection {
  name: string;
  modes: string[];
  variables: Variable[];
}

let collections: Collection[];
let textStyles: { name: string }[];

beforeAll(() => {
  // Build fresh so the test validates current source, not a stale artifact — but into a
  // PRIVATE directory. The build wipes its output first, and dist/ is read at test time
  // by packages/css (which derives its component schema from figma-native.json +
  // tokens.css). Rebuilding in place would delete that directory out from under a
  // suite turbo is running concurrently, surfacing as a missing module somewhere else.
  const out = 'dist-test-figma-native';
  execFileSync('node', ['build.mjs'], {
    cwd: tokensRoot,
    stdio: 'pipe',
    env: { ...process.env, AUX_TOKENS_OUT: out },
  });
  const json = JSON.parse(readFileSync(resolve(tokensRoot, out, 'figma-native.json'), 'utf8'));
  collections = json.collections;
  textStyles = json.textStyles;
});

const byName = (n: string) => collections.find((c) => c.name === n)!;
const isAlias = (v: unknown): v is { alias: string } =>
  typeof v === 'object' && v !== null && 'alias' in v;

describe('figma-native contract', () => {
  it('emits exactly the Global + Theme + Component collections', () => {
    expect(collections.map((c) => c.name)).toEqual(['Global', 'Theme', 'Component']);
  });

  it('Global has one mode; Theme has the 4 themes; Component has the size axis', () => {
    expect(byName('Global').modes).toEqual(['Base']);
    expect(byName('Theme').modes).toEqual(['light', 'dark', 'sunlight', 'darknight']);
    expect(byName('Component').modes).toEqual(['sm', 'md', 'lg']);
  });

  it('never leaks a GTC tier into a variable name', () => {
    // THE ORPHAN GUARD. Figma variable paths are an emitted public name with a live
    // external consumer: the push program creates any name it does not find and never
    // deletes, so renaming `spacing/4` to `global/spacing/4` would not move the bound
    // instances — it would silently create 400+ duplicates and orphan the originals,
    // returning success. GTC itself says the Group is carried by the collection, so
    // the tier must be stripped from the path.
    const leaked = collections.flatMap((c) =>
      c.variables.map((v) => v.name).filter((n) => /^(global|theme|component|register)\//.test(n)),
    );
    expect(leaked).toEqual([]);
  });

  it('every alias resolves to a real Global variable (no dangling refs)', () => {
    const primNames = new Set(byName('Global').variables.map((v) => `Global/${v.name}`));
    const dangling: string[] = [];
    for (const coll of collections) {
      for (const v of coll.variables) {
        for (const value of Object.values(v.valuesByMode)) {
          if (isAlias(value) && !primNames.has(value.alias)) dangling.push(`${v.name} → ${value.alias}`);
        }
      }
    }
    expect(dangling).toEqual([]);
  });

  it('every Theme role is a COLOR aliased across all 4 modes', () => {
    for (const v of byName('Theme').variables) {
      expect(v.type).toBe('COLOR');
      expect(Object.keys(v.valuesByMode).sort()).toEqual(['dark', 'darknight', 'light', 'sunlight']);
      expect(Object.values(v.valuesByMode).every(isAlias)).toBe(true);
    }
  });

  it('every Component variable is structural, aliased, and defined in all 3 size modes', () => {
    const vars = byName('Component').variables;
    expect(vars.length).toBeGreaterThan(100);
    for (const v of vars) {
      // Colour belongs to the theme axis; a component colour would be invisible to
      // the per-theme contrast/CVD gates.
      expect(v.type, `${v.name} must not be a COLOR`).toBe('FLOAT');
      expect(Object.keys(v.valuesByMode).sort(), `${v.name} modes`).toEqual(['lg', 'md', 'sm']);
      expect(Object.values(v.valuesByMode).every(isAlias), `${v.name} must alias`).toBe(true);
    }
  });

  it('excludes non-representable types (shadow, cubicBezier/easing, strokeStyle)', () => {
    const names = byName('Global').variables.map((v) => v.name);
    expect(names.some((n) => n.startsWith('shadow/'))).toBe(false);
    expect(names.some((n) => n.startsWith('ease/') || n.includes('bezier'))).toBe(false);
    // strokeStyle is a keyword — it would land as a FLOAT with a null value.
    expect(names.some((n) => n.startsWith('border-style/'))).toBe(false);
  });

  it('keeps Text Style names stable', () => {
    // These name Figma Text Styles that already exist in the file. A rename does not
    // rename them on push — it creates a second set alongside the originals.
    expect(textStyles.map((s) => s.name).sort()).toEqual([
      'marketing/body',
      'marketing/caption',
      'marketing/display',
      'marketing/h1',
      'marketing/h2',
      'marketing/h3',
      'marketing/lead',
      'product/body',
      'product/body-lg',
      'product/caption',
      'product/display',
      'product/heading',
      'product/label',
      'product/title',
    ]);
  });
});
