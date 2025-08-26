'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from '@/presentation/providers/ThemeContext';
import { useSettings } from '@/presentation/providers/SettingsContext';

export const MAX_SELECTIONS = 1; // Only one font can be selected at a time

interface ArabicFont {
  name: string;
  value: string;
  category: string;
  id: number;
  lang: string;
}

export const useArabicFontPanel = () => {
  const { theme } = useTheme();
  const { settings, setSettings, arabicFonts } = useSettings();
  const [activeFilter, setActiveFilter] = useState('Uthmani');
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

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
      }
    }
  }, [settings.arabicFontFace, fonts]);

  // Group fonts by category
  const groupedFonts = useMemo(() => {
    const grouped = fonts.reduce(
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
  }, [fonts]);

  // Handle selection toggle
  const handleSelectionToggle = useCallback(
    (id: number) => {
      const font = fonts.find((f) => f.id === id);
      if (!font) return;

      // For fonts, only allow single selection
      setSelectedIds(new Set([id]));

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
    // Reset to default font (usually the first Uthmani font)
    const defaultFont = fonts.find((font) => font.category === 'Uthmani');
    if (defaultFont) {
      setSettings({
        ...settings,
        arabicFontFace: defaultFont.value,
      });
    }
  }, [fonts, settings, setSettings]);

  return {
    theme,
    fonts,
    loading: false,
    error: undefined,
    groupedFonts,
    activeFilter,
    setActiveFilter,
    selectedIds,
    handleSelectionToggle,
    handleReset,
  };
};
