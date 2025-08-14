'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import useSWR from 'swr';
import { useTheme } from '@/app/providers/ThemeContext';
import { useSettings } from '@/app/providers/SettingsContext';
import { getTafsirResources } from '@/lib/api';
import { capitalizeLanguageName, MAX_SELECTIONS, Tafsir } from './tafsirPanel.utils';

export const useTafsirPanel = (isOpen: boolean) => {
  const { theme } = useTheme();
  const { settings, setTafsirIds } = useSettings();
  const { data } = useSWR('tafsirs', getTafsirResources);

  const [tafsirs, setTafsirs] = useState<Tafsir[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [orderedSelection, setOrderedSelection] = useState<number[]>([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [showLimitWarning, setShowLimitWarning] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const stickyHeaderRef = useRef<HTMLDivElement>(null);
  const tabsContainerRef = useRef<HTMLDivElement>(null);

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

  const isUpdatingRef = useRef(false);

  useEffect(() => {
    if (isUpdatingRef.current) return;
    const currentSelection = [...orderedSelection];
    const settingsIds = settings.tafsirIds || [];
    if (JSON.stringify(currentSelection) !== JSON.stringify(settingsIds)) {
      isUpdatingRef.current = true;
      setTafsirIds(currentSelection);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 50);
    }
  }, [orderedSelection, setTafsirIds, settings.tafsirIds]);

  useEffect(() => {
    if (isOpen && tafsirs.length > 0) {
      const settingsIds = settings.tafsirIds || [];
      isUpdatingRef.current = true;
      setSelectedIds(new Set(settingsIds));
      setOrderedSelection(settingsIds);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 50);
    }
  }, [isOpen, tafsirs.length, settings.tafsirIds]);

  const languages = useMemo(() => {
    const unique = [...new Set(tafsirs.map((t) => t.lang))];
    const sorted = unique.sort((a, b) => {
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
    });
    return ['All', ...sorted];
  }, [tafsirs]);

  const filteredTafsirs = useMemo(() => {
    if (searchTerm === '') return tafsirs;
    const searchLower = searchTerm.toLowerCase();
    return tafsirs.filter(
      (item) =>
        item.name.toLowerCase().includes(searchLower) ||
        item.lang.toLowerCase().includes(searchLower)
    );
  }, [tafsirs, searchTerm]);

  const groupedTafsirs = useMemo(() => {
    return filteredTafsirs.reduce(
      (acc, item) => {
        (acc[item.lang] = acc[item.lang] || []).push(item);
        return acc;
      },
      {} as Record<string, Tafsir[]>
    );
  }, [filteredTafsirs]);

  const handleSelectionToggle = (id: number) => {
    const newSelected = new Set(selectedIds);
    let newOrdered = [...orderedSelection];

    if (newSelected.has(id)) {
      newSelected.delete(id);
      newOrdered = newOrdered.filter((sel) => sel !== id);
      setShowLimitWarning(false);
    } else {
      if (selectedIds.size >= MAX_SELECTIONS) {
        setShowLimitWarning(true);
        setTimeout(() => setShowLimitWarning(false), 3000);
        return;
      }
      newSelected.add(id);
      newOrdered.push(id);
    }

    setSelectedIds(newSelected);
    setOrderedSelection(newOrdered);
  };

  const handleTabClick = (lang: string) => {
    setActiveFilter(lang);
    if (lang === 'All') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const header = document.querySelector(`.lang-header[data-lang="${lang}"]`);
      if (header && stickyHeaderRef.current) {
        const headerTop =
          header.getBoundingClientRect().top +
          window.pageYOffset -
          stickyHeaderRef.current.offsetHeight;
        window.scrollTo({ top: headerTop, behavior: 'smooth' });
      }
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, id: number) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: number) => {
    e.preventDefault();
    if (draggedId === null || draggedId === targetId) {
      setDraggedId(null);
      return;
    }
    const newOrdered = [...orderedSelection];
    const draggedIndex = newOrdered.indexOf(draggedId);
    const targetIndex = newOrdered.indexOf(targetId);
    const [draggedItem] = newOrdered.splice(draggedIndex, 1);
    newOrdered.splice(targetIndex, 0, draggedItem);
    setOrderedSelection(newOrdered);
    setDraggedId(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
  };

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
      const newSelected = new Set([englishTafsir.id]);
      const newOrdered = [englishTafsir.id];
      setSelectedIds(newSelected);
      setOrderedSelection(newOrdered);
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
    groupedTafsirs,
    selectedIds,
    orderedSelection,
    handleSelectionToggle,
    handleTabClick,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    draggedId,
    showLimitWarning,
    activeFilter,
    stickyHeaderRef,
    tabsContainerRef,
    canScrollLeft,
    canScrollRight,
    scrollTabsLeft,
    scrollTabsRight,
    handleReset,
  };
};
