import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../test-utils/a11y';
import Launcher from '../Launcher.vue';
import { SURFACES, SURFACE_BY_ID } from '../surfaces';

const ORG = '45th CAB';

describe('Launcher', () => {
  it('has no axe violations', async () => {
    const wrapper = mount(Launcher, {
      props: { org: ORG, account: 'y.dimov@auterion.com', role: 'Operator' },
      attachTo: document.body,
    });
    expect(await axe(wrapper.element)).toHaveNoViolations();
    wrapper.unmount();
  });

  it('offers every declared surface, and nothing it was not given', () => {
    const wrapper = mount(Launcher, { props: { org: ORG } });
    expect(wrapper.findAll('a[href^="#surface-"]')).toHaveLength(SURFACES.length);

    const subset = mount(Launcher, {
      props: { org: ORG, surfaces: [SURFACE_BY_ID.suite, SURFACE_BY_ID.control] },
    });
    expect(subset.findAll('a[href^="#surface-"]')).toHaveLength(2);
  });

  /**
   * The tile's whole job: say what you are about to be handed BEFORE the click,
   * so moving between a light roomy Suite and a dark dense Control stops being
   * a jolt.
   */
  it('declares each surface theme and register on its tile', () => {
    const wrapper = mount(Launcher, { props: { org: ORG } });
    for (const [i, tile] of wrapper.findAll('a[href^="#surface-"]').entries()) {
      const surface = SURFACES[i]!;
      const text = tile.text();
      expect(text).toContain(surface.theme);
      expect(text).toContain(surface.register);
      expect(text).toContain(surface.chrome);
    }
  });

  it('marks a surface that does not ship yet, rather than implying it does', () => {
    const wrapper = mount(Launcher, { props: { org: ORG } });
    const tiles = wrapper.findAll('a[href^="#surface-"]');
    for (const [i, tile] of tiles.entries()) {
      const proposed = SURFACES[i]!.proposed === true;
      expect(tile.attributes('data-proposed')).toBe(String(proposed));
      expect(tile.text().includes('proposed')).toBe(proposed);
    }
    expect(tiles.filter((t) => t.attributes('data-proposed') === 'true').length).toBeGreaterThan(0);
  });

  /**
   * Identity is carried by silhouette, never by hue — a colour per product
   * would mint accent hues with no ramp, no contrast gate and no token, next to
   * a status ladder that already owns five meanings.
   */
  it('draws a glyph per surface and spends no product hue', () => {
    const wrapper = mount(Launcher, { props: { org: ORG } });
    expect(wrapper.findAll('a[href^="#surface-"] svg')).toHaveLength(SURFACES.length);
    // No tile paints a background or text colour of its own.
    for (const tile of wrapper.findAll('a[href^="#surface-"]')) {
      const own = tile.classes().filter((c) => /^(bg|text)-/.test(c));
      expect(own.sort()).toEqual(['bg-card', 'text-card-foreground']);
    }
  });

  it('carries the identity bar, so the org is stated here too', () => {
    const wrapper = mount(Launcher, { props: { org: ORG } });
    expect(wrapper.text()).toContain(ORG);
    expect(wrapper.text()).toContain('Auterion');
  });

  /**
   * The bar is allowed to drop the account control at panel width precisely
   * because the launcher states the signed-in account in full. If that stops
   * being true, the bar's responsive rule becomes a dead end.
   */
  it('states the signed-in account in full when given one', () => {
    const wrapper = mount(Launcher, {
      props: { org: ORG, account: 'y.dimov@auterion.com', role: 'Operator' },
    });
    expect(wrapper.text()).toContain('y.dimov@auterion.com');
    expect(wrapper.text()).toContain('Operator');
  });

  it('omits the account line entirely rather than inventing one', () => {
    const wrapper = mount(Launcher, { props: { org: ORG } });
    expect(wrapper.text()).not.toContain('Signed in as');
  });

  it('lets the caller decide where a tile goes', () => {
    const wrapper = mount(Launcher, {
      props: { org: ORG, href: (s: { id: string }) => `/app/${s.id}` },
    });
    expect(wrapper.find('a[href="/app/suite"]').exists()).toBe(true);
  });
});
