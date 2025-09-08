'use client';

import type {
  Dispatch,
  SetStateAction,
  RefObject,
  DragEvent,
} from 'react';

import { useTheme } from '@/app/providers/ThemeContext';
import type { Theme } from '@/app/providers/ThemeContext';
import type { TafsirResource } from '@/types';

import { useTafsir } from './useTafsir';
import { useTafsirSelection } from './useTafsirSelection';
import { useTafsirTabsScroll } from './useTafsirTabsScroll';

export interface UseTafsirPanelReturn {
  theme: Theme;
  tafsirs: TafsirResource[];
  loading: boolean;
  error: string | null;
  isFromCache: boolean;

  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  languages: string[];
  groupedTafsirs: Record<string, TafsirResource[]>;
  activeFilter: string;
  setActiveFilter: Dispatch<SetStateAction<string>>;

  selectedIds: Set<number>;
  orderedSelection: number[];
  handleSelectionToggle: (id: number) => boolean;
  showLimitWarning: boolean;

  handleDragStart: (e: DragEvent<HTMLDivElement>, id: number) => void;
  handleDragOver: (e: DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: DragEvent<HTMLDivElement>, targetId: number) => void;
  handleDragEnd: () => void;
  draggedId: number | null;

  handleReset: () => void;

  tabsContainerRef: RefObject<HTMLDivElement>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollTabsLeft: () => void;
  scrollTabsRight: () => void;
}

export const useTafsirPanel = (isOpen: boolean): UseTafsirPanelReturn => {
  const { theme } = useTheme();

  const { tafsirs: domainTafsirs, loading: apiLoading, error: apiError, isFromCache } = useTafsir();

  const {
    tafsirs,
    searchTerm,
    setSearchTerm,
    languages,
    groupedTafsirs,
    activeFilter,
    setActiveFilter,
    selectedIds,
    orderedSelection,
    handleSelectionToggle,
    showLimitWarning,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    draggedId,
    handleReset,
  } = useTafsirSelection(domainTafsirs);

  const { tabsContainerRef, canScrollLeft, canScrollRight, scrollTabsLeft, scrollTabsRight } =
    useTafsirTabsScroll(languages);

  const loading = isOpen && apiLoading;
  const error = apiError;

  return {
    theme,
    tafsirs,
    loading,
    error,
    isFromCache,

    searchTerm,
    setSearchTerm,
    languages,
    groupedTafsirs,
    activeFilter,
    setActiveFilter,

    selectedIds,
    orderedSelection,
    handleSelectionToggle,
    showLimitWarning,

    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    draggedId,

    handleReset,

    tabsContainerRef,
    canScrollLeft,
    canScrollRight,
    scrollTabsLeft,
    scrollTabsRight,
  };
};
