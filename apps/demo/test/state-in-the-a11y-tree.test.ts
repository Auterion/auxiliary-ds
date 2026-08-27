import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

/**
 * State that a sighted user can see must also exist in the accessibility tree.
 *
 * Two shapes, both of which shipped across every surface in this app:
 *
 * 1. SELECTED STATE AS A CSS CLASS. Eleven hand-rolled segmented controls, tab
 *    strips and view switchers carried their selected state in `data-active`
 *    and nothing else — 75 sites, zero with an ARIA counterpart. To a screen
 *    reader every button in the group is identical and nothing reports which
 *    view you are in. `data-active` is fine as a styling hook; it is not a
 *    state, and pairing it with `aria-pressed` costs one attribute.
 *
 * 2. HIDDEN-BUT-FOCUSABLE. Closed sheets, overlays and collapsed control fans
 *    hid with `transform`, `opacity` and `pointer-events: none`. None of those
 *    removes anything from the tab order, so an operator tabbing through the
 *    handheld reached the engage-authority switch while it was invisible.
 *    `aria-hidden` is not the fix and made it worse: it hides the control from a
 *    screen reader while leaving it keyboard-reachable, which is an explicit
 *    ARIA violation (aria-hidden must not contain focusable elements). `inert`
 *    is the platform mechanism that removes both, in one attribute, and it also
 *    retires the hand-rolled `:tabindex="open ? 0 : -1"` guards that were doing
 *    half the job on some fans and none of it on others.
 *
 * WHAT THIS CANNOT CHECK: whether `aria-pressed` is bound to the RIGHT
 * condition, or whether a group needs `role="tablist"`/`aria-selected` rather
 * than a set of toggle buttons. Those are review questions. It checks only that
 * the state exists in the tree at all — which is the part that was missing
 * everywhere rather than sometimes.
 */

const srcDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return e.name.endsWith('.vue') ? [p] : [];
  });
}
const files = walk(srcDir);

/** The opening tag enclosing line `i`, looking back a few lines for a multi-line tag. */
function enclosingTag(lines: string[], i: number): string | null {
  const back = lines.slice(Math.max(0, i - 10), i + 1).join('\n');
  const m = /<([a-zA-Z][\w-]*)[^<>]*$/.exec(back);
  return m ? m[1]! : null;
}

/** The whole opening tag as text, for attribute lookups. */
function tagText(lines: string[], i: number): string {
  const start = Math.max(0, i - 10);
  const chunk = lines.slice(start, i + 12).join('\n');
  const open = chunk.lastIndexOf('<', chunk.indexOf(lines[i]!));
  const close = chunk.indexOf('>', open);
  return open >= 0 && close > open ? chunk.slice(open, close + 1) : chunk;
}

describe('selected state reaches the accessibility tree', () => {
  it('finds the components it is meant to police', () => {
    expect(files.length).toBeGreaterThanOrEqual(40);
    const withState = files.filter((f) => readFileSync(f, 'utf8').includes('data-active'));
    expect(withState.length, 'no data-active found — has the styling hook been renamed?').toBeGreaterThanOrEqual(10);
  });

  it('every <button> with data-active also reports it', () => {
    const offenders: string[] = [];
    for (const file of files) {
      const lines = readFileSync(file, 'utf8').split('\n');
      lines.forEach((line, i) => {
        if (!/:?data-active=/.test(line)) return;
        if (enclosingTag(lines, i) !== 'button') return;
        const tag = tagText(lines, i);
        if (/aria-pressed|aria-selected|aria-current/.test(tag)) return;
        offenders.push(`  ${relative(srcDir, file)}:${i + 1}  ${line.trim().slice(0, 62)}`);
      });
    }
    expect(
      offenders,
      `buttons whose selected state is style-only — add :aria-pressed:\n${offenders.join('\n')}`,
    ).toEqual([]);
  });
});

describe('hidden containers are inert, not merely invisible', () => {
  it('uses no dynamic aria-hidden on a container that can hold controls', () => {
    // A *static* aria-hidden="true" on a decorative <svg> or spacer is correct
    // and common; only the BOUND form is a hiding mechanism, and that is the one
    // that ends up wrapping focusable content.
    const offenders: string[] = [];
    for (const file of files) {
      const lines = readFileSync(file, 'utf8').split('\n');
      lines.forEach((line, i) => {
        if (!/:aria-hidden=/.test(line)) return;
        const tag = enclosingTag(lines, i);
        if (tag && /^(svg|path|circle|rect|span|i)$/.test(tag)) return;
        offenders.push(`  ${relative(srcDir, file)}:${i + 1}  ${line.trim().slice(0, 62)}  → use :inert`);
      });
    }
    expect(
      offenders,
      `dynamic aria-hidden on a container — it hides from AT but stays tab-reachable:\n${offenders.join('\n')}`,
    ).toEqual([]);
  });

  it('retires the hand-rolled tabindex guard in favour of inert', () => {
    const offenders: string[] = [];
    for (const file of files) {
      const lines = readFileSync(file, 'utf8').split('\n');
      lines.forEach((line, i) => {
        // `open ? 0 : -1` is the shape that means "I am doing inert by hand".
        if (/:tabindex="[^"]*\?\s*0\s*:\s*-1"/.test(line)) {
          offenders.push(`  ${relative(srcDir, file)}:${i + 1}  ${line.trim().slice(0, 62)}  → :inert on the wrapper`);
        }
      });
    }
    expect(offenders, `hand-rolled inert:\n${offenders.join('\n')}`).toEqual([]);
  });
});

// Positive controls — each must reject the exact shape that shipped.
describe('self-check', () => {
  it('rejects a style-only selected state and accepts a reported one', () => {
    const bad = ['<button', '  class="seg"', '  :data-active="a === b"', '>'];
    expect(enclosingTag(bad, 2)).toBe('button');
    expect(/aria-pressed/.test(tagText(bad, 2))).toBe(false);

    const good = ['<button', '  class="seg"', '  :data-active="a === b"', '  :aria-pressed="a === b"', '>'];
    expect(/aria-pressed/.test(tagText(good, 2))).toBe(true);
  });

  it('rejects a bound aria-hidden on a div but allows a static one on an svg', () => {
    expect(/:aria-hidden=/.test('<div :aria-hidden="closed">')).toBe(true);
    expect(/:aria-hidden=/.test('<svg aria-hidden="true">')).toBe(false);
  });

  it('rejects a hand-rolled tabindex guard', () => {
    expect(/:tabindex="[^"]*\?\s*0\s*:\s*-1"/.test(':tabindex="open ? 0 : -1"')).toBe(true);
    expect(/:tabindex="[^"]*\?\s*0\s*:\s*-1"/.test('tabindex="0"')).toBe(false);
  });
});
