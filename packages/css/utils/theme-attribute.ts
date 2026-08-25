/**
 * Set a token-mode attribute (`data-theme`, `data-register`) without cross-fading
 * the whole page.
 *
 * Recipes put `transition-colors` on rows, buttons, menu items and every other
 * interactive surface, which is correct for hover — a state change on ONE element.
 * Flipping `[data-theme]` re-resolves every color token at once, so those same
 * transitions fire together and the page performs a slow, uneven cross-fade in
 * which different components arrive at the new theme at different moments. In an
 * operational theme switch — an operator going to `darknight` for a night flight,
 * or to `sunlight` under glare — that is the opposite of what the switch is for.
 *
 * The fix is the standard suppress → flush → restore: install a stylesheet that
 * kills transitions, make the change, force a synchronous style flush by reading
 * layout, then drop the stylesheet on the next frame. `!important` beats the
 * recipe utilities; reading `offsetHeight` is what makes the new colors commit
 * while transitions are still off, and is deliberately not optimised away.
 *
 * No-ops outside a DOM (SSR) and honours `prefers-reduced-motion` implicitly:
 * suppressing a transition is never the thing reduced-motion users object to.
 */
export function setThemeAttribute(
  attribute: string,
  value: string | null,
  target?: Element,
): void {
  if (typeof document === 'undefined') return;
  const el = target ?? document.documentElement;

  const style = document.createElement('style');
  style.append(
    document.createTextNode('*,*::before,*::after{transition:none !important}'),
  );
  document.head.append(style);

  if (value === null) el.removeAttribute(attribute);
  else el.setAttribute(attribute, value);

  // Force the new values to commit while transitions are still suppressed.
  void document.body.offsetHeight;

  requestAnimationFrame(() => style.remove());
}
