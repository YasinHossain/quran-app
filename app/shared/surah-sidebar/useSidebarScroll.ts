import { useRef } from 'react';
import { useSidebar } from '@/app/providers/SidebarContext';
import useScrollPersistence from '@/lib/hooks/useScrollPersistence';
import useScrollCentering from '@/lib/hooks/useScrollCentering';

type TabKey = 'Surah' | 'Juz' | 'Page';

interface Options {
  activeTab: TabKey;
  selectedSurahId: string | null;
  selectedJuzId: string | null;
  selectedPageId: string | null;
}

const useSidebarScroll = ({
  activeTab,
  selectedSurahId,
  selectedJuzId,
  selectedPageId,
}: Options) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const {
    surahScrollTop,
    setSurahScrollTop,
    juzScrollTop,
    setJuzScrollTop,
    pageScrollTop,
    setPageScrollTop,
  } = useSidebar();

  const {
    handleScroll,
    prepareForTabSwitch: persistencePrepare,
    rememberScroll: persistRememberScroll,
  } = useScrollPersistence<TabKey>({
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

  const { skipNextCentering, prepareForTabSwitch: centeringPrepare } = useScrollCentering<TabKey>({
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
  });

  const rememberScroll = (tab: TabKey) => {
    persistRememberScroll(tab);
    skipNextCentering(tab);
  };

  const prepareForTabSwitch = (nextTab: TabKey) => {
    persistencePrepare();
    centeringPrepare(nextTab);
  };

  return { scrollRef, handleScroll, prepareForTabSwitch, rememberScroll };
};

export default useSidebarScroll;

export type { TabKey };
