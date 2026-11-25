import { RefObject, startTransition, useCallback, useEffect, useRef } from 'react';

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
  const pendingUpdateRef = useRef<{ tab: T; top: number } | null>(null);
  const flushTimeoutRef = useRef<number | null>(null);
  const pendingStorageWritesRef = useRef<Record<string, string>>({});
  const storageWriteTimeoutRef = useRef<number | null>(null);

  const clearFlushTimer = useCallback((): void => {
    if (flushTimeoutRef.current === null) return;
    window.clearTimeout(flushTimeoutRef.current);
    flushTimeoutRef.current = null;
  }, []);

  const flushStorageWrites = useCallback((): void => {
    if (!enabled) return;
    const entries = pendingStorageWritesRef.current;
    pendingStorageWritesRef.current = {};

    Object.entries(entries).forEach(([key, value]) => {
      try {
        sessionStorage.setItem(key, value);
      } catch {
        // Ignore storage access failures (blocked/denied in some environments).
      }
    });
  }, [enabled]);

  const scheduleStorageWrite = useCallback(
    (key: string, value: string): void => {
      if (!enabled) return;
      pendingStorageWritesRef.current[key] = value;

      if (storageWriteTimeoutRef.current !== null) return;
      storageWriteTimeoutRef.current = window.setTimeout(() => {
        storageWriteTimeoutRef.current = null;
        flushStorageWrites();
      }, 0);
    },
    [enabled, flushStorageWrites]
  );

  const flushPending = useCallback((): void => {
    if (!enabled) return;
    const pending = pendingUpdateRef.current;
    if (!pending) return;

    pendingUpdateRef.current = null;
    startTransition(() => {
      setScrollTops[pending.tab](pending.top);
    });
    scheduleStorageWrite(storageKeys[pending.tab], String(pending.top));
  }, [enabled, scheduleStorageWrite, setScrollTops, storageKeys]);

  useEffect(() => {
    return () => {
      clearFlushTimer();
      flushPending();
    };
  }, [clearFlushTimer, flushPending]);

  useEffect(() => {
    if (!enabled) return;
    const container = scrollRef.current;
    if (!container) return;
    const storageKey = storageKeys[activeTab];
    const top = Number(sessionStorage.getItem(storageKey)) || scrollTops[activeTab];
    if (container.scrollTop === top) return;
    container.scrollTop = top;
  }, [activeTab, enabled, scrollRef, scrollTops, storageKeys]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>): void => {
      if (!enabled) return;
      const top = e.currentTarget.scrollTop;
      pendingUpdateRef.current = { tab: activeTab, top };

      // Avoid heavy synchronous work during scrolling (especially on iOS Safari).
      // We only persist after scrolling settles to keep momentum scrolling smooth.
      clearFlushTimer();
      flushTimeoutRef.current = window.setTimeout(() => {
        flushTimeoutRef.current = null;
        flushPending();
      }, 120);
    },
    [activeTab, clearFlushTimer, enabled, flushPending]
  );

  const prepareForTabSwitch = useCallback((): void => {
    if (!enabled) return;
    clearFlushTimer();
    const top = scrollRef.current?.scrollTop ?? 0;
    pendingUpdateRef.current = null;
    startTransition(() => {
      setScrollTops[activeTab](top);
    });
    scheduleStorageWrite(storageKeys[activeTab], String(top));
  }, [activeTab, clearFlushTimer, enabled, scheduleStorageWrite, scrollRef, setScrollTops, storageKeys]);

  const rememberScroll = useCallback(
    (tab: T): void => {
      if (!enabled) return;
      clearFlushTimer();
      const top = scrollRef.current?.scrollTop ?? 0;
      pendingUpdateRef.current = null;
      startTransition(() => {
        setScrollTops[tab](top);
      });
      scheduleStorageWrite(storageKeys[tab], String(top));
    },
    [clearFlushTimer, enabled, scheduleStorageWrite, scrollRef, setScrollTops, storageKeys]
  );

  return { handleScroll, prepareForTabSwitch, rememberScroll };
};
