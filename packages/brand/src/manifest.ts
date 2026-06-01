/**
 * Typed access to the brand manifest — the machine-readable source of truth for
 * which mark to use on which surface. Data is generated from `brand.manifest.json`
 * into `registry.generated.ts`; this module adds types + resolution helpers so an
 * agent or the `<Logo>` component can pick the correct asset for a given
 * surface/theme without hard-coding paths.
 */
import { MANIFEST as RAW, ART } from './registry.generated';

export type Tone = 'color' | 'mono' | 'inverse';
export type Kind = 'mark' | 'wordmark' | 'lockup-horizontal' | 'lockup-stacked';
export type Theme = 'light' | 'dark' | 'sunlight' | 'darknight';
export type LogoType = 'org' | 'product';

export interface LogoEntry {
  id: string;
  name: string;
  type: LogoType;
  /** For products: the org this rolls up to. */
  parent?: string;
  /** Canonical co-lockup wording, e.g. "Auterion Mission Control". */
  coLockup?: string;
  /** Free-text note on the surface context this logo lives in. */
  context?: string;
  /** Smallest legible render, in px, per kind (height for lockups, edge for marks). */
  minSize: Record<Kind, number>;
  /** Clearspace as a multiple of the mark's cap-unit. */
  clearspace: number;
  /** Themes this logo is cleared for. */
  themes: Theme[];
  /** Things you must not do with this asset. */
  forbidden: string[];
  /** Per kind, per tone: either "pending" or a path relative to assets/. */
  variants: Record<Kind, Partial<Record<Tone, string>>>;
}

export interface BrandManifest {
  version: number;
  tones: Tone[];
  kinds: Kind[];
  toneByTheme: Record<Theme, Tone>;
  logos: LogoEntry[];
  appIcons: {
    targets: string[];
    outputs: Array<Record<string, unknown>>;
    note?: string;
  };
}

export const manifest = RAW as unknown as BrandManifest;

/** All logo entries (org + products). */
export const logos: LogoEntry[] = manifest.logos;

/** Look up a logo entry by id. */
export function getLogo(id: string): LogoEntry | undefined {
  return manifest.logos.find((l) => l.id === id);
}

/** The tone to use on a given theme (light/sunlight → color, dark/darknight → inverse). */
export function toneForTheme(theme: Theme): Tone {
  return manifest.toneByTheme[theme] ?? 'color';
}

export interface ResolvedLogo {
  entry: LogoEntry;
  kind: Kind;
  tone: Tone;
  status: 'available' | 'pending';
  /** Inlined SVG markup, present only when status === 'available'. */
  svg?: string;
  /** Smallest legible size (px) for this kind. */
  minSize: number;
}

/**
 * Resolve the concrete asset for a request. Falls back tone color → mono when the
 * requested tone is missing but another exists; reports `pending` when no art is
 * available yet, so callers can render a placeholder rather than break.
 */
export function resolveLogo(req: {
  id: string;
  kind?: Kind;
  tone?: Tone;
  theme?: Theme;
}): ResolvedLogo | undefined {
  const entry = getLogo(req.id);
  if (!entry) return undefined;

  const kind: Kind = req.kind ?? 'lockup-horizontal';
  const tone: Tone = req.tone ?? (req.theme ? toneForTheme(req.theme) : 'color');

  const tryTones: Tone[] = [tone, 'color', 'mono', 'inverse'];
  for (const t of tryTones) {
    const svg = ART[`${entry.id}:${kind}:${t}`];
    if (svg) {
      return { entry, kind, tone: t, status: 'available', svg, minSize: entry.minSize[kind] };
    }
  }
  return { entry, kind, tone, status: 'pending', minSize: entry.minSize[kind] };
}
