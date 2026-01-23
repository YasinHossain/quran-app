'use client';

import { useEffect, useState } from 'react';

/**
 * `react-virtuoso` tuning helper.
 * On lower-end devices we reduce the overscan to limit DOM/memory and keep scroll smooth.
 *
 * This reads `html[data-glass]` (set by an early inline script in `app/layout.tsx`).
 */
export const useAdaptiveViewportBy = (defaultPx = 1000, reducedPx = 600): number => {
  const [value, setValue] = useState(defaultPx);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const glass = document.documentElement.getAttribute('data-glass');
    const next = glass === 'off' ? reducedPx : defaultPx;
    setValue(next);
  }, [defaultPx, reducedPx]);

  return value;
};
