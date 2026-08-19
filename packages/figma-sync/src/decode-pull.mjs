/**
 * Expand the pull program's compact wire format back into the `figma-native.json` shape
 * the comparator works in.
 *
 * The pull returns one tab-separated row per variable with values positional by mode,
 * because returning one object per variable truncated at 20kb partway through a
 * 368-variable collection. This is the other half of that encoding — pure, so it is
 * unit-tested rather than trusted.
 *
 * See src/pull-logic.mjs for the encoder.
 */

/** Reverse of the encoder's cell escaping. Order matters: backslash last. */
function decodeCell(s) {
  let out = '';
  for (let i = 0; i < s.length; i++) {
    if (s[i] === '\\' && i + 1 < s.length) {
      const next = s[i + 1];
      if (next === 't') { out += '\t'; i++; continue; }
      if (next === 'n') { out += '\n'; i++; continue; }
      if (next === '\\') { out += '\\'; i++; continue; }
    }
    out += s[i];
  }
  return out;
}

/**
 * A FLOAT arrives as the string "4"; the contract holds the number 4. Coerce by the
 * variable's declared type rather than by guessing from the text — "0080" is a plausible
 * STRING value and must not become 80, and an empty string is a real absence.
 */
function coerce(type, text) {
  if (type === 'FLOAT') return Number(text);
  if (type === 'BOOLEAN') return text === 'true';
  return text; // COLOR (hex) and STRING pass through
}

/**
 * @param {object} raw the object returned by dist/pull.figma.js
 * @returns {{collections: Array, effectStyles: object|null, textStyles: Array|null}}
 */
export function decodePull(raw) {
  if (!raw || typeof raw !== 'object') throw new Error('decodePull: not an object');
  if (raw.format !== 'rows/1') {
    throw new Error(
      'decodePull: unknown wire format ' + JSON.stringify(raw.format ?? null) +
        ' — rebuild figma-sync and re-run the pull so both halves match.',
    );
  }
  // Refusing here is the point. A partial pull silently diffed would report every
  // unreturned variable as missing-in-figma — a page of confident, wrong findings.
  if (raw.more) {
    throw new Error(
      'decodePull: the pull was truncated (more: true). Re-run it with OFFSET/LIMIT ' +
        'and merge the pages before diffing — a partial pull reports phantom drift.',
    );
  }

  const collections = (raw.collections ?? []).map((c) => {
    const modes = c.modes ?? [];
    const variables = (c.rows ?? []).map((row) => {
      const cells = row.split('\t');
      const name = decodeCell(cells[0] ?? '');
      const type = cells[1] ?? '';
      const valuesByMode = {};
      modes.forEach((mode, i) => {
        const text = cells[2 + i];
        if (text === undefined || text === '') return; // mode genuinely unset
        const decoded = decodeCell(text);
        valuesByMode[mode] = decoded.startsWith('@')
          ? { alias: decoded.slice(1) }
          : coerce(type, decoded);
      });
      return { name, type, valuesByMode };
    });
    if (c.total != null && variables.length !== c.total) {
      throw new Error(
        'decodePull: collection ' + c.name + ' returned ' + variables.length +
          ' of ' + c.total + ' variables — the pull was partial.',
      );
    }
    return { name: c.name, modes, variables };
  });

  return {
    collections,
    effectStyles: raw.effectStyles ?? null,
    textStyles: raw.textStyles ?? null,
  };
}

/**
 * Rename collections on the Figma side to the names the contract uses.
 *
 * The exporter now emits Global / Theme / Component, matching both the GTC tiers and the
 * auxiliary-ds file, so the primary target needs no mapping. This stays because the
 * mismatch it solves is generic: a file whose collections were renamed by hand reports
 * as N missing collections plus every variable "new in Figma" — correct, and useless.
 * One rename on the read side turns that back into a real diff.
 *
 * This renames only the collection, never a variable path, and only on the READ side —
 * it changes what we compare against, never the file.
 *
 * @param {object} doc     decoded pull output
 * @param {object} mapping { "<figma name>": "<contract name>" }
 */
export function mapCollectionNames(doc, mapping) {
  if (!mapping || Object.keys(mapping).length === 0) return doc;
  const renameAlias = (target) => {
    const slash = target.indexOf('/');
    if (slash === -1) return target;
    const coll = target.slice(0, slash);
    return (mapping[coll] ?? coll) + target.slice(slash);
  };
  return {
    ...doc,
    collections: doc.collections.map((c) => ({
      ...c,
      name: mapping[c.name] ?? c.name,
      // Alias targets are qualified with the collection name too, so they must move with it.
      variables: c.variables.map((v) => ({
        ...v,
        valuesByMode: Object.fromEntries(
          Object.entries(v.valuesByMode).map(([mode, val]) => [
            mode,
            val && typeof val === 'object' && 'alias' in val ? { alias: renameAlias(val.alias) } : val,
          ]),
        ),
      })),
    })),
  };
}
