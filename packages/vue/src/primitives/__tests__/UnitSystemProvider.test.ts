import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { h } from 'vue';
import { axe } from '../../test-utils/a11y';
import UnitSystemProvider from '../UnitSystemProvider.vue';
import TelemetryValue from '../TelemetryValue.vue';

/** Mount a TelemetryValue inside a provider with the given provider props. */
function withProvider(providerProps: Record<string, unknown>, tvProps: Record<string, unknown>) {
  return mount(UnitSystemProvider, {
    props: providerProps,
    slots: { default: () => h(TelemetryValue, tvProps) },
  });
}

describe('UnitSystemProvider', () => {
  it('renders only its slot (no wrapper element)', () => {
    const wrapper = mount(UnitSystemProvider, { slots: { default: 'hi' } });
    expect(wrapper.html()).toBe('hi');
  });

  it('drives descendant TelemetryValue conversion to the deployment system', () => {
    const metric = withProvider({ system: 'metric' }, { value: 408, quantity: 'altitude', label: 'Alt' });
    expect(metric.text()).toContain('408');
    expect(metric.text()).toContain('m');

    const imperial = withProvider({ system: 'imperial' }, { value: 408, quantity: 'altitude', label: 'Alt' });
    expect(imperial.text()).toContain('1339');
    expect(imperial.text()).toContain('ft');
  });

  it('applies the deployment locale to numeric formatting', () => {
    const wrapper = withProvider({ system: 'metric', locale: 'de-DE' }, { value: 1234.5, precision: 1 });
    expect(wrapper.text()).toContain('1.234,5');
  });

  it('lets a per-component system prop override the provider', () => {
    const wrapper = withProvider({ system: 'metric' }, {
      value: 408,
      quantity: 'altitude',
      system: 'imperial',
    });
    expect(wrapper.text()).toContain('1339');
    expect(wrapper.text()).toContain('ft');
  });

  it('has no axe violations', async () => {
    const wrapper = withProvider(
      { system: 'imperial' },
      { value: 408, quantity: 'altitude', label: 'Altitude' },
    );
    expect(await axe(wrapper.element)).toHaveNoViolations();
  });
});
