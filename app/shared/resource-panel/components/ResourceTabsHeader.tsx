'use client';

import React, { memo } from 'react';

import { ResourceTabs } from '@/app/shared/resource-panel';

interface ResourceTabsHeaderProps {
  languages: string[];
  activeFilter: string;
  onTabClick: (filter: string) => void;
  tabsContainerRef: React.RefObject<HTMLDivElement>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollTabsLeft: () => void;
  scrollTabsRight: () => void;
}

export const ResourceTabsHeader = memo(function ResourceTabsHeader({
  languages,
  activeFilter,
  onTabClick,
  tabsContainerRef,
  canScrollLeft,
  canScrollRight,
  scrollTabsLeft,
  scrollTabsRight,
}: ResourceTabsHeaderProps): React.JSX.Element {
  return (
    <div className="sticky top-0 z-10 py-2 border-b bg-background border-border">
      <div className="px-4">
        <ResourceTabs
          languages={languages}
          activeFilter={activeFilter}
          onTabClick={onTabClick}
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
});
