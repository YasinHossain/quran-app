import React from 'react';

import { getFocusableElements } from './focusable';

type FocusHandlers = { saveFocus: () => void; restoreFocus: () => void };

export const useFocusTrap = (
  isActive: boolean,
  containerRef: React.RefObject<HTMLElement>
): void => {
  const prev = React.useRef<HTMLElement | null>(null);
  React.useEffect(() => {
    if (!isActive || !containerRef.current) return;
    prev.current = document.activeElement as HTMLElement;
    const focusables = getFocusableElements(containerRef.current);
    if (!focusables.length) return;
    focusables[0].focus();
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key !== 'Tab') return;
      if (focusables.length === 1) {
        e.preventDefault();
        return;
      }
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isActive, containerRef]);
  React.useEffect(() => {
    if (!isActive && prev.current) {
      prev.current.focus();
      prev.current = null;
    }
  }, [isActive]);
};

export const useFocusRestoration = (): FocusHandlers => {
  const saved = React.useRef<string | null>(null);
  const saveFocus = React.useCallback((): void => {
    const el = document.activeElement as HTMLElement;
    if (el?.id) saved.current = el.id;
  }, []);
  const restoreFocus = React.useCallback((): void => {
    if (saved.current) {
      document.getElementById(saved.current)?.focus();
      saved.current = null;
    }
  }, []);
  return { saveFocus, restoreFocus };
};

export const useAutoFocus = (
  shouldFocus: boolean,
  ref: React.RefObject<HTMLElement>,
  delay = 100
): void => {
  React.useEffect(() => {
    if (!shouldFocus || !ref.current) return;
    const t = setTimeout(() => ref.current?.focus(), delay);
    return () => clearTimeout(t);
  }, [shouldFocus, ref, delay]);
};

export const useResponsiveFocus = (
  breakpoint: 'mobile' | 'tablet' | 'desktop',
  enabled = true
): FocusHandlers => {
  const focus = useFocusRestoration();
  React.useEffect(() => {
    if (!enabled) return;
    focus.saveFocus();
    const t = setTimeout(() => focus.restoreFocus(), 150);
    return () => clearTimeout(t);
  }, [breakpoint, focus, enabled]);
  return enabled ? focus : { saveFocus() {}, restoreFocus() {} };
};

export const useRovingTabIndex = (
  items: React.RefObject<HTMLElement>[],
  activeIndex: number,
  onActiveIndexChange: (index: number) => void
): void => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key))
        return;
      e.preventDefault();
      let idx = activeIndex;
      switch (e.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          idx = activeIndex > 0 ? activeIndex - 1 : items.length - 1;
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          idx = activeIndex < items.length - 1 ? activeIndex + 1 : 0;
          break;
        case 'Home':
          idx = 0;
          break;
        case 'End':
          idx = items.length - 1;
          break;
      }
      onActiveIndexChange(idx);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, items.length, onActiveIndexChange]);
  React.useEffect(() => {
    items.forEach((ref, i) => {
      if (ref.current) {
        ref.current.tabIndex = i === activeIndex ? 0 : -1;
        if (i === activeIndex) ref.current.focus();
      }
    });
  }, [activeIndex, items]);
};
