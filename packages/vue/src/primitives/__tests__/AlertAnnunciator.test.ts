import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { effectScope } from 'vue';
import { axe } from '../../test-utils/a11y';
import AlertAnnunciator from '../AlertAnnunciator.vue';
import { useAlertModel } from '../../composables/useAlertModel';

function makeModel(seed: (m: ReturnType<typeof useAlertModel>) => void) {
  const scope = effectScope();
  const model = scope.run(() => useAlertModel())!;
  seed(model);
  return model;
}

describe('AlertAnnunciator', () => {
  it('summarises the highest level and the visible alert count', () => {
    const model = makeModel((m) => {
      m.raise({ id: 'a', level: 'caution' });
      m.raise({ id: 'b', level: 'alarm' });
    });
    const wrapper = mount(AlertAnnunciator, { props: { model } });
    // Highest is alarm (level reaches AT via StatusBadge + the live region).
    expect(wrapper.text()).toContain('Alarm');
    expect(wrapper.text()).toContain('2 alerts');
  });

  it('counts all visible alerts (incl. acknowledged), with singular/plural label', () => {
    const model = makeModel((m) => {
      m.raise({ id: 'a', level: 'alarm' });
      m.raise({ id: 'b', level: 'caution' });
      m.acknowledge('b'); // acked but still visible
    });
    const wrapper = mount(AlertAnnunciator, { props: { model } });
    expect(wrapper.text()).toContain('2 alerts'); // visible-count semantics, not "active"

    const single = makeModel((m) => m.raise({ id: 'x', level: 'warning' }));
    expect(mount(AlertAnnunciator, { props: { model: single } }).text()).toContain('1 alert');
  });

  it('exposes a stable action name independent of the changing status', () => {
    const model = makeModel((m) => m.raise({ id: 'a', level: 'alarm' }));
    const wrapper = mount(AlertAnnunciator, { props: { model } });
    expect(wrapper.get('button').attributes('aria-label')).toBe('View alerts');
  });

  it('shows a nominal resting state when there are no alerts', () => {
    const model = makeModel(() => {});
    const wrapper = mount(AlertAnnunciator, { props: { model } });
    expect(wrapper.text()).toContain('All nominal');
  });

  it('emits select when clicked', async () => {
    const model = makeModel((m) => m.raise({ id: 'a', level: 'warning' }));
    const wrapper = mount(AlertAnnunciator, { props: { model } });
    await wrapper.get('button').trigger('click');
    expect(wrapper.emitted('select')).toHaveLength(1);
  });

  it('has no axe violations (active and resting)', async () => {
    const active = makeModel((m) => m.raise({ id: 'a', level: 'alarm' }));
    expect(await axe(mount(AlertAnnunciator, { props: { model: active } }).element)).toHaveNoViolations();

    const resting = makeModel(() => {});
    expect(await axe(mount(AlertAnnunciator, { props: { model: resting } }).element)).toHaveNoViolations();
  });
});
