import { renderHook, act } from '@testing-library/react';

import {
  useFocusTrap,
  useFocusRestoration,
  useAutoFocus,
  useResponsiveFocus,
  useRovingTabIndex,
} from '@/lib/focus';

import { setupDom } from './focus/test-utils';

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const waitForUpdates = (ms: number): Promise<void> => act(() => sleep(ms));

describe('focus hooks', (): void => {
  let container: HTMLElement;
  let cleanup: () => void;

  beforeEach(() => {
    ({ container, cleanup } = setupDom());
  });

  afterEach(() => {
    cleanup();
  });

  describe('useFocusTrap', (): void => {
    it('traps focus within container and wraps on Tab', (): void => {
      const containerRef = { current: container };
      renderHook(() => useFocusTrap(true, containerRef));
      expect(document.activeElement?.id).toBe('btn1');
      const lastEl = container.querySelector('#select1') as HTMLSelectElement;
      lastEl.focus();
      act(() => {
        const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
        document.dispatchEvent(tabEvent);
      });
      expect(document.activeElement?.id).toBe('btn1');
    });

    it('handles Shift+Tab from first to last', (): void => {
      const containerRef = { current: container };
      renderHook(() => useFocusTrap(true, containerRef));
      act(() => {
        const shiftTab = new KeyboardEvent('keydown', {
          key: 'Tab',
          shiftKey: true,
          bubbles: true,
        });
        document.dispatchEvent(shiftTab);
      });
      expect(document.activeElement?.id).toBe('select1');
    });

    it('restores previous focus when deactivated', (): void => {
      const external = document.createElement('button');
      document.body.appendChild(external);
      external.focus();
      const containerRef = { current: container };
      const { rerender } = renderHook(({ active }) => useFocusTrap(active, containerRef), {
        initialProps: { active: true },
      });
      rerender({ active: false });
      expect(document.activeElement).toBe(external);
      document.body.removeChild(external);
    });
  });

  describe('useFocusRestoration', (): void => {
    it('saves and restores focus by id', (): void => {
      const target = container.querySelector('#btn2') as HTMLButtonElement;
      target.focus();
      const { result } = renderHook(() => useFocusRestoration());
      act(() => result.current.saveFocus());
      const other = container.querySelector('#btn1') as HTMLButtonElement;
      other.focus();
      act(() => result.current.restoreFocus());
      expect(document.activeElement).toBe(target);
    });

    it('handles elements without id', (): void => {
      const btn = document.createElement('button');
      container.appendChild(btn);
      btn.focus();
      const { result } = renderHook(() => useFocusRestoration());
      act(() => result.current.saveFocus());
      expect(() => act(() => result.current.restoreFocus())).not.toThrow();
      container.removeChild(btn);
    });
  });

  describe('useAutoFocus', (): void => {
    it('focuses element when condition is true', async (): Promise<void> => {
      const target = container.querySelector('#btn2') as HTMLButtonElement;
      const ref = { current: target };
      renderHook(() => useAutoFocus(true, ref, 10));
      await waitForUpdates(20);
      expect(document.activeElement).toBe(target);
    });

    it('does not focus element when condition is false', async (): Promise<void> => {
      const target = container.querySelector('#btn2') as HTMLButtonElement;
      const ref = { current: target };
      renderHook(() => useAutoFocus(false, ref, 10));
      await waitForUpdates(20);
      expect(document.activeElement).not.toBe(target);
    });
  });

  describe('useResponsiveFocus', (): void => {
    it('manages focus across breakpoint changes', (): void => {
      const target = container.querySelector('#btn1') as HTMLButtonElement;
      target.focus();
      const { rerender } = renderHook(
        ({ bp }: { bp: 'mobile' | 'tablet' | 'desktop' }) => useResponsiveFocus(bp, true),
        { initialProps: { bp: 'mobile' } }
      );
      expect(() => rerender({ bp: 'desktop' })).not.toThrow();
    });
  });

  describe('useRovingTabIndex', (): void => {
    it('sets tabIndex and focuses active item', (): void => {
      const button1 = container.querySelector('#btn1') as HTMLButtonElement;
      const button2 = container.querySelector('#btn2') as HTMLButtonElement;
      const input1 = container.querySelector('#input1') as HTMLInputElement;
      const items = [{ current: button1 }, { current: button2 }, { current: input1 }];
      const setActive = jest.fn();
      renderHook(() => useRovingTabIndex(items, 0, setActive));
      expect(button1.tabIndex).toBe(0);
      expect(button2.tabIndex).toBe(-1);
      expect(input1.tabIndex).toBe(-1);
      expect(document.activeElement).toBe(button1);
    });
  });
});
