import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { PUSH_PROGRAM } from '../src/push-logic.mjs';
import { PULL_PROGRAM } from '../src/pull-logic.mjs';
import { COMPONENTS_PROGRAM } from '../src/components-logic.mjs';
import { buildComponentSpec } from '../src/component-spec.mjs';

/**
 * Guards the push program (ROADMAP Phase 5a). It's executed in Figma via use_figma,
 * so it never goes through the normal build/lint of executable code — this asserts it
 * is at least syntactically valid and still drives the Variable + Effect Style API.
 * A typo here would silently no-op the live sync.
 */
describe('figma-sync push program', () => {
  it('is syntactically valid (parses as an async program with DATA/SHADOWS/figma)', () => {
    // use_figma auto-wraps in an async context; mirror that to validate top-level await.
    expect(
      () => new Function('DATA', 'SHADOWS', 'figma', `return (async () => {${PUSH_PROGRAM}})()`),
    ).not.toThrow();
  });

  it('drives the variable + effect-style API and resolves aliases', () => {
    for (const marker of [
      'createVariableCollection',
      'getLocalVariablesAsync',
      'figma.variables.createVariable(',
      "type: 'VARIABLE_ALIAS'",
      'createEffectStyle',
      'scopesFor',
    ]) {
      expect(PUSH_PROGRAM, `program should reference ${marker}`).toContain(marker);
    }
  });

  it('contains no backtick — it is embedded in a template literal by the build', () => {
    expect(PUSH_PROGRAM).not.toContain('`');
  });
});

/**
 * The pull program has the same problem as the push — it only ever runs inside Figma —
 * plus one of its own: it must stay READ-ONLY. A mutating call reaching this program
 * would quietly turn a drift report into an unreviewed write, which is exactly what
 * README Principle 1 forbids. That is asserted here rather than trusted to review.
 */
describe('figma-sync pull program', () => {
  it('is syntactically valid (parses as an async program)', () => {
    expect(
      () => new Function('WANT', 'INCLUDE_STYLES', 'figma', `return (async () => {${PULL_PROGRAM}})()`),
    ).not.toThrow();
  });

  it('reads the variable and style APIs', () => {
    for (const marker of [
      'getLocalVariableCollectionsAsync',
      'getLocalVariablesAsync',
      'getLocalEffectStylesAsync',
      'getLocalTextStylesAsync',
      'rgbaToHex',
      'VARIABLE_ALIAS',
    ]) {
      expect(PULL_PROGRAM, `program should reference ${marker}`).toContain(marker);
    }
  });

  it('calls nothing that mutates the file', () => {
    for (const forbidden of [
      'createVariable',
      'createVariableCollection',
      'setValueForMode',
      'createEffectStyle',
      'createTextStyle',
      'renameMode',
      'addMode',
      'remove(',
      '.effects =',
      '.scopes =',
    ]) {
      expect(PULL_PROGRAM, `pull program must not call ${forbidden}`).not.toContain(forbidden);
    }
  });

  it('contains no backtick — it is embedded in a template literal by the build', () => {
    expect(PULL_PROGRAM).not.toContain('`');
  });
});

/**
 * The component program has the push's problem (only ever runs inside Figma) plus a
 * sharper one: it writes COMPONENTS, and a component set is bound into every design
 * that instantiates it. A bug here does not merely fail — it duplicates sets, orphans
 * instances, or produces components that look right and carry no variable bindings.
 */
describe('figma-sync component program', () => {
  it('is syntactically valid (parses as an async program with SPEC/figma)', () => {
    expect(
      () => new Function('SPEC', 'figma', `return (async () => {${COMPONENTS_PROGRAM}})()`),
    ).not.toThrow();
  });

  it('binds variables rather than writing literal values', () => {
    for (const marker of [
      'setBoundVariable',
      'setBoundVariableForPaint',
      'setExplicitVariableModeForCollection',
      'combineAsVariants',
      'loadFontAsync',
    ]) {
      expect(COMPONENTS_PROGRAM, `program should reference ${marker}`).toContain(marker);
    }
  });

  it('reconciles in place instead of appending', () => {
    // Idempotency is the difference between "re-run to sync" and "re-run to duplicate".
    expect(COMPONENTS_PROGRAM).toContain("n.type === 'COMPONENT_SET' && n.name === setName");
    expect(COMPONENTS_PROGRAM).toContain('child.remove()');
  });

  it('contains no backtick — it is embedded in a template literal by the build', () => {
    expect(COMPONENTS_PROGRAM).not.toContain('`');
  });
});

/**
 * The spec builder is the half of the component sync that CI can gate properly: it is
 * pure, it holds every CSS-to-Figma decision, and it runs without Figma.
 */
describe('component spec', () => {
  const schema = JSON.parse(
    readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), '../../css/component-schema.json'), 'utf8'),
  );
  const { spec, skipped } = buildComponentSpec(schema);

  it('covers every flat recipe and skips nothing silently', () => {
    expect(skipped).toEqual([]);
    expect(Object.keys(spec).sort()).toEqual(
      ['Avatar', 'Badge', 'Button', 'Input', 'Label', 'Separator', 'Skeleton', 'Textarea', 'Tooltip'],
    );
  });

  it('carries the size variant as a Figma MODE, not three bindings', () => {
    const md = spec.Button.variants.find((v) => v.name === 'Variant=primary, Size=md, Loading=false, State=rest');
    expect(md.mode).toBe('md');
    expect(md.frame.height).toEqual({ figma: 'Component/button/height', mode: 'md', alpha: null });
    expect(md.frame.paddingX).toEqual({ figma: 'Component/button/padding-x', mode: 'md', alpha: null });
  });

  it('binds the design value, not the touch floor', () => {
    // `height` resolves to max(var(--component-button-height-md), var(--target-floor)).
    // --target-floor is the coarse-pointer minimum — a runtime response to the input
    // device. Binding it would freeze a 44px button into the library.
    const md = spec.Button.variants.find((v) => v.name === 'Variant=primary, Size=md, Loading=false, State=rest');
    expect(md.frame.height.figma).not.toContain('target');
  });

  it('resolves colour through the Theme collection', () => {
    const md = spec.Button.variants.find((v) => v.name === 'Variant=primary, Size=md, Loading=false, State=rest');
    expect(md.frame.fill).toEqual({ figma: 'Theme/primary', mode: null, alpha: null });
    expect(md.text.fill).toEqual({ figma: 'Theme/primary-foreground', mode: null, alpha: null });
  });

  it('gives disabled a variant and hover none', () => {
    // hover/active are opacity modifiers with no token behind them; materialising one
    // writes a literal colour that pnpm figma:diff then reports as untokenised drift.
    expect(spec.Button.props.State).toEqual(['rest', 'disabled']);
    const disabled = spec.Button.variants.find((v) => v.name.endsWith('State=disabled'));
    expect(disabled.frame.opacity).toEqual({ figma: 'Global/opacity/disabled', mode: null, alpha: null });
    expect(spec.Button.variants.some((v) => v.name.includes('hover'))).toBe(false);
  });

  it('omits a text child where the recipe styles no type', () => {
    // Avatar, Separator and Skeleton carry no colour or font-size on their slot.
    // Inventing a label would put a string in the file that no recipe produces.
    expect(spec.Separator.variants.every((v) => v.text === null)).toBe(true);
    expect(spec.Skeleton.variants.every((v) => v.text === null)).toBe(true);
    expect(spec.Button.variants.every((v) => v.text?.characters === 'Button')).toBe(true);
  });
});
