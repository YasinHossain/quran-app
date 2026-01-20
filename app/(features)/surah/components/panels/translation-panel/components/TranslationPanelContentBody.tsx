'use client';

import React from 'react';

import { ResourceTabsHeader } from '@/app/shared/resource-panel/components/ResourceTabsHeader';

import { TranslationResultsSection } from './TranslationResultsSection';
import { TranslationSelectionSection } from './TranslationSelectionSection';

import type { TranslationResource } from '@/types';

interface TranslationPanelContentBodyProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  orderedSelection: number[];
  translations: TranslationResource[];
  handleSelection: (id: number) => void;
  onReorder: (ids: number[]) => void;
  onReset: () => void;
  languages: string[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  tabsContainerRef: React.RefObject<HTMLDivElement>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollTabsLeft: () => void;
  scrollTabsRight: () => void;
  sectionsToRender: Array<{ language: string; items: TranslationResource[] }>;
  resourcesToRender: TranslationResource[];
  selectedIds: Set<number>;
  listHeight: number;
  listContainerRef: React.RefObject<HTMLDivElement>;
}

export function PanelContentBody(props: TranslationPanelContentBodyProps): React.JSX.Element {
  return (
    <div className="flex-1 min-w-0 overflow-y-auto" ref={props.listContainerRef}>
      <TranslationSelectionSection
        searchTerm={props.searchTerm}
        setSearchTerm={props.setSearchTerm}
        orderedSelection={props.orderedSelection}
        translations={props.translations}
        handleSelection={props.handleSelection}
        onReorder={props.onReorder}
        onReset={props.onReset}
      />

      <ResourceTabsHeader
        languages={props.languages}
        activeFilter={props.activeFilter}
        onTabClick={props.setActiveFilter}
        tabsContainerRef={props.tabsContainerRef}
        canScrollLeft={props.canScrollLeft}
        canScrollRight={props.canScrollRight}
        scrollTabsLeft={props.scrollTabsLeft}
        scrollTabsRight={props.scrollTabsRight}
      />

      <TranslationResultsSection
        activeFilter={props.activeFilter}
        sectionsToRender={props.sectionsToRender}
        resourcesToRender={props.resourcesToRender}
        selectedIds={props.selectedIds}
        onToggle={props.handleSelection}
        listHeight={props.listHeight}
      />
    </div>
  );
}
