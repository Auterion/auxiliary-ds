import { describe, expect, it } from 'vitest';
import { PUSH_PROGRAM } from '../src/push-logic.mjs';

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
});
