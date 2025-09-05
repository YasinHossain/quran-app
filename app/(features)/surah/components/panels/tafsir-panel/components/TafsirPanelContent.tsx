'use client';

import React from 'react';

import { AlertIcon } from '@/app/shared/icons';
import { ResourceTabs, ResourceList } from '@/app/shared/resource-panel';
import { TafsirResource } from '@/types';

import { TafsirLimitWarning } from '../TafsirLimitWarning';
import { TafsirSearch } from '../TafsirSearch';
import { TafsirSelectionList } from '../TafsirSelectionList';

interface TafsirPanelContentProps {
  loading: boolean;
  error: string | null;
  showLimitWarning: boolean;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  orderedSelection: number[];
  tafsirs: TafsirResource[];
  handleSelectionToggle: (id: number) => void;
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
  resourcesToRender: TafsirResource[];
  selectedIds: Set<number>;
  listHeight: number;
  listContainerRef: React.RefObject<HTMLDivElement>;
}

export const TafsirPanelContent = ({
  loading,
  error,
  showLimitWarning,
  searchTerm,
  setSearchTerm,
  orderedSelection,
  tafsirs,
  handleSelectionToggle,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  draggedId,
  languages,
  activeFilter,
  setActiveFilter,
  tabsContainerRef,
  canScrollLeft,
  canScrollRight,
  scrollTabsLeft,
  scrollTabsRight,
  resourcesToRender,
  selectedIds,
  listHeight,
  listContainerRef,
}: TafsirPanelContentProps) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-4 mt-4 p-4 rounded-lg border bg-error/10 border-error/20 text-error">
        <div className="flex items-center space-x-2">
          <AlertIcon className="h-5 w-5 text-error" />
          <span className="text-sm">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <TafsirLimitWarning show={showLimitWarning} />

      <div className="flex-1 overflow-y-auto" ref={listContainerRef}>
        <div className="p-4 space-y-4">
          <TafsirSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <TafsirSelectionList
            orderedSelection={orderedSelection}
            tafsirs={tafsirs}
            handleSelectionToggle={handleSelectionToggle}
            handleDragStart={handleDragStart}
            handleDragOver={handleDragOver}
            handleDrop={handleDrop}
            handleDragEnd={handleDragEnd}
            draggedId={draggedId}
          />
        </div>

        {/* Sticky Tabs */}
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

        <div className="px-4 pb-4 pt-4">
          {resourcesToRender.length > 0 ? (
            <ResourceList
              resources={resourcesToRender}
              rowHeight={58}
              selectedIds={selectedIds}
              onToggle={handleSelectionToggle}
              height={listHeight}
            />
          ) : (
            <div className="text-center text-muted py-8">
              {tafsirs.length === 0
                ? 'Loading tafsir resources...'
                : 'No tafsir resources found for the selected filter.'}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
