import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick, defineComponent, h } from 'vue';
import { axe } from '../../test-utils/a11y';
import Dialog from '../Dialog/Dialog.vue';
import DialogTrigger from '../Dialog/DialogTrigger.vue';
import DialogContent from '../Dialog/DialogContent.vue';
import DialogTitle from '../Dialog/DialogTitle.vue';
import DialogDescription from '../Dialog/DialogDescription.vue';
import DialogClose from '../Dialog/DialogClose.vue';

// Reka teleports DialogContent into document.body, so a closed body between tests
// can leak. Build a fresh harness component per test and clean the body after.
function harness(rootProps: Record<string, unknown> = {}) {
  return defineComponent({
    setup() {
      return () =>
        h(Dialog, rootProps, () => [
          h(DialogTrigger, () => 'Open dialog'),
          h(DialogContent, () => [
            h(DialogTitle, () => 'Confirm action'),
            h(DialogDescription, () => 'This cannot be undone.'),
            h(DialogClose, () => 'Cancel'),
          ]),
        ]);
    },
  });
}

function cleanBody() {
  document.body.innerHTML = '';
}

describe('Dialog', () => {
  it('renders the trigger but keeps content out of the DOM while closed', () => {
    const wrapper = mount(harness());
    expect(wrapper.text()).toContain('Open dialog');
    // Content is portalled and only mounted when open.
    expect(document.body.textContent).not.toContain('Confirm action');
    wrapper.unmount();
    cleanBody();
  });

  it('exposes the trigger with a button role and aria-haspopup', () => {
    const wrapper = mount(harness());
    const trigger = wrapper.find('button');
    expect(trigger.exists()).toBe(true);
    expect(trigger.attributes('aria-haspopup')).toBe('dialog');
    expect(trigger.attributes('aria-expanded')).toBe('false');
    wrapper.unmount();
    cleanBody();
  });

  it('teleports content to document.body when defaultOpen is set', async () => {
    const wrapper = mount(harness({ defaultOpen: true }));
    await nextTick();

    const dialog = document.body.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    expect(document.body.textContent).toContain('Confirm action');
    expect(document.body.textContent).toContain('This cannot be undone.');
    wrapper.unmount();
    cleanBody();
  });

  it('styles title and description via the design-system classes', async () => {
    const wrapper = mount(harness({ defaultOpen: true }));
    await nextTick();

    const title = document.body.querySelector('h2, [id]');
    const heading = document.body.querySelector('.text-lg');
    expect(heading).not.toBeNull();
    expect(heading?.className).toContain('font-medium');
    expect(heading?.className).toContain('text-foreground');

    const desc = document.body.querySelector('.text-muted-foreground.text-sm, .text-sm.text-muted-foreground');
    expect(desc).not.toBeNull();
    expect(desc?.textContent).toContain('This cannot be undone.');
    // title element is wired for accessible naming
    expect(title).not.toBeNull();
    wrapper.unmount();
    cleanBody();
  });

  it('associates the dialog with its title and description for accessible naming', async () => {
    const wrapper = mount(harness({ defaultOpen: true }));
    await nextTick();

    const dialog = document.body.querySelector('[role="dialog"]');
    expect(dialog).not.toBeNull();
    const labelledby = dialog?.getAttribute('aria-labelledby');
    const describedby = dialog?.getAttribute('aria-describedby');
    expect(labelledby).toBeTruthy();
    expect(describedby).toBeTruthy();

    const titleEl = labelledby ? document.getElementById(labelledby) : null;
    const descEl = describedby ? document.getElementById(describedby) : null;
    expect(titleEl?.textContent).toContain('Confirm action');
    expect(descEl?.textContent).toContain('This cannot be undone.');
    wrapper.unmount();
    cleanBody();
  });

  it('renders the built-in close affordance with an accessible label', async () => {
    const wrapper = mount(harness({ defaultOpen: true }));
    await nextTick();

    const closeBtn = document.body.querySelector('[aria-label="Close"]');
    expect(closeBtn).not.toBeNull();
    // The X glyph is decorative.
    expect(closeBtn?.querySelector('svg')?.getAttribute('aria-hidden')).toBe('true');
    wrapper.unmount();
    cleanBody();
  });

  it('has no axe violations when open', async () => {
    const wrapper = mount(harness({ defaultOpen: true }));
    await nextTick();

    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
    wrapper.unmount();
    cleanBody();
  });
});
