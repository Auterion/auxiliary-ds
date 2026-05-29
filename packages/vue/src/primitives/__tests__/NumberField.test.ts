import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h, nextTick, ref } from 'vue';
import { axe } from '../../test-utils/a11y';
import NumberField from '../NumberField.vue';

describe('NumberField', () => {
  it('renders a spinbutton input flanked by labelled decrement/increment buttons', () => {
    const wrapper = mount(NumberField, { props: { modelValue: 5 } });
    expect(wrapper.find('[role="spinbutton"]').exists()).toBe(true);
    expect(wrapper.find('[aria-label="Decrease"]').exists()).toBe(true);
    expect(wrapper.find('[aria-label="Increase"]').exists()).toBe(true);
  });

  it('reflects the modelValue on the spinbutton', () => {
    const wrapper = mount(NumberField, { props: { modelValue: 408 } });
    const spin = wrapper.get('[role="spinbutton"]');
    expect(spin.attributes('aria-valuenow')).toBe('408');
    expect((spin.element as HTMLInputElement).value).toContain('408');
  });

  it('increments and decrements the bound value when the steppers are clicked', async () => {
    const Host = defineComponent({
      setup() {
        const value = ref(5);
        return () =>
          h(NumberField, {
            modelValue: value.value,
            min: 0,
            max: 10,
            'onUpdate:modelValue': (n: number) => (value.value = n),
          });
      },
    });
    const wrapper = mount(Host, { attachTo: document.body });
    await nextTick();
    const spin = () => wrapper.get('[role="spinbutton"]');

    await wrapper.get('[aria-label="Increase"]').trigger('pointerdown');
    await wrapper.get('[aria-label="Increase"]').trigger('click');
    await nextTick();
    expect(spin().attributes('aria-valuenow')).toBe('6');

    await wrapper.get('[aria-label="Decrease"]').trigger('pointerdown');
    await wrapper.get('[aria-label="Decrease"]').trigger('click');
    await nextTick();
    expect(spin().attributes('aria-valuenow')).toBe('5');

    wrapper.unmount();
  });

  it('works uncontrolled via defaultValue (steppers update the internal value)', async () => {
    const wrapper = mount(NumberField, { props: { defaultValue: 5 }, attachTo: document.body });
    await nextTick();
    await wrapper.get('[aria-label="Increase"]').trigger('pointerdown');
    await wrapper.get('[aria-label="Increase"]').trigger('click');
    await nextTick();
    expect(wrapper.get('[role="spinbutton"]').attributes('aria-valuenow')).toBe('6');
    wrapper.unmount();
  });

  it('clamps stepping at the configured bounds', async () => {
    const wrapper = mount(NumberField, { props: { defaultValue: 10, min: 0, max: 10 }, attachTo: document.body });
    await nextTick();
    await wrapper.get('[aria-label="Increase"]').trigger('pointerdown');
    await wrapper.get('[aria-label="Increase"]').trigger('click');
    await nextTick();
    // already at max — stays at 10
    expect(wrapper.get('[role="spinbutton"]').attributes('aria-valuenow')).toBe('10');
    wrapper.unmount();
  });

  it('exposes min/max on the spinbutton when bounded', () => {
    const wrapper = mount(NumberField, { props: { modelValue: 5, min: 0, max: 10 } });
    const spin = wrapper.get('[role="spinbutton"]');
    expect(spin.attributes('aria-valuemin')).toBe('0');
    expect(spin.attributes('aria-valuemax')).toBe('10');
  });

  it('maps each size prop to its recipe height class (defaulting to md)', () => {
    const cases: Array<['sm' | 'md' | 'lg', string]> = [
      ['sm', 'h-8'],
      ['md', 'h-9'],
      ['lg', 'h-10'],
    ];
    for (const [size, cls] of cases) {
      const wrapper = mount(NumberField, { props: { size } });
      expect(wrapper.classes()).toContain(cls);
    }
    expect(mount(NumberField).classes()).toContain('h-9');
  });

  it('sets aria-invalid on the input and a destructive border on the root when invalid', () => {
    const wrapper = mount(NumberField, { props: { invalid: true } });
    expect(wrapper.get('[role="spinbutton"]').attributes('aria-invalid')).toBe('true');
    expect(wrapper.classes()).toContain('border-destructive');
    // `invalid` is consumed, not leaked to the root element
    expect(wrapper.attributes('invalid')).toBeUndefined();
  });

  it('renders the unit as a decorative suffix', () => {
    const wrapper = mount(NumberField, { props: { modelValue: 12, unit: 'm' } });
    const unit = wrapper.find('span[aria-hidden="true"]');
    expect(unit.exists()).toBe(true);
    expect(unit.text()).toBe('m');
  });

  it('disables the input when disabled', () => {
    const wrapper = mount(NumberField, { props: { disabled: true } });
    expect(wrapper.get('[role="spinbutton"]').attributes('disabled')).toBeDefined();
  });

  it('has no axe violations when associated with a label', async () => {
    const wrapper = mount(NumberField, {
      props: { id: 'altitude', modelValue: 408, unit: 'm' },
      attachTo: document.body,
    });
    const label = document.createElement('label');
    label.setAttribute('for', 'altitude');
    label.textContent = 'Altitude';
    wrapper.element.parentNode?.insertBefore(label, wrapper.element);

    const results = await axe(label.parentElement as HTMLElement);
    expect(results).toHaveNoViolations();

    wrapper.unmount();
    label.remove();
  });
});
