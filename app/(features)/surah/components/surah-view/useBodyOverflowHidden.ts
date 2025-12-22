'use client';

import { useEffect, useState } from 'react';

/**
 * Detects if the device is a touch-primary mobile device.
 * This matches the CSS media query: @media (pointer: coarse) and (max-width: 767px)
 * Used to determine scroll behavior - touch mobiles use body scrolling.
 */
const useTouchMobile = (): boolean => {
  const [isTouchMobile, setIsTouchMobile] = useState(false);

  useEffect(() => {
    // Match CSS media query: (pointer: coarse) and (max-width: 767px)
    const mediaQuery = window.matchMedia('(pointer: coarse) and (max-width: 767px)');

    const handleChange = (e: MediaQueryListEvent | MediaQueryList): void => {
      setIsTouchMobile(e.matches);
    };

    // Initial check
    handleChange(mediaQuery);

    // Listen for changes (resize, orientation change)
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isTouchMobile;
};

/**
 * Hook to manage body overflow behavior.
 * 
 * On DESKTOP: Sets body overflow to hidden so scrolling happens in the container.
 * This allows the scrollbar to appear within the content area (below the header).
 * 
 * On TOUCH MOBILE: Allows body scrolling so Chrome's address bar auto-hides.
 * This mimics quran.com's approach where the entire document scrolls.
 */
export const useBodyOverflowHidden = (): { isTouchMobile: boolean } => {
  const isTouchMobile = useTouchMobile();

  useEffect(() => {
    // On touch mobile, we want body to scroll (for Chrome address bar auto-hide)
    // On desktop, we hide body overflow so container handles scrolling
    if (isTouchMobile) {
      // Ensure body can scroll on touch mobile
      const originalOverflow = document.body.style.overflow;
      const originalOverflowX = document.body.style.overflowX;
      const originalOverflowY = document.body.style.overflowY;

      document.body.style.overflow = '';
      document.body.style.overflowX = 'hidden';
      document.body.style.overflowY = 'auto';

      return () => {
        // Restore original overflow settings
        document.body.style.overflow = originalOverflow;
        document.body.style.overflowX = originalOverflowX;
        document.body.style.overflowY = originalOverflowY;
      };
    }

    // Desktop behavior: hide body overflow
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = originalOverflow;
      }
    };
  }, [isTouchMobile]);

  return { isTouchMobile };
};
