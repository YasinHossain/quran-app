import { useMemo } from 'react';

import { useSidebar } from '@/app/providers/SidebarContext';
import { useScrollPersistence } from '@/lib/hooks/useScrollPersistence';

import type { TabKey } from '@/app/shared/components/surah-tabs/types';

interface Options {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  activeTab: TabKey;
  isEnabled: boolean;
}

const STORAGE_KEYS: Record<TabKey, string> = {
  Surah: 'surahScrollTop',
  Juz: 'juzScrollTop',
  Page: 'pageScrollTop',
};

export const useSidebarScrollPersistence = ({
  scrollRef,
  activeTab,
  isEnabled,
}: Options): ReturnType<typeof useScrollPersistence<TabKey>> => {
  const {
    surahScrollTop,
    setSurahScrollTop,
    juzScrollTop,
    setJuzScrollTop,
    pageScrollTop,
    setPageScrollTop,
  } = useSidebar();

  // PERF_FIX: {"id":"scroll-persistence-stable-deps","why":"useScrollPersistence cleanup calls setState; passing new object literals each render changes callback deps and can trigger a max-update-depth loop.","area":"surah-sidebar scroll persistence"}
  const scrollTops = useMemo(
    () => ({
      Surah: surahScrollTop,
      Juz: juzScrollTop,
      Page: pageScrollTop,
    }),
    [juzScrollTop, pageScrollTop, surahScrollTop]
  );

  const setScrollTops = useMemo(
    () => ({
      Surah: setSurahScrollTop,
      Juz: setJuzScrollTop,
      Page: setPageScrollTop,
    }),
    [setJuzScrollTop, setPageScrollTop, setSurahScrollTop]
  );

  return useScrollPersistence<TabKey>({
    scrollRef,
    activeTab,
    scrollTops,
    setScrollTops,
    storageKeys: STORAGE_KEYS,
    isEnabled,
  });
};
