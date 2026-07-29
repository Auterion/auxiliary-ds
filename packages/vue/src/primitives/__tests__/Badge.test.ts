import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test-utils/a11y';
import Badge from '../Badge.vue';

describe('Badge', () => {
  it('renders as a span with slotted content', () => {
    const wrapper = mount(Badge, { slots: { default: 'New' } });
    expect(wrapper.element.tagName).toBe('SPAN');
    expect(wrapper.text()).toContain('New');
  });

  it('applies the default variant classes by default', () => {
    const wrapper = mount(Badge, { slots: { default: 'Default' } });
    expect(wrapper.classes()).toContain('bg-muted');
    expect(wrapper.classes()).toContain('text-foreground');
    expect(wrapper.classes()).toContain('border-border');
  });

  it('maps each variant to its class set', () => {
    const cases: Array<[string, string[]]> = [
      ['neutral', ['bg-muted', 'text-foreground']],
      ['secondary', ['bg-card', 'text-muted-foreground']],
      ['outline', ['border', 'text-muted-foreground']],
      ['primary', ['bg-primary', 'text-primary-foreground']],
    ];
    for (const [variant, expected] of cases) {
      const wrapper = mount(Badge, {
        props: { variant: variant as 'neutral' | 'secondary' | 'outline' | 'primary' },
        slots: { default: variant },
      });
      for (const cls of expected) {
        expect(wrapper.classes()).toContain(cls);
      }
    }
  });

  it('outline variant has no background fill class', () => {
    const wrapper = mount(Badge, { props: { variant: 'outline' }, slots: { default: 'Outline' } });
    const bgClasses = wrapper.classes().filter((c) => c.startsWith('bg-'));
    expect(bgClasses).toHaveLength(0);
  });

  it('applies md sizing by default and sm sizing when size="sm"', () => {
    const md = mount(Badge, { slots: { default: 'md' } });
    expect(md.classes()).toContain('h-(--component-badge-height-md)');
    expect(md.classes()).toContain('text-xs');

    const sm = mount(Badge, { props: { size: 'sm' }, slots: { default: 'sm' } });
    expect(sm.classes()).toContain('h-(--component-badge-height-sm)');
    expect(sm.classes()).toContain('text-2xs');
  });

  it('always carries the shared base classes', () => {
    const wrapper = mount(Badge, { slots: { default: 'Base' } });
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining([
        'inline-flex',
        'items-center',
        'rounded-(--component-badge-radius)',
        'font-medium',
      ]),
    );
  });

  it('has no axe violations', async () => {
    const wrapper = mount(Badge, { props: { variant: 'primary' }, slots: { default: 'Live' } });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});
