import { describe, expect, it } from 'vitest';
import { combobox } from '../recipes/combobox.js';
import { dropdownMenu } from '../recipes/dropdown-menu.js';
import { select } from '../recipes/select.js';
import { button } from '../recipes/button.js';
import { checkbox } from '../recipes/checkbox.js';
import { switchControl } from '../recipes/switch.js';
import { tabs } from '../recipes/tabs.js';
import { guardedAction } from '../recipes/guarded-action.js';

/**
 * Recipe-level a11y affordance gate. The token gates (packages/tokens/test)
 * certify the *ratios*; this certifies the recipes actually USE the classes
 * those ratios were computed for, so a recipe edit can't silently drop an
 * affordance while the token gates stay green.
 */

// data-[highlighted] is the only keyboard-position indicator in open menus and
// listboxes; it must paint the strong primary fill + inverted text (gated at
// ≥3:1 vs popover in tokens), not a faint tint.
describe('menu/listbox keyboard highlight paints the gated primary fill', () => {
  const items = {
    'dropdown-menu': dropdownMenu().item(),
    select: select().item(),
    combobox: combobox().item(),
  };
  for (const [name, classes] of Object.entries(items)) {
    it(`${name} item`, () => {
      expect(classes).toContain('data-[highlighted]:bg-primary');
      expect(classes).toContain('data-[highlighted]:text-primary-foreground');
    });
  }
});

// Solid-fill focusables need the 2px ring-offset gap (rendered in background,
// gated at ≥3:1 vs primary in tokens) — without it the focus ring can be
// invisible against the fill (sunlight ring IS primary: black on black).
describe('solid-fill focusables carry the ring-offset gap', () => {
  const surfaces = {
    button: button(),
    checkbox: checkbox().root(),
    switch: switchControl().root(),
    'tabs trigger': tabs().trigger(),
    'guarded-action': guardedAction().root(),
  };
  for (const [name, classes] of Object.entries(surfaces)) {
    it(name, () => {
      expect(classes).toContain('focus-visible:ring-offset-2');
      expect(classes).toContain('ring-offset-background');
    });
  }
});
