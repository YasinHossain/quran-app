'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useSettings } from '@/app/providers/SettingsContext';
import { useSelectableResources } from '@/lib/hooks/useSelectableResources';
import { TafsirResource } from '@/types';

import { Tafsir } from '../../domain/entities/Tafsir';

const MAX_SELECTIONS = 3;

export const useTafsirSelection = (domainTafsirs: Tafsir[]) => {
  const { settings, setTafsirIds } = useSettings();
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  const tafsirs = useMemo<TafsirResource[]>(() => {
    return domainTafsirs.map((t) => ({
      id: t.id,
      name: t.displayName,
      lang: t.formattedLanguage,
    }));
  }, [domainTafsirs]);

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

  const {
    searchTerm,
    setSearchTerm,
    languages,
    groupedResources,
    activeFilter,
    setActiveFilter,
    selectedIds,
    orderedSelection,
    handleSelectionToggle: baseHandleSelectionToggle,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    draggedId,
    setSelections,
  } = useSelectableResources<TafsirResource>({
    resources: tafsirs,
    selectionLimit: MAX_SELECTIONS,
    initialSelectedIds: settings.tafsirIds || [],
    languageSort,
  });

  const groupedTafsirs = groupedResources;

  const handleSelectionToggle = useCallback(
    (id: number): boolean => {
      const changed = baseHandleSelectionToggle(id);
      if (!changed) {
        setShowLimitWarning(true);
        return false;
      }
      setShowLimitWarning(false);
      return true;
    },
    [baseHandleSelectionToggle]
  );

  const handleReset = useCallback(() => {
    const englishTafsir = tafsirs.find((t) => t.lang.toLowerCase() === 'english');
    if (englishTafsir) {
      setSelections([englishTafsir.id]);
      setShowLimitWarning(false);
    }
  }, [tafsirs, setSelections]);

  useEffect(() => {
    setTafsirIds([...orderedSelection]);
  }, [orderedSelection, setTafsirIds]);

  return {
    tafsirs,
    searchTerm,
    setSearchTerm,
    languages,
    groupedTafsirs,
    activeFilter,
    setActiveFilter,
    selectedIds,
    orderedSelection,
    handleSelectionToggle,
    showLimitWarning,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    draggedId,
    handleReset,
  } as const;
};
