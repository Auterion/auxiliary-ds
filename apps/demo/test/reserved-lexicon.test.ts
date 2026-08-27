import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

/**
 * The reserved status ladder keeps its own words.
 *
 * `AD-D-014` states it normatively — "One word per concept — never *critical*,
 * *error*, *info*, *success*, or any other paraphrase" — and
 * `foundations/voice-and-lexicon.md` gives the reason: in an operational context
 * "a word that means two things, or two words that mean the same thing, costs an
 * operator time they may not have."
 *
 * The demo had drifted into five parallel vocabularies at once: `Critical` for
 * alarm, `Success`/`Healthy`/`OK` for nominal, `Review` for caution, `INFO` for
 * advisory, plus a `Low/Moderate/Elevated/High` risk ladder on the marketing
 * site. None of it was wrong on screen; all of it means the same operator reads
 * two words for one state depending on which surface they are looking at.
 *
 * SCOPE, deliberately narrow. This flags a banned word only where it appears in
 * a QUOTED STRING — the shape a label takes. It does not flag prose, comments,
 * class names, or the word `critical` used as an ordinary English adjective
 * ("flight-critical path"), because those are not what an operator reads off a
 * badge. A gate that punished prose would get switched off, and it would be
 * right to switch it off.
 *
 * WHAT THIS CANNOT CHECK: whether a level is the RIGHT level. `warning` where
 * `alarm` was meant reads identically to a machine — `web/pages/Brand.vue` was
 * shipping "Battery critical" at `level="warning"`, and only the banned word was
 * mechanically visible. The wrong rung stays a review question.
 */

const srcDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src');

function walk(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name);
    if (e.isDirectory()) return walk(p);
    return /\.(vue|ts)$/.test(e.name) ? [p] : [];
  });
}
const files = walk(srcDir).filter((f) => !f.includes(`${join('', 'test')}`));

/** Banned stand-ins, mapped to the rung each one paraphrases. */
const BANNED: Record<string, string> = {
  critical: 'alarm',
  fatal: 'alarm',
  error: 'alarm',
  severe: 'alarm',
  warn: 'warning',
  success: 'nominal',
  healthy: 'nominal',
  ok: 'nominal',
  good: 'nominal',
  info: 'advisory',
  note: 'advisory',
  tip: 'advisory',
};

/** Quoted string literals on a line — the shape a user-visible label takes. */
function strings(line: string): string[] {
  return [...line.matchAll(/'([^']{2,40})'|"([^"]{2,40})"|>([A-Z][A-Za-z ]{1,30})</g)].map(
    (m) => m[1] ?? m[2] ?? m[3] ?? '',
  );
}

describe('the reserved ladder keeps its own words', () => {
  it('finds the sources it is meant to police', () => {
    expect(files.length).toBeGreaterThanOrEqual(40);
  });

  it('uses no banned stand-in as a user-visible label', () => {
    const offenders: string[] = [];
    for (const file of files) {
      readFileSync(file, 'utf8')
        .split('\n')
        .forEach((line, i) => {
          // Comments are prose, not labels.
          if (/^\s*(\/\/|\*|<!--)/.test(line)) return;
          for (const s of strings(line)) {
            const word = s.trim().toLowerCase();
            const rung = BANNED[word];
            if (rung) {
              offenders.push(
                `  ${relative(srcDir, file)}:${i + 1}  "${s.trim()}" → use "${rung}" (AD-D-014)`,
              );
            }
          }
        });
    }
    expect(
      offenders,
      `banned ladder stand-ins used as labels:\n${offenders.join('\n')}`,
    ).toEqual([]);
  });

  // Positive controls — the exact shapes that were shipping.
  it('actually catches the shapes that shipped', () => {
    expect(strings("alarm: 'Critical', warning: 'Warning',").map((s) => s.toLowerCase())).toContain('critical');
    expect(strings("{ id: 'a4', label: 'Healthy' }").map((s) => s.toLowerCase())).toContain('healthy');
    expect(strings("result: 'Success',").map((s) => s.toLowerCase())).toContain('success');
  });

  it('leaves ordinary prose alone', () => {
    // "flight-critical path" is English, not a label, and lives in a comment.
    const prose = ' * Flight-critical path: 0-80 ms, effectively instant.';
    expect(/^\s*(\/\/|\*|<!--)/.test(prose)).toBe(true);
    // A compound label that merely contains a banned word is not a rename.
    expect(strings("label: 'Error budget'").some((s) => BANNED[s.toLowerCase()])).toBe(false);
  });
});
