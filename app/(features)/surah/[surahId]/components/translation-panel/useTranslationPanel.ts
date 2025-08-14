'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useTheme } from '@/app/providers/ThemeContext';
import { useSettings } from '@/app/providers/SettingsContext';
import { getTranslations } from '@/lib/api/translations';
import { TranslationResource } from '@/types';
import { Translation } from './translationPanel.types';
import {
  capitalizeLanguageName,
  loadSelectedTranslations,
  saveSelectedTranslations,
  handleDragStart,
  handleDragOver,
  handleDrop,
  handleDragEnd,
  scrollTabs,
  updateScrollState,
  scrollToTab,
} from './translationPanel.utils';
import { initialTranslationsData } from './translationPanel.data';

export const MAX_SELECTIONS = 5;

export const useTranslationPanel = (isOpen: boolean) => {
  const { theme } = useTheme();
  const { settings, setTranslationIds } = useSettings();
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [orderedSelection, setOrderedSelection] = useState<number[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const loadTranslations = async () => {
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
    if (isOpen) loadTranslations();
  }, [isOpen]);

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
      setSelectedIds(new Set(settingsIds));
      setOrderedSelection(settingsIds);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 50);
    }
  }, [isOpen, translations.length, settings.translationIds]);

  const languages = Array.from(new Set(translations.map((t) => t.lang))).sort((a, b) =>
    a.localeCompare(b)
  );
  languages.unshift('All');

  const filteredTranslations = translations.filter((t) => {
    if (!searchTerm) return true;
    const lower = searchTerm.toLowerCase();
    return t.name.toLowerCase().includes(lower) || t.lang.toLowerCase().includes(lower);
  });

  const groupedTranslations = filteredTranslations.reduce(
    (acc, item) => {
      (acc[item.lang] = acc[item.lang] || []).push(item);
      return acc;
    },
    {} as Record<string, Translation[]>
  );

  const handleSelectionToggle = (id: number) => {
    const newSelectedIds = new Set(selectedIds);
    let newOrder = [...orderedSelection];
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
      newOrder = newOrder.filter((i) => i !== id);
    } else {
      if (newSelectedIds.size >= MAX_SELECTIONS) return;
      newSelectedIds.add(id);
      newOrder.push(id);
    }
    setSelectedIds(newSelectedIds);
    setOrderedSelection(newOrder);
  };

  const onTabClick = (lang: string) => setActiveFilter(lang);

  const resetSelection = () => {
    const sahih = translations.find(
      (t) =>
        t.name.toLowerCase().includes('saheeh international') ||
        t.name.toLowerCase().includes('sahih international')
    );
    if (sahih) {
      setSelectedIds(new Set([sahih.id]));
      setOrderedSelection([sahih.id]);
    } else {
      setSelectedIds(new Set());
      setOrderedSelection([]);
    }
  };

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

  return {
    theme,
    translations,
    loading,
    error,
    languages,
    groupedTranslations,
    activeFilter,
    setActiveFilter: onTabClick,
    searchTerm,
    setSearchTerm,
    selectedIds,
    handleSelectionToggle,
    orderedSelection,
    resetSelection,
    handleDragStart: (e: React.DragEvent<HTMLDivElement>, id: number) =>
      handleDragStart(e, id, setDraggedId),
    handleDragOver,
    handleDrop: (e: React.DragEvent<HTMLDivElement>, id: number) =>
      handleDrop(e, id, draggedId, orderedSelection, setOrderedSelection, setDraggedId),
    handleDragEnd: () => handleDragEnd(setDraggedId),
    tabsContainerRef,
    canScrollLeft,
    canScrollRight,
    scrollTabsLeft: () => scrollTabs(tabsContainerRef, 'left'),
    scrollTabsRight: () => scrollTabs(tabsContainerRef, 'right'),
    scrollToTab: (lang: string) => scrollToTab(tabsContainerRef, languages, lang),
  } as const;
};
