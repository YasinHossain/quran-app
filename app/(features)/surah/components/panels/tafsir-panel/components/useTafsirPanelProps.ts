'use client';

import React from 'react';

import type { TafsirListProps } from './TafsirList';
import type { TafsirSearchSectionProps } from './TafsirSearchSection';
import type { TafsirTabsProps } from './TafsirTabs';
import type { TafsirResource } from '@/types';

interface SearchPropsArgs {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  orderedSelection: number[];
  tafsirs: TafsirResource[];
  handleSelectionToggle: (id: number) => void;
  onReorder: (ids: number[]) => void;
  onReset: () => void;
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
  activeFilter: string;
  sectionsToRender: Array<{ language: string; items: TafsirResource[] }>;
  resources: TafsirResource[];
  selectedIds: Set<number>;
  onToggle: (id: number) => void;
  height: number;
  total: number;
}

export const useTafsirSearchProps = ({
  searchTerm,
  setSearchTerm,
  orderedSelection,
  tafsirs,
  handleSelectionToggle,
  onReorder,
  onReset,
}: SearchPropsArgs): TafsirSearchSectionProps =>
  React.useMemo(
    () => ({
      searchTerm,
      setSearchTerm,
      orderedSelection,
      tafsirs,
      handleSelectionToggle,
      onReorder,
      onReset,
    }),
    [
      searchTerm,
      setSearchTerm,
      orderedSelection,
      tafsirs,
      handleSelectionToggle,
      onReorder,
      onReset,
    ]
  );

export const useTafsirTabsProps = ({
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

export const useTafsirListProps = ({
  activeFilter,
  sectionsToRender,
  resources,
  selectedIds,
  onToggle,
  height,
  total,
}: ListPropsArgs): TafsirListProps =>
  React.useMemo(
    () => ({ activeFilter, sectionsToRender, resources, selectedIds, onToggle, height, total }),
    [activeFilter, sectionsToRender, resources, selectedIds, onToggle, height, total]
  );
