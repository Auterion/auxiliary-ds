import { describe, expect, it } from 'vitest';
import { decodePull, mapCollectionNames } from '../src/decode-pull.mjs';

/**
 * The wire format between pull-logic.mjs (in Figma) and the comparator (in Node) is the
 * one place the two halves can silently disagree — the encoder runs somewhere these
 * tests cannot reach. Everything here pins the contract from the decoder's side.
 *
 * The truncation guards matter most: a partial pull that decodes cleanly produces a page
 * of confident, wrong `missing-in-figma` findings, which is worse than an error.
 */

const doc = (over = {}) => ({
  format: 'rows/1',
  more: false,
  collections: [
    {
      name: 'Semantic',
      modes: ['light', 'dark'],
      total: 2,
      rows: [
        'background\tCOLOR\t@Primitives/color/base/white\t@Primitives/color/ink/950',
        'card\tCOLOR\t#ffffff\t#0d0e10',
      ],
    },
  ],
  effectStyles: null,
  textStyles: null,
  ...over,
});

describe('decodePull', () => {
  it('expands positional rows into the figma-native shape', () => {
    expect(decodePull(doc()).collections[0]).toEqual({
      name: 'Semantic',
      modes: ['light', 'dark'],
      variables: [
        {
          name: 'background',
          type: 'COLOR',
          valuesByMode: {
            light: { alias: 'Primitives/color/base/white' },
            dark: { alias: 'Primitives/color/ink/950' },
          },
        },
        { name: 'card', type: 'COLOR', valuesByMode: { light: '#ffffff', dark: '#0d0e10' } },
      ],
    });
  });

  it('coerces by declared type, not by how the text looks', () => {
    const d = doc({
      collections: [
        {
          name: 'Primitives',
          modes: ['Base'],
          total: 3,
          rows: ['spacing/4\tFLOAT\t16', 'font/weight\tSTRING\t0080', 'flag/on\tBOOLEAN\ttrue'],
        },
      ],
    });
    const vars = decodePull(d).collections[0].variables;
    expect(vars[0].valuesByMode.Base).toBe(16);
    // The trap: a STRING that parses as a number must stay a string.
    expect(vars[1].valuesByMode.Base).toBe('0080');
    expect(vars[2].valuesByMode.Base).toBe(true);
  });

  it('treats an empty cell as a mode genuinely unset, not as empty string', () => {
    const d = doc({
      collections: [{ name: 'Semantic', modes: ['light', 'dark'], total: 1, rows: ['x\tCOLOR\t#fff\t'] }],
    });
    expect(decodePull(d).collections[0].variables[0].valuesByMode).toEqual({ light: '#fff' });
  });

  it('round-trips tabs and backslashes in names', () => {
    const d = doc({
      collections: [
        { name: 'Primitives', modes: ['Base'], total: 1, rows: ['odd\\tname\\\\x\tSTRING\tv'] },
      ],
    });
    expect(decodePull(d).collections[0].variables[0].name).toBe('odd\tname\\x');
  });

  it('preserves a dangling alias marker rather than smoothing it over', () => {
    const d = doc({
      collections: [
        { name: 'Semantic', modes: ['light'], total: 1, rows: ['x\tCOLOR\t@UNRESOLVED:VariableID:9:9'] },
      ],
    });
    expect(decodePull(d).collections[0].variables[0].valuesByMode.light).toEqual({
      alias: 'UNRESOLVED:VariableID:9:9',
    });
  });

  it('refuses a truncated pull', () => {
    expect(() => decodePull(doc({ more: true }))).toThrow(/truncated/);
  });

  it('refuses a collection returning fewer rows than it claims', () => {
    const d = doc();
    d.collections[0].total = 99;
    expect(() => decodePull(d)).toThrow(/partial/);
  });

  it('refuses an unknown wire format instead of guessing', () => {
    expect(() => decodePull(doc({ format: 'rows/2' }))).toThrow(/unknown wire format/);
    expect(() => decodePull({ collections: [] })).toThrow(/unknown wire format/);
  });
});

describe('mapCollectionNames', () => {
  it('renames collections and the alias targets that point at them', () => {
    const decoded = decodePull(
      doc({
        collections: [
          {
            name: 'Theme',
            modes: ['light'],
            total: 1,
            rows: ['background\tCOLOR\t@Global/color/base/white'],
          },
        ],
      }),
    );
    const mapped = mapCollectionNames(decoded, { Theme: 'Semantic', Global: 'Primitives' });
    expect(mapped.collections[0].name).toBe('Semantic');
    // The alias is collection-qualified too — renaming only the collection would leave
    // every alias pointing at a name that no longer exists, reporting all of them changed.
    expect(mapped.collections[0].variables[0].valuesByMode.light).toEqual({
      alias: 'Primitives/color/base/white',
    });
  });

  it('leaves unmapped collections and literal values alone', () => {
    const decoded = decodePull(doc());
    const mapped = mapCollectionNames(decoded, { Global: 'Primitives' });
    expect(mapped.collections[0].name).toBe('Semantic');
    expect(mapped.collections[0].variables[1].valuesByMode.light).toBe('#ffffff');
  });

  it('is a no-op with no mapping', () => {
    const decoded = decodePull(doc());
    expect(mapCollectionNames(decoded, {})).toBe(decoded);
  });
});
