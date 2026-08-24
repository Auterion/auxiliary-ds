import { describe, it, expect } from 'vitest';
import {
  manifest,
  logos,
  getLogo,
  toneForTheme,
  resolveLogo,
  type Kind,
} from '../manifest';

const KINDS: Kind[] = ['mark', 'wordmark', 'lockup-horizontal', 'lockup-stacked'];

describe('brand manifest', () => {
  it('carries the org + product inventory', () => {
    const ids = logos.map((l) => l.id);
    expect(ids).toEqual(expect.arrayContaining(['auterion', 'mission-control', 'suite', 'os']));
    expect(getLogo('auterion')?.type).toBe('org');
    expect(getLogo('mission-control')?.type).toBe('product');
    expect(getLogo('mission-control')?.parent).toBe('auterion');
  });

  it('defines every kind × tone slot for every logo (pending or path)', () => {
    for (const logo of logos) {
      for (const kind of KINDS) {
        const tones = logo.variants[kind];
        expect(tones, `${logo.id}.${kind}`).toBeTruthy();
        for (const tone of manifest.tones) {
          expect(tones[tone], `${logo.id}.${kind}.${tone}`).toBeDefined();
        }
      }
    }
  });

  it('maps light/sunlight to color and dark/darknight to inverse', () => {
    expect(toneForTheme('light')).toBe('color');
    expect(toneForTheme('sunlight')).toBe('color');
    expect(toneForTheme('dark')).toBe('inverse');
    expect(toneForTheme('darknight')).toBe('inverse');
  });

  it('resolves a kind whose master is absent to pending', () => {
    // `wordmark` art hasn't landed; `mark` + `lockup-horizontal` have.
    const r = resolveLogo({ id: 'auterion', kind: 'wordmark' });
    expect(r).toBeDefined();
    expect(r!.status).toBe('pending');
    expect(r!.svg).toBeUndefined();
    expect(r!.minSize).toBe(getLogo('auterion')!.minSize.wordmark);
  });

  it('resolves a landed master to its inlined single-color SVG', () => {
    const r = resolveLogo({ id: 'auterion', kind: 'mark', theme: 'light' });
    expect(r).toBeDefined();
    expect(r!.status).toBe('available');
    expect(r!.svg).toContain('<svg');
    // The mono master serves every tone via currentColor.
    expect(r!.svg).toContain('currentColor');
    expect(r!.minSize).toBe(getLogo('auterion')!.minSize.mark);
  });

  it('returns undefined for an unknown logo id', () => {
    expect(resolveLogo({ id: 'nope' })).toBeUndefined();
  });

  it('names a forbidden context for every logo (usage rules are populated)', () => {
    for (const logo of logos) {
      expect(logo.forbidden.length, logo.id).toBeGreaterThan(0);
    }
  });

  it('declares the app-icon export targets', () => {
    expect(manifest.appIcons.targets).toEqual(
      expect.arrayContaining(['auterion', 'mission-control', 'suite', 'os']),
    );
    expect(manifest.appIcons.outputs.length).toBeGreaterThan(0);
  });
});
