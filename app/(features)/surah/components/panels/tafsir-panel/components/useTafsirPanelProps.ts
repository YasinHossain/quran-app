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

export const useTafsirSearchProps = ({
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
