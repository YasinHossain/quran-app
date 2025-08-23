/**
 * Focus Management Tests
 * Comprehensive testing of focus utilities and accessibility features
 */

import { renderHook, act } from '@testing-library/react';
import {
  useFocusTrap,
  useFocusRestoration,
  useAutoFocus,
  useResponsiveFocus,
  useRovingTabIndex,
  getFocusableElements,
} from '../focus';
import React from 'react';

describe('Focus Management System', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.innerHTML = `
      <button id="btn1">Button 1</button>
      <input id="input1" type="text" placeholder="Input 1" />
      <a id="link1" href="#">Link 1</a>
      <button id="btn2">Button 2</button>
      <select id="select1">
        <option>Option 1</option>
      </select>
    `;
    document.body.appendChild(container);

    // Mock element dimensions for JSDOM
    const elements = container.querySelectorAll('*');
    elements.forEach((el) => {
      Object.defineProperty(el, 'offsetWidth', { value: 100, configurable: true });
      Object.defineProperty(el, 'offsetHeight', { value: 20, configurable: true });
    });
  });

  afterEach(() => {
    document.body.removeChild(container);
    document.body.focus();
  });

  describe('getFocusableElements', () => {
    it('should find all focusable elements', () => {
      const focusable = getFocusableElements(container);

      expect(focusable).toHaveLength(5);
      expect(focusable.map((el) => el.id)).toEqual(['btn1', 'input1', 'link1', 'btn2', 'select1']);
    });

    it('should exclude disabled elements', () => {
      const disabledButton = container.querySelector('#btn1') as HTMLButtonElement;
      disabledButton.disabled = true;

      const focusable = getFocusableElements(container);

      expect(focusable).toHaveLength(4);
      expect(focusable.map((el) => el.id)).not.toContain('btn1');
    });

    it('should exclude hidden elements', () => {
      const hiddenInput = container.querySelector('#input1') as HTMLInputElement;
      hiddenInput.style.display = 'none';

      const focusable = getFocusableElements(container);

      expect(focusable).toHaveLength(4);
      expect(focusable.map((el) => el.id)).not.toContain('input1');
    });

    it('should exclude elements with visibility hidden', () => {
      const hiddenLink = container.querySelector('#link1') as HTMLAnchorElement;
      hiddenLink.style.visibility = 'hidden';

      const focusable = getFocusableElements(container);

      expect(focusable).toHaveLength(4);
      expect(focusable.map((el) => el.id)).not.toContain('link1');
    });
  });

  describe('useFocusTrap', () => {
    it('should trap focus within container when active', async () => {
      const containerRef = { current: container };

      renderHook(() => useFocusTrap(true, containerRef));

      // First focusable element should be focused
      expect(document.activeElement?.id).toBe('btn1');

      // Tab to last element
      const lastButton = container.querySelector('#select1') as HTMLSelectElement;
      lastButton.focus();

      // Tab should wrap to first element
      act(() => {
        const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
        document.dispatchEvent(tabEvent);
      });

      // Should still be within the container
      expect(container.contains(document.activeElement)).toBe(true);
    });

    it('should handle Shift+Tab correctly', async () => {
      const containerRef = { current: container };

      renderHook(() => useFocusTrap(true, containerRef));

      const firstButton = container.querySelector('#btn1') as HTMLButtonElement;
      firstButton.focus();

      // Shift+Tab should wrap to last element
      act(() => {
        const shiftTabEvent = new KeyboardEvent('keydown', {
          key: 'Tab',
          shiftKey: true,
          bubbles: true,
        });
        document.dispatchEvent(shiftTabEvent);
      });

      expect(container.contains(document.activeElement)).toBe(true);
    });

    it('should not trap focus when inactive', () => {
      const containerRef = { current: container };

      renderHook(() => useFocusTrap(false, containerRef));

      // Should not automatically focus any element
      expect(container.contains(document.activeElement)).toBe(false);
    });

    it('should restore previous focus when deactivated', () => {
      const externalButton = document.createElement('button');
      externalButton.textContent = 'External';
      document.body.appendChild(externalButton);
      externalButton.focus();

      const containerRef = { current: container };

      const { rerender } = renderHook(({ isActive }) => useFocusTrap(isActive, containerRef), {
        initialProps: { isActive: true },
      });

      // Deactivate focus trap
      rerender({ isActive: false });

      // Should restore focus to external button
      expect(document.activeElement).toBe(externalButton);

      document.body.removeChild(externalButton);
    });
  });

  describe('useFocusRestoration', () => {
    it('should save and restore focus by element id', () => {
      const targetButton = container.querySelector('#btn2') as HTMLButtonElement;
      targetButton.focus();

      const { result } = renderHook(() => useFocusRestoration());

      act(() => {
        result.current.saveFocus();
      });

      // Focus different element
      const otherButton = container.querySelector('#btn1') as HTMLButtonElement;
      otherButton.focus();

      act(() => {
        result.current.restoreFocus();
      });

      expect(document.activeElement).toBe(targetButton);
    });

    it('should handle elements without id gracefully', () => {
      const noIdButton = document.createElement('button');
      noIdButton.textContent = 'No ID';
      container.appendChild(noIdButton);
      noIdButton.focus();

      const { result } = renderHook(() => useFocusRestoration());

      act(() => {
        result.current.saveFocus();
      });

      // Should not throw error
      expect(() => {
        act(() => {
          result.current.restoreFocus();
        });
      }).not.toThrow();

      container.removeChild(noIdButton);
    });
  });

  describe('useAutoFocus', () => {
    it('should auto-focus element when condition is true', async () => {
      const targetButton = container.querySelector('#btn2') as HTMLButtonElement;
      const elementRef = { current: targetButton };

      renderHook(() => useAutoFocus(true, elementRef, 10));

      // Wait for timeout
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
      });

      expect(document.activeElement).toBe(targetButton);
    });

    it('should not auto-focus when condition is false', async () => {
      const targetButton = container.querySelector('#btn2') as HTMLButtonElement;
      const elementRef = { current: targetButton };

      renderHook(() => useAutoFocus(false, elementRef, 10));

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
      });

      expect(document.activeElement).not.toBe(targetButton);
    });

    it('should respect custom delay', async () => {
      const targetButton = container.querySelector('#btn2') as HTMLButtonElement;
      const elementRef = { current: targetButton };

      renderHook(() => useAutoFocus(true, elementRef, 50));

      // Check before delay
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 25));
      });
      expect(document.activeElement).not.toBe(targetButton);

      // Check after delay
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 30));
      });
      expect(document.activeElement).toBe(targetButton);
    });
  });

  describe('useResponsiveFocus', () => {
    it('should manage focus during breakpoint changes', () => {
      const targetElement = container.querySelector('#btn1') as HTMLButtonElement;
      targetElement.focus();

      const { rerender } = renderHook(
        ({ breakpoint }: { breakpoint: 'mobile' | 'tablet' | 'desktop' }) =>
          useResponsiveFocus(breakpoint),
        { initialProps: { breakpoint: 'mobile' } }
      );

      // Change breakpoint
      rerender({ breakpoint: 'desktop' });

      // Should handle breakpoint change gracefully
      expect(() => rerender({ breakpoint: 'tablet' })).not.toThrow();
    });
  });

  describe('useRovingTabIndex', () => {
    it('should manage tabindex for roving focus', () => {
      const button1 = container.querySelector('#btn1') as HTMLButtonElement;
      const button2 = container.querySelector('#btn2') as HTMLButtonElement;
      const input1 = container.querySelector('#input1') as HTMLInputElement;

      const items = [{ current: button1 }, { current: button2 }, { current: input1 }];

      const activeIndex = 0;
      const setActiveIndex = jest.fn();

      renderHook(() => useRovingTabIndex(items, activeIndex, setActiveIndex));

      // First item should have tabindex 0, others -1
      expect(button1.tabIndex).toBe(0);
      expect(button2.tabIndex).toBe(-1);
      expect(input1.tabIndex).toBe(-1);

      // First item should be focused
      expect(document.activeElement).toBe(button1);
    });

    it('should handle arrow key navigation', () => {
      const button1 = container.querySelector('#btn1') as HTMLButtonElement;
      const button2 = container.querySelector('#btn2') as HTMLButtonElement;

      const items = [{ current: button1 }, { current: button2 }];

      let activeIndex = 0;
      const setActiveIndex = jest.fn((newIndex) => {
        activeIndex = newIndex;
      });

      renderHook(() => useRovingTabIndex(items, activeIndex, setActiveIndex));

      // Simulate ArrowDown
      act(() => {
        const arrowEvent = new KeyboardEvent('keydown', {
          key: 'ArrowDown',
          bubbles: true,
        });
        document.dispatchEvent(arrowEvent);
      });

      expect(setActiveIndex).toHaveBeenCalledWith(1);
    });

    it('should handle Home and End keys', () => {
      const button1 = container.querySelector('#btn1') as HTMLButtonElement;
      const button2 = container.querySelector('#btn2') as HTMLButtonElement;
      const input1 = container.querySelector('#input1') as HTMLInputElement;

      const items = [{ current: button1 }, { current: button2 }, { current: input1 }];

      let activeIndex = 1;
      const setActiveIndex = jest.fn((newIndex) => {
        activeIndex = newIndex;
      });

      renderHook(() => useRovingTabIndex(items, activeIndex, setActiveIndex));

      // Test Home key
      act(() => {
        const homeEvent = new KeyboardEvent('keydown', {
          key: 'Home',
          bubbles: true,
        });
        document.dispatchEvent(homeEvent);
      });

      expect(setActiveIndex).toHaveBeenCalledWith(0);

      // Test End key
      act(() => {
        const endEvent = new KeyboardEvent('keydown', {
          key: 'End',
          bubbles: true,
        });
        document.dispatchEvent(endEvent);
      });

      expect(setActiveIndex).toHaveBeenCalledWith(2);
    });

    it('should wrap around at boundaries', () => {
      const button1 = container.querySelector('#btn1') as HTMLButtonElement;
      const button2 = container.querySelector('#btn2') as HTMLButtonElement;

      const items = [{ current: button1 }, { current: button2 }];

      let activeIndex = 1; // Last item
      const setActiveIndex = jest.fn((newIndex) => {
        activeIndex = newIndex;
      });

      renderHook(() => useRovingTabIndex(items, activeIndex, setActiveIndex));

      // ArrowDown from last item should wrap to first
      act(() => {
        const arrowEvent = new KeyboardEvent('keydown', {
          key: 'ArrowDown',
          bubbles: true,
        });
        document.dispatchEvent(arrowEvent);
      });

      expect(setActiveIndex).toHaveBeenCalledWith(0);

      // Reset to first item
      activeIndex = 0;
      setActiveIndex.mockClear();

      // Re-render hook with new activeIndex
      const { rerender } = renderHook(() => useRovingTabIndex(items, activeIndex, setActiveIndex));
      
      // ArrowUp from first item should wrap to last
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

  describe('Edge Cases', () => {
    it('should handle empty containers', () => {
      const emptyContainer = document.createElement('div');
      document.body.appendChild(emptyContainer);

      const focusable = getFocusableElements(emptyContainer);
      expect(focusable).toHaveLength(0);

      // Focus trap should handle empty container gracefully
      const containerRef = { current: emptyContainer };
      expect(() => {
        renderHook(() => useFocusTrap(true, containerRef));
      }).not.toThrow();

      document.body.removeChild(emptyContainer);
    });

    it('should handle null container refs', () => {
      const containerRef = { current: null } as unknown as React.RefObject<HTMLElement>;

      expect(() => {
        renderHook(() => useFocusTrap(true, containerRef));
      }).not.toThrow();
    });

    it('should cleanup event listeners on unmount', () => {
      const containerRef = { current: container };
      const addEventListenerSpy = jest.spyOn(document, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(document, 'removeEventListener');

      const { unmount } = renderHook(() => useFocusTrap(true, containerRef));

      expect(addEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

      addEventListenerSpy.mockRestore();
      removeEventListenerSpy.mockRestore();
    });
  });
});
