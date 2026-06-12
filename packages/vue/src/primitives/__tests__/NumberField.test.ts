import { describe, it, expect } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
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

  // Regression: these props are consumed by the stepper buttons, but used to
  // survive the delegated-props destructure and fall through NumberFieldRoot
  // as junk DOM attributes (decrementlabel="…").
  it('applies decrementLabel/incrementLabel as button names without leaking DOM attrs', () => {
    const wrapper = mount(NumberField, {
      props: { modelValue: 5, decrementLabel: 'Minus', incrementLabel: 'Plus' },
    });
    expect(wrapper.find('[aria-label="Minus"]').exists()).toBe(true);
    expect(wrapper.find('[aria-label="Plus"]').exists()).toBe(true);
    const root = wrapper.get('[role="group"]');
    expect(root.attributes('decrementlabel')).toBeUndefined();
    expect(root.attributes('incrementlabel')).toBeUndefined();
  });

  it('reflects the modelValue on the spinbutton', () => {
    const wrapper = mount(NumberField, { props: { modelValue: 408 } });
    const spin = wrapper.get('[role="spinbutton"]');
    expect(spin.attributes('aria-valuenow')).toBe('408');
    expect((spin.element as HTMLInputElement).value).toContain('408');
  });

  // Reka's steppers increment on pointerdown and start a press-and-hold repeat
  // timer whose *release* listener is on `window`. Dispatch a window pointerup
  // after each press to clear that timer — otherwise it fires after the test
  // tears down happy-dom and throws "window is not defined".
  const press = async (wrapper: VueWrapper, label: 'Increase' | 'Decrease') => {
    await wrapper.get(`[aria-label="${label}"]`).trigger('pointerdown');
    window.dispatchEvent(new Event('pointerup'));
    await nextTick();
  };

  it('increments and decrements the bound value via the steppers', async () => {
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

    await press(wrapper, 'Increase');
    expect(spin().attributes('aria-valuenow')).toBe('6');

    await press(wrapper, 'Decrease');
    expect(spin().attributes('aria-valuenow')).toBe('5');

    wrapper.unmount();
  });

  it('works uncontrolled via defaultValue (steppers update the internal value)', async () => {
    const wrapper = mount(NumberField, { props: { defaultValue: 5 }, attachTo: document.body });
    await nextTick();
    await press(wrapper, 'Increase');
    expect(wrapper.get('[role="spinbutton"]').attributes('aria-valuenow')).toBe('6');
    wrapper.unmount();
  });

  it('clamps stepping at the configured bounds', async () => {
    const wrapper = mount(NumberField, { props: { defaultValue: 10, min: 0, max: 10 }, attachTo: document.body });
    await nextTick();
    await press(wrapper, 'Increase');
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
      ['sm', 'h-[max(var(--control-height-sm),var(--target-floor))]'],
      ['md', 'h-[max(var(--control-height-md),var(--target-floor))]'],
      ['lg', 'h-[max(var(--control-height-lg),var(--target-floor))]'],
    ];
    for (const [size, cls] of cases) {
      const wrapper = mount(NumberField, { props: { size } });
      expect(wrapper.classes()).toContain(cls);
    }
    expect(mount(NumberField).classes()).toContain('h-[max(var(--control-height-md),var(--target-floor))]');
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

  it('accepts custom decrementLabel / incrementLabel for operational context', () => {
    const wrapper = mount(NumberField, { props: { decrementLabel: 'Minus', incrementLabel: 'Plus' } });
    expect(wrapper.find('[aria-label="Minus"]').exists()).toBe(true);
    expect(wrapper.find('[aria-label="Plus"]').exists()).toBe(true);
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
