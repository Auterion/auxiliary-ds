import { describe, expect, it } from 'vitest';
import { PUSH_PROGRAM } from '../src/push-logic.mjs';
import { PULL_PROGRAM } from '../src/pull-logic.mjs';

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
