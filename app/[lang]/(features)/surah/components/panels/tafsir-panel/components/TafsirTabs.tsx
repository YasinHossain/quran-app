'use client';

import React from 'react';

import { ResourceTabsHeader } from '@/app/shared/resource-panel/components/ResourceTabsHeader';

export interface TafsirTabsProps {
  languages: string[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  tabsContainerRef: React.RefObject<HTMLDivElement>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollTabsLeft: () => void;
  scrollTabsRight: () => void;
}

export const TafsirTabs = ({
  languages,
  activeFilter,
  setActiveFilter,
  tabsContainerRef,
  canScrollLeft,
  canScrollRight,
  scrollTabsLeft,
  scrollTabsRight,
}: TafsirTabsProps): React.JSX.Element => (
  <ResourceTabsHeader
    languages={languages}
    activeFilter={activeFilter}
    onTabClick={setActiveFilter}
    tabsContainerRef={tabsContainerRef}
    canScrollLeft={canScrollLeft}
    canScrollRight={canScrollRight}
    scrollTabsLeft={scrollTabsLeft}
    scrollTabsRight={scrollTabsRight}
  />
);
