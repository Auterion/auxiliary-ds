import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test-utils/a11y';
import Card from '../Card/Card.vue';
import CardHeader from '../Card/CardHeader.vue';
import CardTitle from '../Card/CardTitle.vue';
import CardDescription from '../Card/CardDescription.vue';
import CardContent from '../Card/CardContent.vue';
import CardFooter from '../Card/CardFooter.vue';

describe('Card', () => {
  it('renders a surface div with the card token classes and slotted content', () => {
    const wrapper = mount(Card, { slots: { default: 'card body' } });
    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.text()).toContain('card body');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['rounded-md', 'border', 'border-border', 'bg-card', 'text-card-foreground']),
    );
  });

  it('CardHeader stacks content with vertical padding', () => {
    const wrapper = mount(CardHeader, { slots: { default: 'header' } });
    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.text()).toContain('header');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['flex', 'flex-col', 'gap-1', 'px-5', 'pt-5']),
    );
  });

  it('CardTitle renders an h3 heading with its slot', () => {
    const wrapper = mount(CardTitle, { slots: { default: 'My Title' } });
    expect(wrapper.element.tagName).toBe('H3');
    expect(wrapper.text()).toBe('My Title');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['text-base', 'font-medium', 'leading-tight']),
    );
  });

  it('CardDescription renders muted paragraph text', () => {
    const wrapper = mount(CardDescription, { slots: { default: 'desc' } });
    expect(wrapper.element.tagName).toBe('P');
    expect(wrapper.text()).toBe('desc');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['text-sm', 'text-muted-foreground']),
    );
  });

  it('CardContent applies body padding around its slot', () => {
    const wrapper = mount(CardContent, { slots: { default: 'content' } });
    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.text()).toContain('content');
    expect(wrapper.classes()).toEqual(expect.arrayContaining(['px-5', 'py-4']));
  });

  it('CardFooter is a top-bordered flex row', () => {
    const wrapper = mount(CardFooter, { slots: { default: 'footer' } });
    expect(wrapper.element.tagName).toBe('DIV');
    expect(wrapper.text()).toContain('footer');
    expect(wrapper.classes()).toEqual(
      expect.arrayContaining(['flex', 'items-center', 'gap-2', 'border-t', 'border-border', 'px-5', 'py-3']),
    );
  });

  it('composes the subcomponents into a complete card', () => {
    const wrapper = mount(Card, {
      slots: {
        default: `
          <div>
            <span class="hdr">Engine Status</span>
            <span class="desc">Live telemetry</span>
            <span class="body">All systems nominal</span>
            <span class="ftr">Acknowledge</span>
          </div>
        `,
      },
    });
    expect(wrapper.find('.hdr').text()).toBe('Engine Status');
    expect(wrapper.find('.desc').text()).toBe('Live telemetry');
    expect(wrapper.find('.body').text()).toBe('All systems nominal');
    expect(wrapper.find('.ftr').text()).toBe('Acknowledge');
  });

  it('has no axe violations for a fully composed card', async () => {
    const wrapper = mount(Card, {
      slots: {
        default: `
          <div class="flex flex-col gap-1 px-5 pt-5">
            <h3 class="text-base font-medium leading-tight">Engine Status</h3>
            <p class="text-sm text-muted-foreground">Live telemetry</p>
          </div>
          <div class="px-5 py-4">All systems nominal</div>
        `,
      },
    });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
  });
});
