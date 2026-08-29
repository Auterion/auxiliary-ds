import { describe, it, expect } from 'vitest';
import { SURFACES, SURFACE_BY_ID, THEMES, REGISTERS, type Surface } from '../surfaces';

/**
 * The table is the contract (AD-D-038). These gates exist because every
 * consumer — tiles, bars, any spec panel — reads from it and restates nothing,
 * so a malformed row is a malformed screen everywhere at once.
 */
describe('the surface declaration table', () => {
  it('has a unique id per surface, and the index agrees with the list', () => {
    const ids = SURFACES.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(Object.keys(SURFACE_BY_ID).sort()).toEqual([...ids].sort());
    for (const s of SURFACES) expect(SURFACE_BY_ID[s.id]).toBe(s);
  });

  it('declares a theme and a register drawn from the two axes', () => {
    const themes = THEMES.map((t) => t.key);
    const registers = REGISTERS.map((r) => r.key);
    for (const s of SURFACES) {
      expect(themes, `${s.id}.theme`).toContain(s.theme);
      expect(registers, `${s.id}.register`).toContain(s.register);
    }
  });

  /**
   * A surface's default theme must be one it says it supports. This caught a
   * real drift: Nemyx defaulted to `dark` while declaring a theme list that
   * omitted the `light` theme it actually ships (AD-D-016).
   */
  it('lists its default theme among the themes it supports', () => {
    for (const s of SURFACES) {
      expect(s.themes, `${s.id} defaults to a theme it does not declare`).toContain(s.theme);
    }
  });

  it('declares at least one theme, with no duplicates', () => {
    for (const s of SURFACES) {
      expect(s.themes.length).toBeGreaterThan(0);
      expect(new Set(s.themes).size).toBe(s.themes.length);
    }
  });

  it('writes every prose field, and writes it as prose', () => {
    const sentence = (s: Surface, field: keyof Surface, value: string) => {
      expect(value.trim(), `${s.id}.${String(field)} is empty`).not.toBe('');
      expect(value.trim(), `${s.id}.${String(field)} has stray whitespace`).toBe(value);
    };
    for (const s of SURFACES) {
      sentence(s, 'chrome', s.chrome);
      sentence(s, 'formal', s.formal);
      sentence(s, 'blurb', s.blurb);
      sentence(s, 'level', s.level);
      sentence(s, 'stack', s.stack);
      // The bar prints `chrome` after the slash; a long one wrecks the strip.
      expect(s.chrome.length, `${s.id}.chrome is too long for the bar`).toBeLessThanOrEqual(12);
    }
  });

  it('gives every tab a distinct label within its surface', () => {
    for (const s of SURFACES) {
      expect(new Set(s.tabs).size, `${s.id} repeats a tab`).toBe(s.tabs.length);
      for (const tab of s.tabs) expect(tab.trim()).toBe(tab);
    }
  });

  /**
   * Simulation declares ANOTHER surface's axes on purpose: a rehearsal drawn in
   * a light, roomy desk theme would train the operator on a screen they will
   * never see again. If that ever stops being true it is a decision, not a typo.
   */
  it('keeps Simulation on the pair it rehearses', () => {
    expect(SURFACE_BY_ID.sim.theme).toBe(SURFACE_BY_ID.control.theme);
    expect(SURFACE_BY_ID.sim.register).toBe(SURFACE_BY_ID.control.register);
  });

  it('keeps Nemyx as the surface that carries every theme (AD-D-016)', () => {
    expect([...SURFACE_BY_ID.nemyx.themes].sort()).toEqual(
      [...THEMES.map((t) => t.key)].sort(),
    );
  });
});
