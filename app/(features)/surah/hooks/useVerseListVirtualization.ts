import { useVirtualizer, type VirtualItem, type Virtualizer } from '@tanstack/react-virtual';
import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import type { Verse as VerseType } from '@/types';

const ESTIMATED_VERSE_HEIGHT = 320;

export function findScrollParent(start: HTMLElement | null): HTMLElement | null {
  let node: HTMLElement | null = start?.parentElement ?? null;
  while (node) {
    const style = getComputedStyle(node);
    if (style.overflowY === 'auto' || style.overflowY === 'scroll') {
      return node;
    }
    node = node.parentElement;
  }
  const scrollingElement = document.scrollingElement;
  if (scrollingElement instanceof HTMLElement) {
    return scrollingElement;
  }
  return document.body instanceof HTMLElement ? document.body : null;
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
  virtualizer: Virtualizer<HTMLElement, Element>;
  virtualItems: VirtualItem[];
}

export function useVerseListVirtualization({
  verses,
  isLoading,
  error,
}: UseVerseListVirtualizationArgs): UseVerseListVirtualizationReturn {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollParentRef = useRef<HTMLElement | null>(null);
  const [scrollElement, setScrollElement] = useState<HTMLElement | null>(null);

  const shouldVirtualize = useMemo(
    () => verses.length > 0 && !isLoading && !error && Boolean(scrollElement),
    [verses.length, isLoading, error, scrollElement]
  );

  useLayoutEffect(() => {
    const parent = containerRef.current ? findScrollParent(containerRef.current) : null;
    scrollParentRef.current = parent;
    setScrollElement((previous) => (previous === parent ? previous : parent));
  }, [verses.length]);

  const itemCount = shouldVirtualize ? verses.length : 0;
  const virtualizer = useVirtualizer<HTMLElement, Element>({
    count: itemCount,
    getScrollElement: () => scrollParentRef.current,
    estimateSize: () => ESTIMATED_VERSE_HEIGHT,
    overscan: 6,
    getItemKey: (index) => verses[index]?.id ?? `verse-${index}`,
  });

  const virtualItems = shouldVirtualize ? virtualizer.getVirtualItems() : [];

  useLayoutEffect(() => {
    if (!shouldVirtualize) return;
    virtualizer.measure();
  }, [shouldVirtualize, virtualizer, verses.length]);

  return {
    containerRef,
    scrollParentRef,
    shouldVirtualize,
    virtualizer,
    virtualItems,
  };
}
