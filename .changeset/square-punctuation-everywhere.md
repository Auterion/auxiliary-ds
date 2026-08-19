---
'@auxiliary/tokens': minor
'@auxiliary/css': minor
---

The house OpenType set is now **exactly square punctuation** — `ss07` (square
punctuation) + `ss08` (square quotes), plus `calt`/`liga` — and nothing else.
`font/display` drops the `Inter Display` family for Inter Variable's optical-size axis.

**Only punctuation is squared; letterforms are left alone.** `ss01` (open digits) and
the `cv02/03/04/06/09/12/13` letterform alternates are gone from every rule. They
reshaped glyphs rather than punctuation, so they were doing something other than what
the set is for. Inter's default letterforms are now the house letterforms.

**Fixed: `ss03` was fighting `ss08`.** Inter's `ss03` is *"Round quotes & commas"* — the
direct opposite of `ss08` *"Square quotes"* — but it was enabled in all four house
feature strings behind a comment that misnamed it "straight/square quotes". Both were on
at once, so quote and comma shape was decided by the font's internal lookup order rather
than by us. **Quotes and commas visibly change across every surface** — this is the fix
that makes square punctuation true rather than merely intended.

The one exception is `[data-register="operational"]`, which keeps `cv05` (tailed l),
`cv08` (serif I), `cv11` (single-storey a) and `zero` (slashed zero) on top of the house
set. These are the only glyph alternates left anywhere in the system, and they are a
legibility guarantee for instrument surfaces — `I`/`l`/`1` must read as three shapes in
call-signs, and every `0` in telemetry must be slashed — not a style choice.

**`font/display` is now the same stack as `font/sans`** (`Inter Variable` first). The
standalone `Inter Display` binary does not ship `ss07`/`ss08`, so keeping it as the
marketing face meant exempting every headline from the house punctuation. Inter v4 folded
the Display drawings into the variable font as the `opsz` axis, and **`opsz 32` IS the
static Display design** — `.font-display` still pins it, so the display voice is unchanged.

Nothing is lost on the web, and nothing was ever gained: only `InterVariable.woff2` is
vendored (`packages/css/fonts/files/`), so `Inter Display` had no binary to resolve to and
was *already* falling through to Inter Variable. The token now describes what actually
renders. Verified against the shipped file: axes `opsz 14–32` + `wght 100–900`, with
`ss07`/`ss08` present.

Figma text styles target `Inter Variable` too. Figma has no automatic optical sizing and
its Plugin API exposes no setter for variable-font axes or OpenType features, so `opsz 32`
and `ss07`/`ss08` must be enabled by hand in the Type details panel there. The web output
is correct regardless.
