'use client';

import React from 'react';

import { TafsirLimitWarning } from '@/app/(features)/surah/components/panels/tafsir-panel/TafsirLimitWarning';
import {
  ResourcePanelErrorMessage,
  ResourcePanelLoadingSpinner,
} from '@/app/shared/resource-panel/components/ResourcePanelFallbacks';
import { TafsirResource } from '@/types';

import { TafsirList } from './TafsirList';
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
  resourcesToRender: TafsirResource[];
  sectionsToRender: Array<{ language: string; items: TafsirResource[] }>;
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

  if (loading) return <ResourcePanelLoadingSpinner />;
  if (error) return <ResourcePanelErrorMessage error={error} />;

  return <TafsirContentBody {...contentProps} />;
};
