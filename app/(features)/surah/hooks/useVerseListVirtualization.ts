import { useWindowVirtualizer, type VirtualItem, type Virtualizer } from '@tanstack/react-virtual';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import type { Verse as VerseType } from '@/types';

const ESTIMATED_VERSE_HEIGHT = 320;
const OVERSCAN_COUNT = 10; // Pre-render 10 items above/below viewport for smoother scrolling

/**
 * Detects if the device uses touch as primary input (coarse pointer).
 * Used to disable virtualization on touch devices to avoid visual glitches.
 */
const useTouchDevice = (): boolean => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: coarse)');
    const handleChange = (e: MediaQueryListEvent | MediaQueryList): void => {
      setIsTouchDevice(e.matches);
    };

    handleChange(mediaQuery);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isTouchDevice;
};

/**
 * Finds the scroll parent for an element.
 * With body scrolling, this returns documentElement or body.
 */
export function findScrollParent(start: HTMLElement | null): HTMLElement | null {
  const scrollingElement = document.scrollingElement;
  if (scrollingElement instanceof HTMLElement) {
    return scrollingElement;
  }
  return document.documentElement instanceof HTMLElement
    ? document.documentElement
    : document.body instanceof HTMLElement
      ? document.body
      : null;
}

interface UseVerseListVirtualizationArgs {
  verses: VerseType[];
  isLoading: boolean;
  error: string | null;
}

interface UseVerseListVirtualizationReturn {
  containerRef: React.RefObject<HTMLDivElement | null>;
  scrollParentRef: React.MutableRefObject<HTMLElement | null>;
  shouldVirtualize: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  virtualizer: Virtualizer<any, Element>;
  virtualItems: VirtualItem[];
  isTouchDevice: boolean;
  scrollMargin: number;
}

export function useVerseListVirtualization({
  verses,
  isLoading,
  error,
}: UseVerseListVirtualizationArgs): UseVerseListVirtualizationReturn {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollParentRef = useRef<HTMLElement | null>(null);
  const [scrollMargin, setScrollMargin] = useState(0);
  const isTouchDevice = useTouchDevice();

  // Calculate scrollMargin when container is mounted
  useLayoutEffect(() => {
    const updateScrollMargin = (): void => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const newMargin = rect.top + window.scrollY;
        setScrollMargin(newMargin);
      }
    };

    updateScrollMargin();

    // Update on resize
    window.addEventListener('resize', updateScrollMargin);
    return () => window.removeEventListener('resize', updateScrollMargin);
  }, [verses.length]);

  // DISABLE virtualization on touch devices to avoid visual glitches
  // Body scrolling still works for Chrome address bar auto-hide
  const shouldVirtualize = useMemo(
    () => !isTouchDevice && verses.length > 0 && !isLoading && !error,
    [isTouchDevice, verses.length, isLoading, error]
  );

  const itemCount = shouldVirtualize ? verses.length : 0;

  // Use useWindowVirtualizer for body/window scrolling (like Quran.com)
  const virtualizer = useWindowVirtualizer({
    count: itemCount,
    estimateSize: () => ESTIMATED_VERSE_HEIGHT,
    overscan: OVERSCAN_COUNT,
    getItemKey: (index) => verses[index]?.id ?? `verse-${index}`,
    // scrollMargin accounts for the header and any content above the list
    scrollMargin,
  });

  const virtualItems = shouldVirtualize ? virtualizer.getVirtualItems() : [];

  useEffect(() => {
    if (!shouldVirtualize) return;
    virtualizer.measure();
  }, [shouldVirtualize, virtualizer, verses.length]);

  return {
    containerRef,
    scrollParentRef,
    shouldVirtualize,
    virtualizer,
    virtualItems,
    isTouchDevice,
    scrollMargin,
  };
}
