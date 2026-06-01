# Error / 404

The dead-end screen — a page that can't be shown (404, 500, no access). State plainly what happened and offer the way back; never a blank page or a raw stack trace.

<div class="vp-raw" style="margin:1.25rem 0; border:1px solid var(--border); border-radius:0.5rem; background:var(--background); padding:3rem 1rem; display:flex; flex-direction:column; align-items:center; text-align:center; gap:0.75rem;">
  <div style="display:flex; align-items:center; justify-content:center; width:3.5rem; height:3.5rem; border-radius:9999px; background:var(--muted); color:var(--muted-foreground);"><Icon name="circle-question" /></div>
  <strong style="font-size:2rem; font-variant-numeric:tabular-nums;">404</strong>
  <div style="font-weight:600;">Page not found</div>
  <p style="margin:0; max-width:24rem; font-size:0.875rem; color:var(--muted-foreground);">The page you're looking for doesn't exist or was moved. Check the URL, or head back to the dashboard.</p>
  <div style="display:flex; gap:0.5rem;"><Button variant="ghost" size="sm">Go back</Button><Button variant="primary" size="sm">Dashboard</Button></div>
</div>

## Composition

- The same shape as an [empty state](/patterns/app-blocks): icon → code/heading → one sentence → the way out. The difference is intent — empty means "nothing yet," error means "something went wrong."
- **Match severity to the cause.** A 404 is calm (`circle-question`). A 500 or a permissions error warrants a `caution`/`warning` cue and a support path. A *connectivity* failure on an operational surface is not a 404 — it's the [degraded state](/templates/gcs), which keeps the last-known data.
- Never expose a raw stack trace to an operator; log it, show a recovery action.
