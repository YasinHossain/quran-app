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
      } catch {
        setTranslations(initialTranslationsData);
      } finally {
        setLoading(false);
      }
    };
    if (isOpen) loadTranslationsAsync();
  }, [isOpen]);

  const selectable = useSelectableResources<Translation>({
    resources: translations,
    selectionLimit: MAX_SELECTIONS,
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
    setSelections,
  } = selectable;

  const isUpdatingRef = useRef(false);
  useEffect(() => {
    if (isUpdatingRef.current) return;
    const current = [...orderedSelection];
    const settingsIds = settings.translationIds || [];
    if (JSON.stringify(current) !== JSON.stringify(settingsIds)) {
      isUpdatingRef.current = true;
      setTranslationIds(current);
      saveSelectedTranslations(current);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 50);
    }
  }, [orderedSelection, setTranslationIds, settings.translationIds]);

  useEffect(() => {
    if (isOpen && translations.length > 0) {
      const settingsIds = settings.translationIds || loadSelectedTranslations();
      isUpdatingRef.current = true;
      setSelections(settingsIds);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 50);
    }
  }, [isOpen, translations.length, settings.translationIds, setSelections]);

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

  const resetSelection = () => {
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
    resetSelection,
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
