import { renderHook, act } from '@testing-library/react';
import React from 'react';

import { useFocusTrap, useFocusRestoration } from '../focus';
import { setupDom } from './focus/test-utils';

describe('focus restoration utilities', () => {
  let container: HTMLElement;
  let cleanup: () => void;

  beforeEach(() => {
    ({ container, cleanup } = setupDom());
  });

  afterEach(() => {
    cleanup();
  });

  describe('useFocusTrap', () => {
    it('restores previous focus when deactivated', () => {
      const externalButton = document.createElement('button');
      externalButton.textContent = 'External';
      document.body.appendChild(externalButton);
      externalButton.focus();

      const containerRef = { current: container };

      const { rerender } = renderHook(({ isActive }) => useFocusTrap(isActive, containerRef), {
        initialProps: { isActive: true },
      });

      rerender({ isActive: false });

      expect(document.activeElement).toBe(externalButton);

      document.body.removeChild(externalButton);
    });
  });

  describe('useFocusRestoration', () => {
    it('saves and restores focus by element id', () => {
      const targetButton = container.querySelector('#btn2') as HTMLButtonElement;
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

    it('handles elements without id gracefully', () => {
      const noIdButton = document.createElement('button');
      noIdButton.textContent = 'No ID';
      container.appendChild(noIdButton);
      noIdButton.focus();

      const { result } = renderHook(() => useFocusRestoration());

      act(() => {
        result.current.saveFocus();
      });

      expect(() => {
        act(() => {
          result.current.restoreFocus();
        });
      }).not.toThrow();

      container.removeChild(noIdButton);
    });
  });
});
