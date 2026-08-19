/**
 * component-schema.json  ->  a Figma component spec.
 *
 * This is the CSS-to-Figma translation layer, and it lives here — in plain Node, unit
 * tested — rather than inside the plugin program, for two reasons. The program ships as
 * a string through `use_figma` with a 50 000-character budget and no way to debug it;
 * and the interesting decisions (a `padding-inline` is two Figma paddings, a `color` is
 * a fill on a text child, a size variant is a MODE rather than three bindings) are
 * exactly the ones worth asserting in a test. The program that follows is deliberately
 * dumb: it applies a spec it does not interpret.
 *
 * Scope is the flat recipes only — the ones with no `slots:`. A slotted recipe's frame
 * tree cannot be derived: Card ships as six separate Vue components, so how they nest is
 * the consumer's choice, not the recipe's. Generating a plausible guess would produce a
 * Figma component that quietly disagrees with every real usage.
 */

/** The flat recipes: no slots, so the Figma frame tree follows from the recipe alone. */
export const FLAT_COMPONENTS = [
  'button',
  'badge',
  'input',
  'textarea',
  'label',
  'avatar',
  'separator',
  'skeleton',
  'tooltip',
];

/** Human-facing component-set names. */
const SET_NAME = {
  button: 'Button',
  badge: 'Badge',
  input: 'Input',
  textarea: 'Textarea',
  label: 'Label',
  avatar: 'Avatar',
  separator: 'Separator',
  skeleton: 'Skeleton',
  tooltip: 'Tooltip',
};

/**
 * Sample text, and whether the component has any.
 *
 * A Figma component needs *something* to look at. Where the recipe styles type
 * (`color` / `font-size` land on the slot) a text child carries it; where it does not —
 * Avatar, Separator, Skeleton — the frame stands alone and inventing a label would put
 * a string in the file that no recipe produces.
 */
const SAMPLE_TEXT = {
  button: 'Button',
  badge: 'Badge',
  label: 'Label',
  tooltip: 'Tooltip',
  input: 'Placeholder',
  textarea: 'Placeholder',
};

/**
 * Width for components that have no intrinsic one.
 *
 * A Button hugs its label; a text field does not — it fills whatever it is given, and a
 * hugging Input in Figma collapses to the width of the placeholder, which is not what
 * an Input is. These are sample widths for the artboard, not tokens, and are marked as
 * such so nobody mistakes them for a contract.
 */
const SAMPLE_WIDTH = { input: 240, textarea: 240, separator: 240, skeleton: 240, tooltip: 160 };
const SAMPLE_HEIGHT = { textarea: 88, skeleton: 16, avatar: null, separator: null };

/** CSS longhands this translation understands. Anything else is reported, not guessed. */
const FRAME_PROPS = new Set([
  'background-color',
  'border-radius',
  'border-color',
  'border-width',
  'gap',
  'height',
  'width',
  'padding-inline',
  'padding-block',
  'opacity',
  'display',
  'align-items',
  'justify-content',
  'flex-direction',
]);
const TEXT_PROPS = new Set(['color', 'font-size', 'font-weight']);

/**
 * `Global/font-weight/medium` -> the Figma font style to load.
 *
 * Weight is read from the token PATH rather than bound as a variable: Figma models
 * weight as part of `fontName`, which is a font that must be loaded before any text can
 * be written, not a number that can be swapped afterwards. Deriving the style name from
 * the token keeps the two in step without pretending it is a binding.
 */
const WEIGHT_STYLE = { regular: 'Regular', medium: 'Medium', semibold: 'Semi Bold', bold: 'Bold' };
function fontStyleFor(binding) {
  const leaf = binding?.figma?.split('/').pop();
  return WEIGHT_STYLE[leaf] ?? 'Regular';
}

/** Figma auto-layout enums for the flex properties a recipe can set. */
const ALIGN = { center: 'CENTER', 'flex-start': 'MIN', 'flex-end': 'MAX', start: 'MIN', end: 'MAX' };
const JUSTIFY = {
  center: 'CENTER',
  'flex-start': 'MIN',
  'flex-end': 'MAX',
  'space-between': 'SPACE_BETWEEN',
};

/**
 * The Figma variable behind a schema entry, preferring the Component tier.
 *
 * `height` is the case that matters: the recipe writes
 * `max(var(--component-button-height-md), var(--target-floor))`, two references, and
 * only the first is the design value. `--target-floor` is the coarse-pointer touch
 * minimum — a runtime response to the input device, which Figma has no concept of.
 * Binding it would freeze a 44px button into the library.
 */
function bindingOf(entry) {
  if (!entry) return null;
  if (entry.figma) return { figma: entry.figma, mode: entry.mode ?? null, alpha: entry.alpha ?? null };
  const refs = entry.refs ?? [];
  const preferred = refs.find((r) => r.figma.startsWith('Component/')) ?? refs[0];
  return preferred ? { figma: preferred.figma, mode: preferred.mode ?? null, alpha: null } : null;
}

/** Merge `common` and a matrix row into one flat property map for a slot. */
function mergeSlot(common, row, slot, state) {
  const pick = (source) => {
    if (!source) return {};
    return state === 'rest'
      ? (source.properties ?? {})
      : { ...(source.properties ?? {}), ...(source.states?.[state] ?? {}) };
  };
  return { ...pick(common[slot]), ...pick(row.slots[slot]) };
}

/** `{variant: 'primary', size: 'md'}` + state -> "Variant=primary, Size=md, State=rest" */
function variantName(props, state) {
  const title = (s) => s.charAt(0).toUpperCase() + s.slice(1);
  const parts = Object.entries(props).map(([k, v]) => `${title(k)}=${v}`);
  parts.push(`State=${state}`);
  return parts.join(', ');
}

/**
 * Which interaction states become Figma variants.
 *
 * `rest` is the design artifact. `disabled` earns a variant because it is carried by a
 * real token (`Global/opacity/disabled`) and so stays true when the token moves. `hover`
 * and `active` do not: they are opacity modifiers (`bg-primary/90`) with no token behind
 * them, and materialising one means writing a literal colour into the file that
 * `pnpm figma:diff` would then correctly report as untokenised drift. They stay in the
 * schema, where they are true, and out of Figma, where they would not be.
 */
const STATES = ['rest', 'disabled'];

/**
 * @param {object} schema parsed component-schema.json
 * @returns {{ spec: object, skipped: string[] }}
 */
export function buildComponentSpec(schema) {
  const spec = {};
  const skipped = [];

  for (const name of FLAT_COMPONENTS) {
    const component = schema[name];
    if (!component) {
      skipped.push(`${name}: not in schema`);
      continue;
    }
    if (component.slots.length !== 1 || component.slots[0] !== 'root') {
      skipped.push(`${name}: has slots ${component.slots.join(', ')} — needs a layout declaration`);
      continue;
    }

    const hasState = (state) =>
      state === 'rest' ||
      component.matrix.some((r) => r.slots.root?.states?.[state]) ||
      component.common.root?.states?.[state];
    const states = STATES.filter(hasState);

    const variants = [];
    for (const row of component.matrix) {
      for (const state of states) {
        const props = mergeSlot(component.common, row, 'root', state);
        const frame = {};
        const text = {};
        for (const [property, entry] of Object.entries(props)) {
          if (property.startsWith('--tw-')) continue; // Tailwind plumbing, never geometry
          if (TEXT_PROPS.has(property)) text[property] = entry;
          else if (FRAME_PROPS.has(property)) frame[property] = entry;
        }
        variants.push({
          name: variantName(row.props, state),
          // The size variant IS the Component collection's mode. Setting it once on the
          // frame makes every bound structural variable resolve at that size together.
          mode: bindingOf(frame['height'])?.mode ?? bindingOf(frame['padding-inline'])?.mode ?? null,
          frame: frameSpec(frame, name),
          text: Object.keys(text).length ? textSpec(text, name) : null,
        });
      }
    }

    spec[SET_NAME[name]] = {
      recipe: name,
      props: {
        ...Object.fromEntries(
          Object.entries(component.api).map(([k, v]) => [k.charAt(0).toUpperCase() + k.slice(1), v]),
        ),
        State: states,
      },
      variants,
    };
  }
  return { spec, skipped };
}

function frameSpec(props, recipe) {
  const literal = (p) => props[p]?.value ?? null;
  const bound = (p) => bindingOf(props[p]);
  return {
    layout: literal('flex-direction') === 'column' ? 'VERTICAL' : 'HORIZONTAL',
    align: ALIGN[literal('align-items')] ?? 'CENTER',
    justify: JUSTIFY[literal('justify-content')] ?? 'MIN',
    fill: bound('background-color'),
    stroke: bound('border-color'),
    strokeWeight: bound('border-width'),
    radius: bound('border-radius'),
    gap: bound('gap'),
    paddingX: bound('padding-inline'),
    paddingY: bound('padding-block'),
    height: bound('height'),
    opacity: bound('opacity'),
    // Sample geometry, NOT a token — see SAMPLE_WIDTH.
    sampleWidth: SAMPLE_WIDTH[recipe] ?? null,
    sampleHeight: bound('height') ? null : (SAMPLE_HEIGHT[recipe] ?? null),
  };
}

function textSpec(props, recipe) {
  return {
    characters: SAMPLE_TEXT[recipe] ?? SET_NAME[recipe] ?? recipe,
    fill: bindingOf(props['color']),
    fontSize: bindingOf(props['font-size']),
    fontStyle: fontStyleFor(bindingOf(props['font-weight'])),
  };
}
