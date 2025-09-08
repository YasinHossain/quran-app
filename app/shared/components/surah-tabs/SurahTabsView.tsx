import { memo } from 'react';

import { TabContent } from '@/app/shared/components/surah-tabs/TabContent';

import type { SurahTabsProps } from '@/app/shared/components/surah-tabs/types';
import type { SurahTabsState } from '@/app/shared/components/surah-tabs/useSurahTabsState';

import { SidebarTabs } from '@/app/shared/components/surah-sidebar/components/SidebarTabs';

export const SurahTabsView = memo(function SurahTabsView({
  tabs,
  activeTab,
  setActiveTab,
  prepareForTabSwitch,
  searchInput,
  scrollRef,
  handleScroll,
  filteredChapters,
  filteredJuzs,
  filteredPages,
  chapters,
  selectedSurahId,
  setSelectedSurahId,
  selectedJuzId,
  setSelectedJuzId,
  selectedPageId,
  setSelectedPageId,
  rememberScroll,
  isTafsirPath,
}: SurahTabsProps & SurahTabsState) {
  return (
    <>
      <div className="p-3 sm:p-4 border-b border-border md:border-b-0 md:p-3 md:pb-1">
        <SidebarTabs
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          prepareForTabSwitch={prepareForTabSwitch}
        />
      </div>
      {searchInput}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex-1 min-h-0 overflow-y-auto p-2 sm:p-3 touch-pan-y"
      >
        <TabContent
          activeTab={activeTab}
          filteredChapters={filteredChapters}
          filteredJuzs={filteredJuzs}
          filteredPages={filteredPages}
          chapters={chapters}
          selectedSurahId={selectedSurahId}
          setSelectedSurahId={setSelectedSurahId}
          selectedJuzId={selectedJuzId}
          setSelectedJuzId={setSelectedJuzId}
          selectedPageId={selectedPageId}
          setSelectedPageId={setSelectedPageId}
          rememberScroll={rememberScroll}
          isTafsirPath={isTafsirPath}
        />
      </div>
    </>
  );
});
