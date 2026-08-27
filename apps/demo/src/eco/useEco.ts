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
 * Measure the identity bar's height under both registers.
 *
 * The spec panel states two numbers. Asserting them in prose is how a spec line
 * goes stale against the specimen it describes, so it reads them off two live
 * probes instead: whatever `calc(--control-height-lg + --spacing-2)` resolves
 * to today is what the page prints.
 */
export function useBarHeights() {
  const expressive = ref(0);
  const operational = ref(0);

  onMounted(() => {
    const probe = (register: string): number => {
      const el = document.createElement('div');
      el.className = 'ec-bar';
      el.dataset.register = register;
      el.setAttribute('aria-hidden', 'true');
      el.style.position = 'absolute';
      el.style.visibility = 'hidden';
      el.style.pointerEvents = 'none';
      el.style.insetInlineStart = '-9999px';
      document.body.appendChild(el);
      const h = el.offsetHeight;
      el.remove();
      return h;
    };
    expressive.value = probe('expressive');
    operational.value = probe('operational');
  });

  return { expressive, operational };
}
