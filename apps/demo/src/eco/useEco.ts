/* Two small utilities the page needs and the design system does not owe it. */

import { onMounted, ref } from 'vue';

/**
 * Suppress transitions across a theme or register swap.
 *
 * A theme flip changes colour, background and border on nearly every element on
 * the page at once. Every `transition-colors` fires together and the switch
 * smears over its duration instead of snapping — most visible on this page,
 * where one control repaints five surfaces. So: kill transitions, force a
 * reflow so the browser commits that state, restore on the next frame.
 *
 * The class is on `<html>` rather than the page root because the specimens set
 * their own `[data-theme]` subtrees and every one of them has to be covered.
 */
export function suppressTransitions(): void {
  const root = document.documentElement;
  root.classList.add('ec-swapping');
  // Reading a layout property is what forces the style flush; the value is
  // deliberately unused.
  void root.offsetHeight;
  const restore = () => root.classList.remove('ec-swapping');
  requestAnimationFrame(() => requestAnimationFrame(restore));
  // `requestAnimationFrame` does not fire in a backgrounded tab, and a swap can
  // absolutely happen in one — the control is two clicks from a tab switch.
  // Without this fallback the class latches and every transition on the page
  // stays dead for the rest of the session. Whichever path runs first wins;
  // removing an absent class is a no-op.
  setTimeout(restore, 120);
}

/**
 * The identity bar's height under both registers.
 *
 * The spec panel states two numbers. Asserting them in prose is how a spec line
 * goes stale against the specimen it describes, so it reads them off the TOKENS
 * instead: whatever `--component-identity-bar-height` plus `-height-offset`
 * resolves to under each register is what the page prints.
 *
 * It reads the token tier rather than measuring a rendered bar because the bar
 * now ships from `@auxiliary/shell` (AD-D-038) and this page has no business
 * knowing its class names. The tier is the public contract; the class is not.
 * It also proves the register axis actually reaches the component tier — if the
 * `[data-register]` block ever stopped re-emitting these vars, both numbers
 * would come back equal and the panel would say so.
 */
export function useBarHeights() {
  const expressive = ref(0);
  const operational = ref(0);

  onMounted(() => {
    const probe = (register: string): number => {
      const el = document.createElement('div');
      el.dataset.register = register;
      el.setAttribute('aria-hidden', 'true');
      el.style.position = 'absolute';
      el.style.visibility = 'hidden';
      el.style.pointerEvents = 'none';
      el.style.insetInlineStart = '-9999px';
      /* The component tier emits var() REFERENCES rather than resolved
       * literals — that deviation is the mechanism the register axis rides on.
       * So the vars cannot be read off the element and parsed; the only way to
       * ask what they resolve to is to make the browser substitute them into a
       * real length and then measure it. */
      el.style.blockSize =
        'calc(var(--component-identity-bar-height) + var(--component-identity-bar-height-offset))';
      document.body.appendChild(el);
      const measured = el.getBoundingClientRect().height;
      el.remove();
      return Math.round(measured);
    };
    expressive.value = probe('expressive');
    operational.value = probe('operational');
  });

  return { expressive, operational };
}
