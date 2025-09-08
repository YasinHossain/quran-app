'use client';

import React from 'react';

import { TranslationSearch } from '@/app/(features)/surah/components/panels/translation-panel/TranslationSearch';
import { TranslationSelectionList } from '@/app/(features)/surah/components/panels/translation-panel/TranslationSelectionList';

import { TranslationsByLanguage } from './TranslationsByLanguage';
import { TranslationsVirtualList } from './TranslationsVirtualList';
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
    <div className="flex-1 overflow-y-auto" ref={props.listContainerRef}>
      <HeaderSection
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

      <ResultsSection
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

function HeaderSection({
  searchTerm,
  setSearchTerm,
  orderedSelection,
  translations,
  handleSelection,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  draggedId,
}: Pick<
  TranslationPanelContentBodyProps,
  | 'searchTerm'
  | 'setSearchTerm'
  | 'orderedSelection'
  | 'translations'
  | 'handleDragStart'
  | 'handleDragOver'
  | 'handleDrop'
  | 'handleDragEnd'
  | 'draggedId'
> & { handleSelection: (id: number) => void }): React.JSX.Element {
  return (
    <div className="p-4 space-y-4">
      <TranslationSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <TranslationSelectionList
        orderedSelection={orderedSelection}
        translations={translations}
        handleSelectionToggle={handleSelection}
        handleDragStart={handleDragStart}
        handleDragOver={handleDragOver}
        handleDrop={handleDrop}
        handleDragEnd={handleDragEnd}
        draggedId={draggedId}
      />
    </div>
  );
}

function ResultsSection({
  activeFilter,
  sectionsToRender,
  resourcesToRender,
  selectedIds,
  onToggle,
  listHeight,
}: Pick<
  TranslationPanelContentBodyProps,
  'activeFilter' | 'sectionsToRender' | 'resourcesToRender' | 'selectedIds' | 'listHeight'
> & { onToggle: (id: number) => void }): React.JSX.Element {
  return (
    <div className="px-4 pb-4 pt-4">
      {activeFilter === 'All' ? (
        <TranslationsByLanguage
          sectionsToRender={sectionsToRender}
          selectedIds={selectedIds}
          onToggle={onToggle}
        />
      ) : (
        <TranslationsVirtualList
          resources={resourcesToRender}
          selectedIds={selectedIds}
          onToggle={onToggle}
          height={listHeight}
        />
      )}
    </div>
  );
}
