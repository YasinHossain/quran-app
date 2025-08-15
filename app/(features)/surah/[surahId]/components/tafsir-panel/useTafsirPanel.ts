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
  const { data } = useSWR('tafsirs', getTafsirResources);

  const [tafsirs, setTafsirs] = useState<Tafsir[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const loadTafsirs = async () => {
      try {
        setLoading(true);
        setError(null);
        if (data) {
          const formatted: Tafsir[] = data.map((t) => ({
            id: t.id,
            name: t.name,
            lang: capitalizeLanguageName(t.language_name),
            selected: false,
          }));
          setTafsirs(formatted);
        }
      } catch {
        setError('Failed to load tafsirs. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    if (isOpen) {
      loadTafsirs();
    }
  }, [isOpen, data]);

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

  const isUpdatingRef = useRef(false);
  useEffect(() => {
    if (isUpdatingRef.current) return;
    const current = [...orderedSelection];
    const settingsIds = settings.tafsirIds || [];
    if (JSON.stringify(current) !== JSON.stringify(settingsIds)) {
      isUpdatingRef.current = true;
      setTafsirIds(current);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 50);
    }
  }, [orderedSelection, setTafsirIds, settings.tafsirIds]);

  useEffect(() => {
    if (isOpen && tafsirs.length > 0) {
      const settingsIds = settings.tafsirIds || [];
      isUpdatingRef.current = true;
      setSelections(settingsIds);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 50);
    }
  }, [isOpen, tafsirs.length, settings.tafsirIds, setSelections]);

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
