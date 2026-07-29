/** Type surface for gtc-validate.mjs (authored as plain ESM so build.mjs can import it directly). */

export interface GtcToken {
  /** Dotted path, e.g. `theme.light.card-foreground`. */
  path: string;
  /** Path split into GTC levels. */
  seg: string[];
  /** Inferred GTC group. Handles both the GTC and pre-GTC source layouts. */
  group: 'global' | 'theme' | 'component' | 'register';
  type: string | undefined;
  raw: unknown;
  /** Every `{ref}` inside the raw value, braces stripped. */
  refs: string[];
}

export interface GtcFinding {
  rule: string;
  path: string;
  message: string;
}

export interface ValidateOptions {
  /** Enforce the group-first rules. Off for the pre-GTC layout, which has no group prefixes. */
  gtcLayout?: boolean;
  /** Kebab-cased names of shipped components; when supplied, component Elements are checked. */
  componentNames?: Set<string> | null;
}

export declare const THEMES: string[];
export declare const REGISTERS: string[];
export declare const SIZE_VOCABULARIES: string[][];

export declare function loadSource(root?: string): { tree: Record<string, unknown>; files: string[] };
export declare function collectTokens(tree: Record<string, unknown>): GtcToken[];
export declare function groupOfSegments(seg: string[]): GtcToken['group'];
export declare function isGtcLayout(tree: Record<string, unknown>): boolean;
export declare function shippedComponentNames(repoRoot?: string): Set<string>;
export declare function validateGtc(tokens: GtcToken[], opts?: ValidateOptions): GtcFinding[];
/** Throws a formatted Error when any rule fails. */
export declare function assertGtc(root?: string): void;
