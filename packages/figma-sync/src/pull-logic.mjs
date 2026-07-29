/**
 * The Figma Plugin API program that READS a file's Variables and Styles back out,
 * in exactly the shape `@auxiliary/tokens` emits as `dist/figma-native.json`.
 *
 * This is the observation half of the sync. It writes nothing — to Figma or to the
 * repo — and exists so `src/diff.mjs` can compare two documents of the same shape.
 * Figma is readable here, never authoritative (README Principle 1).
 *
 * WHY THE SHAPE MATTERS MORE THAN THE READ
 * ----------------------------------------
 * The export is lossy in ways that would be miserable to invert by hand: the size
 * segment of a component token becomes a Figma MODE (component.button.padding-x.md
 * -> Component/button/padding-x @ mode md), and every dimension collapses to a
 * unitless FLOAT. Rather than re-derive that inverse, this returns the SAME shape the
 * export already produces, so the comparator never has to know about units or tiers.
 *
 * Two transports must match push-logic.mjs exactly, or every value reports as drift:
 *   1. COLOR -> hex via the same round(x * 255) the push decodes with. The push writes
 *      hex -> {r,g,b,a} by dividing by 255, so this round-trips byte-exact and float
 *      noise cannot manufacture phantom diffs.
 *   2. Aliases resolve to a qualified "Collection/name", never a raw variable id —
 *      ids are per-file and meaningless to a comparator.
 *
 * THE WIRE FORMAT IS COMPACT ON PURPOSE
 * -------------------------------------
 * Measured, not guessed: returning one object per variable truncated at 20kb partway
 * through the 368-variable Global collection. So each variable is one tab-separated row
 * with values POSITIONAL by mode — the mode names are stated once on the collection
 * instead of repeated per variable, which is most of the saving. Aliases are marked with
 * a leading "@". src/decode-pull.mjs expands rows back into the figma-native shape, and
 * is unit-tested against this encoding.
 *
 * OFFSET/LIMIT paginate within a collection for the case where even that is too much;
 * the response carries `more` so the caller knows to ask again rather than silently
 * diffing a partial file — a truncated pull that looked complete would report hundreds
 * of phantom `missing-in-figma` findings.
 *
 * `use_figma` auto-wraps this in an async context, so top-level await is fine.
 * NOTE: this whole file is embedded into a template literal by build-program.mjs
 * — never use a backtick here, not even inside a comment.
 */
export const PULL_PROGRAM = String.raw`
// Inverse of the push's hexToRgba. Same rounding, so a pushed value reads back identical.
function rgbaToHex(c) {
  const h = (n) => Math.round(Math.max(0, Math.min(1, n)) * 255).toString(16).padStart(2, '0');
  return '#' + h(c.r) + h(c.g) + h(c.b) + ((c.a == null || c.a >= 1) ? '' : h(c.a));
}

const collections = await figma.variables.getLocalVariableCollectionsAsync();
const allVariables = await figma.variables.getLocalVariablesAsync();

// id -> "Collection/name", so an alias reads as Primitives/color/primitive/ink/950.
// Built over EVERY variable in the file, not just the ones we are returning: a
// Semantic variable aliases into Primitives, and a per-collection pull must still
// name its alias targets even when Primitives is not in this payload.
const collNameById = new Map(collections.map((c) => [c.id, c.name]));
const qualifiedById = new Map();
for (const v of allVariables) {
  const cn = collNameById.get(v.variableCollectionId);
  if (cn) qualifiedById.set(v.id, cn + '/' + v.name);
}

// WANT is injected by build-program.mjs: an array of collection names, or null for all.
// Per-collection payloads exist because the RESPONSE, not the code, is what strains the
// MCP here — the full file is ~617 variables.
const wanted = (typeof WANT !== 'undefined' && WANT) ? new Set(WANT) : null;

const varsByCollection = new Map();
for (const v of allVariables) {
  const list = varsByCollection.get(v.variableCollectionId) || [];
  list.push(v);
  varsByCollection.set(v.variableCollectionId, list);
}

const offset = (typeof OFFSET !== 'undefined' && OFFSET) ? OFFSET : 0;
const limit = (typeof LIMIT !== 'undefined' && LIMIT) ? LIMIT : Infinity;

// A tab-separated cell. Tabs and newlines inside a Figma name or string value would
// corrupt the row, so they are escaped rather than trusted not to occur.
function cell(s) {
  return String(s).split('\\').join('\\\\').split('\t').join('\\t').split('\n').join('\\n');
}

const outCollections = [];
let more = false;
for (const c of collections) {
  if (wanted && !wanted.has(c.name)) continue;
  const modeNameById = new Map(c.modes.map((m) => [m.modeId, m.name]));
  const modeNames = c.modes.map((m) => m.name);
  // Sorted so a diff of two pulls is stable, and so pagination is deterministic —
  // Figma's own ordering is not guaranteed between calls.
  const all = (varsByCollection.get(c.id) || []).slice();
  all.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
  const page = all.slice(offset, offset === 0 && limit === Infinity ? undefined : offset + limit);
  if (offset + page.length < all.length) more = true;

  const rows = page.map((v) => {
    const cells = [cell(v.name), v.resolvedType];
    for (const modeName of modeNames) {
      const modeId = c.modes.find((m) => m.name === modeName).modeId;
      const raw = v.valuesByMode[modeId];
      if (raw === undefined) {
        cells.push('');
      } else if (raw && typeof raw === 'object' && raw.type === 'VARIABLE_ALIAS') {
        // An alias whose target we cannot name is reported as such rather than
        // silently dropped — a dangling alias is exactly the kind of thing a drift
        // report exists to surface.
        cells.push('@' + cell(qualifiedById.get(raw.id) || ('UNRESOLVED:' + raw.id)));
      } else if (raw && typeof raw === 'object' && 'r' in raw) {
        cells.push(cell(rgbaToHex(raw)));
      } else {
        cells.push(cell(raw));
      }
    }
    return cells.join('\t');
  });

  outCollections.push({ name: c.name, modes: modeNames, total: all.length, rows });
}

// Styles ride with whichever payload sets INCLUDE_STYLES (the last one), mirroring the push.
let effectStyles = null;
let textStyles = null;
if (typeof INCLUDE_STYLES !== 'undefined' && INCLUDE_STYLES) {
  effectStyles = {};
  for (const s of await figma.getLocalEffectStylesAsync()) {
    // Only the fields the push actually sets. Figma adds others (showShadowBehindNode,
    // boundVariables); comparing those would report drift we never caused.
    effectStyles[s.name] = s.effects.map((e) => ({
      type: e.type,
      color: e.color ? { r: e.color.r, g: e.color.g, b: e.color.b, a: e.color.a == null ? 1 : e.color.a } : null,
      offset: e.offset ? { x: e.offset.x, y: e.offset.y } : null,
      radius: e.radius,
      spread: e.spread == null ? 0 : e.spread,
      visible: e.visible,
      blendMode: e.blendMode,
    }));
  }

  textStyles = [];
  for (const s of await figma.getLocalTextStylesAsync()) {
    const lh = s.lineHeight;
    const ls = s.letterSpacing;
    const boundFontSize = s.boundVariables && s.boundVariables.fontSize;
    textStyles.push({
      name: s.name,
      fontFamily: s.fontName ? s.fontName.family : null,
      fontStyle: s.fontName ? s.fontName.style : null,
      fontSize: s.fontSize,
      lineHeightPercent: lh && lh.unit === 'PERCENT' ? lh.value : null,
      letterSpacingPercent: ls && ls.unit === 'PERCENT' ? ls.value : 0,
      fontSizeVar: boundFontSize ? (qualifiedById.get(boundFontSize.id) || null) : null,
    });
  }
  textStyles.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
}

// The "more" flag is load-bearing: a truncated pull that looked complete would report
// hundreds of phantom missing-in-figma findings. decode-pull.mjs refuses to decode it.
return { format: 'rows/1', collections: outCollections, effectStyles, textStyles, more };
`;
