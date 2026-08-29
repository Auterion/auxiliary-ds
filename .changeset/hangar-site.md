---
'@auxiliary/demo': minor
---

demo(hangar): auterion.com in a monochrome grid grammar

A second marketing surface, built as an experiment against the layout language
of `armory.framer.ai` — four-column rule field, prose in the middle half of the
viewport, bands alternating between near-black and near-white, one display cut
carrying the whole hierarchy, and mono reserved for facts. Six pages: home,
product, solutions, company, careers, news.

It sits **beside** the existing `auterion.com` demo rather than replacing it.
That one is an editorial press sheet in the Deck 07b grammar; this one is an
agency sheet. Two grammars over the same content is the point of having both.

**Two decisions that are the opposite of the reference**

- **No photography.** Every image slot is a generated monochrome plate —
  halftone, contour, scan, orbit, swarm — drawn from the band's own aliases with
  a seeded PRNG, so a plate renders identically every time. Stock is the one
  asset a design system cannot supply and the one a defence company should not
  fake, and a page full of borrowed landscapes would have said nothing about
  Auterion.
- **No product hue.** The sheet spends zero chroma. It takes the achromatic
  `mono` neutral rather than `ink`, which carries a deliberate blue cast for
  product UI. Auterion blue appears nowhere — which is what would make a status
  colour unmissable if one ever landed on this surface.

**The grammar**, stated once in `_hangar.css` and never restated in a page:

- `Band` sets the exposure; every `--hg-*` alias re-resolves from it, so no page
  names a colour.
- The middle-half column is placed by **grid**, not margin — every type rule in
  the file sets `margin: 0`, and a `margin-inline-start` would be silently
  beaten by whichever came later in the stylesheet.
- A **bridge** maps `--foreground` / `--background` / `--border` onto the
  exposure, so a DS component dropped into a band inherits it. Found the hard
  way: a `@auxiliary/viz` Gauge painted its readout in the page theme's ink and
  vanished on the ink band.
- A **plate is always an ink object**, whichever band it sits in — the way a
  photograph on a white page is still a photograph.

**Content** comes from one table (`content.ts`), so no page can drift from its
own data. Partner names match the ones the existing `web/` demo already uses, so
the two surfaces cannot disagree about who the company works with.

The one scroll-linked effect is the statement reveal, which lights words as they
pass a reading line. It listens through the **capture** phase because the sheet
scrolls inside its own element and scroll events do not bubble — without that it
silently does nothing, which is the worst kind of broken: it looks deliberate.
Under `prefers-reduced-motion` every word is simply lit.

Carries the fixes from the interface review rather than repeating them: labelled
icon-only controls, a focus ring on every control, `touch-action: manipulation`
and an intentional tap highlight, a labelled newsletter field, empty states on
both filtered lists, and `translate="no"` on brand names.
