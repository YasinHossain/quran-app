'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';

import { useSettings } from '@/app/providers/SettingsContext';
import { useTheme } from '@/app/providers/ThemeContext';

export const MAX_ARABIC_FONT_SELECTIONS = 1; // Only one font can be selected at a time

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
  const { selectedIds, handleSelectionToggle, handleReset, initializeFromSettings } =
    useArabicFontSelection(settings, setSettings);

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
    initializeFromSettings(fonts);
  }, [initializeFromSettings, fonts]);

  // Group fonts by category
  const groupedFonts = useMemo(() => groupAndSortFonts(fonts), [fonts]);

  const onToggle = useCallback(
    (id: number) => handleSelectionToggle(id, fonts),
    [handleSelectionToggle, fonts]
  );
  const onReset = useCallback(() => handleReset(fonts), [handleReset, fonts]);

  return {
    theme,
    fonts,
    loading: false,
    error: undefined,
    groupedFonts,
    activeFilter,
    setActiveFilter,
    selectedIds,
    handleSelectionToggle: onToggle,
    handleReset: onReset,
  };
};

function groupAndSortFonts(fonts: ArabicFont[]): Record<string, ArabicFont[]> {
  const grouped = fonts.reduce(
    (acc, font) => {
      const group = font.category || 'Other';
      (acc[group] = acc[group] || []).push(font);
      return acc;
    },
    {} as Record<string, ArabicFont[]>
  );
  Object.keys(grouped).forEach((key) => {
    grouped[key]!.sort((a, b) => a.name.localeCompare(b.name));
  });
  return grouped;
}

function useArabicFontSelection(
  settings: ReturnType<typeof useSettings>['settings'],
  setSettings: ReturnType<typeof useSettings>['setSettings']
) {
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const initializeFromSettings = useCallback(
    (fonts: ArabicFont[]) => {
      if (settings.arabicFontFace && fonts.length > 0) {
        const selectedFont = fonts.find((font) => font.value === settings.arabicFontFace);
        if (selectedFont) {
          setSelectedIds(new Set([selectedFont.id]));
        }
      }
    },
    [settings.arabicFontFace]
  );

  const handleSelectionToggle = useCallback(
    (id: number, fonts?: ArabicFont[]) => {
      const font = (fonts || []).find((f) => f.id === id);
      if (!font) return;
      setSelectedIds(new Set([id]));
      setSettings({ ...settings, arabicFontFace: font.value });
    },
    [setSettings, settings]
  );

  const handleReset = useCallback(
    (fonts?: ArabicFont[]) => {
      setSelectedIds(new Set());
      const defaultFont = (fonts || []).find((font) => font.category === 'Uthmani');
      if (defaultFont) {
        setSettings({ ...settings, arabicFontFace: defaultFont.value });
      }
    },
    [setSettings, settings]
  );

  return { selectedIds, handleSelectionToggle, handleReset, initializeFromSettings } as const;
}
