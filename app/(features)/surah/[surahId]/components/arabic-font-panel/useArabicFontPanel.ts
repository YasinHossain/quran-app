'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTheme } from '@/app/providers/ThemeContext';
import { useSettings } from '@/app/providers/SettingsContext';

export const MAX_SELECTIONS = 1; // Only one font can be selected at a time

interface ArabicFont {
  name: string;
  value: string;
  category: string;
  id: number;
  lang: string;
}

export const useArabicFontPanel = (isOpen: boolean) => {
  const { theme } = useTheme();
  const { settings, setSettings, arabicFonts } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [orderedSelection, setOrderedSelection] = useState<number[]>([]);
  const [draggedId, setDraggedId] = useState<number | null>(null);

  const tabsContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Convert arabicFonts to have consistent interface with other resources
  const fonts: ArabicFont[] = useMemo(() => {
    return arabicFonts.map((font, index) => ({
      ...font,
      id: index + 1,
      lang: font.category,
    }));
  }, [arabicFonts]);

  // Initialize selection from settings
  useEffect(() => {
    if (settings.arabicFontFace && fonts.length > 0) {
      const selectedFont = fonts.find((font) => font.value === settings.arabicFontFace);
      if (selectedFont) {
        setSelectedIds(new Set([selectedFont.id]));
        setOrderedSelection([selectedFont.id]);
      }
    }
  }, [settings.arabicFontFace, fonts]);

  // Filter fonts by search term
  const filteredFonts = useMemo(() => {
    if (!searchTerm) return fonts;
    return fonts.filter((font) => font.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [fonts, searchTerm]);

  // Group fonts by category
  const groupedFonts = useMemo(() => {
    const grouped = filteredFonts.reduce(
      (acc, font) => {
        const group = font.category || 'Other';
        (acc[group] = acc[group] || []).push(font);
        return acc;
      },
      {} as Record<string, ArabicFont[]>
    );

    // Sort within each group
    Object.keys(grouped).forEach((key) => {
      grouped[key].sort((a, b) => a.name.localeCompare(b.name));
    });

    return grouped;
  }, [filteredFonts]);

  // Font groups for tabs
  const fontGroups = useMemo(() => {
    const groups = Object.keys(groupedFonts).sort((a, b) => {
      if (a === 'Uthmani') return -1;
      if (b === 'Uthmani') return 1;
      if (a === 'Indopak') return -1;
      if (b === 'Indopak') return 1;
      return a.localeCompare(b);
    });
    return ['All', ...groups];
  }, [groupedFonts]);

  // Handle selection toggle
  const handleSelectionToggle = useCallback(
    (id: number) => {
      const font = fonts.find((f) => f.id === id);
      if (!font) return;

      // For fonts, only allow single selection
      setSelectedIds(new Set([id]));
      setOrderedSelection([id]);

      // Update settings
      setSettings({
        ...settings,
        arabicFontFace: font.value,
      });
    },
    [fonts, settings, setSettings]
  );

  // Handle reset
  const handleReset = useCallback(() => {
    setSelectedIds(new Set());
    setOrderedSelection([]);
    // Reset to default font (usually the first Uthmani font)
    const defaultFont = fonts.find((font) => font.category === 'Uthmani');
    if (defaultFont) {
      setSettings({
        ...settings,
        arabicFontFace: defaultFont.value,
      });
    }
  }, [fonts, settings, setSettings]);

  // Drag and drop handlers (simplified for single selection)
  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, id: number) => {
    setDraggedId(id);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>, targetId: number) => {
    e.preventDefault();
    // For single selection, no reordering needed
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
  }, []);

  // Tab scrolling
  const updateScrollButtons = useCallback(() => {
    const container = tabsContainerRef.current;
    if (!container) return;

    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth);
  }, []);

  const scrollTabsLeft = useCallback(() => {
    tabsContainerRef.current?.scrollBy({ left: -200, behavior: 'smooth' });
  }, []);

  const scrollTabsRight = useCallback(() => {
    tabsContainerRef.current?.scrollBy({ left: 200, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const container = tabsContainerRef.current;
    if (!container) return;

    container.addEventListener('scroll', updateScrollButtons);
    updateScrollButtons();

    return () => container.removeEventListener('scroll', updateScrollButtons);
  }, [updateScrollButtons]);

  return {
    theme,
    fonts: filteredFonts,
    loading: false,
    error: undefined,
    fontGroups,
    groupedFonts,
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
    scrollTabsLeft,
    scrollTabsRight,
  };
};
