---
'@auxiliary/tokens': minor
'@auxiliary/css': patch
---

The type scale is now fully token-derived — theme.css no longer overrides it:

- Fluid display sizes (3xl–10xl) are encoded in the tokens via
  `$extensions["com.auterion.auxiliary"].fluid.min`; `$value` stays the
  desktop maximum so JS/DTCG/Figma exports keep concrete sizes, and the CSS
  build emits the same `clamp()` literals theme.css used to hand-author
  (byte-for-byte verified).
- New `text-leading/*` and `text-tracking/*` token groups carry the per-size
  line-height/letter-spacing pairs, emitted as Tailwind's
  `--text-<step>--line-height` / `--letter-spacing` suffix vars (CSS only;
  Figma Text Styles already carry them).
- New `text.2xs` (10px) step replaces the `text-[10px]` / `text-[0.625rem]`
  arbitrary values in the badge, status-badge, and coordinate-value recipes.
- `type.product.display` now aliases `{text.3xl}` instead of an off-scale raw
  32px — the Figma text style moves 32 → 30px and gains a variable binding.
- `cn()` registers the custom `2xs`/`10xl` font-size steps with
  tailwind-merge, which otherwise misclassifies them as text colors and drops
  them on merge (this also fixes a latent `text-10xl` bug).
