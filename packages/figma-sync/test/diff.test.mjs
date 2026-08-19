import { describe, expect, it } from 'vitest';
import { diff, format, styleNameForRole } from '../src/diff.mjs';

/**
 * The comparator is the only part of the reverse sync that CI can honestly gate.
 *
 * Fetching from Figma needs an interactively-authenticated MCP session (and the
 * Variables REST API is Enterprise-only while Auterion is Organization tier), so no
 * automated job can ever answer "is Figma actually in sync?". What CI CAN guarantee is
 * that when someone does fetch, the comparison is correct — that every kind of drift is
 * still detected and that a matching pair still reports clean.
 *
 * A silent comparator is the failure mode that matters: a report saying "no drift"
 * because the join key stopped matching looks exactly like success.
 */

/** Minimal expected-side document in the figma-native.json shape. */
const expected = () => ({
  collections: [
    {
      name: 'Theme',
      modes: ['light', 'dark'],
      variables: [
        {
          name: 'background',
          type: 'COLOR',
          valuesByMode: {
            light: { alias: 'Global/color/primitive/white' },
            dark: { alias: 'Global/color/primitive/ink/950' },
          },
        },
        {
          name: 'card',
          type: 'COLOR',
          valuesByMode: { light: '#ffffff', dark: '#0d0e10' },
        },
      ],
    },
    {
      name: 'Component',
      modes: ['sm', 'md', 'lg'],
      variables: [
        { name: 'button/radius', type: 'FLOAT', valuesByMode: { sm: 4, md: 4, lg: 4 } },
      ],
    },
  ],
  textStyles: [
    {
      name: 'product/body-lg',
      fontFamilyCandidates: ['Inter', 'Inter Variable'],
      fontStyle: 'Semi Bold',
      fontSize: 18,
      lineHeightPercent: 140,
      letterSpacingPercent: -1,
      fontSizeVar: 'Global/text/lg',
    },
  ],
  shadows: {
    'shadow/sm': [
      {
        type: 'DROP_SHADOW',
        color: { r: 0, g: 0, b: 0, a: 0.08 },
        offset: { x: 0, y: 1 },
        radius: 2,
        spread: 0,
      },
    ],
  },
});

/** The matching actual-side document, as pull-logic.mjs would return it. */
const actual = () => ({
  collections: [
    {
      name: 'Theme',
      modes: ['light', 'dark'],
      variables: [
        {
          name: 'background',
          type: 'COLOR',
          valuesByMode: {
            light: { alias: 'Global/color/primitive/white' },
            dark: { alias: 'Global/color/primitive/ink/950' },
          },
        },
        { name: 'card', type: 'COLOR', valuesByMode: { light: '#ffffff', dark: '#0d0e10' } },
      ],
    },
    {
      name: 'Component',
      modes: ['sm', 'md', 'lg'],
      variables: [
        { name: 'button/radius', type: 'FLOAT', valuesByMode: { sm: 4, md: 4, lg: 4 } },
      ],
    },
  ],
  effectStyles: {
    'shadow/sm': [
      {
        type: 'DROP_SHADOW',
        color: { r: 0, g: 0, b: 0, a: 0.08 },
        offset: { x: 0, y: 1 },
        radius: 2,
        spread: 0,
        visible: true,
        blendMode: 'NORMAL',
      },
    ],
  },
  textStyles: [
    {
      name: 'Type/Product/Body Large',
      fontFamily: 'Inter',
      fontStyle: 'Semi Bold',
      fontSize: 18,
      lineHeightPercent: 140,
      letterSpacingPercent: -1,
      fontSizeVar: 'Global/text/lg',
    },
  ],
});

const run = (e, a) => diff(e, a, { expectedShadows: e.shadows });
const kinds = (report) => report.findings.map((f) => f.kind);
/** Find the Theme collection's variable list in a document. */
const semantic = (doc) => doc.collections.find((c) => c.name === 'Theme');

describe('a file that matches the contract', () => {
  it('reports no drift at all', () => {
    const report = run(expected(), actual());
    expect(report.findings, format(report)).toEqual([]);
    expect(report.clean).toBe(true);
    expect(format(report)).toContain('no drift');
  });

  it('is not clean merely because nothing was compared', () => {
    // Positive control for the whole suite. If the join key ever stops matching, every
    // test above would still pass while the tool silently reported success forever.
    const e = expected();
    semantic(e).variables[1].valuesByMode.dark = '#111111';
    const report = run(e, actual());
    expect(report.clean).toBe(false);
    expect(kinds(report)).toContain('changed');
  });
});

describe('value drift', () => {
  it('detects a changed literal, naming the mode and both sides', () => {
    const a = actual();
    semantic(a).variables[1].valuesByMode.dark = '#131417';
    const report = run(expected(), a);
    const changed = report.findings.find((f) => f.kind === 'changed');
    expect(changed.key).toBe('Theme/card');
    expect(changed.changes).toEqual([{ mode: 'dark', expected: '#0d0e10', actual: '#131417' }]);
    expect(format(report)).toContain('#0d0e10');
    expect(format(report)).toContain('#131417');
  });

  it('detects a re-pointed alias', () => {
    const a = actual();
    semantic(a).variables[0].valuesByMode.dark = { alias: 'Global/color/primitive/black' };
    const report = run(expected(), a);
    const changed = report.findings.find((f) => f.kind === 'changed');
    expect(changed.key).toBe('Theme/background');
    expect(changed.changes[0].actual).toEqual({ alias: 'Global/color/primitive/black' });
  });

  it('does not confuse an alias with a literal of the same text', () => {
    const a = actual();
    semantic(a).variables[0].valuesByMode.dark = 'Global/color/primitive/ink/950';
    expect(kinds(run(expected(), a))).toContain('changed');
  });

  it('reports a dangling alias target rather than passing it over', () => {
    const a = actual();
    semantic(a).variables[0].valuesByMode.dark = { alias: 'UNRESOLVED:VariableID:9:9' };
    const changed = run(expected(), a).findings.find((f) => f.kind === 'changed');
    expect(changed.changes[0].actual.alias).toContain('UNRESOLVED');
  });
});

describe('structural drift', () => {
  it('flags a variable Figma gained', () => {
    const a = actual();
    semantic(a).variables.push({ name: 'signal-text', type: 'COLOR', valuesByMode: { light: '#1355c4', dark: '#6ba2f8' } });
    const report = run(expected(), a);
    expect(report.findings.find((f) => f.kind === 'new-in-figma').key).toBe('Theme/signal-text');
  });

  it('flags a variable Figma lacks', () => {
    const a = actual();
    semantic(a).variables.pop();
    const report = run(expected(), a);
    expect(report.findings.find((f) => f.kind === 'missing-in-figma').key).toBe('Theme/card');
  });

  it('flags a type change and does not then compare values across it', () => {
    const a = actual();
    semantic(a).variables[1].type = 'FLOAT';
    const report = run(expected(), a);
    expect(kinds(report)).toContain('type-mismatch');
    expect(report.findings.filter((f) => f.kind === 'changed' && f.key === 'Theme/card')).toEqual([]);
  });

  it('flags mode drift once per collection, not once per variable', () => {
    const a = actual();
    semantic(a).modes = ['light', 'dark', 'sunlight'];
    const report = run(expected(), a);
    const mm = report.findings.filter((f) => f.kind === 'mode-mismatch');
    expect(mm).toHaveLength(1);
    expect(mm[0].extraModes).toEqual(['sunlight']);
  });

  it('reports a wholly absent collection once, not once per variable', () => {
    const a = actual();
    a.collections = a.collections.filter((c) => c.name !== 'Theme');
    const report = run(expected(), a);
    expect(report.findings.filter((f) => f.kind === 'missing-collection')).toHaveLength(1);
    // The 2 Theme variables must NOT each restate it.
    expect(report.findings.filter((f) => f.kind === 'missing-in-figma')).toEqual([]);
  });

  it("ignores a designer's own collection entirely", () => {
    const a = actual();
    a.collections.push({
      name: 'Scratch — brand exploration',
      modes: ['Base'],
      variables: [{ name: 'wip/hero', type: 'COLOR', valuesByMode: { Base: '#ff00ff' } }],
    });
    expect(run(expected(), a).clean).toBe(true);
  });
});

describe('probable renames', () => {
  it('pairs a missing name with a gained one holding identical values', () => {
    const a = actual();
    semantic(a).variables[1] = {
      name: 'surface',
      type: 'COLOR',
      valuesByMode: { light: '#ffffff', dark: '#0d0e10' },
    };
    const report = run(expected(), a);
    expect(report.renames).toEqual([
      { kind: 'probable-rename', from: 'Theme/card', to: 'Theme/surface' },
    ]);
    expect(format(report)).toContain('NOT applied');
  });

  it('stays silent when the match is ambiguous', () => {
    // Two gained variables share the missing one's values — "renamed to one of these
    // two" is worse than nothing, so nothing is offered.
    const a = actual();
    const twin = { light: '#ffffff', dark: '#0d0e10' };
    semantic(a).variables[1] = { name: 'surface', type: 'COLOR', valuesByMode: { ...twin } };
    semantic(a).variables.push({ name: 'panel', type: 'COLOR', valuesByMode: { ...twin } });
    expect(run(expected(), a).renames).toEqual([]);
  });

  it('does not pair on a value that is commonplace elsewhere', () => {
    // Regression from the first real run against auxiliary-ds: pairing on uniqueness
    // *within the unmatched sets* matched `control/height/xs` to
    // `density/control-height/compact` purely because both were 28. A value shared with
    // any other variable identifies nothing.
    const e = expected();
    const a = actual();
    const comp = (doc) => doc.collections.find((c) => c.name === 'Component');
    comp(e).variables.push({ name: 'input/radius', type: 'FLOAT', valuesByMode: { sm: 4, md: 4, lg: 4 } });
    comp(a).variables.push({ name: 'field/corner', type: 'FLOAT', valuesByMode: { sm: 4, md: 4, lg: 4 } });
    // `button/radius` is also 4/4/4 on both sides, so 4 is not distinctive.
    expect(run(e, a).renames).toEqual([]);
  });

  it('does not pair across differing values', () => {
    const a = actual();
    semantic(a).variables[1] = {
      name: 'surface',
      type: 'COLOR',
      valuesByMode: { light: '#eeeeee', dark: '#0d0e10' },
    };
    expect(run(expected(), a).renames).toEqual([]);
  });

  it('distinguishes aliases that differ only in target', () => {
    // Guards the signature builder: an earlier version filtered nested keys away, which
    // collapsed every aliased variable to one identical signature and paired them at random.
    const e = expected();
    const a = actual();
    semantic(e).variables[1] = {
      name: 'card',
      type: 'COLOR',
      valuesByMode: { light: { alias: 'Global/a' }, dark: { alias: 'Global/b' } },
    };
    semantic(a).variables[1] = {
      name: 'surface',
      type: 'COLOR',
      valuesByMode: { light: { alias: 'Global/x' }, dark: { alias: 'Global/y' } },
    };
    expect(run(e, a).renames).toEqual([]);
  });
});

describe('styles', () => {
  it('maps a role name to its Figma style name', () => {
    expect(styleNameForRole('product/body-lg')).toBe('Type/Product/Body Large');
    expect(styleNameForRole('marketing/display')).toBe('Type/Marketing/Display');
  });

  it('detects a changed text style and a downgraded font', () => {
    const a = actual();
    a.textStyles[0].fontSize = 20;
    a.textStyles[0].fontFamily = 'Helvetica';
    const report = run(expected(), a);
    const f = report.findings.find((x) => x.kind === 'changed-text-style');
    expect(f.name).toBe('Type/Product/Body Large');
    expect(f.changes.map((c) => c.prop)).toEqual(['fontSize', 'fontFamily']);
  });

  it('accepts any candidate family, and a no-space weight variant', () => {
    const a = actual();
    a.textStyles[0].fontFamily = 'Inter Variable'; // second candidate
    a.textStyles[0].fontStyle = 'SemiBold'; // the push's own fallback spelling
    expect(run(expected(), a).clean).toBe(true);
  });

  it('detects a missing text style', () => {
    const a = actual();
    a.textStyles = [];
    expect(kinds(run(expected(), a))).toContain('missing-text-style');
  });

  it('detects a changed effect style but tolerates float noise', () => {
    const a = actual();
    a.effectStyles['shadow/sm'][0].color.a = 0.08000000119209; // Figma float round-trip
    expect(run(expected(), a).clean).toBe(true);

    a.effectStyles['shadow/sm'][0].radius = 6;
    expect(kinds(run(expected(), a))).toContain('changed-effect-style');
  });

  it('detects a missing effect style', () => {
    const a = actual();
    a.effectStyles = {};
    expect(kinds(run(expected(), a))).toContain('missing-effect-style');
  });

  it('says nothing about styles when the payload carried none', () => {
    // Per-collection pulls omit styles; absent must not read as deleted.
    const a = actual();
    a.effectStyles = null;
    a.textStyles = null;
    expect(run(expected(), a).clean).toBe(true);
  });
});
