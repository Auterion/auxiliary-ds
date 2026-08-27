import { describe, expect, it } from 'vitest';
import { ENTITIES, SURFACES, type SurfaceId } from '../src/eco/surfaces';

/**
 * The ecosystem demo's declaration table has to stay coherent with itself.
 *
 * `eco/surfaces.ts` is the single source for the launcher tiles, the six
 * identity bars, the spec ledger and the object resolver — which is the point
 * of the page, and also its one real failure mode: every one of those panels
 * renders GENERATED prose from the table, so a bad row does not look like a bad
 * row. It looks like a sentence.
 *
 * The bug that prompted this file shipped and read fine in review: the vehicle's
 * noun for the device surface was "This airframe", and the resolver rendered
 * "Opens as a this airframe." One demonstrative, in a data file, three
 * components away from the string that showed it.
 *
 * WHAT THIS CANNOT CHECK: whether a reason is *true* of the product — only that
 * one exists, is specific, and is a sentence. And it says nothing about layout;
 * see `demo-ramp-contrast.test.ts` and `no-restated-ladders.test.ts` for the
 * colour and ladder halves.
 */

const IDS = SURFACES.map((s) => s.id);

describe('surface table', () => {
  it('has no duplicate surface ids', () => {
    expect(new Set(IDS).size).toBe(IDS.length);
  });

  it('defaults every surface to a theme its brand entry supports', () => {
    for (const s of SURFACES) {
      expect(s.themes, `${s.id} defaults to ${s.theme}`).toContain(s.theme);
    }
  });

  it('gives every surface a chrome name short enough for the bar', () => {
    // Eight is measured, not guessed. At a 320px container — the width the
    // container query in `_eco.css` targets — the longest name in the table
    // (INSIGHTS, 8) leaves the flexible spacer at exactly 0px with the tab strip
    // already at its 3.5rem floor. A ninth character overflows the bar and pushes
    // the org pill, the one thing in there answering a safety question, past the
    // clipped edge. If a surface needs a longer word, the bar has to change
    // first: this number is a property of that layout, not a style preference.
    for (const s of SURFACES) {
      expect(s.chrome.length, `${s.id} chrome name`).toBeLessThanOrEqual(8);
    }
  });
});

describe('object grammar', () => {
  it('names a resolution for every surface that opens the object', () => {
    for (const e of ENTITIES) {
      for (const id of e.opens) {
        expect(e.as[id], `${e.kind} opens in ${id} but has no noun`).toBeTruthy();
      }
    }
  });

  it('gives a specific reason for every surface that does not', () => {
    for (const e of ENTITIES) {
      for (const id of IDS.filter((i) => !e.opens.includes(i))) {
        const why = e.why[id];
        expect(why, `${e.kind} on ${id}`).toBeTruthy();
        expect(why, `${e.kind} on ${id} must end as a sentence`).toMatch(/\.$/);
        // "Unavailable" teaches nothing; the point of greying rather than hiding
        // is that the operator learns the shape of the system.
        expect(why?.toLowerCase()).not.toMatch(/^(unavailable|not available|n\/a)/);
      }
    }
  });

  it('carries no entry for a surface on the wrong side of the line', () => {
    for (const e of ENTITIES) {
      for (const id of Object.keys(e.as) as SurfaceId[]) {
        expect(e.opens, `${e.kind}.as names ${id}, which it cannot open`).toContain(id);
      }
      for (const id of Object.keys(e.why) as SurfaceId[]) {
        expect(e.opens, `${e.kind}.why explains ${id}, which it can open`).not.toContain(id);
      }
    }
  });

  it('reads as a sentence when the resolver drops it into one', () => {
    for (const e of ENTITIES) {
      for (const id of e.opens) {
        const phrase = e.as[id] ?? '';
        // The resolver renders `Opens as ${phrase}.` verbatim. The article is
        // part of the copy because English picks it by sound, not by spelling:
        // "a utilisation record" and "an update target" open on the same letter.
        expect(phrase, `${e.kind}/${id} needs its own article`).toMatch(/^(a|an|the) /);
        // A demonstrative is what produced "Opens as a this airframe."
        expect(phrase, `${e.kind}/${id}`).not.toMatch(/^(this|that|these|those) /i);
        expect(phrase, `${e.kind}/${id} must not end its own sentence`).not.toMatch(/[.!?]$/);
      }
    }
  });

  it('uses a stable, lower-case kind slug in the URI', () => {
    for (const e of ENTITIES) {
      expect(e.kind).toMatch(/^[a-z][a-z-]*$/);
      expect(e.id).toMatch(/^[a-z0-9][a-z0-9-]*$/);
    }
  });
});
