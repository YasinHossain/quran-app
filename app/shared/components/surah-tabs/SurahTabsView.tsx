import { memo } from 'react';

import { TabContent } from '@/app/shared/components/surah-tabs/TabContent';

import type { SurahTabsProps } from '@/app/shared/components/surah-tabs/types';
import type { SurahTabsState } from '@/app/shared/components/surah-tabs/useSurahTabsState';

import { SidebarTabs } from '@/app/shared/components/surah-sidebar/components/SidebarTabs';

type TabsHeaderProps = Pick<
  SurahTabsState,
  'tabs' | 'activeTab' | 'setActiveTab' | 'prepareForTabSwitch'
> &
  Pick<SurahTabsProps, 'searchInput'>;

const TabsHeader = memo(function TabsHeader({
  tabs,
  activeTab,
  setActiveTab,
  prepareForTabSwitch,
  searchInput,
}: TabsHeaderProps) {
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
    </>
  );
});

type ScrollableTabContentProps = Pick<
  SurahTabsProps & SurahTabsState,
  | 'activeTab'
  | 'filteredChapters'
  | 'filteredJuzs'
  | 'filteredPages'
  | 'chapters'
  | 'selectedSurahId'
  | 'setSelectedSurahId'
  | 'selectedJuzId'
  | 'setSelectedJuzId'
  | 'selectedPageId'
  | 'setSelectedPageId'
  | 'rememberScroll'
  | 'isTafsirPath'
  | 'scrollRef'
  | 'handleScroll'
>;

const ScrollableTabContent = memo(function ScrollableTabContent({
  scrollRef,
  handleScroll,
  ...tabContentProps
}: ScrollableTabContentProps) {
  return (
    <div
      ref={scrollRef}
      onScroll={handleScroll}
      className="flex-1 min-h-0 overflow-y-auto p-2 sm:p-3 touch-pan-y"
    >
      <TabContent {...tabContentProps} />
    </div>
  );
});

export const SurahTabsView = memo(function SurahTabsView(props: SurahTabsProps & SurahTabsState) {
  const {
    tabs,
    activeTab,
    setActiveTab,
    prepareForTabSwitch,
    searchInput,
    scrollRef,
    handleScroll,
    ...tabContentProps
  } = props;

  return (
    <>
      <TabsHeader
        tabs={tabs}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        prepareForTabSwitch={prepareForTabSwitch}
        searchInput={searchInput}
      />
      <ScrollableTabContent
        scrollRef={scrollRef}
        handleScroll={handleScroll}
        activeTab={activeTab}
        {...tabContentProps}
      />
    </>
  );
});
