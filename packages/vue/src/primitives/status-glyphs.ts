/**
 * Shared operational-status visual language for StatusBadge and AlertBanner.
 *
 * Five distinct outlines so each level is legible in grayscale (color-blind safe)
 * regardless of fill color — severity shapes, increasing urgency:
 * alarm=octagon, warning=triangle, caution=diamond, advisory=circle-i,
 * nominal=circle-check. (Exclamation dots are zero-length round-capped segments.)
 *
 * Kept in one place so the two components never drift apart.
 */
export type StatusLevel = 'alarm' | 'warning' | 'caution' | 'advisory' | 'nominal';

export const STATUS_GLYPHS: Record<StatusLevel, string> = {
  alarm: 'M8 2 H16 L22 8 V16 L16 22 H8 L2 16 V8 Z M12 7 V13 M12 16.5 L12 16.5',
  warning: 'M12 2 L22 20 H2 Z M12 9 V14 M12 17 L12 17',
  caution: 'M12 2 L22 12 L12 22 L2 12 Z M12 8 V13 M12 16 L12 16',
  advisory: 'M12 2 A10 10 0 1 0 12 22 A10 10 0 1 0 12 2 M12 8 L12 8 M12 11 V17',
  nominal: 'M12 2 A10 10 0 1 0 12 22 A10 10 0 1 0 12 2 M7.5 12 L11 15.5 L16.5 9',
};

/** Human-readable level for the always-rendered visually-hidden label (AT cue). */
export const STATUS_LABELS: Record<StatusLevel, string> = {
  alarm: 'Alarm',
  warning: 'Warning',
  caution: 'Caution',
  advisory: 'Advisory',
  nominal: 'Nominal',
};

/**
 * Severity rank for prioritization — lower is more urgent (alarm 0 … nominal 4).
 * The single ordering the alert model sorts by, kept here so it never drifts
 * from the ladder the glyphs/labels encode.
 */
export const STATUS_RANK: Record<StatusLevel, number> = {
  alarm: 0,
  warning: 1,
  caution: 2,
  advisory: 3,
  nominal: 4,
};
