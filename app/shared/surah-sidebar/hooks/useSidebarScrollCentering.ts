import { useEffect, useRef } from 'react';

import { useSidebar } from '@/app/providers/SidebarContext';
import { useScrollCentering } from '@/lib/hooks/useScrollCentering';

import type { TabKey } from '@/app/shared/components/surah-tabs/types';

interface Options {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  activeTab: TabKey;
  selectedSurahId: number | null;
  selectedJuzId: number | null;
  selectedPageId: number | null;
  isEnabled: boolean;
}

export const useSidebarScrollCentering = ({
  scrollRef,
  activeTab,
  selectedSurahId,
  selectedJuzId,
  selectedPageId,
  isEnabled,
}: Options): ReturnType<typeof useScrollCentering<TabKey>> => {
  const {
    surahScrollTop,
    setSurahScrollTop,
    juzScrollTop,
    setJuzScrollTop,
    pageScrollTop,
    setPageScrollTop,
  } = useSidebar();

  return useScrollCentering<TabKey>({
    scrollRef,
    activeTab,
    selectedIds: {
      Surah: selectedSurahId,
      Juz: selectedJuzId,
      Page: selectedPageId,
    },
    scrollTops: {
      Surah: surahScrollTop,
      Juz: juzScrollTop,
      Page: pageScrollTop,
    },
    isEnabled,
  });
};

// Background pre-centering: when a selection changes for a non-active tab,
// clear its stored scrollTop and mark it to force-center on next open.
export const useBackgroundPreCentering = ({
  activeTab,
  selectedSurahId,
  selectedJuzId,
  selectedPageId,
}: Pick<Options, 'activeTab' | 'selectedSurahId' | 'selectedJuzId' | 'selectedPageId'>): void => {
  const { setSurahScrollTop, setJuzScrollTop, setPageScrollTop } = useSidebar();
  const prev = useRef({ Surah: selectedSurahId, Juz: selectedJuzId, Page: selectedPageId });

  useEffect(() => {
    const tabs: TabKey[] = ['Surah', 'Juz', 'Page'];
    tabs.forEach((tab) => {
      const currentId =
        tab === 'Surah' ? selectedSurahId : tab === 'Juz' ? selectedJuzId : selectedPageId;
      const prevId = prev.current[tab];
      if (currentId !== prevId && activeTab !== tab) {
        // Reset stored scroll to enable centering and mark as force center.
        if (tab === 'Surah') setSurahScrollTop(0);
        if (tab === 'Juz') setJuzScrollTop(0);
        if (tab === 'Page') setPageScrollTop(0);
        sessionStorage.setItem(`forceCenter${tab}`, '1');
      }
    });
    prev.current = { Surah: selectedSurahId, Juz: selectedJuzId, Page: selectedPageId };
  }, [
    activeTab,
    selectedSurahId,
    selectedJuzId,
    selectedPageId,
    setSurahScrollTop,
    setJuzScrollTop,
    setPageScrollTop,
  ]);
};
