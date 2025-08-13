import { RefObject, useLayoutEffect } from 'react';

interface ScrollPersistenceOptions<T extends string> {
  scrollRef: RefObject<HTMLDivElement | null>;
  activeTab: T;
  scrollTops: Record<T, number>;
  setScrollTops: Record<T, (top: number) => void>;
  storageKeys: Record<T, string>;
}

interface ScrollPersistenceResult<T extends string> {
  handleScroll: (e: React.UIEvent<HTMLDivElement>) => void;
  prepareForTabSwitch: () => void;
  rememberScroll: (tab: T) => void;
}

const useScrollPersistence = <T extends string>({
  scrollRef,
  activeTab,
  scrollTops,
  setScrollTops,
  storageKeys,
}: ScrollPersistenceOptions<T>): ScrollPersistenceResult<T> => {
  useLayoutEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const storageKey = storageKeys[activeTab];
    const top = Number(sessionStorage.getItem(storageKey)) || scrollTops[activeTab];
    container.scrollTop = top;
  }, [activeTab, scrollRef, scrollTops, storageKeys]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>): void => {
    const top = e.currentTarget.scrollTop;
    setScrollTops[activeTab](top);
    sessionStorage.setItem(storageKeys[activeTab], String(top));
  };

  const prepareForTabSwitch = (): void => {
    const top = scrollRef.current?.scrollTop ?? 0;
    setScrollTops[activeTab](top);
  };

  const rememberScroll = (tab: T): void => {
    const top = scrollRef.current?.scrollTop ?? 0;
    setScrollTops[tab](top);
    sessionStorage.setItem(storageKeys[tab], String(top));
  };

  return { handleScroll, prepareForTabSwitch, rememberScroll };
};

export default useScrollPersistence;
