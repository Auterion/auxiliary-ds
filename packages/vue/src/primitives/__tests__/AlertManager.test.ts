import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { effectScope } from 'vue';
import { axe } from '../../test-utils/a11y';
import AlertManager from '../AlertManager.vue';
import AlertBanner from '../AlertBanner.vue';
import { useAlertModel } from '../../composables/useAlertModel';

function makeModel(seed: (m: ReturnType<typeof useAlertModel>) => void) {
  const scope = effectScope();
  const model = scope.run(() => useAlertModel())!;
  seed(model);
  return model;
}

const ackBtns = (wrapper: ReturnType<typeof mount>) =>
  wrapper.findAll('button').filter((b) => b.text() === 'Acknowledge');

describe('AlertManager', () => {
  it('renders one banner per visible alert, in priority order', () => {
    const model = makeModel((m) => {
      m.raise({ id: 'a', level: 'advisory', title: 'Advisory one' });
      m.raise({ id: 'b', level: 'alarm', title: 'Alarm one' });
    });
    const wrapper = mount(AlertManager, { props: { model } });
    const banners = wrapper.findAllComponents(AlertBanner);
    expect(banners).toHaveLength(2);
    // Alarm sorts first.
    expect(banners[0]!.text()).toContain('Alarm one');
  });

  it('owns a single polite live region; banners do not each announce', () => {
    const model = makeModel((m) => m.raise({ id: 'a', level: 'alarm', title: 'Fire' }));
    const wrapper = mount(AlertManager, { props: { model } });
    // One log region for the whole stack…
    expect(wrapper.findAll('[role="log"]')).toHaveLength(1);
    // …and no per-banner assertive region (avoids the re-announce storm).
    expect(wrapper.findAll('[role="alert"]')).toHaveLength(0);
  });

  it('acknowledges via the per-banner action and removes the action once acked', async () => {
    const model = makeModel((m) => m.raise({ id: 'a', level: 'warning', title: 'Heads up' }));
    const wrapper = mount(AlertManager, { props: { model } });

    expect(model.unacknowledged.value).toBe(1);
    await ackBtns(wrapper)[0]!.trigger('click');
    expect(model.unacknowledged.value).toBe(0);

    // The acked banner no longer offers an Acknowledge action…
    expect(ackBtns(wrapper)).toHaveLength(0);
    // …and names its state for assistive tech rather than opacity alone.
    expect(wrapper.text()).toContain('Acknowledged');
  });

  it('acknowledges the whole backlog via the header, which then disappears', async () => {
    const model = makeModel((m) => {
      m.raise({ id: 'a', level: 'warning', title: 'One' });
      m.raise({ id: 'b', level: 'caution', title: 'Two' });
    });
    const wrapper = mount(AlertManager, { props: { model } });

    const ackAll = wrapper.findAll('button').find((b) => b.text() === 'Acknowledge all')!;
    await ackAll.trigger('click');
    expect(model.unacknowledged.value).toBe(0);
    // Header is gated on unacked > 0, so it is gone once the backlog is cleared.
    expect(wrapper.findAll('button').find((b) => b.text() === 'Acknowledge all')).toBeUndefined();
  });

  it('caps the stack and summarises the remainder', () => {
    const model = makeModel((m) => {
      for (let i = 0; i < 5; i++) m.raise({ id: `a${i}`, level: 'caution', title: `C${i}` });
    });
    const wrapper = mount(AlertManager, { props: { model, max: 3 } });
    expect(wrapper.findAllComponents(AlertBanner)).toHaveLength(3);
    expect(wrapper.text()).toContain('+2 more');
  });

  it('has no axe violations', async () => {
    const model = makeModel((m) => {
      m.raise({ id: 'a', level: 'alarm', title: 'Engine fire', message: 'Shut down engine 1' });
      m.raise({ id: 'b', level: 'caution', title: 'GPS degraded' });
    });
    const wrapper = mount(AlertManager, { props: { model } });
    expect(await axe(wrapper.element)).toHaveNoViolations();
  });
});
