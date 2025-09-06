'use client';

import { useTheme } from '@/app/providers/ThemeContext';

import { useTabsScroll } from './hooks/useTabsScroll';
import { useTranslationsData } from './hooks/useTranslationsData';
import { useTranslationSelection } from './hooks/useTranslationSelection';

export const useTranslationPanel = () => {
  const { theme } = useTheme();
  const { translations, loading, error, languageSort } = useTranslationsData();
  const {
    searchTerm,
    setSearchTerm,
    languages,
    groupedTranslations,
    activeFilter,
    setActiveFilter,
    selectedIds,
    orderedSelection,
    handleSelectionToggle,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    draggedId,
    handleReset,
  } = useTranslationSelection(translations, languageSort);
  const { tabsContainerRef, canScrollLeft, canScrollRight, scrollTabsLeft, scrollTabsRight } =
    useTabsScroll(languages);

  return {
    theme,
    translations,
    loading,
    error,
    languages,
    groupedTranslations,
    activeFilter,
    setActiveFilter,
    searchTerm,
    setSearchTerm,
    selectedIds,
    orderedSelection,
    handleSelectionToggle,
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
