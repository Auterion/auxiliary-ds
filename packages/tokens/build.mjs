import { rmSync } from 'node:fs';
import StyleDictionary from 'style-dictionary';
import { converter, formatHex, parse as parseColor } from 'culori';
import { assertGtc } from './gtc-validate.mjs';

/**
 * Output directory, overridable so a test can build somewhere private.
 *
 * This matters because the build WIPES its output first (see below), and `dist/` is now
 * read at test time by downstream suites — packages/css derives its component schema
 * from figma-native.json + tokens.css. A test that rebuilds in place therefore deletes,
 * for a few hundred milliseconds, a directory another package's tests are reading, and
 * turbo runs those suites concurrently. The failure looks like a missing module in an
 * unrelated package, which is about the worst possible signal.
 */
const OUT_DIR = process.env.AUX_TOKENS_OUT ?? 'dist';

// Wipe the output entirely before building: cleanAllPlatforms() only removes the
// declared destinations, so renamed outputs and stray files (e.g. editor /
// macOS conflict copies) would otherwise survive — and `files: ["dist"]`
// publishes everything in here.
rmSync(OUT_DIR, { recursive: true, force: true });

const THEMES = ['light', 'dark', 'sunlight', 'darknight'];

// Registers are the second orthogonal axis (ROADMAP §6g): [data-register]
// re-resolves the non-color "flex" tokens (control height, radius, motion)
// exactly the way [data-theme] re-resolves color. `expressive` is the default
// (no attribute, no override block) so only `operational` ships a token file.
const REGISTERS = ['expressive', 'operational'];

// Input-modality axis (ROADMAP § Input modality & touch): a coarse pointer
// floors interactive target sizes to --target-min (44px, MIL-STD-1472 / WCAG
// 2.5.5 AAA). Modelled as a single `--target-floor` toggle (0px → 44px) that
// recipes consume via `max(--control-height-*, --target-floor)`, so it composes
// *over* register density at any tree depth and wins by construction. Detection
// is the media query (default); `[data-input]` is the authoring override
// (kiosks/field tablets force coarse; a known desk forces fine). Static CSS —
// not token-derived — so it's emitted verbatim after the theme/register blocks.
const INPUT_MODALITY_CSS = `@media (pointer: coarse) {
  :root { --target-floor: var(--target-min); --field-text-floor: var(--field-text-min); }
}
[data-input="coarse"] { --target-floor: var(--target-min); --field-text-floor: var(--field-text-min); }
[data-input="fine"] { --target-floor: 0px; --field-text-floor: 0px; }
`;

const toSrgb = converter('rgb');

// GTC (buninux.com/design-tokens): the first path segment is always the Group, and
// for the two axis tiers the second segment is the axis VALUE:
//   global.spacing.4                  theme.dark.card
//   register.operational.radius.sm    component.button.radius.md
// Every classifier keys off path[0] so a token that isn't under a known group can
// never fall through into the "everything else" bucket (see assertSourceShapes).
const isGlobal = (t) => t.path[0] === 'global';
const isTheme = (t) => t.path[0] === 'theme' && THEMES.includes(t.path[1]);
const isRegister = (t) => t.path[0] === 'register' && REGISTERS.includes(t.path[1]);
const isComponent = (t) => t.path[0] === 'component';
/** Axis value (theme mode / register name) for the two axis tiers. */
const axisOf = (t) => t.path[1];
// Composite typography roles ($type "typography") are not a single CSS value —
// they decompose into the existing text/leading/tracking/font utilities, and ship
// to Figma as Text Styles (like shadow → Effect Styles). Excluded from the flat
// CSS var/Tailwind exports; surfaced in DTCG json + figma-native textStyles.
const isTypography = (t) => t.$type === 'typography';
// Register override blocks, emitted only for registers that actually have tokens.
const registersWithTokens = (allTokens) =>
  REGISTERS.filter((name) => allTokens.some((t) => isRegister(t) && axisOf(t) === name));

// `_` is this repo's DTCG-safe stand-in for a decimal point (JSON keys can hold a
// "." but Style Dictionary treats it as a path separator), so `spacing.2_5` means
// 2.5. It must emit as an ESCAPED dot: Tailwind looks up `--spacing-2\.5` for the
// `px-2.5` utility. Emitting `--spacing-2-5` — as this did until the GTC pass —
// silently never matched, leaving all three fractional rungs dead and every
// `px-2.5` quietly falling back to Tailwind's own `--spacing` multiplier.
const kebabSegment = (s) => String(s).replace(/_/g, '\\.');
const cssName = (path) => path.map(kebabSegment).join('-');

// Fluid type: a dimension token may declare a phone-width minimum via
// $extensions["com.auterion.auxiliary"].fluid.min; $value stays the desktop
// maximum (so JS/DTCG/Figma exports keep concrete sizes) and only the CSS
// emission interpolates between them with clamp() across this viewport range.
const FLUID_VP = { minPx: 360, maxPx: 1280 }; // small phone → breakpoint.xl
const fluidMin = (t) => t.original?.$extensions?.['com.auterion.auxiliary']?.fluid?.min;
const trimNum = (n, dp = 3) =>
  String(Math.round(n * 10 ** dp) / 10 ** dp);
const fluidClamp = (minRaw, maxRaw) => {
  const min = parseFloat(minRaw);
  const max = parseFloat(maxRaw);
  const range = FLUID_VP.maxPx - FLUID_VP.minPx;
  const slopeVw = ((max - min) / range) * 100;
  const interceptPx = min - FLUID_VP.minPx * ((max - min) / range);
  return `clamp(${trimNum(min / 16)}rem, ${trimNum(interceptPx / 16)}rem + ${trimNum(slopeVw)}vw, ${trimNum(max / 16)}rem)`;
};

// Tailwind v4 derives per-size line-height/letter-spacing from suffixed theme
// vars (--text-3xl--line-height). The token source models them as sibling
// groups (text-leading/*, text-tracking/*) because DTCG paths can't express
// the double-dash suffix; this maps them back at CSS-emission time only.
const SUFFIX_GROUPS = {
  'text-leading': '--line-height',
  'text-tracking': '--letter-spacing',
};
// How many leading path segments are namespace rather than name. Emitted CSS
// variable names MUST NOT change across the GTC restructure — they are the public
// contract every recipe, demo and doc page consumes:
//   global.spacing.4                -> --spacing-4
//   theme.light.card-foreground     -> --card-foreground     (drops TWO segments)
//   register.operational.radius.md  -> --radius-md           (drops TWO segments)
// The component tier deliberately KEEPS its group segment, so a per-component var
// (--component-button-radius-md) can never collide with a global one.
const GROUP_STRIP = { global: 1, theme: 2, register: 2, component: 0 };

/** Name a CSS var from an already-stripped segment list. */
const varNameFor = (segments) => {
  const suffix = SUFFIX_GROUPS[segments[0]];
  if (suffix) return `--text-${cssName(segments.slice(1))}${suffix}`;
  return `--${cssName(segments)}`;
};
const cssVarName = (t) => varNameFor(t.path.slice(GROUP_STRIP[t.path[0]] ?? 0));

const ALIAS_RE = /^\{([^}]+)\}$/;
/** The `{a.b.c}` target of an alias-valued token, as segments — or null. */
const aliasSegments = (t) => {
  const raw = t.original?.$value;
  const m = typeof raw === 'string' ? raw.match(ALIAS_RE) : null;
  return m ? m[1].split('.') : null;
};

/**
 * Component tokens emit a REFERENCE, never a resolved literal.
 *
 * Every other tier resolves to a literal because a literal is what it means. A
 * component token means "this button's md height IS the global md control height" —
 * a redirect. Baking `36px` would freeze it: under [data-register="operational"]
 * --control-height-md becomes 32px and a literal would not follow. `var(...)`
 * follows by construction. No fallback value: the target is declared in this same
 * generated file, and a fallback is precisely the frozen literal being eliminated.
 */
const componentValue = (t) => {
  const alias = aliasSegments(t);
  if (!alias) return t.$value; // unreachable — assertComponentTier forbids literals
  return `var(${varNameFor(alias[0] === 'global' ? alias.slice(1) : alias)})`;
};

const renderComponentVars = (tokens, indent = '  ') =>
  tokens.map((t) => `${indent}${cssVarName(t)}: ${componentValue(t)};`).join('\n');

/** CSS var names a token list declares — used to find what a register block shadows. */
const declaredNames = (tokens) => new Set(tokens.map((t) => cssVarName(t)));

/**
 * Component vars that must be RE-EMITTED inside a register block.
 *
 * Custom properties substitute var() at the element the declaration applies to, and
 * descendants inherit the already-substituted value. So a `:root`-only
 * `--component-button-height-md: var(--control-height-md)` computes to 36px at
 * :root, and a SUBTREE carrying [data-register="operational"] would inherit that
 * 36px — silently ignoring the register. Since the register axis is documented as
 * composing at any tree depth, every block that shadows a referenced var has to
 * restate the component tokens that point at it.
 */
const componentVarsDependingOn = (components, shadowed) =>
  components.filter((t) => {
    const alias = aliasSegments(t);
    if (!alias) return false;
    return shadowed.has(varNameFor(alias[0] === 'global' ? alias.slice(1) : alias));
  });

const renderVars = (tokens, indent = '  ') =>
  tokens
    .map((t) => {
      const min = fluidMin(t);
      const value = min ? fluidClamp(min, t.$value) : t.$value;
      return `${indent}${cssVarName(t)}: ${value};`;
    })
    .join('\n');

StyleDictionary.registerFormat({
  name: 'css/auxiliary-tailwind-themes',
  format: async ({ dictionary }) => {
    // Positive filter on the global tier. This was previously the double negative
    // `!isTheme && !isRegister`, which is an allow-list by accident: a component
    // token satisfies both negations, so it would silently land in @theme{} as a
    // resolved literal — losing its var() reference and its register flex.
    const globals = dictionary.allTokens.filter((t) => isGlobal(t) && !isTypography(t));
    const byTheme = Object.fromEntries(
      THEMES.map((name) => [name, dictionary.allTokens.filter((t) => isTheme(t) && axisOf(t) === name)])
    );
    const byRegister = Object.fromEntries(
      REGISTERS.map((name) => [name, dictionary.allTokens.filter((t) => isRegister(t) && axisOf(t) === name)])
    );

    let out = '';
    // @theme: globals + light defaults (Tailwind generates utilities from these)
    out += '@theme {\n';
    out += '  /* Global */\n';
    out += renderVars(globals) + '\n\n';
    out += '  /* Theme (light defaults) */\n';
    out += renderVars(byTheme.light) + '\n';
    out += '}\n\n';

    // System dark mode
    out += '@media (prefers-color-scheme: dark) {\n  :root {\n';
    out += renderVars(byTheme.dark, '    ') + '\n';
    out += '  }\n}\n\n';

    // Explicit overrides via [data-theme]
    for (const theme of THEMES) {
      out += `[data-theme="${theme}"] {\n`;
      out += renderVars(byTheme[theme]) + '\n';
      out += '}\n\n';
    }

    // Increased-contrast preference. Answered with the hardened palettes that
    // already ship rather than a fifth and sixth theme: `sunlight` is built to
    // clear 7:1 body and 3:1 structural border/input under glare, and `darknight`
    // is its dark counterpart — which is exactly what "give me more contrast"
    // is asking for. Scoped to :root:not([data-theme]) so a DELIBERATE theme
    // choice always beats an inferred preference; the operator who picked
    // `light` keeps `light`.
    out += '@media (prefers-contrast: more) {\n';
    out += '  :root:not([data-theme]) {\n';
    out += renderVars(byTheme.sunlight, '    ') + '\n';
    out += '  }\n\n';
    out += '  @media (prefers-color-scheme: dark) {\n';
    out += '    :root:not([data-theme]) {\n';
    out += renderVars(byTheme.darknight, '      ') + '\n';
    out += '    }\n';
    out += '  }\n';
    out += '}\n\n';

    // Component tier — reference-valued so it follows [data-register]. Emitted in a
    // plain :root block, deliberately NOT inside @theme{}: Tailwind tree-shakes theme
    // variables against generated utilities, and --component-* is not a Tailwind
    // namespace, so the whole tier could be dropped. Recipes consume these with the
    // `px-(--component-button-padding-x-md)` shorthand, which needs no theme entry.
    const components = dictionary.allTokens.filter(isComponent);
    if (components.length) {
      out += `:root {\n${renderComponentVars(components)}\n}\n\n`;
    }

    // Register overrides via [data-register] — the orthogonal non-color axis.
    // expressive = default (the @theme/global values above), so only the
    // operational override block is emitted.
    const regs = registersWithTokens(dictionary.allTokens);
    for (const register of regs) {
      out += `[data-register="${register}"] {\n`;
      out += renderVars(byRegister[register]) + '\n';
      const dependents = componentVarsDependingOn(components, declaredNames(byRegister[register]));
      if (dependents.length) out += renderComponentVars(dependents) + '\n';
      out += '}\n';
      if (register !== regs.at(-1)) out += '\n';
    }

    // Input-modality (coarse-pointer) layer — after theme + register so it wins.
    out += '\n' + INPUT_MODALITY_CSS;
    return out;
  },
});

StyleDictionary.registerFormat({
  name: 'css/auxiliary-vars',
  format: async ({ dictionary }) => {
    // Positive filter on the global tier — see the note in the tailwind format.
    const globals = dictionary.allTokens.filter((t) => isGlobal(t) && !isTypography(t));
    const byTheme = Object.fromEntries(
      THEMES.map((name) => [name, dictionary.allTokens.filter((t) => isTheme(t) && axisOf(t) === name)])
    );
    const byRegister = Object.fromEntries(
      REGISTERS.map((name) => [name, dictionary.allTokens.filter((t) => isRegister(t) && axisOf(t) === name)])
    );

    let out = '/* Generated — do not edit */\n\n';
    out += ':root {\n';
    out += renderVars(globals) + '\n\n';
    out += renderVars(byTheme.light) + '\n';
    out += '}\n\n';

    out += '@media (prefers-color-scheme: dark) {\n  :root {\n';
    out += renderVars(byTheme.dark, '    ') + '\n';
    out += '  }\n}\n\n';

    for (const theme of THEMES) {
      out += `[data-theme="${theme}"] {\n`;
      out += renderVars(byTheme[theme]) + '\n';
      out += '}\n\n';
    }

    // Component tier — see the note in the tailwind format.
    const components = dictionary.allTokens.filter(isComponent);
    if (components.length) {
      out += `:root {\n${renderComponentVars(components)}\n}\n\n`;
    }

    // [data-register] — the orthogonal non-color axis (ROADMAP §6g).
    for (const register of registersWithTokens(dictionary.allTokens)) {
      out += `[data-register="${register}"] {\n`;
      out += renderVars(byRegister[register]) + '\n';
      const dependents = componentVarsDependingOn(components, declaredNames(byRegister[register]));
      if (dependents.length) out += renderComponentVars(dependents) + '\n';
      out += '}\n\n';
    }

    // Input-modality (coarse-pointer) layer — after theme + register so it wins.
    out += INPUT_MODALITY_CSS;
    return out;
  },
});

// The JS entry ships as plain JS + a declaration file (not a raw .ts source):
// Node refuses type-stripping under node_modules, so a published .ts entry
// breaks every non-bundler consumer. A JSON literal is valid TS type syntax,
// so the .d.ts preserves the exact as-const literal types.
const tokensTree = (dictionary) => {
  const tree = {};
  for (const t of dictionary.allTokens) {
    let node = tree;
    for (let i = 0; i < t.path.length - 1; i++) {
      const key = t.path[i];
      node[key] ??= {};
      node = node[key];
    }
    node[t.path[t.path.length - 1]] = t.$value;
  }
  return tree;
};

StyleDictionary.registerFormat({
  name: 'javascript/tokens-const',
  format: async ({ dictionary }) =>
    `export const tokens = ${JSON.stringify(tokensTree(dictionary), null, 2)};\n`,
});

StyleDictionary.registerFormat({
  name: 'typescript/tokens-dts',
  format: async ({ dictionary }) =>
    `export declare const tokens: ${JSON.stringify(tokensTree(dictionary), null, 2)};\n`,
});

/**
 * Convert authoring-friendly token values into strict W3C DTCG shapes.
 * Our source files use CSS-like strings ("16px", "200ms", "cubic-bezier(...)"
 * "0 1px 2px rgb(...)") because they're readable and Style Dictionary's CSS
 * pipeline emits them straight through. The DTCG export needs the structured
 * forms validators and downstream tools (Paper, Magic Path, Pencil, etc.)
 * expect. Aliases (`{path}` strings) and color strings stay untouched.
 */
const DIM_RE = /^(-?\d*\.?\d+)([a-zA-Z%]+)?$/;
const CB_RE = /^cubic-bezier\(\s*([\d.-]+)\s*,\s*([\d.-]+)\s*,\s*([\d.-]+)\s*,\s*([\d.-]+)\s*\)$/;
// Strict-DTCG color $value object form (spec §8.1) in sRGB color space.
// Source values may be in any CSS color function (oklch, rgb, hex, hsl, …);
// culori normalises them to sRGB and we emit `{colorSpace, components, alpha,
// hex}`. We deliberately collapse to sRGB rather than carry the source space
// because most validators and design tools only round-trip sRGB cleanly; the
// perceptually-uniform OKLCH literals are still authoritative in tokens.css /
// tailwind-v4.css where browsers render them natively.
const toDtcgColor = (raw) => {
  if (typeof raw !== 'string') return null;
  const parsed = parseColor(raw);
  if (!parsed) return null;
  const rgb = toSrgb(parsed);
  if (!rgb) return null;
  // Clamp to gamut (oklch can encode out-of-gamut sRGB values), then round
  // to 6 decimals — keeps the file readable without losing perceptual fidelity.
  const round = (n) => Math.round(Math.max(0, Math.min(1, n)) * 1e6) / 1e6;
  const r = round(rgb.r ?? 0);
  const g = round(rgb.g ?? 0);
  const b = round(rgb.b ?? 0);
  const alpha = rgb.alpha ?? 1;
  const out = {
    colorSpace: 'srgb',
    components: [r, g, b],
    hex: formatHex({ mode: 'rgb', r, g, b }),
  };
  if (alpha !== 1) out.alpha = round(alpha);
  return out;
};

const toDtcgValue = (token) => {
  const raw = token.original?.$value ?? token.$value;
  // Aliases pass through verbatim — they're spec-compliant strings.
  if (typeof raw === 'string' && raw.startsWith('{') && raw.endsWith('}')) return raw;

  switch (token.$type) {
    case 'color': {
      const dtcg = toDtcgColor(raw);
      return dtcg ?? raw;
    }
    case 'dimension':
    case 'duration': {
      if (typeof raw === 'number') {
        return { value: raw, unit: token.$type === 'duration' ? 'ms' : 'px' };
      }
      const m = String(raw).match(DIM_RE);
      if (m) return { value: parseFloat(m[1]), unit: m[2] ?? (token.$type === 'duration' ? 'ms' : 'px') };
      return raw;
    }
    case 'cubicBezier': {
      const m = String(raw).match(CB_RE);
      if (m) return [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3]), parseFloat(m[4])];
      if (Array.isArray(raw) && raw.length === 4) return raw.map(Number);
      return raw;
    }
    case 'shadow': {
      // Source authors shadows as CSS strings: "0 1px 2px 0 rgb(0 0 0 / 0.08)"
      // or composite "0 4px 8px -2px rgb(..), 0 2px 4px -2px rgb(..)".
      // DTCG wants { color, offsetX, offsetY, blur, spread } per layer.
      const layers = String(raw)
        .split(/,(?![^()]*\))/)
        .map((s) => s.trim())
        .map((layer) => {
          const m = layer.match(/^(-?\d+(?:\.\d+)?)(px|rem|em)?\s+(-?\d+(?:\.\d+)?)(px|rem|em)?\s+(-?\d+(?:\.\d+)?)(px|rem|em)?(?:\s+(-?\d+(?:\.\d+)?)(px|rem|em)?)?\s+(.+)$/);
          if (!m) return null;
          const dim = (v, u) => ({ value: parseFloat(v), unit: u ?? 'px' });
          return {
            color: toDtcgColor(m[9]) ?? m[9],
            offsetX: dim(m[1], m[2]),
            offsetY: dim(m[3], m[4]),
            blur: dim(m[5], m[6]),
            spread: m[7] != null ? dim(m[7], m[8]) : { value: 0, unit: 'px' },
          };
        });
      if (layers.every(Boolean)) return layers.length === 1 ? layers[0] : layers;
      return raw;
    }
    case 'typography': {
      // Composite (spec §9.7): { fontFamily, fontSize, fontWeight, lineHeight,
      // letterSpacing }. Aliases pass through as {path} strings; literal
      // dimensions (fontSize/letterSpacing) become { value, unit }; lineHeight /
      // fontWeight stay numbers. `raw` here is the original (unresolved) object.
      const obj = raw && typeof raw === 'object' ? raw : {};
      const dim = (v) => {
        if (typeof v === 'string' && v.startsWith('{') && v.endsWith('}')) return v;
        if (typeof v === 'number') return { value: v, unit: 'px' };
        const m = String(v).match(DIM_RE);
        return m ? { value: parseFloat(m[1]), unit: m[2] ?? 'px' } : v;
      };
      const num = (v) => {
        if (typeof v === 'string' && v.startsWith('{') && v.endsWith('}')) return v;
        const n = Number(v);
        return Number.isNaN(n) ? v : n;
      };
      return {
        fontFamily: obj.fontFamily,
        fontSize: dim(obj.fontSize),
        fontWeight: num(obj.fontWeight),
        lineHeight: num(obj.lineHeight),
        letterSpacing: dim(obj.letterSpacing),
      };
    }
    case 'fontFamily':
    case 'fontWeight':
    case 'number':
    default:
      return raw;
  }
};

/**
 * Strict DTCG single-file export. Consolidates every source token into one
 * nested JSON matching the W3C Design Tokens Community Group spec. Aliases
 * stay as `{path.to.token}` strings. Color values become structured objects
 * with colorSpace + components. Composite types (shadow, cubicBezier) emit
 * their spec'd object/array shapes. Dimension/duration emit { value, unit }.
 *
 * Consumed by any DTCG-aware design tool (Paper, Magic Path, Pencil, …) and
 * validates against the W3C DTCG spec.
 */
StyleDictionary.registerFormat({
  name: 'json/dtcg',
  format: async ({ dictionary }) => {
    const tree = {};
    for (const t of dictionary.allTokens) {
      let node = tree;
      for (let i = 0; i < t.path.length - 1; i++) {
        const key = t.path[i];
        node[key] ??= {};
        node = node[key];
      }
      node[t.path[t.path.length - 1]] = { $type: t.$type, $value: toDtcgValue(t) };
    }
    return JSON.stringify(tree, null, 2) + '\n';
  },
});

/**
 * Figma-native variable export (ROADMAP Phase 5a — the contract for figma-sync).
 *
 * Emits three collections mapping 1:1 onto the Figma Plugin API variable model, so the
 * `@auxiliary/figma-sync` use_figma push script applies them directly. They are named for
 * the GTC tiers they carry, so a Figma binding path and a token path read the same:
 *   - "Global" (single mode "Base") — every scalar global token as a COLOR / FLOAT /
 *     STRING variable. Names use "/" (Figma variable groups).
 *   - "Theme" (4 modes light/dark/sunlight/darknight) — each semantic role as one
 *     COLOR variable whose per-mode value is a cross-collection alias into Global.
 *   - "Component" (3 modes sm/md/lg) — the component tier's structural tokens, whose
 *     size axis collapses onto Figma modes.
 *
 * Figma Variables are unitless, so dimension/duration collapse to FLOAT (px for
 * spacing/radius/text, rem for breakpoint, em for tracking, ms for duration). shadow and
 * cubicBezier are NOT representable as variables — skipped here (shadows ship as Effect
 * Styles via figma-sync; easings stay documentation).
 */
const FIGMA_GLOBAL = 'Global';
/** Figma modes for the Component collection — the component tier's size axis. */
const SIZE_MODES = ['sm', 'md', 'lg'];
// shadow + cubicBezier aren't variables (shadow → Effect Styles; easings → docs).
// typography is a composite → Text Styles, not a variable (handled separately below).
// strokeStyle is a keyword, not a number or colour — figmaType() would fall through
// to FLOAT and toFigmaValue() would yield null, producing exactly the junk variable
// assertSourceShapes exists to prevent.
const FIGMA_SKIP = new Set(['shadow', 'cubicBezier', 'typography', 'strokeStyle']);
const figmaType = (type) =>
  type === 'color' ? 'COLOR' : type === 'fontFamily' ? 'STRING' : 'FLOAT';
// `{global.color.primitive.red.700}` → `Global/color/primitive/red/700`.
// The GTC group is carried by the COLLECTION, not the variable path — GTC's own
// taxonomy rule 2 says so ("in Figma the collection name is the Group and variable
// paths start at Element"). Stripping it is also what keeps every existing Figma
// variable path stable: a renamed *path* would not move the bound instances, it
// would ORPHAN them and silently create duplicates. Renaming a *collection* is
// safe by contrast — Figma binds by variable id, not by qualified name.
const aliasToVarRef = (ref) =>
  `${FIGMA_GLOBAL}/${ref.replace(/[{}]/g, '').replace(/^global\./, '').split('.').join('/')}`;

// Map a resolved fontWeight number → the Figma font style name we'll try first.
const WEIGHT_STYLE = { 400: 'Regular', 500: 'Medium', 600: 'Semi Bold', 700: 'Bold' };
// Map a resolved fontFamily stack → ordered Figma family candidates to load.
// (Token stacks lead with the CSS variable-font name; Figma usually installs the
// base family, so try both.)
const figmaFamilyCandidates = (stack) => {
  const arr = Array.isArray(stack) ? stack : [stack];
  const joined = arr.join(' ');
  // "Inter Display" is deliberately NOT a candidate. The standalone Display binary
  // ships WITHOUT ss07/ss08 (square punctuation), and square punctuation is
  // house-wide — so the display voice is reached via the opsz axis instead
  // (`opsz 32` IS the static Display design). Lead with the VARIABLE family so
  // both that axis and the full feature set are available in Figma.
  if (/Inter/i.test(joined)) return ['Inter Variable', 'Inter'];
  if (/Geist Mono/i.test(joined)) return ['Geist Mono', 'Geist'];
  return [arr[0]];
};
const dimValue = (v) => {
  if (typeof v === 'number') return v;
  const m = String(v).match(DIM_RE);
  return m ? parseFloat(m[1]) : null;
};

// Derive Figma Text Styles from the composite `type/*` typography roles. Values
// are resolved (concrete numbers); fontSize keeps a binding ref to its Global
// variable when the role aliased one, so the plugin can bind it.
const toTextStyles = (allTokens) =>
  allTokens
    .filter((t) => t.$type === 'typography')
    .map((t) => {
      const v = t.$value; // resolved
      const orig = t.original?.$value ?? {}; // aliases (for variable binding)
      const lh = Number(v.lineHeight);
      const ls = dimValue(v.letterSpacing) ?? 0; // em
      const weight = Number(v.fontWeight);
      const bindRef = (val) =>
        typeof val === 'string' && val.startsWith('{') && val.endsWith('}')
          ? aliasToVarRef(val)
          : null;
      return {
        // `global.type.product.display` → `product/display`. Drops the group AND the
        // `type` group segment; these Text Style names are live in the Figma file, so
        // a change here creates duplicates rather than renaming.
        name: t.path.slice(2).join('/'),
        fontFamilyCandidates: figmaFamilyCandidates(v.fontFamily),
        fontStyle: WEIGHT_STYLE[weight] ?? 'Regular',
        fontSize: dimValue(v.fontSize),
        lineHeightPercent: Number.isFinite(lh) ? Math.round(lh * 1000) / 10 : null,
        letterSpacingPercent: Math.round(ls * 1000) / 10, // em → % of font size
        fontSizeVar: bindRef(orig.fontSize),
      };
    });

const toFigmaValue = (token) => {
  const raw = token.original?.$value ?? token.$value;
  if (typeof raw === 'string' && raw.startsWith('{') && raw.endsWith('}')) {
    return { alias: aliasToVarRef(raw) };
  }
  if (token.$type === 'color') {
    const c = toDtcgColor(raw);
    if (!c) return null;
    const [r, g, b] = c.components;
    return { r, g, b, a: c.alpha ?? 1 };
  }
  if (token.$type === 'fontFamily') return Array.isArray(raw) ? raw.join(', ') : String(raw);
  // dimension / number / duration / fontWeight → unitless FLOAT
  if (typeof raw === 'number') return raw;
  const m = String(raw).match(DIM_RE);
  return m ? parseFloat(m[1]) : null;
};

StyleDictionary.registerFormat({
  name: 'json/figma-native',
  format: async ({ dictionary }) => {
    // text-leading/text-tracking are CSS-only pairing vars for Tailwind's
    // per-size suffix convention; Text Styles already carry lh/ls, so raw
    // FLOAT variables for them would be junk in Figma.
    // Positive filter on the global tier (was `!isTheme && !isRegister`, which would
    // sweep the component tier into Global). SUFFIX_GROUPS now sits at path[1],
    // since path[0] is the group.
    const globals = dictionary.allTokens.filter(
      (t) => isGlobal(t) && !FIGMA_SKIP.has(t.$type) && !SUFFIX_GROUPS[t.path[1]],
    );
    const globalVars = globals.map((t) => ({
      // Group carried by the collection — see aliasToVarRef.
      name: t.path.slice(1).join('/'),
      type: figmaType(t.$type),
      valuesByMode: { Base: toFigmaValue(t) },
    }));

    // Group the 4 theme files by role (path after the group + mode segments) into one
    // variable per role with a per-mode alias.
    const roles = new Map();
    for (const t of dictionary.allTokens.filter(isTheme)) {
      const mode = axisOf(t);
      const name = t.path.slice(2).join('/');
      if (!roles.has(name)) roles.set(name, { name, type: figmaType(t.$type), valuesByMode: {} });
      roles.get(name).valuesByMode[mode] = toFigmaValue(t);
    }

    // Component tier → a third collection with SIZE as Figma modes. The source
    // authors size as a path segment (DTCG has no mode concept we adopted), but
    // Figma models exactly this natively, and collapsing at export is the same
    // transform the Theme collection already performs across four theme files.
    // It is what lets a designer flip one frame's mode and have every bound
    // radius/padding/height resize together.
    const componentVars = new Map();
    for (const t of dictionary.allTokens.filter(isComponent)) {
      const leaf = t.path.at(-1);
      const sized = SIZE_MODES.includes(leaf);
      const name = (sized ? t.path.slice(1, -1) : t.path.slice(1)).join('/');
      if (!componentVars.has(name)) {
        componentVars.set(name, { name, type: figmaType(t.$type), valuesByMode: {} });
      }
      const entry = componentVars.get(name);
      if (sized) entry.valuesByMode[leaf] = toFigmaValue(t);
      else for (const m of SIZE_MODES) entry.valuesByMode[m] = toFigmaValue(t);
    }
    // Figma requires a value per mode. A two-size component (Badge, StatusBadge)
    // genuinely has no `lg`, so carry the nearest declared rung outward rather than
    // inventing a third size — "Badge at lg looks like Badge at md" is the truth.
    for (const v of componentVars.values()) {
      let carry = null;
      for (const m of SIZE_MODES) {
        if (v.valuesByMode[m] !== undefined) carry = v.valuesByMode[m];
        else if (carry !== null) v.valuesByMode[m] = carry;
      }
      carry = null;
      for (const m of [...SIZE_MODES].reverse()) {
        if (v.valuesByMode[m] !== undefined) carry = v.valuesByMode[m];
        else if (carry !== null) v.valuesByMode[m] = carry;
      }
    }

    return (
      JSON.stringify(
        {
          collections: [
            { name: FIGMA_GLOBAL, modes: ['Base'], variables: globalVars },
            { name: 'Theme', modes: THEMES, variables: [...roles.values()] },
            ...(componentVars.size
              ? [{ name: 'Component', modes: SIZE_MODES, variables: [...componentVars.values()] }]
              : []),
          ],
          textStyles: toTextStyles(dictionary.allTokens),
        },
        null,
        2,
      ) + '\n'
    );
  },
});

/**
 * Build-time invariant: every semantic theme token must be a `{path}` alias
 * to a primitive. Catches accidental "literal RGB" cells like the bespoke
 * OpenBridge night palette we deleted. Throws with a clear list of offenders.
 */
const assertPrimitivePurity = (dictionary) => {
  const offenders = [];
  for (const t of dictionary.allTokens) {
    if (!isTheme(t)) continue;
    const orig = t.original?.$value;
    // Tightened with the GTC rename: the target must be a colour PRIMITIVE, not just
    // any alias. Catches a theme role pointing at another theme role or at a
    // non-colour global — neither of which the old "starts with {" test caught.
    const isAlias = typeof orig === 'string' && orig.endsWith('}') && orig.startsWith('{global.color.primitive.');
    if (!isAlias) {
      offenders.push(`  ${t.path.join('.')} = ${JSON.stringify(orig)}`);
    }
  }
  if (offenders.length > 0) {
    throw new Error(
      `Primitive-purity check failed — ${offenders.length} theme token(s) ` +
        `use literal values instead of {color.primitive.*} aliases:\n` +
        offenders.join('\n'),
    );
  }
};

/**
 * Build-time orthogonality invariant (ROADMAP §6g): the two axes never overlap.
 * Register controls everything *non-color* (density/radius/motion); theme
 * controls *only* color. So: no register token may be a color, and no theme
 * token may be a non-color flex token. A drift here would couple the axes and
 * break the "[data-theme] × [data-register] compose freely" contract.
 */
const assertRegisterOrthogonality = (dictionary) => {
  const offenders = [];
  for (const t of dictionary.allTokens) {
    if (isRegister(t) && t.$type === 'color') {
      offenders.push(`  register ${t.path.join('.')} is a color (register never touches color)`);
    }
    if (isTheme(t) && t.$type !== 'color') {
      offenders.push(`  theme ${t.path.join('.')} is ${t.$type} (theme is color-only)`);
    }
  }
  if (offenders.length > 0) {
    throw new Error(
      `Register/theme orthogonality check failed — ${offenders.length} token(s) cross the axis:\n` +
        offenders.join('\n'),
    );
  }
};

/**
 * Build-time parity invariant: all four themes must define the identical role
 * set (and each role the same $type everywhere). A role missing from one theme
 * would silently fall through to the light value in the emitted CSS — e.g. a
 * darknight theme missing `brand` would leak full-blue-energy light brand into
 * the scotopic theme, invisible to the per-theme gates (they iterate only the
 * keys a theme *has*).
 */
const assertThemeRoleParity = (dictionary) => {
  const roleSets = new Map(THEMES.map((theme) => [theme, new Map()]));
  for (const t of dictionary.allTokens) {
    if (!isTheme(t)) continue;
    // path[0] is the `theme` group, path[1] the mode. isTheme already guarantees
    // path[1] ∈ THEMES, so the map lookup cannot be undefined.
    roleSets.get(axisOf(t)).set(t.path.slice(2).join('.'), t.$type);
  }
  const union = new Map();
  for (const roles of roleSets.values()) {
    for (const [role, type] of roles) if (!union.has(role)) union.set(role, type);
  }
  const offenders = [];
  for (const [theme, roles] of roleSets) {
    const missing = [...union.keys()].filter((r) => !roles.has(r));
    if (missing.length) offenders.push(`  ${theme} missing: ${missing.join(', ')}`);
    for (const [role, type] of roles) {
      if (union.get(role) !== type) {
        offenders.push(`  ${theme}.${role} is ${type} but ${union.get(role)} elsewhere`);
      }
    }
  }
  if (offenders.length > 0) {
    throw new Error(
      `Theme-role parity check failed — the four themes must define the same roles:\n` +
        offenders.join('\n'),
    );
  }
};

/**
 * Build-time invariants for the component tier (GTC).
 *
 *  - No colour. Colour belongs to the theme axis exclusively; a component colour
 *    would be invisible to the four per-theme contrast/CVD/blue-energy gates and
 *    would not re-resolve under [data-theme].
 *  - Every token aliases a global. A literal here defines a value the component tier
 *    has no authority to define, and — because component tokens emit as var() — it
 *    would be the one declaration in the block that silently does not follow
 *    [data-register].
 *  - Aliases must resolve, and only into `global.*`.
 *  - No `global.target.*`. --target-floor is re-declared by the @media(pointer:coarse)
 *    and [data-input] blocks, which do NOT re-emit the component tier, so a component
 *    var pointing at it would inherit its :root-substituted value and silently ignore
 *    the touch floor. Recipes must compose it with max() at the point of use.
 */
const assertComponentTier = (dictionary) => {
  const globalPaths = new Set(
    dictionary.allTokens.filter(isGlobal).map((t) => t.path.join('.')),
  );
  const offenders = [];
  for (const t of dictionary.allTokens) {
    if (!isComponent(t)) continue;
    const at = t.path.join('.');
    if (t.$type === 'color') {
      offenders.push(`  ${at} is a color (the component tier is structural only)`);
    }
    const alias = aliasSegments(t);
    if (!alias) {
      offenders.push(
        `  ${at} = ${JSON.stringify(t.original?.$value)} (component tokens must alias a global token)`,
      );
      continue;
    }
    const target = alias.join('.');
    if (alias[0] !== 'global') {
      offenders.push(`  ${at} -> {${target}} (component may only alias global.*)`);
    } else if (!globalPaths.has(target)) {
      offenders.push(`  ${at} -> {${target}} does not exist`);
    } else if (alias[1] === 'target') {
      offenders.push(
        `  ${at} -> {${target}} (compose target.* with max() in the recipe — it is not re-emitted under [data-input])`,
      );
    }
  }
  if (offenders.length > 0) {
    throw new Error(
      `Component-tier check failed — ${offenders.length} violation(s):\n` + offenders.join('\n'),
    );
  }
};

/**
 * Build-time source-shape validation: every token must carry a known $type and
 * a $value whose shape matches it. Without this, an untyped token flows through
 * as $type undefined → Figma FLOAT with null values, and an object $value on a
 * scalar type emits `--x: [object Object]` into the CSS.
 */
const GTC_GROUPS = new Set(['global', 'theme', 'component', 'register']);
const KNOWN_TYPES = new Set([
  'color',
  'dimension',
  'duration',
  'cubicBezier',
  'shadow',
  'typography',
  'fontFamily',
  'fontWeight',
  'number',
  'strokeStyle', // DTCG §9.2 — border-style
]);
// DTCG §9.2 keyword forms. `none` is NOT among them (use border-width.0).
const STROKE_STYLE_KEYWORDS = new Set([
  'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'outset', 'inset',
]);
const LINE_CAPS = new Set(['round', 'butt', 'square']);
const TYPOGRAPHY_KEYS = ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing'];
const assertSourceShapes = (dictionary) => {
  const offenders = [];
  const isAlias = (v) => typeof v === 'string' && v.startsWith('{') && v.endsWith('}');
  for (const t of dictionary.allTokens) {
    const type = t.original?.$type ?? t.$type;
    const raw = t.original?.$value ?? t.$value;
    // Every token must sit under a GTC group. Without this a file authored in the
    // pre-GTC un-prefixed shape (`{"spacing": {...}}`) matches none of the
    // classifiers, silently skips every emission block, and vanishes from the CSS.
    if (!GTC_GROUPS.has(t.path[0])) {
      offenders.push(
        `  ${t.path.join('.')} is not under a GTC group (${[...GTC_GROUPS].join('/')})`,
      );
      continue;
    }
    if (t.path[0] === 'theme' && !THEMES.includes(t.path[1])) {
      offenders.push(`  ${t.path.join('.')} — "theme" must be followed by ${THEMES.join('|')}`);
      continue;
    }
    if (t.path[0] === 'register' && !REGISTERS.includes(t.path[1])) {
      offenders.push(`  ${t.path.join('.')} — "register" must be followed by ${REGISTERS.join('|')}`);
      continue;
    }
    if (!KNOWN_TYPES.has(type)) {
      offenders.push(`  ${t.path.join('.')} has unknown $type ${JSON.stringify(type)}`);
      continue;
    }
    if (isAlias(raw)) continue;
    const bad = (why) => offenders.push(`  ${t.path.join('.')} = ${JSON.stringify(raw)} (${why})`);
    switch (type) {
      case 'color':
        if (typeof raw !== 'string' || !parseColor(raw)) bad('unparseable color');
        break;
      case 'dimension':
      case 'duration':
        if (typeof raw !== 'number' && !(typeof raw === 'string' && DIM_RE.test(raw)))
          bad(`malformed ${type}`);
        break;
      case 'number':
      case 'fontWeight':
        if (typeof raw !== 'number' || !Number.isFinite(raw)) bad(`non-finite ${type}`);
        break;
      case 'fontFamily':
        if (typeof raw !== 'string' && !Array.isArray(raw)) bad('fontFamily must be string or array');
        break;
      case 'cubicBezier':
        if (
          !(typeof raw === 'string' && CB_RE.test(raw)) &&
          !(Array.isArray(raw) && raw.length === 4 && raw.every((n) => typeof n === 'number'))
        )
          bad('malformed cubicBezier');
        break;
      case 'shadow':
        if (typeof raw !== 'string') bad('shadow must be a CSS string');
        break;
      case 'strokeStyle':
        // DTCG §9.2: a keyword, or { dashArray: <dimension>[], lineCap }.
        if (typeof raw === 'string') {
          if (!STROKE_STYLE_KEYWORDS.has(raw)) bad('unknown strokeStyle keyword (DTCG §9.2)');
        } else if (raw !== null && typeof raw === 'object' && !Array.isArray(raw)) {
          if (
            !Array.isArray(raw.dashArray) ||
            !raw.dashArray.every((d) => typeof d === 'string' && DIM_RE.test(d))
          )
            bad('strokeStyle.dashArray must be an array of dimensions');
          if (!LINE_CAPS.has(raw.lineCap)) bad('strokeStyle.lineCap must be round|butt|square');
        } else {
          bad('strokeStyle must be a keyword or { dashArray, lineCap }');
        }
        break;
      case 'typography': {
        if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) {
          bad('typography must be a composite object');
        } else {
          const missing = TYPOGRAPHY_KEYS.filter((k) => !(k in raw));
          if (missing.length) bad(`typography missing ${missing.join(', ')}`);
        }
        break;
      }
    }
    // Opacity is a plain DTCG `number`, but a physically meaningful one. Outside
    // 0..1 it is not an opacity — and a stray `50` (Tailwind's /100 convention)
    // would emit `--opacity-disabled: 50` and render fully opaque, silently.
    if (isGlobal(t) && t.path[1] === 'opacity' && (typeof raw !== 'number' || raw < 0 || raw > 1)) {
      bad('opacity must be a number in 0..1');
    }
  }
  if (offenders.length > 0) {
    throw new Error(
      `Source-shape check failed — ${offenders.length} malformed token(s):\n` + offenders.join('\n'),
    );
  }
};

const sd = new StyleDictionary({
  source: ['src/**/*.tokens.json'],
  platforms: {
    'tailwind-v4': {
      transformGroup: 'css',
      buildPath: OUT_DIR + '/',
      files: [{ destination: 'tailwind-v4.css', format: 'css/auxiliary-tailwind-themes' }],
    },
    css: {
      transformGroup: 'css',
      buildPath: OUT_DIR + '/',
      files: [{ destination: 'tokens.css', format: 'css/auxiliary-vars' }],
    },
    js: {
      transformGroup: 'js',
      buildPath: OUT_DIR + '/',
      files: [
        { destination: 'tokens.js', format: 'javascript/tokens-const' },
        { destination: 'tokens.d.ts', format: 'typescript/tokens-dts' },
      ],
    },
    dtcg: {
      transformGroup: 'js',
      buildPath: OUT_DIR + '/',
      files: [{ destination: 'tokens.json', format: 'json/dtcg' }],
    },
    figma: {
      transformGroup: 'js',
      buildPath: OUT_DIR + '/',
      files: [{ destination: 'figma-native.json', format: 'json/figma-native' }],
    },
  },
});

// GTC model check runs FIRST, against the raw merged source — before Style
// Dictionary hydrates. SD resolves aliases before the assertions below can see
// them, so a dangling `{ref}` throws from inside SD without naming the offending
// token, and a reference *cycle* blows the stack before any assert runs.
assertGtc();

// Run the invariant assertions against a hydrated dictionary, then build.
const dict = await sd.getPlatformTokens('dtcg');
assertPrimitivePurity(dict);
assertRegisterOrthogonality(dict);
assertThemeRoleParity(dict);
assertComponentTier(dict);
assertSourceShapes(dict);

await sd.cleanAllPlatforms();
await sd.buildAllPlatforms();
