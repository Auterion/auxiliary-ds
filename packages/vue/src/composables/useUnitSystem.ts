import { inject, provide, computed, type InjectionKey, type ComputedRef } from 'vue';
import type { UnitSystem } from '@auxiliary/css/format';

/**
 * Deployment-wide unit-system + locale context. The lexicon requires the unit
 * system to be consistent *per deployment, never mixed in one view* — so it is
 * set once (via `<UnitSystemProvider>`) and read by `TelemetryValue` and
 * friends, rather than threaded through every readout.
 */
export interface UnitSystemContext {
  system: ComputedRef<UnitSystem>;
  locale: ComputedRef<string | undefined>;
}

const UNIT_SYSTEM_KEY: InjectionKey<UnitSystemContext> = Symbol('auxiliary-unit-system');

/** Provide a unit-system context to descendants. Used by `<UnitSystemProvider>`. */
export function provideUnitSystem(context: UnitSystemContext): void {
  provide(UNIT_SYSTEM_KEY, context);
}

/**
 * Read the unit-system context. Falls back to `metric` with no locale when no
 * provider is present, so consumers behave identically to today out of the box.
 */
export function useUnitSystem(): UnitSystemContext {
  return inject(UNIT_SYSTEM_KEY, {
    system: computed<UnitSystem>(() => 'metric'),
    locale: computed<string | undefined>(() => undefined),
  });
}
