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
  // Control heights are consumed as `--control-height-*` directly, or through a
  // component token (`--component-button-height-md`). BOTH forms must be floored:
  // the component tier deliberately cannot carry the max() itself, because
  // --target-floor is re-declared by the @media(pointer:coarse) and [data-input]
  // blocks, which do not re-emit the component tier.
  //
  // `-size` is in the pattern alongside `-height` because SQUARE controls escaped
  // it entirely: an icon-only close button is sized by `size-*`, never `h-*`, so
  // the Dialog and Toast close buttons were sized by their 16px/14px GLYPH and the
  // 44px floor this gate exists to guarantee never reached them. A gate scoped to
  // one of the two ways a control gets its dimensions is not a floor.
  //
  // `-icon-size` and `-thumb-size` are excluded by lookbehind: they measure a
  // glyph or an inner part, not the hit area. Flooring a check indicator to 44px
  // would make it a 44px tick — the target is the ROW it sits in, which is
  // already floored by its own `-height`.
  const HEIGHT_VAR = String.raw`var\(--(?:control-height-(?:xs|sm|md|lg)|component-[a-z-]+-height(?:-(?:sm|md|lg))?|component-[a-z-]+(?<!-icon)(?<!-thumb)-size(?:-(?:sm|md|lg))?)\)`;
  const UNFLOORED = new RegExp(
    String.raw`(?<!max\()${HEIGHT_VAR}(?!\s*,\s*var\(--target-floor\))`,
    'g',
  );

  it('every control-height usage is floored via max(…, --target-floor)', () => {
    const offenders: string[] = [];
    for (const file of recipeFiles) {
      const src = readFileSync(join(recipesDir, file), 'utf8');
      const bare = src.match(UNFLOORED);
      if (bare) offenders.push(`${file}: ${bare.join(', ')}`);
    }
    expect(offenders, `un-floored control-height usages:\n${offenders.join('\n')}`).toEqual([]);
  });

  it('actually finds the floored usages it is meant to police', () => {
    // Positive control. Without this, a rename that stops the pattern matching
    // yields zero offenders — a green test that checks nothing.
    const floored = recipeFiles.flatMap(
      (f) =>
        readFileSync(join(recipesDir, f), 'utf8').match(
          new RegExp(String.raw`max\(${HEIGHT_VAR}\s*,\s*var\(--target-floor\)\)`, 'g'),
        ) ?? [],
    );
    expect(floored.length, 'no floored control heights found — has the var naming moved?').toBeGreaterThanOrEqual(6);
  });
});

/**
 * Typed-text floor — the other half of the coarse-pointer contract.
 *
 * `--target-floor` sizes the BOX. It says nothing about the TEXT, and iOS Safari
 * zooms the whole page when a focused input renders below 16px — then does not
 * zoom back out, so the layout an operator was reading shifts and parts leave the
 * viewport the moment they tap a field. Every form control shipped `text-sm`
 * (14px) on both the `sm` and the DEFAULT `md` rung.
 *
 * Same mechanism, same axis: a 0px floor the pointer media query raises, keyed on
 * the pointer rather than the viewport, and authoring-overridable via [data-input]
 * for a known desk.
 */
describe('typed-text floor', () => {
  it('defines the primitives (--field-text-min 16px, --field-text-floor 0px default)', () => {
    expect(tokensCss).toMatch(/--field-text-min:\s*16px/);
    expect(tokensCss).toMatch(/--field-text-floor:\s*0px/);
  });

  it('raises the floor under a coarse pointer and honours [data-input]', () => {
    expect(tokensCss).toMatch(
      /@media \(pointer: coarse\)\s*\{[^}]*--field-text-floor:\s*var\(--field-text-min\)/,
    );
    expect(tokensCss).toMatch(
      /\[data-input="coarse"\][^}]*--field-text-floor:\s*var\(--field-text-min\)/,
    );
    expect(tokensCss).toMatch(/\[data-input="fine"\][^}]*--field-text-floor:\s*0px/);
  });

  // The controls a person types into. Button/Badge/Tabs are excluded on purpose:
  // they carry labels, not typed text, and iOS only zooms for a focused field.
  const TYPED_TEXT = ['input.ts', 'textarea.ts', 'number-field.ts', 'select.ts', 'combobox.ts'];

  it.each(TYPED_TEXT)('%s floors its sm and md rungs at --field-text-floor', (file) => {
    const src = readFileSync(join(recipesDir, file), 'utf8');
    const floored = src.match(
      /text-\[max\(var\(--text-[a-z0-9]+\),\s*var\(--field-text-floor\)\)\]/g,
    );
    expect(floored?.length ?? 0, `${file} must floor both typed-text rungs`).toBeGreaterThanOrEqual(2);
    // …and must not still carry a bare `text-sm` on a size rung.
    const bare = src.match(/(?:px|py)-\(--component-[a-z-]+-padding-[xy]-(?:sm|md)\) text-sm/g);
    expect(bare, `${file} still sizes a rung with a bare text-sm`).toBeNull();
  });

  it('actually detects an unfloored rung', () => {
    // Positive control — the pattern must reject the shape it replaced.
    const bad = "sm: 'h-[max(var(--component-input-height-sm),var(--target-floor))] px-(--component-input-padding-x-sm) text-sm',";
    expect(bad.match(/(?:px|py)-\(--component-[a-z-]+-padding-[xy]-(?:sm|md)\) text-sm/g)).not.toBeNull();
  });
});
