'use client';

import React from 'react';

import {
  useTafsirListProps,
  useTafsirSearchProps,
  useTafsirTabsProps,
} from './useTafsirPanelProps';

import type { TafsirListProps } from './TafsirList';
import type { TafsirSearchSectionProps } from './TafsirSearchSection';
import type { TafsirTabsProps } from './TafsirTabs';
import type { TafsirResource } from '@/types';

export interface TafsirPanelContentPropsLite {
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

export interface TafsirContentBodyProps {
  showLimitWarning: boolean;
  searchProps: TafsirSearchSectionProps;
  tabsProps: TafsirTabsProps;
  listProps: TafsirListProps;
  listContainerRef: React.RefObject<HTMLDivElement>;
}

export function useTafsirContent(props: TafsirPanelContentPropsLite): TafsirContentBodyProps {
  const searchProps = useTafsirSearchProps({
    searchTerm: props.searchTerm,
    setSearchTerm: props.setSearchTerm,
    orderedSelection: props.orderedSelection,
    tafsirs: props.tafsirs,
    handleSelectionToggle: props.handleSelectionToggle,
    onReorder: props.onReorder,
    onReset: props.onReset,
  });

  const tabsProps = useTafsirTabsProps({
    languages: props.languages,
    activeFilter: props.activeFilter,
    setActiveFilter: props.setActiveFilter,
    tabsContainerRef: props.tabsContainerRef,
    canScrollLeft: props.canScrollLeft,
    canScrollRight: props.canScrollRight,
    scrollTabsLeft: props.scrollTabsLeft,
    scrollTabsRight: props.scrollTabsRight,
  });

  const listProps = useTafsirListProps({
    activeFilter: props.activeFilter,
    sectionsToRender: props.sectionsToRender,
    resources: props.resourcesToRender,
    selectedIds: props.selectedIds,
    onToggle: props.handleSelectionToggle,
    height: props.listHeight,
    total: props.tafsirs.length,
  });

  return {
    showLimitWarning: props.showLimitWarning,
    searchProps,
    tabsProps,
    listProps,
    listContainerRef: props.listContainerRef,
  } as const;
}
