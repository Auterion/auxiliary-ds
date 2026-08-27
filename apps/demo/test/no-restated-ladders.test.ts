import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

/**
 * The demo may not restate a ladder the design system already emits.
 *
 * This is the single most common defect class in `apps/demo`, and it is invisible
 * in a rendered page: `--dk-control-md: 32px` and `--dk-control-md:
 * var(--control-height-sm)` look identical on screen and are not the same thing.
 * The token re-resolves under `[data-register="operational"]`; the literal does
 * not. `_deck07b.css` transcribed the control, radius, motion and gutter ladders
 * as raw values, which meant the register axis — the axis the demo exists to
 * demonstrate — was completely inert on five surfaces, and nothing said so.
 *
 * The same applies to `z-index` (a private stacking ladder cannot be reasoned
 * about against `--z-modal`) and to type (sizes below `--text-2xs` are off the
 * system entirely, and 26 of them were carrying ALT/SPD/HDG units and alert
 * codes at 8px).
 *
 * WHAT THIS CANNOT CHECK, stated so the green tick is not read as more than it
 * is: it does not know whether a value is *right*, only whether it came from the
 * system. It reads source, not computed style, so a literal built by `calc()` at
 * runtime slips through. And it says nothing about layout — see
 * `demo-ramp-contrast.test.ts` for the colour half.
 */

const require = createRequire(import.meta.url);
const tokensCss = readFileSync(require.resolve('@auxiliary/tokens/dist/tailwind-v4.css'), 'utf8');
const srcDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');

/** Every custom property the token package actually emits. */
const EMITTED = new Set([...tokensCss.matchAll(/^\s*(--[a-z0-9-]+):/gm)].map((m) => m[1]!));

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return /\.(vue|css)$/.test(e.name) ? [p] : [];
  });
}

const files = walk(srcDir);

/**
 * A declaration may opt out by carrying `off-ladder:` and a reason, either on its
 * own line or in the comment immediately above it — a real reason usually needs
 * more room than a trailing comment gives. Some values genuinely have no rung: a tablet bezel is industrial design,
 * not a UI radius, and a local stacking shuffle inside one context is not a
 * position on the global z ladder. The point of the marker is that the exception
 * is WRITTEN DOWN and reviewable, rather than being indistinguishable from drift
 * — which is exactly the state this whole layer was in.
 */
const OPT_OUT = /off-ladder:/;
/** True if the marker is on this line or in the comment block just above it. */
const optedOut = (raw: string[], i: number) =>
  raw.slice(Math.max(0, i - 4), i + 1).some((l) => OPT_OUT.test(l));

/** Blank comments so prose about an old value is not itself an offender. */
const stripComments = (s: string) =>
  s.replace(/\/\*[\s\S]*?\*\//g, (b) => b.replace(/[^\n]/g, ' ')).replace(/\/\/[^\n]*/g, '');

type Offender = { file: string; line: number; text: string };

function scan(re: RegExp, keep: (m: RegExpMatchArray) => boolean = () => true): Offender[] {
  const out: Offender[] = [];
  for (const file of files) {
    const lines = stripComments(readFileSync(file, 'utf8')).split('\n');
    const raw = readFileSync(file, 'utf8').split('\n');
    lines.forEach((text, i) => {
      if (optedOut(raw, i)) return;
      for (const m of text.matchAll(re)) {
        if (keep(m)) out.push({ file: relative(srcDir, file), line: i + 1, text: m[0]!.trim() });
      }
    });
  }
  return out;
}

const report = (o: Offender[]) => o.map((x) => `  ${x.file}:${x.line}  ${x.text}`).join('\n');

describe('the demo does not restate system ladders', () => {
  it('finds the files it is meant to police', () => {
    expect(files.length, 'no demo sources found — has the layout moved?').toBeGreaterThanOrEqual(40);
    expect(EMITTED.has('--control-height-sm')).toBe(true);
    expect(EMITTED.has('--text-2xs')).toBe(true);
  });

  // Type below the system's smallest step is off the system, not merely small.
  it('sets no type below --text-2xs', () => {
    const offenders = scan(/font-size:\s*(\d+(?:\.\d+)?)px/g, (m) => Number(m[1]) < 10);
    expect(offenders, `type below the --text-2xs floor (10px):\n${report(offenders)}`).toEqual([]);
  });

  // Radius, duration and easing all re-resolve under [data-register].
  it('takes radius from the system, not a literal', () => {
    const offenders = scan(/border-radius:\s*(\d+(?:\.\d+)?)px/g, (m) => {
      const px = Number(m[1]);
      // 1-2px hairline radii have no rung below --radius-xs and never should.
      return px > 2 && px !== 9999;
    });
    expect(offenders, `raw border-radius — use var(--radius-*) or a --dk-r-* alias:\n${report(offenders)}`).toEqual([]);
  });

  it('takes motion duration from the system, not a literal', () => {
    const offenders = scan(/transition(?:-duration)?:[^;{]*?(\d+)ms/g);
    expect(offenders, `raw duration — use var(--duration-*):\n${report(offenders)}`).toEqual([]);
  });

  // A private stacking ladder cannot be reasoned about against --z-modal.
  it('takes z-index from the system, not a literal', () => {
    const offenders = scan(/z-index:\s*(-?\d+)/g, (m) => {
      const z = Number(m[1]);
      // 0 and the 1/-1 local shuffles are structural, not a ladder position.
      return Math.abs(z) > 1;
    });
    expect(offenders, `raw z-index — use var(--z-*):\n${report(offenders)}`).toEqual([]);
  });

  // Positive controls. Each must reject the exact shape that was shipping, or a
  // regex that silently stopped matching would leave a permanently-green gate —
  // which is how every one of these classes survived in the first place.
  describe('self-check', () => {
    const at = (text: string, re: RegExp, keep: (m: RegExpMatchArray) => boolean = () => true) =>
      [...text.matchAll(re)].filter(keep).length;

    it('rejects 8px type', () => {
      expect(at('font-size: 8px;', /font-size:\s*(\d+(?:\.\d+)?)px/g, (m) => Number(m[1]) < 10)).toBe(1);
    });
    it('rejects a raw 10px radius but allows a 1px hairline', () => {
      const re = /border-radius:\s*(\d+(?:\.\d+)?)px/g;
      const keep = (m: RegExpMatchArray) => Number(m[1]) > 2 && Number(m[1]) !== 9999;
      expect(at('border-radius: 10px;', re, keep)).toBe(1);
      expect(at('border-radius: 1px;', re, keep)).toBe(0);
    });
    it('rejects a raw 160ms duration', () => {
      expect(at('transition: background-color 160ms ease;', /transition(?:-duration)?:[^;{]*?(\d+)ms/g)).toBe(1);
    });
    it('rejects a raw z-index but allows a local 1', () => {
      const re = /z-index:\s*(-?\d+)/g;
      const keep = (m: RegExpMatchArray) => Math.abs(Number(m[1])) > 1;
      expect(at('z-index: 40;', re, keep)).toBe(1);
      expect(at('z-index: 1;', re, keep)).toBe(0);
    });
    it('honours a stated off-ladder opt-out, inline or above', () => {
      expect(optedOut(['  border-radius: 42px; /* off-ladder: device bezel */'], 0)).toBe(true);
      expect(optedOut(['  /* off-ladder: device bezel */', '  border-radius: 42px;'], 1)).toBe(true);
      expect(optedOut(['  border-radius: 42px;'], 0)).toBe(false);
      // …and it must not reach so far back that it exempts an unrelated rule.
      expect(optedOut(['/* off-ladder: x */', '', '', '', '', '  z-index: 40;'], 5)).toBe(false);
    });

    it('ignores a value mentioned only in a comment', () => {
      const src = stripComments('/* was font-size: 8px */\n.x { color: red; }');
      expect(at(src, /font-size:\s*(\d+(?:\.\d+)?)px/g)).toBe(0);
    });
  });
});
