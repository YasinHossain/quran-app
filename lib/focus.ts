/**
 * Focus Management Utilities
 * Enhanced focus management for responsive layouts and accessibility
 */

import React from 'react';

/**
 * Get all focusable elements within a container
 */
export const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
  const focusableSelectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ].join(',');

  return Array.from(container.querySelectorAll(focusableSelectors)).filter((element) => {
    const el = element as HTMLElement;
    const computedStyle = window.getComputedStyle(el);
    return (
      el.offsetWidth > 0 &&
      el.offsetHeight > 0 &&
      !el.hidden &&
      computedStyle.visibility !== 'hidden' &&
      computedStyle.display !== 'none'
    );
  }) as HTMLElement[];
};

/**
 * Focus trap hook for modals and drawers
 */
export const useFocusTrap = (isActive: boolean, containerRef: React.RefObject<HTMLElement>) => {
  const previousActiveElement = React.useRef<HTMLElement | null>(null);

  React.useEffect(() => {
    if (!isActive || !containerRef.current) return;

    // Store the previously focused element
    previousActiveElement.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    const focusableElements = getFocusableElements(container);

    if (focusableElements.length === 0) return;

    // Focus the first focusable element
    focusableElements[0].focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      if (focusableElements.length === 1) {
        event.preventDefault();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, containerRef]);

  // Restore focus when trap is deactivated
  React.useEffect(() => {
    if (!isActive && previousActiveElement.current) {
      previousActiveElement.current.focus();
      previousActiveElement.current = null;
    }
  }, [isActive]);
};

/**
 * Focus restoration hook for responsive layout changes
 */
export const useFocusRestoration = () => {
  const savedFocus = React.useRef<string | null>(null);

  const saveFocus = React.useCallback(() => {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement.id) {
      savedFocus.current = activeElement.id;
    }
  }, []);

  const restoreFocus = React.useCallback(() => {
    if (savedFocus.current) {
      const element = document.getElementById(savedFocus.current);
      if (element) {
        element.focus();
      }
      savedFocus.current = null;
    }
  }, []);

  return {
    saveFocus,
    restoreFocus,
  };
};

/**
 * Auto-focus hook for responsive components
 */
export const useAutoFocus = (
  shouldFocus: boolean,
  elementRef: React.RefObject<HTMLElement>,
  delay = 100
) => {
  React.useEffect(() => {
    if (!shouldFocus || !elementRef.current) return;

    const timeoutId = setTimeout(() => {
      elementRef.current?.focus();
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [shouldFocus, elementRef, delay]);
};

/**
 * Focus management for responsive navigation
 */
export const useResponsiveFocus = (breakpoint: 'mobile' | 'tablet' | 'desktop', enabled = true) => {
  const focusRestoration = useFocusRestoration();

  React.useEffect(() => {
    if (!enabled) return;

    // Save focus before layout change
    focusRestoration.saveFocus();

    // Small delay to allow DOM to update
    const timeoutId = setTimeout(() => {
      focusRestoration.restoreFocus();
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [breakpoint, focusRestoration, enabled]);

  return enabled ? focusRestoration : { saveFocus: () => {}, restoreFocus: () => {} };
};

/**
 * Roving tabindex for component collections
 */
export const useRovingTabIndex = (
  items: React.RefObject<HTMLElement>[],
  activeIndex: number,
  onActiveIndexChange: (index: number) => void
) => {
  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
        return;
      }

      event.preventDefault();

      let newIndex = activeIndex;

      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          newIndex = activeIndex > 0 ? activeIndex - 1 : items.length - 1;
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          newIndex = activeIndex < items.length - 1 ? activeIndex + 1 : 0;
          break;
        case 'Home':
          newIndex = 0;
          break;
        case 'End':
          newIndex = items.length - 1;
          break;
      }

      onActiveIndexChange(newIndex);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, items.length, onActiveIndexChange]);

  // Update tabindex and focus
  React.useEffect(() => {
    items.forEach((itemRef, index) => {
      if (itemRef.current) {
        itemRef.current.tabIndex = index === activeIndex ? 0 : -1;
        if (index === activeIndex) {
          itemRef.current.focus();
        }
      }
    });
  }, [activeIndex, items]);
};

/**
 * Focus visible utilities
 */
export const focusVisibleClasses = {
  // Basic focus-visible styles
  base: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2',

  // Variant styles
  button:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',
  input:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:border-accent',
  card: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background',

  // Dark mode variants
  dark: 'dark:focus-visible:ring-offset-background',

  // Size variants
  small: 'focus-visible:ring-1 focus-visible:ring-offset-1',
  large: 'focus-visible:ring-4 focus-visible:ring-offset-4',
} as const;

/**
 * Utility to get focus-visible classes for a component
 */
export const getFocusVisibleClasses = (
  focusStyle: keyof typeof focusVisibleClasses = 'base'
): string => {
  return focusVisibleClasses[focusStyle];
};
