import { renderHook, act } from '@testing-library/react';
import React from 'react';

import { useFocusTrap, useAutoFocus, getFocusableElements } from '../focus';
import { setupDom } from './focus/test-utils';

describe('focus trap utilities', () => {
  let container: HTMLElement;
  let cleanup: () => void;

  beforeEach(() => {
    ({ container, cleanup } = setupDom());
  });

  afterEach(() => {
    cleanup();
  });

  describe('getFocusableElements', () => {
    it('finds all focusable elements', () => {
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

  describe('useFocusTrap', () => {
    it('traps focus within container when active', () => {
      const containerRef = { current: container };

      renderHook(() => useFocusTrap(true, containerRef));

      expect(document.activeElement?.id).toBe('btn1');

      const lastButton = container.querySelector('#select1') as HTMLSelectElement;
      lastButton.focus();

      act(() => {
        const tabEvent = new KeyboardEvent('keydown', { key: 'Tab', bubbles: true });
        document.dispatchEvent(tabEvent);
      });

      expect(container.contains(document.activeElement)).toBe(true);
    });

    it('handles Shift+Tab correctly', () => {
      const containerRef = { current: container };

      renderHook(() => useFocusTrap(true, containerRef));

      const firstButton = container.querySelector('#btn1') as HTMLButtonElement;
      firstButton.focus();

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

    it('does not trap focus when inactive', () => {
      const containerRef = { current: container };

      renderHook(() => useFocusTrap(false, containerRef));

      expect(container.contains(document.activeElement)).toBe(false);
    });
  });

  describe('useAutoFocus', () => {
    it('auto-focuses element when condition is true', async () => {
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

    it('respects custom delay', async () => {
      const targetButton = container.querySelector('#btn2') as HTMLButtonElement;
      const elementRef = { current: targetButton };

      renderHook(() => useAutoFocus(true, elementRef, 50));

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 25));
      });
      expect(document.activeElement).not.toBe(targetButton);

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 30));
      });
      expect(document.activeElement).toBe(targetButton);
    });
  });

  describe('edge cases', () => {
    it('handles empty containers', () => {
      const emptyContainer = document.createElement('div');
      document.body.appendChild(emptyContainer);

      const focusable = getFocusableElements(emptyContainer);
      expect(focusable).toHaveLength(0);

      const containerRef = { current: emptyContainer };
      expect(() => {
        renderHook(() => useFocusTrap(true, containerRef));
      }).not.toThrow();

      document.body.removeChild(emptyContainer);
    });

    it('handles null container refs', () => {
      const containerRef = { current: null } as unknown as React.RefObject<HTMLElement>;

      expect(() => {
        renderHook(() => useFocusTrap(true, containerRef));
      }).not.toThrow();
    });

    it('cleans up event listeners on unmount', () => {
      const containerRef = { current: container };
      const addSpy = jest.spyOn(document, 'addEventListener');
      const removeSpy = jest.spyOn(document, 'removeEventListener');

      const { unmount } = renderHook(() => useFocusTrap(true, containerRef));

      expect(addSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

      unmount();

      expect(removeSpy).toHaveBeenCalledWith('keydown', expect.any(Function));

      addSpy.mockRestore();
      removeSpy.mockRestore();
    });
  });
});
