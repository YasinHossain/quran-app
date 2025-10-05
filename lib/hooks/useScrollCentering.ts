import {
  RefObject,
  MutableRefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';

interface ScrollCenteringOptions<T extends string> {
  scrollRef: RefObject<HTMLDivElement | null>;
  activeTab: T;
  selectedIds: Record<T, number | null>;
  scrollTops: Record<T, number>;
  isEnabled?: boolean;
}

interface ScrollCenteringResult<T extends string> {
  skipNextCentering: (tab: T) => void;
  prepareForTabSwitch: (nextTab: T) => void;
}

const useInitCenteringFlags = <T extends string>(
  tabs: T[],
  ref: MutableRefObject<Record<T, boolean>>,
  enabled: boolean
): void => {
  useLayoutEffect(() => {
    if (!enabled) return;
    tabs.forEach((tab) => {
      if (sessionStorage.getItem(`skipCenter${tab}`) === '1') {
        ref.current[tab] = false;
        sessionStorage.removeItem(`skipCenter${tab}`);
      }
    });
  }, [tabs, ref, enabled]);
};

type CenterArgs<T extends string> = {
  activeTab: T;
  scrollRef: RefObject<HTMLDivElement | null>;
  scrollTops: Record<T, number>;
  ref: MutableRefObject<Record<T, boolean>>;
  selectedIds: Record<T, number | null>;
  enabled: boolean;
};

const useCenterActiveElement = <T extends string>({
  activeTab,
  scrollRef,
  scrollTops,
  ref,
  selectedIds,
  enabled,
}: CenterArgs<T>): void => {
  useLayoutEffect(() => {
    if (!enabled) return;
    const container = scrollRef.current;
    if (!container) return;
    const activeEl = container.querySelector<HTMLElement>('[data-active="true"]');
    if (activeEl) {
      const containerRect = container.getBoundingClientRect();
      const activeRect = activeEl.getBoundingClientRect();
      const isOutside =
        activeRect.top < containerRect.top || activeRect.bottom > containerRect.bottom;
      if (ref.current[activeTab] && (scrollTops[activeTab] === 0 || isOutside)) {
        activeEl.scrollIntoView({ block: 'center' });
      }
    }
    ref.current[activeTab] = false;
  }, [activeTab, scrollRef, scrollTops, selectedIds, ref, enabled]);
};

export const useScrollCentering = <T extends string>({
  scrollRef,
  activeTab,
  selectedIds,
  scrollTops,
  isEnabled = true,
}: ScrollCenteringOptions<T>): ScrollCenteringResult<T> => {
  const tabs = Object.keys(selectedIds) as T[];
  const enabled = isEnabled;
  const shouldCenterRef = useRef<Record<T, boolean>>(
    tabs.reduce((acc, t) => ({ ...acc, [t]: true }), {} as Record<T, boolean>)
  );

  useInitCenteringFlags(tabs, shouldCenterRef, enabled);

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

  useCenterActiveElement({
    activeTab,
    scrollRef,
    scrollTops,
    ref: shouldCenterRef,
    selectedIds,
    enabled,
  });

  const skipNextCentering = useCallback((tab: T): void => {
    sessionStorage.setItem(`skipCenter${tab}`, '1');
  }, []);

  const prepareForTabSwitch = useCallback(
    (nextTab: T): void => {
      shouldCenterRef.current[nextTab] = true;
    },
    [shouldCenterRef]
  );

  return { skipNextCentering, prepareForTabSwitch };
};
