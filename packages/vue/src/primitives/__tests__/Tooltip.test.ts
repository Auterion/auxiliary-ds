import { describe, it, expect, afterEach } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { axe } from '../../test-utils/a11y';
import Tooltip from '../Tooltip/Tooltip.vue';
import TooltipTrigger from '../Tooltip/TooltipTrigger.vue';
import TooltipContent from '../Tooltip/TooltipContent.vue';
import TooltipProvider from '../Tooltip/TooltipProvider.vue';

/**
 * Tooltip is a composite over Reka UI's TooltipRoot/Trigger/Content/Provider.
 * Content is portalled to document.body, so when open we query the body rather
 * than the wrapper element.
 */

// A full tooltip harness. `defaultOpen` drives the root open so the portalled
// content renders without depending on hover timers (which don't fire in happy-dom).
const Harness = defineComponent({
  props: {
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: undefined },
    side: { type: String, default: undefined },
    sideOffset: { type: Number, default: undefined },
    label: { type: String, default: 'Tooltip text' },
    triggerText: { type: String, default: 'Hover me' },
  },
  setup(props) {
    return () =>
      h(TooltipProvider, null, {
        default: () =>
          h(
            Tooltip,
            { open: props.open, defaultOpen: props.defaultOpen },
            {
              default: () => [
                h(TooltipTrigger, { asChild: true }, { default: () => h('button', props.triggerText) }),
                h(
                  TooltipContent,
                  { side: props.side, sideOffset: props.sideOffset },
                  { default: () => props.label },
                ),
              ],
            },
          ),
      });
  },
});

// Track mounted wrappers so portalled content is torn down between tests —
// otherwise body-attached tooltips leak into later assertions.
const wrappers: Array<{ unmount: () => void }> = [];
function mountTracked(props?: Record<string, unknown>) {
  const w = mount(Harness, { props, attachTo: document.body });
  wrappers.push(w);
  return w;
}

afterEach(() => {
  while (wrappers.length) wrappers.pop()!.unmount();
  document.body.innerHTML = '';
});

describe('Tooltip', () => {
  it('renders the trigger content (closed by default)', () => {
    const wrapper = mountTracked();
    const btn = wrapper.find('button');
    expect(btn.exists()).toBe(true);
    expect(btn.text()).toBe('Hover me');
    // closed by default → no portalled content in body
    expect(document.body.textContent).not.toContain('Tooltip text');
  });

  it('forwards asChild on the trigger so the slotted button is the trigger element', () => {
    const wrapper = mountTracked();
    const btn = wrapper.find('button');
    // asChild means no extra wrapper element — the button itself carries the trigger semantics.
    expect(btn.attributes('aria-describedby') !== undefined || btn.attributes('data-state') !== undefined).toBe(
      true,
    );
  });

  it('portals content into document.body when defaultOpen is true', async () => {
    mountTracked({ defaultOpen: true });
    await nextTick();
    expect(document.body.textContent).toContain('Tooltip text');
  });

  it('applies the design-system content classes on the open tooltip', async () => {
    mountTracked({ defaultOpen: true });
    await nextTick();
    const content = document.body.querySelector('[data-side]') as HTMLElement | null;
    expect(content).not.toBeNull();
    const cls = content!.className;
    expect(cls).toContain('bg-primary');
    expect(cls).toContain('text-primary-foreground');
    expect(cls).toContain('rounded-(--component-tooltip-radius)');
    expect(cls).toContain('z-[var(--z-tooltip)]');
  });

  it('honours the side prop on the rendered content', async () => {
    mountTracked({ defaultOpen: true, side: 'right' });
    await nextTick();
    const content = document.body.querySelector('[data-side]') as HTMLElement | null;
    expect(content).not.toBeNull();
    expect(content!.getAttribute('data-side')).toBe('right');
  });

  it('respects a controlled closed state (open=false)', async () => {
    mountTracked({ open: false });
    await nextTick();
    expect(document.body.textContent).not.toContain('Tooltip text');
  });

  it('has no axe violations when open', async () => {
    mountTracked({ defaultOpen: true });
    await nextTick();
    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });
});
