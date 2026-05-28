import { twMerge } from 'tailwind-merge';

/**
 * A class value, in the shape clsx accepts: strings, falsy values (dropped),
 * arrays (recursed), or objects whose keys are emitted when the value is truthy.
 */
export type ClassValue =
  | string
  | number
  | bigint
  | null
  | boolean
  | undefined
  | ClassValue[]
  | Record<string, unknown>;

function toClassString(value: ClassValue): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number' || typeof value === 'bigint') return String(value);
  if (Array.isArray(value)) {
    let out = '';
    for (const item of value) {
      const str = toClassString(item);
      if (str) out += (out && ' ') + str;
    }
    return out;
  }
  if (typeof value === 'object') {
    // Plain object: emit keys with truthy values (clsx-style).
    let out = '';
    for (const key in value) {
      if (value[key]) out += (out && ' ') + key;
    }
    return out;
  }
  return '';
}

/**
 * Merge class values and resolve conflicting Tailwind utilities with the last
 * one winning. The framework-agnostic primitive behind every component's
 * `class` passthrough: `cn(recipe({ ... }), props.class)`.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(toClassString(inputs));
}
