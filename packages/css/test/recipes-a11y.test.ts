import { describe, expect, it } from 'vitest';
import { combobox } from '../recipes/combobox.js';
import { dropdownMenu } from '../recipes/dropdown-menu.js';
import { select } from '../recipes/select.js';
import { button } from '../recipes/button.js';
import { checkbox } from '../recipes/checkbox.js';
import { switchControl } from '../recipes/switch.js';
import { tabs } from '../recipes/tabs.js';
import { guardedAction } from '../recipes/guarded-action.js';
import { slider } from '../recipes/slider.js';
import { progress } from '../recipes/progress.js';
import { skeleton } from '../recipes/skeleton.js';
import { table } from '../recipes/table.js';
import { popover } from '../recipes/popover.js';
import { toast } from '../recipes/toast.js';
import { card } from '../recipes/card.js';
import { alertBanner } from '../recipes/alert-banner.js';

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

// Loading indicators must be SEEN to convey "content is loading" — same gated
// tier as the tracks below. bg-muted is identical to card in dark.
describe('skeleton uses the gated input color, not muted', () => {
  it('skeleton base', () => {
    expect(skeleton()).toContain('bg-input');
    expect(skeleton()).not.toContain('bg-muted');
  });
});

// Row hover is meaning-bearing pointer feedback — accent is the designated
// hover-tint role; muted/50 composited to 1.00:1 inside dark cards.
describe('table row hover uses the accent hover role', () => {
  it('table row', () => {
    expect(table().row()).toContain('hover:bg-accent');
    expect(table().row()).not.toContain('hover:bg-muted');
  });
});

// Raised surfaces pair with their OWN foreground role, not the page's. The
// values coincide in all four themes today, so a mispairing is invisible
// until a theme diverges them — lock the pairing, not the coincidence.
describe('raised surfaces pair with their own foreground role', () => {
  const surfaces = {
    'popover content': [popover().content(), 'text-popover-foreground'],
    'select content': [select().content(), 'text-popover-foreground'],
    'combobox content': [combobox().content(), 'text-popover-foreground'],
    'dropdown-menu content': [dropdownMenu().content(), 'text-popover-foreground'],
    'toast root': [toast().root(), 'text-popover-foreground'],
    'card root': [card().root(), 'text-card-foreground'],
  } as const;
  for (const [name, [classes, expected]] of Object.entries(surfaces)) {
    it(name, () => {
      expect(classes).toContain(expected);
      expect(classes.split(' ')).not.toContain('text-foreground');
    });
  }
});

// Buttons sitting ON a status fill must press with the fill's own ink
// (currentColor = the level's -foreground), not the page foreground — a white
// wash over a yellow caution fill is invisible and polarity-wrong in dark.
describe('alert-banner press states use currentColor, not page foreground', () => {
  for (const slot of ['action', 'dismiss'] as const) {
    it(slot, () => {
      expect(alertBanner()[slot]()).toContain('active:bg-current/10');
      expect(alertBanner()[slot]()).not.toContain('active:bg-foreground/10');
    });
  }
});

// GuardedAction's hold-progress is functional feedback on a safety-critical
// control: it must be a SOLID currentColor bar (the variant's gated
// -foreground), never an alpha blend — bg-current/25 measured 1.2–2.2:1
// filled-vs-unfilled across all 16 variant×theme combinations. And the armed
// state must not borrow the focus `ring` channel (one box-shadow slot).
describe('guarded-action progress + armed state', () => {
  it('fill is solid currentColor, no alpha modifier', () => {
    const fill = guardedAction().fill();
    expect(fill).toContain('bg-current');
    expect(fill).not.toMatch(/bg-current\/\d/);
  });
  it('armed uses the outline channel, not the focus ring', () => {
    const armedRoot = guardedAction({ armed: true }).root();
    expect(armedRoot).toContain('outline-destructive');
    expect(armedRoot.split(' ')).not.toContain('ring-2');
  });
});

// Control tracks (the "empty" part of slider/progress/switch) convey meaning —
// how much remains — so they must use `input` (the gated ≥3:1 control-boundary
// color), not `muted`, which measures 1.0–1.2:1 against the surfaces and is
// literally identical to `card` in dark.
describe('control tracks use the gated input color, not muted', () => {
  const tracks = {
    'slider track': slider().track(),
    'progress track': progress().root(),
    'switch track': switchControl().root(),
  };
  for (const [name, classes] of Object.entries(tracks)) {
    it(name, () => {
      expect(classes).toContain('bg-input');
      expect(classes).not.toContain('bg-muted');
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
