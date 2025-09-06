'use client';

import { useRef, useEffect, useCallback } from 'react';

import { useSettings } from '@/app/providers/SettingsContext';
import { useSelectableResources } from '@/lib/hooks/useSelectableResources';
import { TranslationResource } from '@/types';

export const MAX_TRANSLATION_SELECTIONS = 5;

export const useTranslationSelection = (
  translations: TranslationResource[],
  languageSort: (a: string, b: string) => number
) => {
  const { settings, setTranslationIds } = useSettings();

  const selectable = useSelectableResources<TranslationResource>({
    resources: translations,
    selectionLimit: MAX_TRANSLATION_SELECTIONS,
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
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (translations.length > 0 && !hasInitialized.current && !isUpdatingRef.current) {
      hasInitialized.current = true;

      const settingsIds = settings.translationIds || [];
      if (settingsIds.length > 0) {
        isUpdatingRef.current = true;
        setSelections(settingsIds);
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 100);
      } else {
        const sahih = translations.find(
          (t) =>
            t.name.toLowerCase().includes('saheeh international') ||
            t.name.toLowerCase().includes('sahih international')
        );
        const defaultIds = sahih ? [sahih.id] : [20];
        isUpdatingRef.current = true;
        setSelections(defaultIds);
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 100);
      }
    }
  }, [translations, setSelections, settings.translationIds]);

  useEffect(() => {
    if (isUpdatingRef.current) return;
    if (!hasInitialized.current) return;

    const current = [...orderedSelection];
    if (current.length === 0) {
      return;
    }
    setTranslationIds(current);
  }, [orderedSelection, setTranslationIds]);

  const handleReset = useCallback(() => {
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
  }, [translations, setSelections]);

  return {
    searchTerm,
    setSearchTerm,
    languages,
    groupedTranslations: groupedResources,
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
    handleReset,
  } as const;
};

