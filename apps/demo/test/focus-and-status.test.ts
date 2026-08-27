import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

/**
 * Two invariants a stylesheet can break on its own, which no library gate can see
 * because the offending declaration lives in `apps/demo`.
 *
 * 1. FOCUS. `outline: none` with no replacement removes the only indicator a
 *    keyboard user has. It is never wrong to reset the UA ring — it is wrong to
 *    reset it and stop. The rule must offer something back in the same block: a
 *    replacement `outline`, a `box-shadow` ring, or a `border-color` change.
 *
 * 2. FILL IS NOT INK (`AD-D-014` invariant 2). The status ladder ships two tiers.
 *    `--alarm` and friends are FILLS, gated only against their own
 *    `-foreground`; as ink on a page or card surface they measure 1.4-2.9:1. The
 *    `*-emphasis` tier exists for exactly that job and is gated ≥4.5:1 against
 *    both `background` and `card`. Painting `color:` or a hairline `border` with
 *    the fill tier is the single most repeated colour defect in this app, and it
 *    is mechanically checkable: a fill token must not appear in a `color` or
 *    `border-color` declaration.
 *
 * WHAT THIS CANNOT CHECK: whether a level is semantically the RIGHT one (a
 * `caution` where `warning` was meant reads identically to a machine), and
 * whether a status is conveyed by colour alone — that needs the rendered tree.
 * Both are review questions, and the gate does not pretend otherwise.
 */

const srcDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return /\.(vue|css)$/.test(e.name) ? [p] : [];
  });
}
const files = walk(srcDir);

const stripComments = (s: string) =>
  s.replace(/\/\*[\s\S]*?\*\//g, (b) => b.replace(/[^\n]/g, ' ')).replace(/\/\/[^\n]*/g, '');

const LADDER = ['alarm', 'warning', 'caution', 'advisory', 'nominal'];

/**
 * A focus reset may opt out with `focus-delegated:` and a reason. There is one
 * legitimate shape: a surface that strips the grammar's ring precisely so each
 * component's OWN recipe ring shows through. That is delegation, not removal —
 * but it is indistinguishable from removal to a matcher, so it has to be said
 * out loud rather than inferred.
 */
const FOCUS_OPT_OUT = /focus-delegated:/;

/** A CSS rule body, with the selector that introduced it. */
function* rules(src: string): Generator<{ selector: string; body: string; line: number }> {
  const text = stripComments(src);
  const re = /([^{}]+)\{([^{}]*)\}/g;
  for (const m of text.matchAll(re)) {
    const line = text.slice(0, m.index).split('\n').length;
    yield { selector: m[1]!.trim(), body: m[2]!, line };
  }
}

describe('focus indicators survive their own reset', () => {
  it('finds the sources it is meant to police', () => {
    expect(files.length).toBeGreaterThanOrEqual(40);
  });

  it('never resets an outline without offering something back', () => {
    const offenders: string[] = [];
    for (const file of files) {
      const raw = readFileSync(file, 'utf8').split('\n');
      raw.forEach((text, i) => {
        if (!/outline:\s*(none|0)\b/.test(text)) return;
        // Walk up to the selector that opened this block, and down to its close.
        let open = i;
        while (open > 0 && !raw[open]!.includes('{')) open--;
        let close = i;
        while (close < raw.length - 1 && !raw[close]!.includes('}')) close++;
        const selector = raw.slice(Math.max(0, open - 3), open + 1).join(' ');
        if (!/:focus/.test(selector)) return;

        const body = raw.slice(open, close + 1).join('\n');
        const givesBack =
          /outline:(?!\s*(none|0)\b)/.test(body) ||
          /box-shadow:/.test(body) ||
          /border(-[a-z]+)?-color:/.test(body) ||
          /border:/.test(body);
        // A stated delegation, in the comment block above the rule.
        const delegated = FOCUS_OPT_OUT.test(raw.slice(Math.max(0, open - 15), open + 1).join('\n'));

        if (!givesBack && !delegated) {
          offenders.push(`  ${relative(srcDir, file)}:${i + 1}  ${selector.trim().slice(0, 70)}`);
        }
      });
    }
    expect(
      offenders,
      `focus rules that remove the indicator and give nothing back:\n${offenders.join('\n')}`,
    ).toEqual([]);
  });

  it('honours a stated delegation', () => {
    expect(FOCUS_OPT_OUT.test('/* focus-delegated: components paint their own ring */')).toBe(true);
    expect(FOCUS_OPT_OUT.test('/* just a comment */')).toBe(false);
  });

  it('actually detects a bare reset', () => {
    const bad = '.x:focus-visible { outline: none; }';
    const found = [...rules(bad)].filter(
      (r) => /:focus/.test(r.selector) && /outline:\s*none/.test(r.body) && !/box-shadow:|border:/.test(r.body),
    );
    expect(found).toHaveLength(1);
    const good = '.y:focus-visible { outline: none; box-shadow: 0 0 0 2px var(--ring); }';
    const ok = [...rules(good)].filter(
      (r) => /:focus/.test(r.selector) && /outline:\s*none/.test(r.body) && !/box-shadow:|border:/.test(r.body),
    );
    expect(ok).toHaveLength(0);
  });
});

describe('the status ladder fill tier is never used as ink', () => {
  it('paints no text or hairline with a fill token', () => {
    const fill = new RegExp(String.raw`var\(--(${LADDER.join('|')})\)`);
    const offenders: string[] = [];
    for (const file of files) {
      const text = stripComments(readFileSync(file, 'utf8'));
      text.split('\n').forEach((lineText, i) => {
        for (const m of lineText.matchAll(/(^|[;{\s])(color|border-color|border[a-z-]*)\s*:\s*([^;]+)/g)) {
          const prop = m[2]!;
          if (prop === 'background-color') continue;
          if (fill.test(m[3]!)) {
            offenders.push(
              `  ${relative(srcDir, file)}:${i + 1}  ${prop}: ${m[3]!.trim().slice(0, 48)}  → use the *-emphasis tier`,
            );
          }
        }
      });
    }
    expect(
      offenders,
      `status FILL tokens used as ink (AD-D-014 invariant 2 — fill is not ink):\n${offenders.join('\n')}`,
    ).toEqual([]);
  });

  it('actually distinguishes fill from emphasis', () => {
    const fill = new RegExp(String.raw`var\(--(${LADDER.join('|')})\)`);
    expect(fill.test('color: var(--alarm)')).toBe(true);
    expect(fill.test('color: var(--alarm-emphasis)')).toBe(false);
    expect(fill.test('background: var(--alarm)')).toBe(true);
  });
});

/**
 * A contrast-gated token, diluted, is no longer contrast-gated.
 *
 * `--muted-foreground` is held to 4.5:1 against every surface by the token
 * suite. `text-muted-foreground/40` is not that token — it is a new colour that
 * nothing has ever measured, and the four in this app measured 1.90:1 where the
 * undiluted token measures 6.8-7.7:1. The dilution reads as a design choice and
 * behaves as an opt-out from the only gate that was protecting it.
 *
 * Two legitimate answers, both used here rather than a blanket ban:
 *   - if the mark is STRUCTURE (a breadcrumb separator), use a structural token
 *     — `--border` is gated at 3:1 in the operational themes;
 *   - if it carries meaning (a unit label, a no-value placeholder), it does not
 *     get to be quieter than the floor.
 */
describe('gated colour tokens are not diluted past their gate', () => {
  const DILUTABLE = ['foreground', 'muted-foreground', 'card-foreground', 'popover-foreground'];

  it('uses no alpha-diluted text token', () => {
    const re = new RegExp(String.raw`text-(?:${DILUTABLE.join('|')})/\d+`, 'g');
    const offenders: string[] = [];
    for (const file of files) {
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          for (const m of line.matchAll(re)) {
            offenders.push(
              `  ${relative(srcDir, file)}:${i + 1}  ${m[0]}  → use the undiluted token, or --border if it is structure`,
            );
          }
        });
    }
    expect(
      offenders,
      `contrast-gated tokens diluted past their gate:\n${offenders.join('\n')}`,
    ).toEqual([]);
  });

  it('actually catches the shape that shipped', () => {
    const re = new RegExp(String.raw`text-(?:${DILUTABLE.join('|')})/\d+`, 'g');
    expect('<span class="text-muted-foreground/40">/</span>'.match(re)).toHaveLength(1);
    expect('<span class="text-muted-foreground">/</span>'.match(re)).toBeNull();
    // A background tint is a different thing and is not in scope.
    expect('<div class="bg-muted-foreground/10">'.match(re)).toBeNull();
  });
});
