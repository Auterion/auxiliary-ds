import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../test-utils/a11y';
import IdentityBar from '../IdentityBar.vue';
import { SURFACE_BY_ID, SURFACES } from '../surfaces';

const ORG = '45th CAB';

describe('IdentityBar', () => {
  it('has no axe violations, with and without a surface', async () => {
    for (const props of [{ org: ORG }, { org: ORG, surface: SURFACE_BY_ID.suite }]) {
      const wrapper = mount(IdentityBar, { props, attachTo: document.body });
      expect(await axe(wrapper.element)).toHaveNoViolations();
      wrapper.unmount();
    }
  });

  /**
   * The invariant the whole ecosystem argument rests on: order never varies.
   * A bar that rearranges itself per surface is five bars wearing one name.
   */
  it('renders its elements in the one fixed order', () => {
    const wrapper = mount(IdentityBar, {
      props: { org: ORG, surface: SURFACE_BY_ID.control },
    });
    const text = wrapper.text();
    const order = ['Auterion', '/', 'Control', 'Fly', ORG];
    let cursor = -1;
    for (const part of order) {
      const at = text.indexOf(part, cursor + 1);
      expect(at, `"${part}" out of order in: ${text}`).toBeGreaterThan(cursor);
      cursor = at;
    }
  });

  it('prints no surface name at the ecosystem root', () => {
    const wrapper = mount(IdentityBar, { props: { org: ORG } });
    expect(wrapper.text()).not.toContain('/');
    expect(wrapper.find('nav').exists()).toBe(false);
    // The app grid belongs to a surface; the launcher IS the grid.
    expect(wrapper.find('[aria-label="Open the launcher"]').exists()).toBe(false);
  });

  /**
   * The bar renders the tabs it is handed and owns nothing below itself. If it
   * ever grows knowledge of what a tab MEANS, product teams will refuse it.
   */
  it('renders exactly the tabs it is handed, in order', () => {
    for (const surface of SURFACES) {
      const wrapper = mount(IdentityBar, { props: { org: ORG, surface } });
      const labels = wrapper.findAll('nav button').map((b) => b.text());
      expect(labels).toEqual(surface.tabs);
    }
  });

  it('marks the current tab with aria-current, and only one', async () => {
    const surface = SURFACE_BY_ID.suite;
    const wrapper = mount(IdentityBar, { props: { org: ORG, surface } });
    const current = () =>
      wrapper.findAll('nav button').filter((b) => b.attributes('aria-current') === 'page');

    expect(current()).toHaveLength(1);
    expect(current()[0]!.text()).toBe(surface.tabs[0]);

    await wrapper.findAll('nav button')[2]!.trigger('click');
    expect(current()).toHaveLength(1);
    expect(current()[0]!.text()).toBe(surface.tabs[2]);
    expect(wrapper.emitted('update:tab')?.at(-1)).toEqual([surface.tabs[2]]);
  });

  it('lets a caller with a router own the current tab', async () => {
    const surface = SURFACE_BY_ID.suite;
    const wrapper = mount(IdentityBar, {
      props: { org: ORG, surface, tab: surface.tabs[1] },
    });
    const current = () =>
      wrapper.findAll('nav button').find((b) => b.attributes('aria-current') === 'page');
    expect(current()!.text()).toBe(surface.tabs[1]);

    // A click reports intent and does NOT move the marker — the caller decides.
    await wrapper.findAll('nav button')[3]!.trigger('click');
    expect(wrapper.emitted('update:tab')?.at(-1)).toEqual([surface.tabs[3]]);
    expect(current()!.text()).toBe(surface.tabs[1]);
  });

  it('resets the uncontrolled tab when the surface changes', async () => {
    const wrapper = mount(IdentityBar, {
      props: { org: ORG, surface: SURFACE_BY_ID.suite },
    });
    await wrapper.findAll('nav button')[2]!.trigger('click');
    await wrapper.setProps({ surface: SURFACE_BY_ID.control });
    const current = wrapper
      .findAll('nav button')
      .find((b) => b.attributes('aria-current') === 'page');
    expect(current!.text()).toBe(SURFACE_BY_ID.control.tabs[0]);
  });

  /**
   * Org is a safety fact — on a shared terminal "which tenant am I in" is not a
   * preference. It is never hidden behind a hover or a menu.
   */
  it('always states the org in text', () => {
    for (const surface of [undefined, SURFACE_BY_ID.nemyx]) {
      const wrapper = mount(IdentityBar, { props: { org: ORG, surface } });
      expect(wrapper.text()).toContain(ORG);
    }
  });

  it('gives the app grid and the account control accessible names', () => {
    const wrapper = mount(IdentityBar, {
      props: { org: ORG, surface: SURFACE_BY_ID.device },
    });
    expect(wrapper.find('[aria-label="Open the launcher"]').exists()).toBe(true);
    expect(wrapper.find('[aria-label="Account details"]').exists()).toBe(true);
    // The nine dots are decoration; the link carries the name.
    expect(wrapper.find('[aria-hidden="true"].grid').exists()).toBe(true);
  });

  it('names the tab strip after the surface it belongs to', () => {
    const wrapper = mount(IdentityBar, {
      props: { org: ORG, surface: SURFACE_BY_ID.control },
    });
    expect(wrapper.find('nav').attributes('aria-label')).toBe(
      `${SURFACE_BY_ID.control.formal} sections`,
    );
  });
});
