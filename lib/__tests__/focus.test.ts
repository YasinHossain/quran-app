/**
 * Focus Management Tests
 * Comprehensive testing of focus utilities and accessibility features
 */
import { renderHook, act } from '@testing-library/react';
import React from 'react';

import {
  useFocusTrap,
  useFocusRestoration,
  useAutoFocus,
  useResponsiveFocus,
  useRovingTabIndex,
  getFocusableElements,
  focusVisibleClasses,
  getFocusVisibleClasses,
} from '../focus';

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

    // Mock element dimensions for JSDOM so visibility filters pass
    const elements = container.querySelectorAll('*');
    elements.forEach((el) => {
      Object.defineProperty(el, 'offsetWidth', { value: 100, configurable: true });
      Object.defineProperty(el, 'offsetHeight', { value: 20, configurable: true });
    });
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('getFocusableElements', () => {
    it('finds all focusable elements in order', () => {
      const focusable = getFocusableElements(container);

      expect(focusable).toHaveLength(5);
      expect(focusable.map((el) => el.id)).toEqual(['btn1', 'input1', 'link1', 'btn2', 'select1']);
    });

    it('excludes disabled elements', () => {
      const disabledButton = container.querySelector('#btn1') as HTMLButtonElement;
      disabledButton.disabled = true;

      const focusable = getFocusableElements(container);

      expect(focusable).toHaveLength(4);
      expect(focusable.map((el) => el.id)).not.toContain('btn1');
    });

    it('excludes hidden elements', () => {
      const hiddenInput = container.querySelector('#input1') as HTMLInputElement;
      hiddenInput.style.display = 'none';
      const focusable = getFocusableElements(container);
      expect(focusable).toHaveLength(4);
      expect(focusable.map((el) => el.id)).not.toContain('input1');
    });

    it('excludes elements with visibility hidden', () => {
      const hiddenLink = container.querySelector('#link1') as HTMLAnchorElement;
      hiddenLink.style.visibility = 'hidden';
      const focusable = getFocusableElements(container);
      expect(focusable).toHaveLength(4);
      expect(focusable.map((el) => el.id)).not.toContain('link1');
    });
  });

  describe('focus visible utilities', () => {
    it('returns base classes by default', () => {
      expect(getFocusVisibleClasses()).toBe(focusVisibleClasses.base);
    });

    it('returns specified variant classes', () => {
      expect(getFocusVisibleClasses('button')).toBe(focusVisibleClasses.button);
    });
  });

  describe('useFocusTrap', () => {
    it('traps focus within container when active and wraps on Tab', () => {
      const containerRef = { current: container };

      renderHook(() => useFocusTrap(true, containerRef));

      // First focusable element should be focused
      expect(document.activeElement?.id).toBe('btn1');

      // Focus last element, then Tab should wrap to first
      const lastEl = container.querySelector('#select1') as HTMLSelectElement;
      lastEl.focus();

      act(() => {
        const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
        document.dispatchEvent(tabEvent);
      });

      expect(document.activeElement?.id).toBe('btn1');
      expect(container.contains(document.activeElement)).toBe(true);
    });

    it('handles Shift+Tab correctly from first to last', () => {
      const containerRef = { current: container };

      renderHook(() => useFocusTrap(true, containerRef));

      // Ensure focus starts at first
      const firstEl = container.querySelector('#btn1') as HTMLButtonElement;
      firstEl.focus();

      act(() => {
        const shiftTabEvent = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true });
        document.dispatchEvent(shiftTabEvent);
      });

      // Should wrap to last element in the container
      expect((document.activeElement as HTMLElement)?.id).toBe('select1');
      expect(container.contains(document.activeElement)).toBe(true);
    });
  });

  describe('useFocusRestoration', () => {
    it('saves and restores focus by element id', () => {
      const targetButton = container.querySelector('#btn2') as HTMLButtonElement;
      targetButton.id = 'restore-target';
      targetButton.focus();

      const { result } = renderHook(() => useFocusRestoration());

      act(() => {
        result.current.saveFocus();
      });

      const otherButton = container.querySelector('#btn1') as HTMLButtonElement;
      otherButton.focus();

      act(() => {
        result.current.restoreFocus();
      });

      expect(document.activeElement).toBe(targetButton);
    });
  });

  describe('useAutoFocus', () => {
    it('auto-focuses element when condition is true with delay', async () => {
      const targetButton = container.querySelector('#btn2') as HTMLButtonElement;
      const elementRef = { current: targetButton };

      renderHook(() => useAutoFocus(true, elementRef, 10));

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
      });

      expect(document.activeElement).toBe(targetButton);
    });

    it('does not auto-focus when condition is false', async () => {
      const targetButton = container.querySelector('#btn2') as HTMLButtonElement;
      const elementRef = { current: targetButton };

      renderHook(() => useAutoFocus(false, elementRef, 10));

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 20));
      });

      expect(document.activeElement).not.toBe(targetButton);
    });
  });

  describe('useResponsiveFocus', () => {
    it('manages focus across breakpoint changes without throwing', () => {
      const targetElement = container.querySelector('#btn1') as HTMLButtonElement;
      targetElement.focus();

      const { rerender } = renderHook(
        ({ bp }: { bp: 'mobile' | 'tablet' | 'desktop' }) => useResponsiveFocus(bp, true),
        { initialProps: { bp: 'mobile' } }
      );

      expect(() => rerender({ bp: 'desktop' })).not.toThrow();
    });
  });

  describe('useRovingTabIndex', () => {
    it('sets tabIndex and focuses active item', () => {
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
  });
});

