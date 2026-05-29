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
 * we build fresh and assert the structure holds: two collections, the 4 semantic
 * modes, every alias resolves to a real primitive, and the non-representable types
 * (shadow, cubicBezier) are excluded.
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

beforeAll(() => {
  // Build fresh so the test validates current source, not a stale artifact.
  execFileSync('node', ['build.mjs'], { cwd: tokensRoot, stdio: 'pipe' });
  const json = JSON.parse(readFileSync(resolve(tokensRoot, 'dist/figma-native.json'), 'utf8'));
  collections = json.collections;
});

const byName = (n: string) => collections.find((c) => c.name === n)!;
const isAlias = (v: unknown): v is { alias: string } =>
  typeof v === 'object' && v !== null && 'alias' in v;

describe('figma-native contract', () => {
  it('emits exactly the Primitives + Semantic collections', () => {
    expect(collections.map((c) => c.name)).toEqual(['Primitives', 'Semantic']);
  });

  it('Primitives has a single mode; Semantic has the 4 theme modes', () => {
    expect(byName('Primitives').modes).toEqual(['Base']);
    expect(byName('Semantic').modes).toEqual(['light', 'dark', 'sunlight', 'darknight']);
  });

  it('every alias resolves to a real Primitives variable (no dangling refs)', () => {
    const primNames = new Set(byName('Primitives').variables.map((v) => `Primitives/${v.name}`));
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

  it('every Semantic role is a COLOR aliased across all 4 modes', () => {
    for (const v of byName('Semantic').variables) {
      expect(v.type).toBe('COLOR');
      expect(Object.keys(v.valuesByMode).sort()).toEqual(['dark', 'darknight', 'light', 'sunlight']);
      expect(Object.values(v.valuesByMode).every(isAlias)).toBe(true);
    }
  });

  it('excludes non-representable types (shadow, cubicBezier/easing)', () => {
    const names = byName('Primitives').variables.map((v) => v.name);
    expect(names.some((n) => n.startsWith('shadow/'))).toBe(false);
    expect(names.some((n) => n.startsWith('ease/') || n.includes('bezier'))).toBe(false);
  });
});
