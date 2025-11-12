'use client';

import React from 'react';

import { TranslationResultsSection } from './TranslationResultsSection';
import { TranslationSelectionSection } from './TranslationSelectionSection';
import { TranslationTabsHeader } from './TranslationTabsHeader';

import type { TranslationResource } from '@/types';

interface TranslationPanelContentBodyProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  orderedSelection: number[];
  translations: TranslationResource[];
  handleSelection: (id: number) => void;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  handleDragEnd: () => void;
  draggedId: number | null;
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
        handleDragStart={props.handleDragStart}
        handleDragOver={props.handleDragOver}
        handleDrop={props.handleDrop}
        handleDragEnd={props.handleDragEnd}
        draggedId={props.draggedId}
      />

      <TranslationTabsHeader
        languages={props.languages}
        activeFilter={props.activeFilter}
        setActiveFilter={props.setActiveFilter}
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
