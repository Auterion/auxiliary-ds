# Accordion

A vertically stacked set of disclosure panels, styled by the `accordion` recipe and built on Reka UI's `AccordionRoot`. Compose four parts: `<Accordion>` wraps the set, each `<AccordionItem>` is one panel, `<AccordionTrigger>` is its clickable header (it renders the chevron for you), and `<AccordionContent>` is the collapsible body.

<div class="auxiliary-demo vp-raw">
  <Accordion type="single" collapsible default-value="airspace" style="width: 100%; max-width: 480px;">
    <AccordionItem value="airspace">
      <AccordionTrigger>Airspace authorization</AccordionTrigger>
      <AccordionContent>
        Class G uncontrolled airspace below 120m AGL. No NOTAMs active for this area. Cleared for VLOS operations.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="weather">
      <AccordionTrigger>Weather window</AccordionTrigger>
      <AccordionContent>
        Wind 6.2 m/s gusting to 9.8 m/s — within operational limits. Visibility &gt;10 km. No precipitation expected for 90 minutes.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="vehicle">
      <AccordionTrigger>Vehicle systems</AccordionTrigger>
      <AccordionContent>
        Battery 74% (estimated 21 min flight). GPS lock: 12 satellites, HDOP 0.7. IMU and barometer calibrated within 24h.
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</div>

## When to use

- To collapse a long page into scannable sections — FAQs, settings groups, pre-flight checklists — where the user only needs one or two sections at a time.
- When vertical space is scarce and the section titles are enough to let a user decide what to open.
- For progressive disclosure of optional detail: show the summary in the trigger, hide the depth in the content.

## When *not* to use

- For content the user needs to **compare side by side** — collapsing hides context. Use a layout that keeps both visible, or `<Tabs>`.
- For a **single** show/hide toggle — that's a disclosure, not an accordion. Reach for a plain `<button>` + conditional render, or `<Collapsible>` if you have one.
- For **primary navigation** — an accordion is content disclosure, not a nav tree. Users expect nav to route, not expand inline.
- When **every** section is usually open at once — at that point the chrome (chevrons, headers) costs more than it gives; just render the sections.

## Examples

### Single (default)

`<Accordion>` defaults to `type="single"`, so opening one item closes the others. Add `collapsible` to let the user close the open item by clicking its trigger again, and `default-value` to start with one open.

<div class="auxiliary-demo vp-raw">
  <Accordion type="single" collapsible default-value="connectivity" style="width: 100%; max-width: 480px;">
    <AccordionItem value="connectivity">
      <AccordionTrigger>Connectivity</AccordionTrigger>
      <AccordionContent>
        LTE primary link, RC backup on 2.4 GHz. Failsafe returns to home on link loss.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="storage">
      <AccordionTrigger>Storage</AccordionTrigger>
      <AccordionContent>
        128 GB onboard. Footage offloads to the ground station after landing.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="firmware">
      <AccordionTrigger>Firmware</AccordionTrigger>
      <AccordionContent>
        Running v4.2.1. One update available; install on the bench, not in the field.
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</div>

```vue
<Accordion type="single" collapsible default-value="connectivity">
  <AccordionItem value="connectivity">
    <AccordionTrigger>Connectivity</AccordionTrigger>
    <AccordionContent>
      LTE primary link, RC backup on 2.4 GHz. Failsafe returns to home on link loss.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="storage">
    <AccordionTrigger>Storage</AccordionTrigger>
    <AccordionContent>
      128 GB onboard. Footage offloads to the ground station after landing.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="firmware">
    <AccordionTrigger>Firmware</AccordionTrigger>
    <AccordionContent>
      Running v4.2.1. One update available; install on the bench, not in the field.
    </AccordionContent>
  </AccordionItem>
</Accordion>
```

### Multiple

Set `type="multiple"` to let several items stay open at once. With `multiple`, `default-value` takes an array and `collapsible` has no effect — every item can already close independently.

<div class="auxiliary-demo vp-raw">
  <Accordion type="multiple" :default-value="['airframe', 'battery']" style="width: 100%; max-width: 480px;">
    <AccordionItem value="airframe">
      <AccordionTrigger>Airframe</AccordionTrigger>
      <AccordionContent>
        Quad-X carbon frame, 1.4 kg dry. Arms folded for transport.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="battery">
      <AccordionTrigger>Battery</AccordionTrigger>
      <AccordionContent>
        6S 5200 mAh. Two packs charged, one on standby.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="payload">
      <AccordionTrigger>Payload</AccordionTrigger>
      <AccordionContent>
        Gimbal-stabilized 4K camera. Spare lens in the case.
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</div>

```vue
<Accordion type="multiple" :default-value="['airframe', 'battery']">
  <AccordionItem value="airframe">
    <AccordionTrigger>Airframe</AccordionTrigger>
    <AccordionContent>Quad-X carbon frame, 1.4 kg dry. Arms folded for transport.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="battery">
    <AccordionTrigger>Battery</AccordionTrigger>
    <AccordionContent>6S 5200 mAh. Two packs charged, one on standby.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="payload">
    <AccordionTrigger>Payload</AccordionTrigger>
    <AccordionContent>Gimbal-stabilized 4K camera. Spare lens in the case.</AccordionContent>
  </AccordionItem>
</Accordion>
```

### Disabled item

Set `disabled` on an `<AccordionItem>` to gray out and block a single panel — useful for a section that isn't applicable to the current mission. Set `disabled` on the `<Accordion>` itself to lock the whole set.

<div class="auxiliary-demo vp-raw">
  <Accordion type="single" collapsible default-value="checks" style="width: 100%; max-width: 480px;">
    <AccordionItem value="checks">
      <AccordionTrigger>Pre-flight checks</AccordionTrigger>
      <AccordionContent>
        Airspace, weather, and vehicle systems all nominal.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="payload" disabled>
      <AccordionTrigger>Payload (none attached)</AccordionTrigger>
      <AccordionContent>
        Not applicable for this mission.
      </AccordionContent>
    </AccordionItem>
  </Accordion>
</div>

```vue
<Accordion type="single" collapsible default-value="checks">
  <AccordionItem value="checks">
    <AccordionTrigger>Pre-flight checks</AccordionTrigger>
    <AccordionContent>Airspace, weather, and vehicle systems all nominal.</AccordionContent>
  </AccordionItem>
  <AccordionItem value="payload" disabled>
    <AccordionTrigger>Payload (none attached)</AccordionTrigger>
    <AccordionContent>Not applicable for this mission.</AccordionContent>
  </AccordionItem>
</Accordion>
```

### Controlled with v-model

Bind `v-model` to drive the open state from your own code — sync it to a route, persist it, or open a panel in response to an event. The bound value is a `string` for `single` and a `string[]` for `multiple`.

```vue
<script setup>
import { ref } from 'vue'
const open = ref('airspace')
</script>

<template>
  <Accordion type="single" collapsible v-model="open">
    <AccordionItem value="airspace">
      <AccordionTrigger>Airspace authorization</AccordionTrigger>
      <AccordionContent>Cleared for VLOS operations below 120m AGL.</AccordionContent>
    </AccordionItem>
    <AccordionItem value="weather">
      <AccordionTrigger>Weather window</AccordionTrigger>
      <AccordionContent>Within operational limits for the next 90 minutes.</AccordionContent>
    </AccordionItem>
  </Accordion>
</template>
```

`update:modelValue` fires on every change, so `v-model` stays in sync without extra wiring.

## Props

### Accordion

<PropsTable name="Accordion" />

`type`, `collapsible`, `disabled`, `dir`, and `orientation` are forwarded to Reka UI's `AccordionRoot`. The wrapper defaults `type` to `'single'` when you omit it.

### AccordionItem

<PropsTable name="AccordionItem" />

`value` is required and must be unique within the accordion — it's the identity used by `default-value` and `v-model`.

### AccordionTrigger

<PropsTable name="AccordionTrigger" />

No props beyond `class`. It renders an `AccordionHeader` + `AccordionTrigger` and draws the chevron itself; pass your label text as the default slot.

### AccordionContent

<PropsTable name="AccordionContent" />

No props beyond `class`. Put the panel body in the default slot — it's wrapped in an inner element the recipe uses for the open/close animation.

## Accessibility

- The trigger renders inside an `AccordionHeader` as a real `<button>` with `aria-expanded` and `aria-controls` wired to its content region; the content carries the matching `role="region"`. Reka UI manages all of this — you only supply the labels.
- **Keyboard:** `Tab` moves focus to each trigger; `Enter` / `Space` toggle the focused panel. With the default vertical `orientation`, `Arrow Up` / `Arrow Down` move focus between triggers, and `Home` / `End` jump to the first / last.
- The chevron `<svg>` is `aria-hidden="true"` — it's a decorative direction cue, never the only signal. Open state is carried by `aria-expanded`, not by the icon alone.
- `disabled` items (and a `disabled` accordion) are skipped in keyboard navigation and report their disabled state to assistive tech, so a screen-reader user won't land on a panel they can't open.
- The chevron rotation and the open/close height transition respect `prefers-reduced-motion` — when a user has reduced motion enabled, panels snap rather than animate.
- Make trigger labels self-describing ("Weather window", not "Section 2"). The trigger text is the panel's accessible name.
