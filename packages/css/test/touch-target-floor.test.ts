import { readdirSync, readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Touch-target floor gate (ROADMAP § Input modality & touch).
 *
 * Input modality is a first-class axis: under a coarse pointer every interactive
 * control must be at least --target-min (44px, MIL-STD-1472 / WCAG 2.5.5 AAA).
 * The mechanism is a single `--target-floor` toggle (0px → 44px on coarse) that
 * recipes consume via `max(--control-height-*, --target-floor)`, so the floor
 * composes *over* register density and wins at any tree depth.
 *
 * Two things must hold, and a regression in either silently re-shrinks field-
 * tablet targets — so both are gated:
 *   1. the generated tokens CSS activates the floor on coarse pointer, and
 *   2. every recipe that sizes a control by --control-height applies the floor.
 */

const require = createRequire(import.meta.url);
const tokensCss = readFileSync(
  require.resolve('@auxiliary/tokens/dist/tailwind-v4.css'),
  'utf8',
);

const recipesDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'recipes');
const recipeFiles = readdirSync(recipesDir).filter(
  (f: string) => f.endsWith('.ts') && f !== 'index.ts' && f !== 'sizes.ts',
);

describe('touch-target floor — generated CSS', () => {
  it('defines the floor primitives (--target-min 44px, --target-floor 0px default)', () => {
    expect(tokensCss).toMatch(/--target-min:\s*44px/);
    expect(tokensCss).toMatch(/--target-floor:\s*0px/);
  });

  it('raises the floor to --target-min under a coarse pointer', () => {
    // The @media (pointer: coarse) block must set --target-floor to the min.
    const coarse = tokensCss.match(
      /@media \(pointer: coarse\)\s*\{[^}]*--target-floor:\s*var\(--target-min\)[^}]*\}/,
    );
    expect(coarse, 'coarse-pointer media query must raise --target-floor').toBeTruthy();
  });

  it('exposes the [data-input] authoring override (coarse forces on, fine forces off)', () => {
    expect(tokensCss).toMatch(/\[data-input="coarse"\]\s*\{\s*--target-floor:\s*var\(--target-min\)/);
    expect(tokensCss).toMatch(/\[data-input="fine"\]\s*\{\s*--target-floor:\s*0px/);
  });

  it('emits the floor layer AFTER the register block (so touch wins over density)', () => {
    const registerAt = tokensCss.indexOf('[data-register="operational"]');
    const floorAt = tokensCss.indexOf('@media (pointer: coarse)');
    expect(registerAt).toBeGreaterThan(-1);
    expect(floorAt).toBeGreaterThan(registerAt);
  });
});

describe('touch-target floor — recipes', () => {
  it('every --control-height usage is floored via max(…, --target-floor)', () => {
    const offenders: string[] = [];
    for (const file of recipeFiles) {
      const src = readFileSync(join(recipesDir, file), 'utf8');
      // A bare `var(--control-height-…)` not wrapped in `max(…, --target-floor)`
      // is an un-floored control — it would drop below 44px on a touch device.
      const bare = src.match(/(?<!max\()var\(--control-height-(sm|md|lg)\)(?!\s*,\s*var\(--target-floor\))/g);
      if (bare) offenders.push(`${file}: ${bare.join(', ')}`);
    }
    expect(offenders, `un-floored control-height usages:\n${offenders.join('\n')}`).toEqual([]);
  });
});
