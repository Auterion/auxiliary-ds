import { describe, it, expect, afterEach } from 'vitest';
import { defineComponent, h, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { axe } from '../../test-utils/a11y';
import Toast from '../Toast/Toast.vue';
import ToastProvider from '../Toast/ToastProvider.vue';
import ToastViewport from '../Toast/ToastViewport.vue';
import ToastTitle from '../Toast/ToastTitle.vue';
import ToastDescription from '../Toast/ToastDescription.vue';
import ToastAction from '../Toast/ToastAction.vue';
import ToastClose from '../Toast/ToastClose.vue';

/**
 * Toast is a composite over Reka UI's ToastProvider / Root / Viewport / Title /
 * Description / Action / Close. The toast renders into the ToastViewport, which
 * Reka portals to document.body; so when open we query the body, not the wrapper.
 *
 * The harness only assigns `open`/`defaultOpen` to the vnode when they are set:
 * Toast forwards via useForwardPropsEmits, which forwards every vnode-assigned
 * prop — and an explicit `open: undefined` would resolve to a boolean-cast
 * `false`, silently switching Reka into controlled-closed mode.
 */
const Harness = defineComponent({
  props: {
    open: { type: Boolean, default: undefined },
    defaultOpen: { type: Boolean, default: undefined },
    type: { type: String, default: undefined },
    duration: { type: Number, default: undefined },
    title: { type: String, default: 'Saved' },
    description: { type: String, default: 'Your changes were saved.' },
    withAction: { type: Boolean, default: false },
    withClose: { type: Boolean, default: false },
    actionClass: { type: String, default: undefined },
  },
  emits: ['update:open'],
  setup(props, { emit }) {
    return () =>
      h(ToastProvider, null, {
        default: () => [
          h(
            Toast,
            {
              ...(props.open !== undefined ? { open: props.open } : {}),
              ...(props.defaultOpen !== undefined ? { defaultOpen: props.defaultOpen } : {}),
              type: props.type,
              duration: props.duration,
              'onUpdate:open': (v: boolean) => emit('update:open', v),
            },
            {
              default: () => [
                h(ToastTitle, null, { default: () => props.title }),
                h(ToastDescription, null, { default: () => props.description }),
                props.withAction
                  ? h(
                      ToastAction,
                      { altText: 'Undo the save', class: props.actionClass },
                      { default: () => 'Undo' },
                    )
                  : null,
                props.withClose ? h(ToastClose) : null,
              ],
            },
          ),
          h(ToastViewport),
        ],
      });
  },
});

const toastRoot = () => document.body.querySelector('li[data-state]') as HTMLElement | null;

describe('Toast', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('does not render the toast when not open', () => {
    mount(Harness, { attachTo: document.body });
    expect(toastRoot()).toBeNull();
    expect(document.body.textContent).not.toContain('Saved');
  });

  it('portals the title + description into the document when open', async () => {
    mount(Harness, { props: { open: true }, attachTo: document.body });
    await nextTick();
    expect(toastRoot()).not.toBeNull();
    expect(document.body.textContent).toContain('Saved');
    expect(document.body.textContent).toContain('Your changes were saved.');
  });

  // Regression: the wrapper used to hand-bind `:open="open"`, so Vue's boolean
  // casting turned an absent `open` into `false` and forced Reka into
  // controlled-closed mode — uncontrolled toasts (default-open, duration-driven)
  // could never display.
  it('renders uncontrolled with default-open (no open prop bound)', async () => {
    mount(Harness, { props: { defaultOpen: true }, attachTo: document.body });
    await nextTick();
    const root = toastRoot();
    expect(root).not.toBeNull();
    expect(root!.getAttribute('data-state')).toBe('open');
    expect(document.body.textContent).toContain('Saved');
  });

  it('renders the toast root with data-state=open and the design-system surface classes', async () => {
    mount(Harness, { props: { open: true }, attachTo: document.body });
    await nextTick();
    const root = toastRoot()!;
    expect(root.getAttribute('data-state')).toBe('open');
    const cls = root.className;
    expect(cls).toContain('rounded-md');
    expect(cls).toContain('bg-popover');
    expect(cls).toContain('text-foreground');
    expect(cls).toContain('border-border');
  });

  it('forwards class to the ToastAction button (single-root fallthrough)', async () => {
    mount(Harness, {
      props: { open: true, withAction: true, actionClass: 'action-x' },
      attachTo: document.body,
    });
    await nextTick();
    const root = toastRoot()!;
    expect(root.querySelector('.action-x')).not.toBeNull();
  });

  it('renders the viewport as an <ol> region with the fixed-position classes', () => {
    mount(Harness, { attachTo: document.body });
    const viewport = document.body.querySelector('ol') as HTMLElement | null;
    expect(viewport).not.toBeNull();
    expect(viewport!.className).toContain('fixed');
    expect(viewport!.className).toContain('z-[var(--z-toast)]');
    // viewport lives inside Reka's labelled toast region landmark
    expect(document.body.querySelector('[role="region"]')).not.toBeNull();
  });

  it('styles the title (medium weight) and description (muted, smaller)', async () => {
    mount(Harness, { props: { open: true }, attachTo: document.body });
    await nextTick();
    const root = toastRoot()!;
    const title = root.querySelector('.font-medium') as HTMLElement | null;
    const desc = root.querySelector('.text-muted-foreground') as HTMLElement | null;
    expect(title).not.toBeNull();
    expect(title!.textContent).toContain('Saved');
    expect(desc).not.toBeNull();
    expect(desc!.className).toContain('text-xs');
    expect(desc!.textContent).toContain('Your changes were saved.');
  });

  it('renders an action (slotted label) and a close button with an aria-label + default glyph', async () => {
    mount(Harness, {
      props: { open: true, withAction: true, withClose: true },
      attachTo: document.body,
    });
    await nextTick();
    const root = toastRoot()!;
    // close button carries the design-system aria-label and default aria-hidden svg glyph
    const close = root.querySelector('[aria-label="Close"]') as HTMLElement | null;
    expect(close).not.toBeNull();
    expect(close!.querySelector('svg[aria-hidden="true"]')).not.toBeNull();
    // action renders its slotted text
    expect(root.textContent).toContain('Undo');
  });

  // axe is scoped to the toast root element (our component's actual output). Running
  // axe against document.body instead would surface an aria-hidden-focus violation
  // from Reka's own internal focus-guard <span aria-hidden tabindex=0> sentinels,
  // which are library internals outside this wrapper's control — see the skipped test.
  it('has no axe violations on the rendered toast', async () => {
    mount(Harness, {
      props: { open: true, withAction: true, withClose: true },
      attachTo: document.body,
    });
    await nextTick();
    const root = toastRoot()!;
    const results = await axe(root);
    expect(results).toHaveNoViolations();
  });

  // BUG (upstream Reka UI, not this wrapper): when a toast is open, Reka injects
  // focus-guard sentinels rendered as <span aria-hidden="true" tabindex="0">.
  // An aria-hidden element must not be focusable (axe rule aria-hidden-focus), so a
  // page-level axe scan of an open toast reports a violation. This is in Reka's
  // ToastViewport internals, not in @auxiliary/vue's Toast components, so it is
  // documented rather than asserted-as-passing.
  // Upstream: https://github.com/unovue/reka-ui/issues/2486 (closed) — re-check on
  // each reka-ui upgrade and unskip once the sentinels pass axe on our pinned version.
  it.skip('has no axe violations across the whole open-toast document', async () => {
    mount(Harness, { props: { open: true }, attachTo: document.body });
    await nextTick();
    const results = await axe(document.body);
    expect(results).toHaveNoViolations();
  });
});
