'use client';

import { useTheme } from '@/app/providers/ThemeContext';

import { useTafsir } from './useTafsir';
import { useTafsirSelection } from './useTafsirSelection';
import { useTafsirTabsScroll } from './useTafsirTabsScroll';

export const useTafsirPanel = (isOpen: boolean) => {
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
  } as const;
};
