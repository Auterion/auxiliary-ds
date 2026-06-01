# Settings

The account / configuration screen — grouped sections of read-and-edit fields, usage meters, and feature toggles. Mirrors the AuterionSuite settings page. A Level-2 conventional surface.

<div class="vp-raw" style="margin:1.25rem 0; border:1px solid var(--border); border-radius:0.5rem; background:var(--background); padding:1.25rem; display:flex; flex-direction:column; gap:1.5rem;">
  <section style="display:flex; flex-direction:column; gap:0.625rem;">
    <h3 style="margin:0; font-size:0.9375rem;">Account</h3>
    <div style="display:flex; gap:2rem; flex-wrap:wrap; font-size:0.875rem;">
      <div style="display:flex; align-items:center; gap:0.5rem;"><span style="color:var(--muted-foreground);">Name</span> <strong>Auterion</strong> <Button variant="ghost" size="sm" aria-label="Edit name"><Icon name="pen-to-square" /></Button></div>
      <div style="display:flex; align-items:center; gap:0.5rem;"><span style="color:var(--muted-foreground);">Notifications</span> <strong>support@auterion.com</strong> <Button variant="ghost" size="sm" aria-label="Edit email"><Icon name="pen-to-square" /></Button></div>
    </div>
  </section>
  <section style="display:flex; flex-direction:column; gap:0.625rem;">
    <h3 style="margin:0; font-size:0.9375rem;">Usage</h3>
    <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:1rem;">
      <div style="display:flex; flex-direction:column; gap:0.375rem;"><span style="font-size:0.75rem; color:var(--muted-foreground);">Seats</span><strong style="font-variant-numeric:tabular-nums;">226 <span style="color:var(--muted-foreground); font-weight:400;">/ ∞</span></strong></div>
      <div style="display:flex; flex-direction:column; gap:0.375rem;"><span style="font-size:0.75rem; color:var(--muted-foreground);">Vehicles</span><strong style="font-variant-numeric:tabular-nums;">1667 <span style="color:var(--muted-foreground); font-weight:400;">/ 10000</span></strong><Progress :value="16.7" /></div>
      <div style="display:flex; flex-direction:column; gap:0.375rem;"><span style="font-size:0.75rem; color:var(--muted-foreground);">Assets</span><strong style="font-variant-numeric:tabular-nums;">273 <span style="color:var(--muted-foreground); font-weight:400;">/ ∞</span></strong></div>
      <div style="display:flex; flex-direction:column; gap:0.375rem;"><span style="font-size:0.75rem; color:var(--muted-foreground);">Batteries</span><strong style="font-variant-numeric:tabular-nums;">77 <span style="color:var(--muted-foreground); font-weight:400;">/ ∞</span></strong></div>
    </div>
  </section>
  <section style="display:flex; flex-direction:column; gap:0.625rem;">
    <h3 style="margin:0; font-size:0.9375rem;">Account features</h3>
    <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:0.75rem;">
      <div style="border:1px solid var(--nominal); border-radius:0.5rem; padding:0.875rem; background:color-mix(in oklch, var(--nominal) 12%, transparent); display:flex; flex-direction:column; gap:0.375rem;"><div style="display:flex; align-items:center; gap:0.5rem;"><strong style="font-size:0.875rem;">App Developer Program</strong><StatusBadge level="nominal" size="sm">Active</StatusBadge></div><span style="font-size:0.8125rem; color:var(--muted-foreground);">Build apps for Auterion-powered vehicles.</span></div>
      <div style="border:1px solid var(--nominal); border-radius:0.5rem; padding:0.875rem; background:color-mix(in oklch, var(--nominal) 12%, transparent); display:flex; flex-direction:column; gap:0.375rem;"><div style="display:flex; align-items:center; gap:0.5rem;"><strong style="font-size:0.875rem;">Manufacturer</strong><StatusBadge level="nominal" size="sm">Active</StatusBadge></div><span style="font-size:0.8125rem; color:var(--muted-foreground);">Deploy your own functionality on the platform.</span></div>
    </div>
  </section>
</div>

## Composition

- **Sections** — a heading per group (Account, Usage, Features), generous spacing between. Field rows pair a muted label with the value and an inline edit affordance (the `EditableField` / `CopyField` primitives the §6.1 backlog tracks would replace the hand-rolled pencil buttons).
- **Usage meters** — a label, an `X / max` (or `X / ∞`) tabular figure, and a `Progress` bar only when there's a real ceiling. (`UsageMeter` is backlogged to formalize this.)
- **Feature cards** — a `nominal`-tinted card + `StatusBadge` for an active entitlement; color is backed by the badge text, never alone.
