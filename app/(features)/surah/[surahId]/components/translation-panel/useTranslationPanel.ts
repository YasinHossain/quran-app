'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@/app/providers/ThemeContext';
import { useSettings } from '@/app/providers/SettingsContext';
import { getTranslations } from '@/lib/api/translations';
import { TranslationResource } from '@/types';
import useSelectableResources from '@/lib/hooks/useSelectableResources';
import {
  capitalizeLanguageName,
  loadSelectedTranslations,
  saveSelectedTranslations,
  scrollTabs,
  updateScrollState,
} from './translationPanel.utils';
import { initialTranslationsData } from './translationPanel.data';
import { Translation } from './translationPanel.types';

export const MAX_SELECTIONS = 5;

export const useTranslationPanel = (isOpen: boolean) => {
  const { theme } = useTheme();
  const { settings, setTranslationIds } = useSettings();
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const loadTranslationsAsync = async () => {
      try {
        setLoading(true);
        setError(null);
        const apiTranslations = await getTranslations();
        const formatted: Translation[] = apiTranslations.map((t: TranslationResource) => ({
          id: t.id,
          name: t.name,
          lang: capitalizeLanguageName(t.language_name),
        }));
        setTranslations(formatted);
      } catch (error) {
        console.error('Failed to fetch translations from API:', error);
        setError('Failed to load translations from API. Using offline data.');
        setTranslations(initialTranslationsData);
      } finally {
        setLoading(false);
      }
    };

    // Load translations immediately on first mount to ensure they're available
    if (translations.length === 0) {
      loadTranslationsAsync();
    }
  }, [isOpen, translations.length]);

  // Language sort function: English first, Bengali second, then alphabetical
  const languageSort = (a: string, b: string) => {
    if (a === 'English') return -1;
    if (b === 'English') return 1;
    if (a === 'Bengali') return -1;
    if (b === 'Bengali') return 1;
    return a.localeCompare(b);
  };

  const selectable = useSelectableResources<Translation>({
    resources: translations,
    selectionLimit: MAX_SELECTIONS,
    languageSort,
  });

  const {
    searchTerm,
    setSearchTerm,
    languages,
    groupedResources,
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
    setSelections,
  } = selectable;

  const isUpdatingRef = useRef(false);

  // Initialize selections once when translations are first loaded
  const hasInitialized = useRef(false);
  useEffect(() => {
    if (translations.length > 0 && !hasInitialized.current && !isUpdatingRef.current) {
      hasInitialized.current = true;
      const settingsIds = settings.translationIds || loadSelectedTranslations();
      if (settingsIds.length > 0) {
        isUpdatingRef.current = true;
        setSelections(settingsIds);
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 100);
      }
    }
  }, [translations.length, setSelections, settings.translationIds]);

  // Save selections when they change
  useEffect(() => {
    if (isUpdatingRef.current) return;

    const current = [...orderedSelection];
    setTranslationIds(current);
    saveSelectedTranslations(current);
  }, [orderedSelection, setTranslationIds]);

  const handleTabsScroll = useCallback(
    () => updateScrollState(tabsContainerRef, setCanScrollLeft, setCanScrollRight),
    []
  );

  useEffect(() => {
    handleTabsScroll();
    const container = tabsContainerRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleTabsScroll);
    window.addEventListener('resize', handleTabsScroll);
    return () => {
      container.removeEventListener('scroll', handleTabsScroll);
      window.removeEventListener('resize', handleTabsScroll);
    };
  }, [languages, handleTabsScroll]);

  const handleReset = () => {
    const sahih = translations.find(
      (t) =>
        t.name.toLowerCase().includes('saheeh international') ||
        t.name.toLowerCase().includes('sahih international')
    );
    if (sahih) {
      setSelections([sahih.id]);
    } else {
      setSelections([]);
    }
  };

  return {
    theme,
    translations,
    loading,
    error,
    languages,
    groupedTranslations: groupedResources,
    activeFilter,
    setActiveFilter,
    searchTerm,
    setSearchTerm,
    selectedIds,
    handleSelectionToggle,
    orderedSelection,
    handleReset,
    draggedId,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    tabsContainerRef,
    canScrollLeft,
    canScrollRight,
    scrollTabsLeft: () => scrollTabs(tabsContainerRef, 'left'),
    scrollTabsRight: () => scrollTabs(tabsContainerRef, 'right'),
  } as const;
};
