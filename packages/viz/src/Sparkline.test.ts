import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Sparkline from './Sparkline.vue';

describe('Sparkline', () => {
  it('renders an svg with a non-empty line path', () => {
    const w = mount(Sparkline, { props: { values: [1, 4, 2, 8, 5] } });
    const path = w.get('path');
    expect(path.attributes('d')!.startsWith('M')).toBe(true);
    expect(w.get('svg').attributes('viewBox')).toBe('0 0 120 32');
  });

  it('is decorative (aria-hidden) without a label, an img with one', () => {
    const bare = mount(Sparkline, { props: { values: [1, 2, 3] } });
    expect(bare.get('svg').attributes('aria-hidden')).toBe('true');
    expect(bare.get('svg').attributes('role')).toBeUndefined();

    const labeled = mount(Sparkline, { props: { values: [1, 2, 3], label: 'Battery trend' } });
    expect(labeled.get('svg').attributes('role')).toBe('img');
    expect(labeled.get('svg').attributes('aria-label')).toBe('Battery trend');
    expect(labeled.get('svg').attributes('aria-hidden')).toBeUndefined();
  });

  it('renders an area path only when area is set', () => {
    expect(mount(Sparkline, { props: { values: [1, 2, 3] } }).findAll('path')).toHaveLength(1);
    expect(
      mount(Sparkline, { props: { values: [1, 2, 3], area: true } }).findAll('path'),
    ).toHaveLength(2);
  });
});
