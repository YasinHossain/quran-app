import { RefObject, useEffect, useLayoutEffect, useRef } from 'react';

interface ScrollCenteringOptions<T extends string> {
  scrollRef: RefObject<HTMLDivElement | null>;
  activeTab: T;
  selectedIds: Record<T, number | null>;
  scrollTops: Record<T, number>;
}

interface ScrollCenteringResult<T extends string> {
  skipNextCentering: (tab: T) => void;
  prepareForTabSwitch: (nextTab: T) => void;
}

const useScrollCentering = <T extends string>({
  scrollRef,
  activeTab,
  selectedIds,
  scrollTops,
}: ScrollCenteringOptions<T>): ScrollCenteringResult<T> => {
  const tabs = Object.keys(selectedIds) as T[];
  const shouldCenterRef = useRef<Record<T, boolean>>(
    tabs.reduce((acc, t) => ({ ...acc, [t]: true }), {} as Record<T, boolean>)
  );

  useLayoutEffect(() => {
    tabs.forEach((tab) => {
      if (sessionStorage.getItem(`skipCenter${tab}`) === '1') {
        shouldCenterRef.current[tab] = false;
        sessionStorage.removeItem(`skipCenter${tab}`);
      }
    });
  }, [tabs]);

  const prevIds = useRef<Record<T, number | null>>(
    tabs.reduce((acc, t) => ({ ...acc, [t]: selectedIds[t] }), {} as Record<T, number | null>)
  );

  useEffect(() => {
    tabs.forEach((tab) => {
      const currentId = selectedIds[tab];
      if (prevIds.current[tab] !== currentId) {
        if (activeTab !== tab) {
          shouldCenterRef.current[tab] = true;
        }
        prevIds.current[tab] = currentId;
      }
    });
  }, [activeTab, selectedIds, tabs]);

  useLayoutEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const activeEl = container.querySelector<HTMLElement>('[data-active="true"]');
    if (activeEl) {
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();
      const isOutside =
        activeRect.top < containerRect.top || activeRect.bottom > containerRect.bottom;
      if (shouldCenterRef.current[activeTab] && (scrollTops[activeTab] === 0 || isOutside)) {
        activeEl.scrollIntoView({ block: 'center' });
      }
    }
    shouldCenterRef.current[activeTab] = false;
  }, [activeTab, scrollRef, scrollTops, selectedIds]);

  const skipNextCentering = (tab: T): void => {
    sessionStorage.setItem(`skipCenter${tab}`, '1');
  };

  const prepareForTabSwitch = (nextTab: T): void => {
    shouldCenterRef.current[nextTab] = true;
  };

  return { skipNextCentering, prepareForTabSwitch };
};

export default useScrollCentering;
