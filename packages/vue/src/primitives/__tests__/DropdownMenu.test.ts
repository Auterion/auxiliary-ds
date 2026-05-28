import { describe, it, expect, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { axe } from '../../test-utils/a11y';
import DropdownMenu from '../DropdownMenu/DropdownMenu.vue';
import DropdownMenuTrigger from '../DropdownMenu/DropdownMenuTrigger.vue';
import DropdownMenuContent from '../DropdownMenu/DropdownMenuContent.vue';
import DropdownMenuItem from '../DropdownMenu/DropdownMenuItem.vue';
import DropdownMenuLabel from '../DropdownMenu/DropdownMenuLabel.vue';
import DropdownMenuSeparator from '../DropdownMenu/DropdownMenuSeparator.vue';

/**
 * Composes a representative menu tree. `rootProps` is forwarded to the
 * <DropdownMenu> root (open/defaultOpen/modelValue), `contentProps` to
 * <DropdownMenuContent> (side/align/sideOffset).
 *
 * Content teleports through Reka's DropdownMenuPortal into document.body, so
 * opened content is queried via document.body rather than the wrapper subtree.
 */
function mountMenu(
  rootProps: Record<string, unknown> = {},
  contentProps: Record<string, unknown> = {},
  contentChildren?: () => unknown,
) {
  const children =
    contentChildren ??
    (() => [
      h(DropdownMenuLabel, () => 'Actions'),
      h(DropdownMenuItem, () => 'Edit'),
      h(DropdownMenuSeparator),
      h(DropdownMenuItem, () => 'Delete'),
    ]);

  return mount(DropdownMenu, {
    attachTo: document.body,
    props: rootProps,
    slots: {
      default: () => [
        h(DropdownMenuTrigger, () => 'Open menu'),
        h(DropdownMenuContent, contentProps, children),
      ],
    },
  });
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('DropdownMenu', () => {
  it('renders the trigger and keeps content closed by default', () => {
    const wrapper = mountMenu();
    const trigger = wrapper.find('[aria-haspopup="menu"]');
    expect(trigger.exists()).toBe(true);
    expect(trigger.attributes('aria-expanded')).toBe('false');
    expect(document.body.textContent).not.toContain('Edit');
  });

  it('teleports menu content into document.body when defaultOpen is set', async () => {
    mountMenu({ defaultOpen: true });
    await nextTick();
    const menu = document.body.querySelector('[role="menu"]');
    expect(menu).not.toBeNull();
    expect(document.body.textContent).toContain('Edit');
    expect(document.body.textContent).toContain('Delete');
  });

  it('marks the trigger expanded when open is controlled true', async () => {
    const wrapper = mountMenu({ open: true });
    await nextTick();
    const trigger = wrapper.find('[aria-haspopup="menu"]');
    expect(trigger.attributes('aria-expanded')).toBe('true');
  });

  it('opens on trigger click and emits update:open', async () => {
    const wrapper = mountMenu();
    const trigger = wrapper.find('[aria-haspopup="menu"]');

    await trigger.trigger('click');
    await nextTick();

    const emitted = wrapper.emitted('update:open');
    expect(emitted).toBeTruthy();
    expect(emitted?.[0]).toEqual([true]);
    expect(document.body.textContent).toContain('Edit');
  });

  it('applies styling and resolved side/align data attributes to the content surface', async () => {
    mountMenu({ defaultOpen: true }, { side: 'top', align: 'end' });
    await nextTick();

    const content = document.body.querySelector('[role="menu"]') as HTMLElement | null;
    expect(content).not.toBeNull();
    expect(content!.className).toContain('bg-popover');
    expect(content!.className).toContain('rounded-md');
    expect(content!.getAttribute('data-side')).toBe('top');
    expect(content!.getAttribute('data-align')).toBe('end');
  });

  it('uses default side=bottom / align=start when no placement props are given', async () => {
    mountMenu({ defaultOpen: true });
    await nextTick();

    const content = document.body.querySelector('[role="menu"]') as HTMLElement | null;
    expect(content).not.toBeNull();
    expect(content!.getAttribute('data-side')).toBe('bottom');
    expect(content!.getAttribute('data-align')).toBe('start');
  });

  it('reflects a disabled item via data-disabled', async () => {
    mountMenu({ defaultOpen: true }, {}, () => [
      h(DropdownMenuItem, { disabled: true }, () => 'Disabled action'),
    ]);
    await nextTick();

    const item = document.body.querySelector('[role="menuitem"]') as HTMLElement | null;
    expect(item).not.toBeNull();
    expect(item!.hasAttribute('data-disabled')).toBe(true);
    expect(item!.className).toContain('data-[disabled]:opacity-50');
  });

  it('renders a separator with role and label as a non-interactive group label', async () => {
    mountMenu({ defaultOpen: true });
    await nextTick();

    const separator = document.body.querySelector('[role="separator"]');
    expect(separator).not.toBeNull();

    const label = Array.from(document.body.querySelectorAll('div')).find((el) =>
      el.textContent?.trim() === 'Actions',
    );
    expect(label).toBeDefined();
    expect(label!.className).toContain('text-muted-foreground');
  });

  it('has no axe violations on the open menu surface', async () => {
    // modal: false avoids Reka's focus-scope marking sibling nodes (the trigger and
    // its focus-guard spans) aria-hidden while keeping them focusable — that is a
    // happy-dom artifact (real browsers move focus into the menu), not a defect of
    // this component. We assert axe on the teleported menu surface itself.
    mountMenu({ defaultOpen: true, modal: false });
    await nextTick();
    const menu = document.body.querySelector('[role="menu"]') as HTMLElement | null;
    expect(menu).not.toBeNull();
    const results = await axe(menu!);
    expect(results).toHaveNoViolations();
  });
});
