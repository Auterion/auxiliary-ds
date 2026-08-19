/**
 * Gate for `component-schema.json` — the committed contract that says which token binds
 * to which property of which slot, for every component and every variant.
 *
 * Three failure modes, all silent without this suite:
 *
 *  1. **Staleness.** The schema is generated and committed. A recipe edit that doesn't
 *     regenerate leaves Figma being pushed a component that no longer matches the code.
 *  2. **A binding that isn't a token.** The emitter throws on an unresolvable `var()`,
 *     but only when it runs. This asserts the result, so a regression cannot hide behind
 *     a cached build.
 *  3. **A dishonest allowlist.** `DEAD_CLASSES` records classes that generate no CSS —
 *     a real defect, ratcheted. An entry that outlives the defect turns the list from a
 *     record into a blindfold.
 *
 * The suite carries a positive control (`detects a fabricated drift`) because the worst
 * outcome here is not a failing gate — it is a gate that passes because the comparison
 * stopped comparing.
 */
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';
// @ts-expect-error — build scripts are plain .mjs, deliberately outside the tsc program
import { buildComponentSchema, DEAD_CLASSES, OUT_FILE } from '../scripts/build-schema.mjs';
// @ts-expect-error — see above
import { buildIndex, loadTokensDist } from '../scripts/figma-index.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const recipesDir = resolve(here, '..', 'recipes');

interface Entry {
  figma?: string;
  mode?: string;
  alpha?: number;
  value?: string;
  refs?: { var: string; figma: string; mode?: string }[];
}
interface SlotEntry {
  properties?: Record<string, Entry>;
  states?: Record<string, Record<string, Entry>>;
}
interface Component {
  api: Record<string, string[]>;
  defaults: Record<string, unknown>;
  slots: string[];
  common: Record<string, SlotEntry>;
  matrix: { props: Record<string, string>; slots: Record<string, SlotEntry> }[];
}

let committed: Record<string, Component>;
let fresh: Record<string, Component>;

beforeAll(async () => {
  committed = JSON.parse(readFileSync(OUT_FILE, 'utf8'));
  // Regenerate from the TypeScript SOURCE, not dist/. The build script uses dist because
  // it runs under plain node; here vitest transforms the source, so the gate compares
  // the committed artifact against what the recipes say right now — which is the whole
  // question — without making `test` wait on a compile.
  fresh = await buildComponentSchema(await import('../recipes/index.js'));
}, 60_000);

/** Every property entry in a component, across common and matrix, rest and states. */
function entriesOf(component: Component): Entry[] {
  const fromSlots = (slots: Record<string, SlotEntry>) =>
    Object.values(slots).flatMap((slot) => [
      ...Object.values(slot.properties ?? {}),
      ...Object.values(slot.states ?? {}).flatMap((s) => Object.values(s)),
    ]);
  return [...fromSlots(component.common), ...component.matrix.flatMap((r) => fromSlots(r.slots))];
}

describe('component schema', () => {
  it('covers every recipe the barrel exports', () => {
    // A scanner that silently stopped finding recipes would make every test below
    // vacuous, and "no findings" reads exactly like "no problems". Compared against the
    // barrel rather than a count, so a NEW recipe that forgot to regenerate fails here
    // with its own name rather than as an off-by-one.
    const barrel = readFileSync(resolve(recipesDir, 'index.ts'), 'utf8');
    const exported = [...barrel.matchAll(/export \{([^}]*)\} from/g)]
      .flatMap((m) => m[1]!.split(','))
      .map((s) => s.trim())
      .filter((s) => s && !s.startsWith('type '));
    expect(exported.length).toBeGreaterThan(25);
    const missing = exported.filter((name) => !(name in committed));
    expect(missing, 'these recipes are exported but absent from the schema').toEqual([]);
  });

  it('is not stale', () => {
    expect(
      fresh,
      'component-schema.json is out of date — run `pnpm --filter @auxiliary/css schema`',
    ).toEqual(committed);
  });

  it('detects a fabricated drift', () => {
    // Positive control for the test above: prove `toEqual` actually distinguishes these
    // documents, so a future refactor cannot make the staleness check pass vacuously.
    const tampered = structuredClone(committed);
    tampered.button!.common.root!.properties!['border-radius'] = { figma: 'Theme/primary' };
    expect(tampered).not.toEqual(committed);
  });

  it('binds every recorded property to a real Figma variable', () => {
    const { figmaNative, tokensCss } = loadTokensDist();
    const { index } = buildIndex(figmaNative, tokensCss);
    const known = new Set<string>([...index.values()].map((b: { figma: string }) => b.figma));

    const bad: string[] = [];
    for (const [name, component] of Object.entries(committed)) {
      for (const entry of entriesOf(component)) {
        const paths = entry.figma ? [entry.figma] : (entry.refs ?? []).map((r) => r.figma);
        for (const p of paths) if (!known.has(p)) bad.push(`${name}: ${p}`);
      }
    }
    expect([...new Set(bad)], 'these bindings name no variable the tokens build emits').toEqual([]);
  });

  it('records a size variant as a Figma mode, not three variables', () => {
    // The load-bearing property of the whole exercise: `size` collapses onto the
    // Component collection's mode axis, so a Figma component set binds `height` once
    // and flips modes. If this regresses, generated components silently gain three
    // unrelated bindings that no longer track the register axis together.
    const md = committed.button!.matrix.find(
      (r) => r.props.variant === 'primary' && r.props.size === 'md' && r.props.loading === 'false',
    );
    expect(md).toBeDefined();
    const props = md!.slots.root!.properties!;
    expect(props['padding-inline']).toEqual({ figma: 'Component/button/padding-x', mode: 'md' });
    expect(props['height']!.refs?.[0]).toEqual({
      var: '--component-button-height-md',
      figma: 'Component/button/height',
      mode: 'md',
    });
  });

  it('keeps colour on the theme axis', () => {
    // Component tokens are structural by contract (see the tokens README): a colour
    // frozen into one would survive a theme switch. The schema is where that would
    // first become visible, since it names the collection behind every fill.
    const colourProps = new Set(['background-color', 'color', 'border-color', 'outline-color']);
    const leaked: string[] = [];
    for (const [name, component] of Object.entries(committed)) {
      const scan = (slots: Record<string, SlotEntry>) => {
        for (const slot of Object.values(slots)) {
          for (const [property, entry] of Object.entries(slot.properties ?? {})) {
            if (colourProps.has(property) && entry.figma?.startsWith('Component/')) {
              leaked.push(`${name} ${property} -> ${entry.figma}`);
            }
          }
        }
      };
      scan(component.common);
      component.matrix.forEach((r) => scan(r.slots));
    }
    expect(leaked, 'colour must resolve through the Theme collection, never Component').toEqual([]);
  });

  it('reports variants the recipe actually declares, including the unset boolean', () => {
    // `loading: { true: … }` declares only the interesting half. Enumerating the
    // declared keys alone would emit a matrix in which every Button is loading.
    expect(committed.button!.api).toEqual({
      variant: ['primary', 'secondary', 'ghost', 'danger'],
      size: ['sm', 'md', 'lg'],
      loading: ['false', 'true'],
    });
    expect(committed.button!.matrix).toHaveLength(24);
  });

  it('keeps DEAD_CLASSES empty', () => {
    // The list is a ratchet for classes that generate no CSS. It began with six
    // animation utilities that had never animated anything; those are now defined in
    // theme.css. Adding an entry is a regression — define the class instead.
    expect([...DEAD_CLASSES]).toEqual([]);
  });

  it('records the animations that were previously dropped silently', () => {
    // The regression that motivated the emitter's dropped-class check: an unmatched
    // Tailwind class produces no rule, no warning, and no schema entry — so an
    // accordion that never slid looked exactly like one with nothing to record.
    expect(committed.accordion!.common.content!.states).toEqual({
      'data-[state=closed]': { animation: { value: 'var(--animate-accordion-up)' } },
      'data-[state=open]': { animation: { value: 'var(--animate-accordion-down)' } },
    });
    expect(committed.dialog!.common.overlay!.states).toEqual({
      'data-[state=closed]': { animation: { value: 'var(--animate-fade-out)' } },
      'data-[state=open]': { animation: { value: 'var(--animate-fade-in)' } },
    });
  });
});
