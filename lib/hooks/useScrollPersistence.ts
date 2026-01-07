import { RefObject, useCallback, useEffect, useRef } from 'react';

interface ScrollPersistenceOptions<T extends string> {
  scrollRef: RefObject<HTMLDivElement | null>;
  activeTab: T;
  scrollTops: Record<T, number>;
  setScrollTops: Record<T, (top: number) => void>;
  storageKeys: Record<T, string>;
  isEnabled?: boolean;
}

interface ScrollPersistenceResult<T extends string> {
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  prepareForTabSwitch: () => void;
  rememberScroll: (tab: T) => void;
}

export const useScrollPersistence = <T extends string>({
  scrollRef,
  activeTab,
  scrollTops,
  setScrollTops,
  storageKeys,
  isEnabled = true,
}: ScrollPersistenceOptions<T>): ScrollPersistenceResult<T> => {
  const enabled = isEnabled;
  const hasRestoredRef = useRef(false);

  // Restore scroll position after Virtuoso has rendered
  // Use effect (not layout effect) to ensure DOM is fully painted
  useEffect(() => {
    if (!enabled) return;
    if (hasRestoredRef.current) return;

    const container = scrollRef.current;
    if (!container) return;

    const storageKey = storageKeys[activeTab];
    const top = Number(sessionStorage.getItem(storageKey)) || scrollTops[activeTab];

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let rafId1: number | undefined;
    let rafId2: number | undefined;

    if (top > 0) {
      // Use multiple requestAnimationFrame calls to ensure Virtuoso has rendered
      // This is necessary because Virtuoso renders items asynchronously
      rafId1 = requestAnimationFrame(() => {
        rafId2 = requestAnimationFrame(() => {
          if (container.scrollHeight > container.clientHeight) {
            container.scrollTop = top;
            hasRestoredRef.current = true;
          } else {
            // Virtuoso hasn't rendered yet, try again after a short delay
            timeoutId = setTimeout(() => {
              container.scrollTop = top;
              hasRestoredRef.current = true;
            }, 50);
          }
        });
      });
    } else {
      hasRestoredRef.current = true;
    }

    return () => {
      if (rafId1) cancelAnimationFrame(rafId1);
      if (rafId2) cancelAnimationFrame(rafId2);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [activeTab, enabled, scrollRef, scrollTops, storageKeys]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>): void => {
      if (!enabled) return;
      const top = e.currentTarget.scrollTop;
      setScrollTops[activeTab](top);
      sessionStorage.setItem(storageKeys[activeTab], String(top));
    },
    [activeTab, enabled, setScrollTops, storageKeys]
  );

  const prepareForTabSwitch = useCallback((): void => {
    if (!enabled) return;
    const top = scrollRef.current?.scrollTop ?? 0;
    setScrollTops[activeTab](top);
  }, [activeTab, enabled, scrollRef, setScrollTops]);

  const rememberScroll = useCallback(
    (tab: T): void => {
      if (!enabled) return;
      const top = scrollRef.current?.scrollTop ?? 0;
      setScrollTops[tab](top);
      sessionStorage.setItem(storageKeys[tab], String(top));
    },
    [enabled, scrollRef, setScrollTops, storageKeys]
  );

  return { handleScroll, prepareForTabSwitch, rememberScroll };
};
