import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/**
 * The demo's OWN ink ramp, held to the floors the theme gates hold tokens to.
 *
 * `packages/tokens/test/contrast.test.ts` certifies the 53 semantic roles per
 * theme. It reads `packages/tokens/src`, so a ramp the demo builds for itself out
 * of raw primitives is *structurally invisible* to it — not merely unchecked.
 * `_deck07b.css` builds exactly that: a four-exposure `--dk-*` ramp aliased
 * straight off `--color-primitive-*`, shared by every deck surface, and its
 * tertiary ink shipped at 3.70:1 in dark against a 4.5:1 requirement. The file
 * that noticed (`web/_web.css`) wrote the ratios into a comment, patched around
 * them locally, and left them for ten other consumers — because a prose comment
 * is the only thing that could carry the finding, and prose does not fail a build.
 *
 * The three inks are all used as TEXT: `--dk-fg` on body copy, `--dk-fg-2` on
 * secondary, `--dk-fg-3` on `.dk-label` and `.dk-micro` — the small uppercase
 * mono carrying alert codes and units. So 4.5:1 is the right floor for all three,
 * not 3:1.
 *
 * WHAT THIS CANNOT CHECK: it resolves one alias hop (`--dk-fg: var(--color-
 * primitive-ink-500)`). A ramp built through `color-mix()` or a second
 * indirection is skipped rather than guessed at — and the skip is asserted below,
 * so a refactor into `color-mix()` fails loudly instead of quietly emptying the
 * gate. It also cannot see alpha dilution at the point of USE
 * (`text-muted-foreground/50`), which is a separate defect class.
 */

const require = createRequire(import.meta.url);
const tokensCss = readFileSync(require.resolve('@auxiliary/tokens/dist/tailwind-v4.css'), 'utf8');
const deck = readFileSync(
  join(dirname(fileURLToPath(import.meta.url)), '..', 'src', '_deck07b.css'),
  'utf8',
);

/* ── colour maths ──────────────────────────────────────────────────────────
 * Mirrors packages/tokens/test/wcag.ts. Duplicated because test helpers are not
 * part of the package's export surface; kept byte-compatible so a ratio quoted
 * here means the same thing as a ratio quoted there.
 */
type Oklch = [number, number, number];

function parseOklch(v: string): Oklch | null {
  const m = /oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)/.exec(v);
  return m ? [Number(m[1]), Number(m[2]), Number(m[3])] : null;
}

function toLinear([L, C, h]: Oklch): [number, number, number] {
  const a = C * Math.cos((h * Math.PI) / 180);
  const b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((x) => Math.min(1, Math.max(0, x))) as [number, number, number];
}

const luminance = (c: Oklch) => {
  const [r, g, b] = toLinear(c);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const ratio = (a: Oklch, b: Oklch) => {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};

/** Linear-sRGB blue channel — the darknight night-vision proxy. */
const blueEnergy = (c: Oklch) => toLinear(c)[2];

/* ── resolve the demo's ramp ───────────────────────────────────────────── */

const PRIMITIVES = new Map<string, Oklch>();
for (const m of tokensCss.matchAll(/^\s*(--color-primitive-[a-z0-9-]+):\s*(oklch\([^)]*\))/gm)) {
  const c = parseOklch(m[2]!);
  if (c) PRIMITIVES.set(m[1]!, c);
}

type Theme = 'light' | 'dark' | 'sunlight' | 'darknight';
const THEMES: Theme[] = ['light', 'dark', 'sunlight', 'darknight'];

/** Body of the `.dk` block for a theme — the bare `.dk` ink block is `light`. */
function blockFor(theme: Theme): string {
  if (theme === 'light') {
    // The second bare `.dk {` block is the ink one; the first holds the ladders.
    const blocks = [...deck.matchAll(/^\.dk\s*\{([\s\S]*?)^\}/gm)].map((m) => m[1]!);
    return blocks.find((b) => b.includes('--dk-bg')) ?? '';
  }
  const m = new RegExp(String.raw`^\.dk\[data-theme='${theme}'\]\s*\{([\s\S]*?)^\}`, 'm').exec(deck);
  return m?.[1] ?? '';
}

/** `--dk-*` → oklch, following exactly one `var(--color-primitive-*)` hop. */
function ramp(theme: Theme): Record<string, Oklch> {
  const out: Record<string, Oklch> = {};
  for (const m of blockFor(theme).matchAll(/(--dk-[a-z0-9-]+):\s*var\((--color-primitive-[a-z0-9-]+)/g)) {
    const c = PRIMITIVES.get(m[2]!);
    if (c) out[m[1]!] = c;
  }
  return out;
}

describe('the deck ramp meets the floors the token gates enforce', () => {
  it('resolves a real ramp for every theme', () => {
    // Guards the whole file: if the ramp is refactored into color-mix() or a
    // second indirection, this fails LOUDLY rather than leaving every assertion
    // below iterating an empty object and passing.
    expect(PRIMITIVES.size, 'no primitives parsed from the token CSS').toBeGreaterThan(200);
    for (const t of THEMES) {
      const r = ramp(t);
      expect(Object.keys(r).length, `${t}: ramp did not resolve`).toBeGreaterThanOrEqual(6);
      expect(r['--dk-bg'], `${t}: no --dk-bg`).toBeTruthy();
      expect(r['--dk-fg'], `${t}: no --dk-fg`).toBeTruthy();
    }
  });

  // All three inks are used as text; --dk-fg-3 paints .dk-label and .dk-micro,
  // which carry alert codes and units at the smallest size on the page.
  describe.each(THEMES)('%s', (theme) => {
    const r = ramp(theme);

    it.each(['--dk-fg', '--dk-fg-2', '--dk-fg-3'])('%s on --dk-bg clears 4.5:1', (ink) => {
      const got = ratio(r[ink]!, r['--dk-bg']!);
      expect(got, `${theme} ${ink} on --dk-bg measured ${got.toFixed(2)}:1`).toBeGreaterThanOrEqual(4.5);
    });

    // The raised surface is held to 3:1, not 4.5:1 — matching how the library
    // gates its own pairs (background/foreground and card/card-foreground are
    // separate contracts; it does not hold every ink against every surface).
    it('--dk-fg-3 stays legible on the raised surface --dk-bg-2', () => {
      const got = ratio(r['--dk-fg-3']!, r['--dk-bg-2']!);
      expect(got, `${theme} measured ${got.toFixed(2)}:1`).toBeGreaterThanOrEqual(3);
    });
  });

  // Structural contrast, matching sunlight-night-gates.test.ts: panels must hold
  // their geometry under glare and in the dark.
  it.each(['sunlight', 'darknight'] as Theme[])('%s: --dk-line clears 3:1 vs --dk-bg', (theme) => {
    const r = ramp(theme);
    const got = ratio(r['--dk-line']!, r['--dk-bg']!);
    expect(got, `${theme} measured ${got.toFixed(2)}:1`).toBeGreaterThanOrEqual(3);
  });

  // The darknight low-blue cap the token gate applies to every semantic role.
  // The deck ramp bypasses that gate entirely, so it is applied here too.
  it('darknight: every deck ink stays low-blue (≤ 0.15)', () => {
    const r = ramp('darknight');
    const leaks = Object.entries(r)
      .filter(([, c]) => blueEnergy(c) > 0.15)
      .map(([k, c]) => `${k} = ${blueEnergy(c).toFixed(3)}`);
    expect(leaks, `deck inks leaking blue in darknight:\n${leaks.join('\n')}`).toEqual([]);
  });

  // Positive control. Without it, a selector rename would empty every loop above
  // and the file would pass while checking nothing — the exact failure mode that
  // let the tertiary ink ship at 3.70:1 under a fully green suite.
  it('actually fails a ramp that does not meet the floor', () => {
    const bg = PRIMITIVES.get('--color-primitive-ink-950')!;
    const tooDark = PRIMITIVES.get('--color-primitive-ink-500')!;
    expect(ratio(tooDark, bg)).toBeLessThan(4.5);
  });
});
