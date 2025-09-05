'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

import { useSettings } from '@/app/providers/SettingsContext';
import { useTheme } from '@/app/providers/ThemeContext';
import { useSelectableResources } from '@/lib/hooks/useSelectableResources';
import { TafsirResource } from '@/types';

import { useTafsir } from './useTafsir';

const MAX_SELECTIONS = 3;

export const useTafsirPanel = (isOpen: boolean) => {
  const { theme } = useTheme();
  const { settings, setTafsirIds } = useSettings();

  const {
    tafsirs: domainTafsirs,
    loading: apiLoading,
    error: apiError,
    isFromCache,
  } = useTafsir();

  const [showLimitWarning, setShowLimitWarning] = useState(false);

  // Scroll state for tabs
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Map domain entities to generic resource shape
  const tafsirs = useMemo<TafsirResource[]>(() => {
    return domainTafsirs.map((t) => ({
      id: t.id,
      name: t.displayName,
      lang: t.formattedLanguage,
    }));
  }, [domainTafsirs]);

  // Only show loading when panel is open and API is loading
  const loading = isOpen && apiLoading;

  // Error handling
  const error = apiError;

  // Language sorting logic from domain
  const languageSort = useCallback(
    (a: string, b: string) => {
      const getDomainTafsir = (lang: string) =>
        domainTafsirs.find((t) => t.formattedLanguage === lang);

      const tafsirA = getDomainTafsir(a);
      const tafsirB = getDomainTafsir(b);

      if (!tafsirA || !tafsirB) return a.localeCompare(b);

      const priorityA = tafsirA.getLanguagePriority();
      const priorityB = tafsirB.getLanguagePriority();

      if (priorityA !== priorityB) return priorityA - priorityB;
      return a.localeCompare(b);
    },
    [domainTafsirs]
  );

  const {
    searchTerm,
    setSearchTerm,
    languages,
    groupedResources,
    activeFilter,
    setActiveFilter,
    selectedIds,
    orderedSelection,
    handleSelectionToggle: baseHandleSelectionToggle,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    draggedId,
    setSelections,
  } = useSelectableResources<TafsirResource>({
    resources: tafsirs,
    selectionLimit: MAX_SELECTIONS,
    initialSelectedIds: settings.tafsirIds || [],
    languageSort,
  });

  const groupedTafsirs = groupedResources;

  const handleSelectionToggle = useCallback(
    (id: number): boolean => {
      const changed = baseHandleSelectionToggle(id);
      if (!changed) {
        setShowLimitWarning(true);
        return false;
      }
      setShowLimitWarning(false);
      return true;
    },
    [baseHandleSelectionToggle]
  );

  const handleReset = useCallback(() => {
    const englishTafsir = tafsirs.find((t) => t.lang.toLowerCase() === 'english');
    if (englishTafsir) {
      setSelections([englishTafsir.id]);
      setShowLimitWarning(false);
    }
  }, [tafsirs, setSelections]);

  useEffect(() => {
    setTafsirIds([...orderedSelection]);
  }, [orderedSelection, setTafsirIds]);

  // Scroll management for tabs
  const checkScrollState = useCallback(() => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  const scrollTabsLeft = useCallback(() => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  }, []);

  const scrollTabsRight = useCallback(() => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  }, []);

  // Setup scroll listeners
  useEffect(() => {
    checkScrollState();
    if (tabsContainerRef.current) {
      const container = tabsContainerRef.current;
      container.addEventListener('scroll', checkScrollState);
      window.addEventListener('resize', checkScrollState);
      return () => {
        container.removeEventListener('scroll', checkScrollState);
        window.removeEventListener('resize', checkScrollState);
      };
    }
  }, [languages, checkScrollState]);

  return {
    // Data
    theme,
    tafsirs,
    loading,
    error,
    isFromCache,

    // Search & Filter
    searchTerm,
    setSearchTerm,
    languages,
    groupedTafsirs,
    activeFilter,
    setActiveFilter,

    // Selection
    selectedIds,
    orderedSelection,
    handleSelectionToggle,
    showLimitWarning,

    // Drag & Drop
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    draggedId,

    // Actions
    handleReset,

    // Scroll
    tabsContainerRef,
    canScrollLeft,
    canScrollRight,
    scrollTabsLeft,
    scrollTabsRight,
  } as const;
};

