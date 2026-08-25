# Complex-UI pattern checklist (from Vitaly Friedman, "Designing For Complex UIs", Maven Jan 2026)

Distilled from the workshop reference doc (`https://smashed.by/maven26`) into an actionable, scoped
checklist. The source doc is an exhaustive link library across all of enterprise UX; this filters it to
**the patterns and systems that touch Auxiliary's surfaces and components**, maps each to what we own, and
keeps only the strongest 1–2 links per topic. Behavior/interaction grounding — the companion to
`visual-research-moodboard.md` (which is the *look*). Feeds the Phase 7.2 audit.

**How to use:** each `[ ]` is a thing to look at and a decision to make for a named component/surface.
Check it off when we've reviewed the refs and recorded a decision (in the audit or a recipe note).
Priority tags: **P0** = directly maps to a shipped/planned component; **P1** = maps to a surface/template;
**P2** = useful background, revisit later; **skip** = out of scope for us.

---

## P0 — Data tables (→ fleet/telemetry tables, `StatusBadge` rows, dense grids)

The deepest match to our problem space. This is where "calm dense" is won or lost.

- [ ] **Row density & rhythm** — sizing, zebra-vs-hairline, sticky header/columns. Maps to: fleet-overview
      table, telemetry/event-stream tables. Ref: [Enterprise data tables (pencilandpaper)](https://pencilandpaper.io/articles/user-experience/ux-pattern-analysis-enterprise-data-tables/).
- [ ] **Column architecture** — pinned key columns, numeric right-align, tabular figures, units handling.
      Maps to: `@auxiliary/css/format` (lat/long, MGRS, units) bound into table cells. Ref: [How to architect a complex table (Smashing)](https://www.smashingmagazine.com/2019/02/complex-web-tables/).
- [ ] **Data-grid component scope** — what a grown-up grid actually needs (selection, bulk actions,
      resize, inline edit). Maps to: decide how far our table primitive goes vs. restraint principle #3.
      Ref: [AG Grid Design System (Figma)](https://www.figma.com/community/file/1360600846643230092/ag-grid-design-system), [GE Ethos Data Grid](https://www.ethosdesignsystem.com/components/data-grid).
- [ ] **Industrial-density lineage** — the grown-up-instrument-at-data-density reference (backs moodboard
      fork #1). Maps to: dark operational tables. Ref: Goldman Sachs DS ([archived](https://web.archive.org/web/20231130204801/https://design.gs.com/home)), Cisco Momentum, Salesforce Lightning.
- [ ] **Mobile/responsive collapse** — how a dense table degrades on narrow viewports. Maps to: do we
      even support this, or are operational tables desktop-only? Ref: [Designing a complex table for mobile](https://uxdesign.cc/designing-a-complex-table-for-mobile-consumption-nom-7472f7b11fe6).

## P0 — Filters & sorting (→ fleet table filtering, list/grid controls)

- [ ] **Filter patterns** — inline vs. panel vs. drawer; applied-filter chips; "broken/frozen filters"
      anti-patterns. Maps to: fleet-overview filtering. Ref: [Enterprise filtering (pencilandpaper)](https://pencilandpaper.io/articles/user-experience/ux-pattern-analysis-enterprise-filtering/), [Frustrating filters (Smashing)](https://www.smashingmagazine.com/2021/07/frustrating-design-patterns-broken-frozen-filters/).
- [ ] **Sorting affordances** — multi-sort, sort indicators, category-specific sort. Maps to: table header
      controls. Ref: [Filter & Sort patterns (Goldman Sachs)](https://design.gs.com/patterns/filter-and-sort), [Faceted sorting (Baymard)](https://baymard.com/blog/faceted-sorting).

## P0 — Forms (→ `templates/settings`, `Input`/`Label`/`Select`/`Checkbox`/`Switch`)

Sharpens the GitHub helper-text-under-label call already in the moodboard.

- [ ] **Field anatomy** — label/helper/error placement, single-column default, button placement. Maps to:
      `Input`+`Label` (we just shipped accessible-name label props on Checkbox/Switch). Ref: [Co-Op Form Design System](https://www.coop.co.uk/experience-library/forms/form-design.html), [Where to put buttons on forms](https://adamsilver.io/blog/where-to-put-buttons-on-forms/), [Avoid multi-column forms (Baymard)](https://baymard.com/blog/avoid-multi-column-forms).
- [ ] **Component decision trees** — radio vs. checkbox vs. select vs. segmented; conditional reveal.
      Maps to: `Select`, future segmented control. Ref: [Decision trees for UI components (Smashing)](https://www.smashingmagazine.com/2024/05/decision-trees-ui-components/), [Conditional reveal (Gov.UK)](https://design-system.service.gov.uk/components/radios/#conditionally-revealing-content).
- [ ] **Disabled & tooltip anti-patterns** — why disabled buttons hurt; tooltip alternatives. Maps to:
      `Button` disabled states, `GuardedAction` messaging. Ref: [Disabled buttons (Smashing)](https://www.smashingmagazine.com/2021/08/frustrating-design-patterns-disabled-buttons/), [Problem with tooltips](https://adamsilver.io/blog/the-problem-with-tooltips-and-what-to-do-instead/).

## P0 — Destructive actions, undo, confirm (→ `GuardedAction`, dialogs, toasts)

We already ship `GuardedAction` — this is the canon to validate it against.

- [ ] **Confirm vs. undo** — when to gate vs. when to allow-and-undo; make destructive buttons harder to
      hit. Maps to: `GuardedAction` philosophy. Ref: [Confirm or Undo?](https://joshwayne.com/posts/confirm-or-undo/), [Make destructive buttons harder to find](http://www.effortmark.co.uk/seven-basic-best-practices-buttons/).
- [ ] **Destructive modal design** — microcopy, type-to-confirm, naming the consequence. Maps to:
      `GuardedAction` + confirm dialog copy. Ref: [Better destructive action modals](https://uxpsychology.substack.com/p/how-to-design-better-destructive), [Microcopy for confirmation](https://uxdesign.cc/are-you-sure-you-want-to-do-this-microcopy-for-confirmation-dialogues-1d94a0f73ac6).
- [ ] **Cancel vs. Close** — distinct affordances; cancel-as-link. Maps to: dialog/drawer footers. Ref:
      [Cancel vs. Close (NN/g)](https://www.nngroup.com/articles/cancel-vs-close/).
- [ ] **Toast accessibility** — for our status/alert toasts (reserved level ladder). Ref: [Accessible toast messages](https://sheribyrnehaber.medium.com/designing-toast-messages-for-accessibility-fb610ac364be).

## P1 — Dashboards & data visualization (→ Suite L2 dashboard, viz-in-card, `Gauge`)

- [ ] **Dashboard pattern taxonomy** — layout archetypes, when NOT to build a dashboard. Maps to:
      mission/fleet overview templates. Ref: [Dashboard Design Patterns](https://dashboarddesignpatterns.github.io/) + [cheatsheet](https://dashboarddesignpatterns.github.io/patterns.html), [How to design a dashboard (free eBook)](https://dataschool.com/how-to-design-a-dashboard/introduction/).
- [ ] **Designing for expert users** — the over-simplified ↔ over-complicated efficient frontier (very
      on-brand for operational). Maps to: operational register density. Ref: [UX efficient frontier (Morgane Peng)](https://uxdesign.cc/over-complicated-over-simplified-the-ux-efficient-frontier-561d7773bc6b).
- [ ] **Dataviz in a design system** — binding charts to metric label+value (already moodboard principle #2).
      Maps to: viz-in-card recipe, `Gauge`. Ref: [Design Systems for Data Visualization (Vitaly)](https://www.linkedin.com/posts/vitalyfriedman_ux-design-dataviz-activity-7151487617086169090-pnU4).

## P1 — Navigation (→ console/settings left-rail, breadcrumbs, command/context menus)

- [ ] **Deep-hierarchy nav** — left-rail section nav, multi-layer click-through, roles-in-nav. Maps to:
      settings/console navigation. Ref: workshop "Navigation" section (Swisscom tap menus, thyssenkrupp
      multi-layer). Lighter priority — we're not a deep-IA product.
- [ ] **Context menus / hover menus** — right-click affordances on map entities & table rows. Maps to:
      operational-console entity actions. Ref: [Guide to building context menus (Height)](https://height.app/blog/guide-to-build-context-menus).
- [ ] **KPI tree** — top-tasks framing for what a dashboard surfaces. Maps to: deciding fleet-overview
      hierarchy. Ref: [Focusing on top tasks (A List Apart)](https://alistapart.com/article/what-really-matters-focusing-on-top-tasks/).

## P1 — Enterprise design systems to study (execution bar)

Upgrades the moodboard's "reference design systems" list with industrial-grade peers.

- [ ] **Goldman Sachs DS** — dense financial data tables; the data-density bar. ([archived](https://web.archive.org/web/20231130204801/https://design.gs.com/home))
- [ ] **GE Ethos** — industrial/operational, strong data-grid. ([site](https://www.ethosdesignsystem.com/))
- [ ] **Cisco Momentum** — operational/network tooling. ([site](https://momentum.design/))
- [ ] **Salesforce Lightning** — the incumbent enterprise DS; data-table + density patterns. ([site](https://www.lightningdesignsystem.com/))
- [ ] **Visa / eBay Evo** — large-scale multi-brand DS governance. ([Visa](https://design.visa.com/), [eBay Evo](https://playbook.ebay.com/design-system))
      _(Keep our existing study list too: Linear, Geist, Stripe, IBM Carbon, Datadog/Grafana.)_

## P2 — Search & autocomplete (revisit if/when we add global search)

- [ ] Search & autocomplete guidelines — scoped search, suggestion patterns, accessible search bars.
      Maps to: not a current surface; park until a command-palette/global-search need appears. Ref:
      [Search UX guidelines (Vitaly)](https://www.linkedin.com/posts/vitalyfriedman_ux-design-search-activity-7121777554285281280-_qA-/), [Autocomplete UX (Baymard)](https://baymard.com/blog/autocomplete-design).

## P2 — Onboarding & AI patterns (background)

- [ ] **Onboarding** — methods/decision tree. Maps to: not core to an operational tool; P2. Ref: [Onboarding decision tree (NewsKit)](https://www.figma.com/community/file/1154728777780695374/defining-an-onboarding-experience).
- [ ] **Design patterns for AI** — Shape of AI, trust patterns, Google PAIR. Maps to: future AI features
      (Phase 8+?). Ref: [Shape of AI](https://www.shapeof.ai/), [People + AI Guidebook (Google)](https://pair.withgoogle.com/guidebook).

## skip — out of scope

Career paths / promotion / DesignOps / hiring; music playlist; general cognitive-load essays;
e-commerce-specific configurators. Useful reading, not Auxiliary work.

---

## Cross-cutting general references (keep handy)

- [Laws of UX](https://lawsofux.com/) · [UX Myths](https://uxmyths.com/) · [Miller's Law / 7±2](https://blog.prototypr.io/the-most-important-rule-in-ux-design-that-everyone-breaks-1c1cb188931)
- [Inclusive Components](https://inclusive-components.design/#components) · [Accessible front-end components (Smashing)](https://www.smashingmagazine.com/2021/03/complete-guide-accessible-front-end-components/) — pairs with our axe-per-component rule.
- [Interface Design Checklists (108MB PDF bundle)](https://smashed.by/ui-deck) — Vitaly's own checklists; mine during the audit.
