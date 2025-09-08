'use client';

import { ResourceTabs } from '@/app/shared/resource-panel';

interface TafsirTabsHeaderProps {
  languages: string[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  tabsContainerRef: React.RefObject<HTMLDivElement>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollTabsLeft: () => void;
  scrollTabsRight: () => void;
}

export function TafsirTabsHeader({
  languages,
  activeFilter,
  setActiveFilter,
  tabsContainerRef,
  canScrollLeft,
  canScrollRight,
  scrollTabsLeft,
  scrollTabsRight,
}: TafsirTabsHeaderProps): React.JSX.Element {
  return (
    <div className="sticky top-0 z-10 py-2 border-b bg-background/95 backdrop-blur-sm border-border">
      <div className="px-4">
        <ResourceTabs
          languages={languages}
          activeFilter={activeFilter}
          onTabClick={setActiveFilter}
          tabsContainerRef={tabsContainerRef}
          canScrollLeft={canScrollLeft}
          canScrollRight={canScrollRight}
          scrollTabsLeft={scrollTabsLeft}
          scrollTabsRight={scrollTabsRight}
          className=""
        />
      </div>
    </div>
  );
}
