import { useSidebar } from '@/app/providers/SidebarContext';
import { useScrollPersistence } from '@/lib/hooks/useScrollPersistence';

import type { TabKey } from '@/app/shared/components/surah-tabs/types';

interface Options {
  scrollRef: React.RefObject<HTMLDivElement>;
  activeTab: TabKey;
}

export const useSidebarScrollPersistence = ({
  scrollRef,
  activeTab,
}: Options): ReturnType<typeof useScrollPersistence<TabKey>> => {
  const {
    surahScrollTop,
    setSurahScrollTop,
    juzScrollTop,
    setJuzScrollTop,
    pageScrollTop,
    setPageScrollTop,
  } = useSidebar();

  return useScrollPersistence<TabKey>({
    scrollRef,
    activeTab,
    scrollTops: {
      Surah: surahScrollTop,
      Juz: juzScrollTop,
      Page: pageScrollTop,
    },
    setScrollTops: {
      Surah: setSurahScrollTop,
      Juz: setJuzScrollTop,
      Page: setPageScrollTop,
    },
    storageKeys: {
      Surah: 'surahScrollTop',
      Juz: 'juzScrollTop',
      Page: 'pageScrollTop',
    },
  });
};
