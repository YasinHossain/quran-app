'use client';

import React from 'react';

import { TafsirLimitWarning } from '@/app/(features)/surah/components/panels/tafsir-panel/TafsirLimitWarning';
import { TafsirResource } from '@/types';

import { TafsirList } from './TafsirList';
import { LoadingSpinner, ErrorMessage } from './TafsirPanelFallbacks';
import { TafsirSearchSection } from './TafsirSearchSection';
import { TafsirTabs } from './TafsirTabs';
import { useTafsirContent, TafsirContentBodyProps } from './useTafsirContent';

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

// hooks and fallback components moved to dedicated files

const TafsirContentBody = ({
  showLimitWarning,
  searchProps,
  tabsProps,
  listProps,
  listContainerRef,
}: TafsirContentBodyProps): React.JSX.Element => (
  <>
    <TafsirLimitWarning show={showLimitWarning} />
    <div className="flex-1 overflow-y-auto" ref={listContainerRef}>
      <TafsirSearchSection {...searchProps} />
      <TafsirTabs {...tabsProps} />
      <TafsirList {...listProps} />
    </div>
  </>
);

export const TafsirPanelContent = (props: TafsirPanelContentProps): React.JSX.Element => {
  const { loading, error, ...rest } = props;
  const contentProps = useTafsirContent(rest);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return <TafsirContentBody {...contentProps} />;
};
