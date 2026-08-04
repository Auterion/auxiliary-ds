# Marketing blocks

The expressive-register blocks for auterion.com and brand surfaces. They are *not* generic SaaS marketing components — they carry the **operational design language**: Geist Mono as the type vehicle, instrument-readout framing, the precision of a flight-data display rather than the warmth of a consumer app. Roomy (expressive register, the default), but never decorative for its own sake.

## Hero

A statement, not a slogan — mono, tight, declarative. One sentence on who Auterion is, a supporting line, two actions.

<div class="auxiliary-demo vp-raw" style="flex-direction:column; align-items:flex-start; gap:1rem; padding:2.5rem;">
  <span style="font-family:var(--font-mono); font-size:0.75rem; letter-spacing:0.18em; text-transform:uppercase; color:var(--muted-foreground);">Auterion — operational truth, expressed with precision</span>
  <h2 style="font-family:var(--font-mono); font-size:2.25rem; font-weight:600; line-height:1.05; letter-spacing:-0.01em; margin:0; max-width:24ch;">Software for autonomous systems that work in the field.</h2>
  <p style="margin:0; color:var(--muted-foreground); max-width:52ch;">One platform — flight control, mission planning, fleet management — across every vehicle, from a single drone to a fleet of thousands.</p>
  <div style="display:flex; gap:0.75rem; padding-top:0.5rem;"><Button variant="primary">Request a demo</Button><Button variant="secondary">Read the docs</Button></div>
</div>

## Stat bar (`MarketingStatBar`)

Proof points as **instrument readouts**, not a card grid — a row of bracketed, mono figures that read like a status strip.

<div class="auxiliary-demo vp-raw" style="gap:0; flex-wrap:wrap; font-family:var(--font-mono);">
  <div style="display:flex; flex-direction:column; gap:0.25rem; padding:0.5rem 1.25rem; border-left:2px solid var(--primary);"><strong style="font-size:1.75rem; line-height:1; font-variant-numeric:tabular-nums;">847</strong><span style="font-size:0.6875rem; letter-spacing:0.12em; text-transform:uppercase; color:var(--muted-foreground);">Active deployments</span></div>
  <div style="display:flex; flex-direction:column; gap:0.25rem; padding:0.5rem 1.25rem; border-left:2px solid var(--primary);"><strong style="font-size:1.75rem; line-height:1; font-variant-numeric:tabular-nums;">99.7%</strong><span style="font-size:0.6875rem; letter-spacing:0.12em; text-transform:uppercase; color:var(--muted-foreground);">Uptime</span></div>
  <div style="display:flex; flex-direction:column; gap:0.25rem; padding:0.5rem 1.25rem; border-left:2px solid var(--primary);"><strong style="font-size:1.75rem; line-height:1; font-variant-numeric:tabular-nums;">1.2M</strong><span style="font-size:0.6875rem; letter-spacing:0.12em; text-transform:uppercase; color:var(--muted-foreground);">Flight hours</span></div>
  <div style="display:flex; flex-direction:column; gap:0.25rem; padding:0.5rem 1.25rem; border-left:2px solid var(--primary);"><strong style="font-size:1.75rem; line-height:1; font-variant-numeric:tabular-nums;">60+</strong><span style="font-size:0.6875rem; letter-spacing:0.12em; text-transform:uppercase; color:var(--muted-foreground);">Countries</span></div>
</div>

## Pillars (`MarketingPillars`)

Platform pillars rendered with the grammar of an **operations-dashboard widget** — a mono index, a heading, a line. Bordered like panels, not soft cards.

<div class="auxiliary-demo vp-raw" style="gap:0.75rem; align-items:stretch;">
  <div style="flex:1; min-width:12rem; border:1px solid var(--border); border-radius:0.375rem; padding:1rem; display:flex; flex-direction:column; gap:0.5rem;"><span style="font-family:var(--font-mono); font-size:0.6875rem; color:var(--muted-foreground);">01 / FLY</span><strong>Flight control</strong><span style="font-size:0.875rem; color:var(--muted-foreground);">PX4-based autopilot, hardware-agnostic, field-proven.</span></div>
  <div style="flex:1; min-width:12rem; border:1px solid var(--border); border-radius:0.375rem; padding:1rem; display:flex; flex-direction:column; gap:0.5rem;"><span style="font-family:var(--font-mono); font-size:0.6875rem; color:var(--muted-foreground);">02 / PLAN</span><strong>Mission planning</strong><span style="font-size:0.875rem; color:var(--muted-foreground);">Survey, corridor, and multi-vehicle missions from one console.</span></div>
  <div style="flex:1; min-width:12rem; border:1px solid var(--border); border-radius:0.375rem; padding:1rem; display:flex; flex-direction:column; gap:0.5rem;"><span style="font-family:var(--font-mono); font-size:0.6875rem; color:var(--muted-foreground);">03 / SCALE</span><strong>Fleet management</strong><span style="font-size:0.875rem; color:var(--muted-foreground);">Monitor, update, and operate thousands of vehicles.</span></div>
</div>

## Value grid (`MarketingValueGrid`)

Capabilities as a **structured matrix** — a precise table of what the platform does, not an icon grid with marketing copy.

<div class="auxiliary-demo vp-raw" style="padding:0;">
  <div style="width:100%; display:grid; grid-template-columns:repeat(2, 1fr); border:1px solid var(--border); border-radius:0.375rem; overflow:hidden;">
    <div style="padding:0.875rem 1rem; border-bottom:1px solid var(--border); border-right:1px solid var(--border); display:flex; gap:0.625rem; align-items:flex-start;"><Icon name="circle-check" /><div><strong style="font-size:0.875rem;">Hardware-agnostic</strong><div style="font-size:0.8125rem; color:var(--muted-foreground);">Skynode, or your own compute.</div></div></div>
    <div style="padding:0.875rem 1rem; border-bottom:1px solid var(--border); display:flex; gap:0.625rem; align-items:flex-start;"><Icon name="circle-check" /><div><strong style="font-size:0.875rem;">Air-gapped operation</strong><div style="font-size:0.8125rem; color:var(--muted-foreground);">Full functionality, fully offline.</div></div></div>
    <div style="padding:0.875rem 1rem; border-right:1px solid var(--border); display:flex; gap:0.625rem; align-items:flex-start;"><Icon name="circle-check" /><div><strong style="font-size:0.875rem;">Open SDK</strong><div style="font-size:0.8125rem; color:var(--muted-foreground);">Build and deploy your own apps.</div></div></div>
    <div style="padding:0.875rem 1rem; display:flex; gap:0.625rem; align-items:flex-start;"><Icon name="circle-check" /><div><strong style="font-size:0.875rem;">Defense-grade</strong><div style="font-size:0.8125rem; color:var(--muted-foreground);">508 / WCAG 2.2 AA, MIL-STD-1472 posture.</div></div></div>
  </div>
</div>

## Quote (`MarketingQuote`)

A customer quote rendered as a **mission log** — attribution as a callsign or role, not a name-and-title card.

<div class="auxiliary-demo vp-raw" style="flex-direction:column; align-items:flex-start; gap:0.875rem; padding:2rem;">
  <blockquote style="margin:0; font-size:1.25rem; line-height:1.4; max-width:48ch;">"We went from three disconnected tools to one. The fleet view is the first thing the team opens and the last thing they close."</blockquote>
  <div style="font-family:var(--font-mono); font-size:0.75rem; letter-spacing:0.08em; color:var(--muted-foreground);">— OPS LEAD · PUBLIC-SAFETY UAS PROGRAM</div>
</div>

## CTA band

The closing action — direct, mono-framed, no hedging.

<div class="auxiliary-demo vp-raw" style="flex-direction:column; align-items:center; text-align:center; gap:0.875rem; padding:2.5rem;">
  <h3 style="font-family:var(--font-mono); font-size:1.5rem; margin:0;">Put it in the air.</h3>
  <p style="margin:0; color:var(--muted-foreground); max-width:40ch;">Talk to our team about your fleet, or start in the docs.</p>
  <div style="display:flex; gap:0.75rem;"><Button variant="primary">Request a demo</Button><Button variant="ghost">Contact sales</Button></div>
</div>

## Notes

- **Expressive ≠ decorative.** These breathe (generous spacing, the brand voice) but hold the operational grammar — mono type, instrument framing, no stock photography or soft gradients. See [Registers](/foundations/registers) and [Visual language](/foundations/visual-language).
- **One voice.** Mono for statements/stats/attribution; the body face for prose. Don't mix in a humanist sans (guidance: "instrument panel, not consumer app").
- **Motion earns its place here** (unlike operational surfaces) — a hero animation that communicates scale is welcome; parallax-for-its-own-sake is not. See [Motion](/foundations/motion).
- These are docs-first compositions; the named blocks (`MarketingStatBar`, `MarketingQuote`, `MarketingValueGrid`, `MarketingPillars`) are extraction candidates if the marketing site consumes them repeatedly.
