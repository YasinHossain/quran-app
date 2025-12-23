'use client';

import { useEffect } from 'react';

/**
 * Hook to hide body overflow, ensuring scrolling happens in a designated container.
 * This prevents the entire page from scrolling and allows for controlled scroll areas.
 */
export const useBodyOverflowHidden = (): void => {
  useEffect(() => {
    // On touch devices, we want to allow body scrolling to support
    // Chrome address bar auto-hide behaviors and native feel.
    // The globals.css handles the overflow properties for touch devices.
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      // Only restore if we are still hidden, presumably set by us
      if (document.body.style.overflow === 'hidden') {
        document.body.style.overflow = originalOverflow;
      }
    };
  }, []);
};

