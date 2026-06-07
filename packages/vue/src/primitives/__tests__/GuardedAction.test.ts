import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { axe } from '../../test-utils/a11y';
import GuardedAction from '../GuardedAction.vue';

describe('GuardedAction', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  describe('hold mode', () => {
    it('fires confirm only after the full hold elapses (reduced-motion-safe, JS-timed)', async () => {
      const wrapper = mount(GuardedAction, { props: { holdMs: 1500 }, slots: { default: 'Arm' } });
      const btn = wrapper.get('button');

      await btn.trigger('pointerdown');
      // Completion is driven by a JS timer, not a CSS transition — so it advances
      // identically under prefers-reduced-motion.
      vi.advanceTimersByTime(1499);
      expect(wrapper.emitted('confirm')).toBeUndefined();

      vi.advanceTimersByTime(1);
      expect(wrapper.emitted('confirm')).toHaveLength(1);
    });

    it('cancels (no confirm) when released early', async () => {
      const wrapper = mount(GuardedAction, { props: { holdMs: 1500 } });
      const btn = wrapper.get('button');

      await btn.trigger('pointerdown');
      vi.advanceTimersByTime(800);
      await btn.trigger('pointerup');

      expect(wrapper.emitted('cancel')).toHaveLength(1);

      // The pending completion timer must have been cleared.
      vi.advanceTimersByTime(2000);
      expect(wrapper.emitted('confirm')).toBeUndefined();
    });

    it('a single Enter/Space tap can NEVER confirm (the whole point of the guard)', async () => {
      const wrapper = mount(GuardedAction, { props: { holdMs: 1500 } });
      const btn = wrapper.get('button');

      // keydown starts the hold; keyup (a normal quick tap) releases it.
      await btn.trigger('keydown', { key: 'Enter' });
      await btn.trigger('keyup', { key: 'Enter' });
      vi.advanceTimersByTime(5000);

      expect(wrapper.emitted('confirm')).toBeUndefined();
      expect(wrapper.emitted('cancel')).toHaveLength(1);
    });

    it('a native click never confirms in hold mode', async () => {
      const wrapper = mount(GuardedAction, { props: { holdMs: 1000 } });
      await wrapper.get('button').trigger('click');
      vi.advanceTimersByTime(2000);
      expect(wrapper.emitted('confirm')).toBeUndefined();
    });

    it('exposes a pollable progressbar to assistive tech while holding', async () => {
      const wrapper = mount(GuardedAction, { props: { holdMs: 1000 } });
      expect(wrapper.find('[role="progressbar"]').exists()).toBe(false);

      await wrapper.get('button').trigger('pointerdown');
      const bar = wrapper.find('[role="progressbar"]');
      expect(bar.exists()).toBe(true);
      expect(bar.attributes('aria-valuenow')).toBeDefined();
      expect(bar.attributes('aria-valuemax')).toBe('100');
    });
  });

  describe('double mode', () => {
    it('confirms on a second activation within the window', async () => {
      const wrapper = mount(GuardedAction, { props: { mode: 'double', doubleMs: 2000 } });
      const btn = wrapper.get('button');

      await btn.trigger('click');
      expect(wrapper.emitted('confirm')).toBeUndefined();
      expect(btn.attributes('aria-pressed')).toBe('true');

      await btn.trigger('click');
      expect(wrapper.emitted('confirm')).toHaveLength(1);
    });

    it('disarms (cancel) when the window lapses', async () => {
      const wrapper = mount(GuardedAction, { props: { mode: 'double', doubleMs: 2000 } });
      await wrapper.get('button').trigger('click');

      vi.advanceTimersByTime(2000);
      expect(wrapper.emitted('cancel')).toHaveLength(1);
      expect(wrapper.emitted('confirm')).toBeUndefined();
    });
  });

  describe('confirm mode', () => {
    it('reveals an inline Confirm / Cancel pair, and confirm fires the action', async () => {
      const wrapper = mount(GuardedAction, { props: { mode: 'confirm' }, slots: { default: 'Release' } });
      const trigger = wrapper.get('button');

      expect(wrapper.findAll('button')).toHaveLength(1);
      await trigger.trigger('click');
      expect(trigger.attributes('aria-expanded')).toBe('true');

      const buttons = wrapper.findAll('button');
      expect(buttons.length).toBe(3); // trigger + Confirm + Cancel
      const confirmBtn = buttons.find((b) => b.text() === 'Confirm')!;
      await confirmBtn.trigger('click');

      expect(wrapper.emitted('confirm')).toHaveLength(1);
    });
  });

  describe('cancelText / instructionText overrides', () => {
    it('uses cancelText on the cancel button in confirm mode', async () => {
      const wrapper = mount(GuardedAction, {
        props: { mode: 'confirm', cancelText: 'Abort' },
        slots: { default: 'Release' },
      });
      await wrapper.get('button').trigger('click');
      const buttons = wrapper.findAll('button');
      expect(buttons.some((b) => b.text() === 'Abort')).toBe(true);
      expect(buttons.some((b) => b.text() === 'Cancel')).toBe(false);
    });

    it('uses instructionText when provided instead of the mode-derived default', () => {
      const wrapper = mount(GuardedAction, {
        props: { instructionText: 'Press and hold to ARM' },
        slots: { default: 'Arm' },
      });
      const instruction = wrapper.find('.sr-only:last-of-type');
      expect(instruction.text()).toBe('Press and hold to ARM');
    });
  });

  describe('disabled / loading', () => {
    it('blocks every guard path when disabled', async () => {
      const wrapper = mount(GuardedAction, { props: { disabled: true, holdMs: 500 } });
      const btn = wrapper.get('button');
      expect(btn.attributes('disabled')).toBeDefined();

      await btn.trigger('pointerdown');
      vi.advanceTimersByTime(1000);
      expect(wrapper.emitted('confirm')).toBeUndefined();
    });
  });

  it('passes through a custom class to the control', () => {
    const wrapper = mount(GuardedAction, { props: { class: 'mt-4' } });
    expect(wrapper.get('button').classes()).toContain('mt-4');
  });

  describe('a11y', () => {
    // axe drives its own setTimeout/rAF internally — fake timers would freeze it.
    beforeEach(() => vi.useRealTimers());

    it('has no axe violations at rest', async () => {
      const wrapper = mount(GuardedAction, { slots: { default: 'Arm' } });
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });

    it('has no axe violations while armed (confirm mode revealed)', async () => {
      const wrapper = mount(GuardedAction, {
        props: { mode: 'confirm', confirmLabel: 'Confirm release' },
        slots: { default: 'Release' },
      });
      await wrapper.get('button').trigger('click');
      expect(await axe(wrapper.element)).toHaveNoViolations();
    });
  });
});
