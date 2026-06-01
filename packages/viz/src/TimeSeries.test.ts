import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import TimeSeries from './TimeSeries.vue';

const data: [number[], number[]] = [
  [0, 1, 2, 3, 4],
  [10, 12, 11, 14, 13],
];

describe('TimeSeries', () => {
  // happy-dom has no real 2D canvas, so uPlot init is skipped — the component
  // must still render its labelled container (SSR / no-canvas graceful degradation).
  it('renders a labelled container without throwing in a non-canvas env', () => {
    const w = mount(TimeSeries, { props: { data, label: 'Altitude', series: ['alt'] } });
    const root = w.get('[role="img"]');
    expect(root.attributes('aria-label')).toBe('Altitude');
    expect(root.attributes('style')).toContain('width: 360px');
  });

  it('accepts data updates without throwing (streaming via setData)', async () => {
    const w = mount(TimeSeries, { props: { data, label: 'Altitude' } });
    await w.setProps({ data: [[0, 1, 2], [9, 8, 7]] });
    expect(w.find('[role="img"]').exists()).toBe(true);
  });
});
