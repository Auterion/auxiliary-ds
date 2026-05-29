import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import { axe } from '../../test-utils/a11y';
import Table from '../Table/Table.vue';
import TableHeader from '../Table/TableHeader.vue';
import TableBody from '../Table/TableBody.vue';
import TableRow from '../Table/TableRow.vue';
import TableHead from '../Table/TableHead.vue';
import TableCell from '../Table/TableCell.vue';
import TableCaption from '../Table/TableCaption.vue';

function harness(headerProps: Record<string, unknown> = {}) {
  return defineComponent({
    setup() {
      return () =>
        h(Table, () => [
          h(TableCaption, () => 'Fleet status'),
          h(TableHeader, headerProps, () =>
            h(TableRow, () => [h(TableHead, () => 'Vehicle'), h(TableHead, () => 'Status')]),
          ),
          h(TableBody, () => [
            h(TableRow, () => [h(TableCell, () => 'MSN-204'), h(TableCell, () => 'Nominal')]),
            h(TableRow, () => [h(TableCell, () => 'MSN-118'), h(TableCell, () => 'Caution')]),
          ]),
        ]);
    },
  });
}

describe('Table', () => {
  it('renders a semantic table inside a scroll container', () => {
    const wrapper = mount(harness());
    expect(wrapper.find('div > table').exists()).toBe(true);
    expect(wrapper.findAll('thead')).toHaveLength(1);
    expect(wrapper.findAll('tbody')).toHaveLength(1);
    expect(wrapper.find('caption').text()).toBe('Fleet status');
  });

  it('renders header cells as <th scope="col"> and body cells as <td>', () => {
    const wrapper = mount(harness());
    const heads = wrapper.findAll('th');
    expect(heads).toHaveLength(2);
    heads.forEach((h) => expect(h.attributes('scope')).toBe('col'));
    expect(wrapper.findAll('tbody td')).toHaveLength(4);
  });

  it('allows the header scope to be overridden (e.g. row headers)', () => {
    const wrapper = mount(
      defineComponent({
        setup: () => () =>
          h(Table, () => h(TableBody, () => h(TableRow, () => h(TableHead, { scope: 'row' }, () => 'r')))),
      }),
    );
    expect(wrapper.find('th').attributes('scope')).toBe('row');
  });

  it('makes the header sticky when TableHeader has the sticky prop', () => {
    const plain = mount(harness());
    expect(plain.find('thead').classes().join(' ')).not.toContain('sticky');

    const sticky = mount(harness({ sticky: true }));
    // the sticky variant targets descendant th via an arbitrary-variant class
    expect(sticky.find('thead').classes().some((c) => c.includes('sticky'))).toBe(true);
  });

  it('merges a consumer class onto the scroll container', () => {
    const wrapper = mount(
      defineComponent({
        setup: () => () => h(Table, { class: 'max-h-96' }, () => h(TableBody, () => h(TableRow, () => h(TableCell, () => 'x')))),
      }),
    );
    expect(wrapper.find('div').classes()).toContain('max-h-96');
  });

  it('has no axe violations for a captioned, header-scoped table', async () => {
    const wrapper = mount(harness(), { attachTo: document.body });
    const results = await axe(wrapper.element);
    expect(results).toHaveNoViolations();
    wrapper.unmount();
  });
});
