import { renderHook, act } from '@testing-library/react';
import React from 'react';

import { useRovingTabIndex, useResponsiveFocus } from '../focus';
import { setupDom } from './focus/test-utils';

describe('focus navigation hooks', () => {
  let container: HTMLElement;
  let cleanup: () => void;

  beforeEach(() => {
    ({ container, cleanup } = setupDom());
  });

  afterEach(() => {
    cleanup();
  });

  describe('useResponsiveFocus', () => {
    it('manages focus during breakpoint changes', () => {
      const targetElement = container.querySelector('#btn1') as HTMLButtonElement;
      targetElement.focus();

      const { rerender } = renderHook(
        ({ breakpoint }: { breakpoint: 'mobile' | 'tablet' | 'desktop' }) =>
          useResponsiveFocus(breakpoint),
        { initialProps: { breakpoint: 'mobile' } }
      );

      rerender({ breakpoint: 'desktop' });

      expect(() => rerender({ breakpoint: 'tablet' })).not.toThrow();
    });
  });

  describe('useRovingTabIndex', () => {
    it('manages tabindex for roving focus', () => {
      const button1 = container.querySelector('#btn1') as HTMLButtonElement;
      const button2 = container.querySelector('#btn2') as HTMLButtonElement;
      const input1 = container.querySelector('#input1') as HTMLInputElement;

      const items = [{ current: button1 }, { current: button2 }, { current: input1 }];
      const activeIndex = 0;
      const setActiveIndex = jest.fn();

      renderHook(() => useRovingTabIndex(items, activeIndex, setActiveIndex));

      expect(button1.tabIndex).toBe(0);
      expect(button2.tabIndex).toBe(-1);
      expect(input1.tabIndex).toBe(-1);

      expect(document.activeElement).toBe(button1);
    });

    it('handles arrow key navigation', () => {
      const button1 = container.querySelector('#btn1') as HTMLButtonElement;
      const button2 = container.querySelector('#btn2') as HTMLButtonElement;

      const items = [{ current: button1 }, { current: button2 }];

      let activeIndex = 0;
      const setActiveIndex = jest.fn((newIndex) => {
        activeIndex = newIndex;
      });

      renderHook(() => useRovingTabIndex(items, activeIndex, setActiveIndex));

      act(() => {
        const arrowEvent = new KeyboardEvent('keydown', {
          key: 'ArrowDown',
          bubbles: true,
        });
        document.dispatchEvent(arrowEvent);
      });

      expect(setActiveIndex).toHaveBeenCalledWith(1);
    });

    it('handles Home and End keys', () => {
      const button1 = container.querySelector('#btn1') as HTMLButtonElement;
      const button2 = container.querySelector('#btn2') as HTMLButtonElement;
      const input1 = container.querySelector('#input1') as HTMLInputElement;

      const items = [{ current: button1 }, { current: button2 }, { current: input1 }];

      let activeIndex = 1;
      const setActiveIndex = jest.fn((newIndex) => {
        activeIndex = newIndex;
      });

      renderHook(() => useRovingTabIndex(items, activeIndex, setActiveIndex));

      act(() => {
        const homeEvent = new KeyboardEvent('keydown', {
          key: 'Home',
          bubbles: true,
        });
        document.dispatchEvent(homeEvent);
      });

      expect(setActiveIndex).toHaveBeenCalledWith(0);

      act(() => {
        const endEvent = new KeyboardEvent('keydown', {
          key: 'End',
          bubbles: true,
        });
        document.dispatchEvent(endEvent);
      });

      expect(setActiveIndex).toHaveBeenCalledWith(2);
    });

    it('wraps around at boundaries', () => {
      const button1 = container.querySelector('#btn1') as HTMLButtonElement;
      const button2 = container.querySelector('#btn2') as HTMLButtonElement;

      const items = [{ current: button1 }, { current: button2 }];

      let activeIndex = 1;
      const setActiveIndex = jest.fn((newIndex) => {
        activeIndex = newIndex;
      });

      renderHook(() => useRovingTabIndex(items, activeIndex, setActiveIndex));

      act(() => {
        const arrowEvent = new KeyboardEvent('keydown', {
          key: 'ArrowDown',
          bubbles: true,
        });
        document.dispatchEvent(arrowEvent);
      });

      expect(setActiveIndex).toHaveBeenCalledWith(0);

      activeIndex = 0;
      setActiveIndex.mockClear();

      renderHook(() => useRovingTabIndex(items, activeIndex, setActiveIndex));

      act(() => {
        const arrowEvent = new KeyboardEvent('keydown', {
          key: 'ArrowUp',
          bubbles: true,
        });
        document.dispatchEvent(arrowEvent);
      });

      expect(setActiveIndex).toHaveBeenCalledWith(1);
    });
  });
});
