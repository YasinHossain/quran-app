'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';

import { useSettings } from '@/app/providers/SettingsContext';
import { useTheme } from '@/app/providers/ThemeContext';

import { useTafsir } from './useTafsir';

interface TafsirPanelData {
  id: number;
  name: string;
  lang: string;
  selected: boolean;
}

interface GroupedTafsirs {
  [language: string]: TafsirPanelData[];
}

const MAX_SELECTIONS = 3;

export const useTafsirPanel = (isOpen: boolean) => {
  const { theme } = useTheme();
  const { settings, setTafsirIds } = useSettings();

  // Use clean architecture hook
  const { tafsirs: domainTafsirs, loading: apiLoading, error: apiError, isFromCache } = useTafsir();

  // UI state
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [draggedId, setDraggedId] = useState<number | null>(null);

  // Scroll state for tabs
  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Convert domain entities to UI format
  const tafsirs = useMemo((): TafsirPanelData[] => {
    return domainTafsirs.map((domainTafsir) => ({
      id: domainTafsir.id,
      name: domainTafsir.displayName,
      lang: domainTafsir.formattedLanguage,
      selected: false, // This will be handled by selection logic
    }));
  }, [domainTafsirs]);

  // Only show loading when panel is open and API is loading
  const loading = isOpen && apiLoading;

  // Error handling
  const error = apiError;

  // Selection management
  const selectedIds = useMemo(() => {
    return new Set(settings.tafsirIds || []);
  }, [settings.tafsirIds]);

  const orderedSelection = useMemo(() => {
    return settings.tafsirIds || [];
  }, [settings.tafsirIds]);

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

  // Filtered and grouped tafsirs
  const filteredTafsirs = useMemo(() => {
    if (!searchTerm) return tafsirs;

    const term = searchTerm.toLowerCase();
    return tafsirs.filter(
      (t) => t.name.toLowerCase().includes(term) || t.lang.toLowerCase().includes(term)
    );
  }, [tafsirs, searchTerm]);

  const groupedTafsirs: GroupedTafsirs = useMemo(() => {
    return filteredTafsirs.reduce((acc, tafsir) => {
      (acc[tafsir.lang] = acc[tafsir.lang] || []).push(tafsir);
      return acc;
    }, {} as GroupedTafsirs);
  }, [filteredTafsirs]);

  // Available languages
  const languages = useMemo(() => {
    const unique = Array.from(new Set(tafsirs.map((t) => t.lang)));
    const sorted = unique.sort(languageSort);
    return ['All', ...sorted];
  }, [tafsirs, languageSort]);

  // Selection handlers
  const handleSelectionToggle = useCallback(
    (id: number): boolean => {
      const newSelected = new Set(selectedIds);
      let newOrder = [...orderedSelection];
      let changed = false;

      if (newSelected.has(id)) {
        newSelected.delete(id);
        newOrder = newOrder.filter((i) => i !== id);
        changed = true;
      } else {
        if (newSelected.size >= MAX_SELECTIONS) {
          setShowLimitWarning(true);
          return false;
        }
        newSelected.add(id);
        newOrder.push(id);
        changed = true;
      }

      if (changed) {
        setTafsirIds(newOrder);
        setShowLimitWarning(false);
      }
      return changed;
    },
    [selectedIds, orderedSelection, setTafsirIds]
  );

  // Drag handlers
  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, id: number) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, targetId: number) => {
      e.preventDefault();
      if (draggedId === null || draggedId === targetId) {
        setDraggedId(null);
        return;
      }

      const newOrder = [...orderedSelection];
      const fromIndex = newOrder.indexOf(draggedId);
      const toIndex = newOrder.indexOf(targetId);

      if (fromIndex > -1 && toIndex > -1) {
        const [movedItem] = newOrder.splice(fromIndex, 1);
        newOrder.splice(toIndex, 0, movedItem);
        setTafsirIds(newOrder);
      }

      setDraggedId(null);
    },
    [draggedId, orderedSelection, setTafsirIds]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
  }, []);

  // Reset handler
  const handleReset = useCallback(() => {
    const englishTafsir = tafsirs.find((t) => t.lang.toLowerCase() === 'english');
    if (englishTafsir) {
      setTafsirIds([englishTafsir.id]);
      setShowLimitWarning(false);
    }
  }, [tafsirs, setTafsirIds]);

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
  };
};
