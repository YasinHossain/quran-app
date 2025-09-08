'use client';

import React from 'react';

import { AlertIcon } from '@/app/shared/icons';
// Resource list usage moved to TafsirVirtualList
import { TafsirResource } from '@/types';

import { TafsirLimitWarning } from '../TafsirLimitWarning';
import { TafsirTabsHeader } from './TafsirTabsHeader';
import { TafsirVirtualList } from './TafsirVirtualList';
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

const LoadingSpinner = (): React.JSX.Element => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent" />
  </div>
);

const ErrorMessage = ({ error }: { error: string }): React.JSX.Element => (
  <div className="mx-4 mt-4 p-4 rounded-lg border bg-error/10 border-error/20 text-error">
    <div className="flex items-center space-x-2">
      <AlertIcon className="h-5 w-5 text-error" />
      <span className="text-sm">{error}</span>
    </div>
  </div>
);

const TafsirContentBody = ({
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
}: Omit<TafsirPanelContentProps, 'loading' | 'error'>): React.JSX.Element => (
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

      <TafsirTabsHeader
        languages={languages}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        tabsContainerRef={tabsContainerRef}
        canScrollLeft={canScrollLeft}
        canScrollRight={canScrollRight}
        scrollTabsLeft={scrollTabsLeft}
        scrollTabsRight={scrollTabsRight}
      />

      <TafsirVirtualList
        resources={resourcesToRender}
        selectedIds={selectedIds}
        onToggle={handleSelectionToggle}
        height={listHeight}
        total={tafsirs.length}
      />
    </div>
  </>
);

export const TafsirPanelContent = (props: TafsirPanelContentProps): React.JSX.Element => {
  const { loading, error } = props;

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <TafsirContentBody {...props} />;
};

// moved to ./TafsirVirtualList
