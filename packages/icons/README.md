# @auxiliary/icons

Auxiliary's icon contract — a typed `<Icon name="..." size="..." />` Vue component wrapping **Font Awesome Pro Sharp** plus Auterion's custom kit of operational / drone-specific glyphs.

## Why a wrapper, not a direct import

The wrapper owns the icon contract. Consumers depend on `<Icon name="...">` with a TS-typed `name` union. The underlying set (Font Awesome → Lucide → custom) can swap behind the contract without breaking a single consumer.

## Status

Scaffold only. Step 5 of the build plan lands the `<Icon>` component, the generated `name` union, and the `sync.mjs` script that regenerates the registry from FA Pro Sharp + the Auterion custom kit.

Heroicons is intentionally **not** a dependency. The README direction to import `@heroicons/vue` is superseded by this contract.
