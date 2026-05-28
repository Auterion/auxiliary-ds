import { describe, it, expect, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { axe } from '../../test-utils/a11y';
import Popover from '../Popover/Popover.vue';
import PopoverTrigger from '../Popover/PopoverTrigger.vue';
import PopoverContent from '../Popover/PopoverContent.vue';

/**
 * Composes the three parts into a representative popover tree.
 * `rootProps` is forwarded to the <Popover> root (e.g. open, defaultOpen, modelValue).
 * `contentProps` is forwarded to <PopoverContent> (side/align/offsets).
 *
 * PopoverContent teleports through Reka's PopoverPortal into document.body, so
 * opened content is queried via document.body rather than the wrapper subtree.
 */
function mountPopover(
  rootProps: Record<string, unknown> = {},
  contentProps: Record<string, unknown> = {},
) {
  return mount(Popover, {
    attachTo: document.body,
    props: rootProps,
    slots: {
      default: () => [
        h(PopoverTrigger, () => 'Open'),
        h(PopoverContent, contentProps, () => 'Popover body'),
      ],
    },
  });
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Popover', () => {
  it('renders the trigger and keeps content closed by default', () => {
    const wrapper = mountPopover();
    const trigger = wrapper.find('[aria-haspopup="dialog"]');
    expect(trigger.exists()).toBe(true);
    expect(trigger.attributes('aria-expanded')).toBe('false');
    expect(document.body.textContent).not.toContain('Popover body');
  });

  it('renders teleported content into document.body when defaultOpen is set', async () => {
    mountPopover({ defaultOpen: true });
    await nextTick();
    expect(document.body.textContent).toContain('Popover body');
  });

  it('marks the trigger expanded when open is controlled true', async () => {
    const wrapper = mountPopover({ open: true });
    await nextTick();
    const trigger = wrapper.find('[aria-haspopup="dialog"]');
    expect(trigger.attributes('aria-expanded')).toBe('true');
  });

  it('opens on trigger click and emits update:open', async () => {
    const wrapper = mountPopover();
    const trigger = wrapper.find('[aria-haspopup="dialog"]');

    await trigger.trigger('click');
    await nextTick();

    const emitted = wrapper.emitted('update:open');
    expect(emitted).toBeTruthy();
    expect(emitted?.[0]).toEqual([true]);
    expect(document.body.textContent).toContain('Popover body');
  });

  it('applies the styling and side/align data attributes to the content surface', async () => {
    mountPopover({ defaultOpen: true }, { side: 'top', align: 'start' });
    await nextTick();

    const content = document.body.querySelector('[role="dialog"]') as HTMLElement | null;
    expect(content).not.toBeNull();
    expect(content!.className).toContain('bg-popover');
    expect(content!.className).toContain('rounded-md');
    // Reka reflects the resolved placement onto data attributes.
    expect(content!.getAttribute('data-side')).toBe('top');
    expect(content!.getAttribute('data-align')).toBe('start');
  });

  it('uses default side=bottom / align=center when no placement props are given', async () => {
    mountPopover({ defaultOpen: true });
    await nextTick();

    const content = document.body.querySelector('[role="dialog"]') as HTMLElement | null;
    expect(content).not.toBeNull();
    expect(content!.getAttribute('data-side')).toBe('bottom');
    expect(content!.getAttribute('data-align')).toBe('center');
  });

  it('has no axe violations with the popover open', async () => {
    mountPopover({ defaultOpen: true });
    await nextTick();
    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });
});
