/**
 * The Figma Plugin API program that applies Auxiliary tokens to a file's Variables,
 * one-way (code → Figma). Run via the Figma MCP `use_figma` tool — the build step
 * (build-program.mjs) prepends the `DATA` (figma-native.json) and `SHADOWS` constants,
 * producing a self-contained program.
 *
 * Idempotent: collections/variables are matched by name and updated in place, so
 * re-running never duplicates. Two passes — create every variable first, then set
 * values/aliases — so cross-collection aliases (Semantic → Primitives) always resolve.
 * `use_figma` auto-wraps this in an async context, so top-level await is fine.
 */
export const PUSH_PROGRAM = String.raw`
// COLOR values are transported as hex (compact + exact); decode to Figma's {r,g,b,a}.
function hexToRgba(h) {
  const s = h.slice(1);
  const ch = (i) => parseInt(s.slice(i, i + 2), 16) / 255;
  return { r: ch(0), g: ch(2), b: ch(4), a: s.length >= 8 ? ch(6) : 1 };
}

// Property-picker scopes per token group — avoids the default ALL_SCOPES pollution.
function scopesFor(variable) {
  if (variable.type === 'COLOR') return ['ALL_FILLS', 'STROKE_COLOR', 'EFFECT_COLOR'];
  const n = variable.name;
  if (n.startsWith('spacing/')) return ['GAP', 'WIDTH_HEIGHT'];
  if (n.startsWith('radius/')) return ['CORNER_RADIUS'];
  if (n.startsWith('text/')) return ['FONT_SIZE'];
  if (n.startsWith('leading/')) return ['LINE_HEIGHT'];
  if (n.startsWith('tracking/')) return ['LETTER_SPACING'];
  if (n.startsWith('font-weight/')) return ['FONT_WEIGHT'];
  if (n.startsWith('font/')) return ['FONT_FAMILY'];
  return []; // z, breakpoint, duration, density — no standard picker
}

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const collByName = new Map(collections.map((c) => [c.name, c]));

function ensureCollection(name, modes) {
  let c = collByName.get(name);
  if (!c) {
    c = figma.variables.createVariableCollection(name);
    collByName.set(name, c);
  }
  c.renameMode(c.modes[0].modeId, modes[0]);
  const have = new Set(c.modes.map((m) => m.name));
  for (let i = 1; i < modes.length; i++) if (!have.has(modes[i])) c.addMode(modes[i]);
  return c;
}
const modeId = (c, name) => c.modes.find((m) => m.name === name).modeId;

// Index existing variables by "<collectionId>::<name>" for idempotent reuse.
const existing = await figma.variables.getLocalVariablesAsync();
const keyOf = (collId, name) => collId + '::' + name;
const varMap = new Map(existing.map((v) => [keyOf(v.variableCollectionId, v.name), v]));

// Pass 1 — ensure collections + every variable exist (no values yet).
const collObjs = {};
for (const coll of DATA.collections) {
  const c = ensureCollection(coll.name, coll.modes);
  collObjs[coll.name] = c;
  for (const v of coll.variables) {
    const key = keyOf(c.id, v.name);
    let variable = varMap.get(key);
    if (!variable) {
      variable = figma.variables.createVariable(v.name, c, v.type);
      varMap.set(key, variable);
    }
    variable.scopes = scopesFor(v);
  }
}

// Qualified "Collection/name" → Variable, for cross-collection alias resolution.
const byQualified = new Map();
for (const coll of DATA.collections) {
  const c = collObjs[coll.name];
  for (const v of coll.variables) byQualified.set(coll.name + '/' + v.name, varMap.get(keyOf(c.id, v.name)));
}

// Pass 2 — set per-mode values and resolve aliases.
let valuesSet = 0;
for (const coll of DATA.collections) {
  const c = collObjs[coll.name];
  for (const v of coll.variables) {
    const variable = byQualified.get(coll.name + '/' + v.name);
    for (const [mode, val] of Object.entries(v.valuesByMode)) {
      const mid = modeId(c, mode);
      if (val && typeof val === 'object' && val.alias) {
        const target = byQualified.get(val.alias);
        if (!target) throw new Error('Unresolved alias target: ' + val.alias + ' (for ' + v.name + ')');
        variable.setValueForMode(mid, { type: 'VARIABLE_ALIAS', id: target.id });
      } else if (typeof val === 'string' && val[0] === '#') {
        variable.setValueForMode(mid, hexToRgba(val));
      } else {
        variable.setValueForMode(mid, val);
      }
      valuesSet++;
    }
  }
}

// Effect styles for shadows (Variables can't model composite shadows).
const effectStyles = await figma.getLocalEffectStylesAsync();
const effByName = new Map(effectStyles.map((s) => [s.name, s]));
for (const [name, effects] of Object.entries(SHADOWS)) {
  let s = effByName.get(name);
  if (!s) {
    s = figma.createEffectStyle();
    s.name = name;
  }
  s.effects = effects;
}

return {
  collections: DATA.collections.map((c) => ({
    name: c.name,
    modes: collObjs[c.name].modes.map((m) => m.name),
    variables: c.variables.length,
  })),
  valuesSet,
  effectStyles: Object.keys(SHADOWS),
};
`;
