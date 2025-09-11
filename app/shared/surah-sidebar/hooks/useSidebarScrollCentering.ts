import { useSidebar } from '@/app/providers/SidebarContext';
import { useScrollCentering } from '@/lib/hooks/useScrollCentering';

import type { TabKey } from '@/app/shared/components/surah-tabs/types';

interface Options {
  scrollRef: React.RefObject<HTMLDivElement>;
  activeTab: TabKey;
  selectedSurahId: number | null;
  selectedJuzId: number | null;
  selectedPageId: number | null;
}

export const useSidebarScrollCentering = ({
  scrollRef,
  activeTab,
  selectedSurahId,
  selectedJuzId,
  selectedPageId,
}: Options): ReturnType<typeof useScrollCentering<TabKey>> => {
  const { surahScrollTop, juzScrollTop, pageScrollTop } = useSidebar();

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
  });
};
