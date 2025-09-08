'use client';

import React from 'react';

import { TafsirLimitWarning } from '@/app/(features)/surah/components/panels/tafsir-panel/TafsirLimitWarning';
import { AlertIcon } from '@/app/shared/icons';
import { TafsirResource } from '@/types';

import { TafsirList, TafsirListProps } from './TafsirList';
import { TafsirSearchSection, TafsirSearchSectionProps } from './TafsirSearchSection';
import { TafsirTabs, TafsirTabsProps } from './TafsirTabs';

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

interface TafsirContentBodyProps {
  showLimitWarning: boolean;
  searchProps: TafsirSearchSectionProps;
  tabsProps: TafsirTabsProps;
  listProps: TafsirListProps;
  listContainerRef: React.RefObject<HTMLDivElement>;
}

interface SearchPropsArgs {
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
}

interface TabsPropsArgs {
  languages: string[];
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  tabsContainerRef: React.RefObject<HTMLDivElement>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollTabsLeft: () => void;
  scrollTabsRight: () => void;
}

interface ListPropsArgs {
  resources: TafsirResource[];
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
  height: number;
  total: number;
}

const useTafsirSearchProps = ({
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
}: SearchPropsArgs): TafsirSearchSectionProps =>
  React.useMemo(
    () => ({
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
    }),
    [
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
    ]
  );

const useTafsirTabsProps = ({
  languages,
  activeFilter,
  setActiveFilter,
  tabsContainerRef,
  canScrollLeft,
  canScrollRight,
  scrollTabsLeft,
  scrollTabsRight,
}: TabsPropsArgs): TafsirTabsProps =>
  React.useMemo(
    () => ({
      languages,
      activeFilter,
      setActiveFilter,
      tabsContainerRef,
      canScrollLeft,
      canScrollRight,
      scrollTabsLeft,
      scrollTabsRight,
    }),
    [
      languages,
      activeFilter,
      setActiveFilter,
      tabsContainerRef,
      canScrollLeft,
      canScrollRight,
      scrollTabsLeft,
      scrollTabsRight,
    ]
  );

const useTafsirListProps = ({
  resources,
  selectedIds,
  onToggle,
  height,
  total,
}: ListPropsArgs): TafsirListProps =>
  React.useMemo(
    () => ({ resources, selectedIds, onToggle, height, total }),
    [resources, selectedIds, onToggle, height, total]
  );

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

const useTafsirContent = (
  props: Omit<TafsirPanelContentProps, 'loading' | 'error'>
): TafsirContentBodyProps => {
  const {
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
  } = props;
  const searchProps = useTafsirSearchProps({
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
  });

  const tabsProps = useTafsirTabsProps({
    languages,
    activeFilter,
    setActiveFilter,
    tabsContainerRef,
    canScrollLeft,
    canScrollRight,
    scrollTabsLeft,
    scrollTabsRight,
  });

  const listProps = useTafsirListProps({
    resources: resourcesToRender,
    selectedIds,
    onToggle: handleSelectionToggle,
    height: listHeight,
    total: tafsirs.length,
  });

  return { showLimitWarning, searchProps, tabsProps, listProps, listContainerRef };
};

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
