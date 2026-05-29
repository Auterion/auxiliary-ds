export interface ComponentEntry {
  name: string;
  path: string;
}
export interface ExportTarget {
  types: string;
  import: string;
}

export function parseComponents(indexSrc: string): ComponentEntry[];
export function buildExports(components: ComponentEntry[]): Record<string, ExportTarget>;
