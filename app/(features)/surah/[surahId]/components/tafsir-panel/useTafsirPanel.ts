'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import useSWR from 'swr';
import { useTheme } from '@/app/providers/ThemeContext';
import { useSettings } from '@/app/providers/SettingsContext';
import { getTafsirResources } from '@/lib/api';
import useSelectableResources from '@/lib/hooks/useSelectableResources';
import { capitalizeLanguageName, MAX_SELECTIONS, Tafsir } from './tafsirPanel.utils';

export const useTafsirPanel = (isOpen: boolean) => {
  const { theme } = useTheme();
  const { settings, setTafsirIds } = useSettings();
  const { data, error: fetchError } = useSWR('tafsirs', getTafsirResources);

  const [tafsirs, setTafsirs] = useState<Tafsir[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (data === undefined && !fetchError) return;
    setLoading(true);
    if (fetchError || !data) {
      const cached = localStorage.getItem('tafsirs');
      if (cached) setTafsirs(JSON.parse(cached));
      setError('Failed to load tafsirs. Please try again.');
      setLoading(false);
      return;
    }
    if (data.length > 0) {
      const formatted: Tafsir[] = data.map((t) => ({
        id: t.id,
        name: t.name,
        lang: capitalizeLanguageName(t.language_name),
        selected: false,
      }));
      setTafsirs(formatted);
      localStorage.setItem('tafsirs', JSON.stringify(formatted));
      setError(null);
    } else {
      const cached = localStorage.getItem('tafsirs');
      if (cached) setTafsirs(JSON.parse(cached));
      setError('Failed to load tafsirs. Please try again.');
    }
    setLoading(false);
  }, [isOpen, data, fetchError]);

  const languageSort = (a: string, b: string) => {
    const lower = (lang: string) => lang.toLowerCase();
    const priority = (lang: string) => {
      const l = lower(lang);
      if (l === 'english') return 0;
      if (l === 'bengali' || l === 'bangla') return 1;
      if (l === 'arabic') return 2;
      return 3;
    };
    const pa = priority(a);
    const pb = priority(b);
    if (pa !== pb) return pa - pb;
    return a.localeCompare(b);
  };

  const selectable = useSelectableResources<Tafsir>({
    resources: tafsirs,
    selectionLimit: MAX_SELECTIONS,
    initialSelectedIds: settings.tafsirIds || [],
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
    handleSelectionToggle: baseToggle,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    draggedId,
    setSelections,
  } = selectable;

  const handleSelectionToggle = (id: number) => {
    const changed = baseToggle(id);
    setShowLimitWarning(!changed && selectedIds.size >= MAX_SELECTIONS);
  };

  // Sync selections TO settings when user makes changes
  useEffect(() => {
    const current = [...orderedSelection];
    setTafsirIds(current);
  }, [orderedSelection, setTafsirIds]);

  const checkScrollState = useCallback(() => {
    if (tabsContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  const scrollTabsLeft = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollTabsRight = () => {
    if (tabsContainerRef.current) {
      tabsContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

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

  const handleReset = () => {
    const englishTafsir = tafsirs.find((t) => t.lang.toLowerCase() === 'english');
    if (englishTafsir) {
      setSelections([englishTafsir.id]);
      setShowLimitWarning(false);
    }
  };

  return {
    theme,
    tafsirs,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    languages,
    groupedTafsirs: groupedResources,
    selectedIds,
    orderedSelection,
    handleSelectionToggle,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    draggedId,
    showLimitWarning,
    activeFilter,
    setActiveFilter,
    tabsContainerRef,
    canScrollLeft,
    canScrollRight,
    scrollTabsLeft,
    scrollTabsRight,
    handleReset,
  };
};
