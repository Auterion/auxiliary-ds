import { expect } from 'vitest';
import * as matchers from 'vitest-axe/matchers';
// Brings the global `Vi.Assertion` augmentation for `toHaveNoViolations` into scope.
// (The runtime side of this entry is an empty shim; matchers are registered below.)
import 'vitest-axe/extend-expect';

expect.extend(matchers);
