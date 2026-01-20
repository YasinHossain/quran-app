'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

import { useSettings } from '@/app/providers/SettingsContext';
import { useSelectableResources } from '@/lib/hooks/useSelectableResources';
import { Tafsir } from '@/src/domain/entities/Tafsir';
import { TafsirResource } from '@/types';

const MAX_SELECTIONS = 3;

interface UseTafsirSelectionReturn {
  tafsirs: TafsirResource[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  languages: string[];
  groupedTafsirs: Record<string, TafsirResource[]>;
  activeFilter: string;
  setActiveFilter: React.Dispatch<React.SetStateAction<string>>;
  selectedIds: Set<number>;
  orderedSelection: number[];
  handleSelectionToggle: (id: number) => boolean;
  showLimitWarning: boolean;
  setSelections: (ids: number[]) => void;
  handleReset: () => void;
}

function composeSelectionReturn(params: {
  tafsirs: TafsirResource[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  languages: string[];
  groupedTafsirs: Record<string, TafsirResource[]>;
  activeFilter: string;
  setActiveFilter: React.Dispatch<React.SetStateAction<string>>;
  selectedIds: Set<number>;
  orderedSelection: number[];
  handleSelectionToggle: (id: number) => boolean;
  showLimitWarning: boolean;
  setSelections: (ids: number[]) => void;
  handleReset: () => void;
}): UseTafsirSelectionReturn {
  return { ...params } as const;
}

// Helpers to keep hook body small
const mapToResources = (tafsirs: Tafsir[]): TafsirResource[] =>
  tafsirs.map((t) => ({ id: t.id, name: t.displayName, lang: t.formattedLanguage }));

const createLanguageSort =
  (domainTafsirs: Tafsir[]) =>
  (a: string, b: string): number => {
    const getDomainTafsir = (lang: string): Tafsir | undefined =>
      domainTafsirs.find((t) => t.formattedLanguage === lang);

    const tafsirA = getDomainTafsir(a);
    const tafsirB = getDomainTafsir(b);

    if (!tafsirA || !tafsirB) return a.localeCompare(b);

    const priorityA = tafsirA.getLanguagePriority();
    const priorityB = tafsirB.getLanguagePriority();

    return priorityA !== priorityB ? priorityA - priorityB : a.localeCompare(b);
  };

const findEnglishTafsirId = (resources: TafsirResource[]): number | undefined =>
  resources.find((t) => t.lang.toLowerCase() === 'english')?.id;

export const useTafsirSelection = (domainTafsirs: Tafsir[]): UseTafsirSelectionReturn => {
  const { settings, setTafsirIds } = useSettings();
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  const tafsirs = useMemo<TafsirResource[]>(() => mapToResources(domainTafsirs), [domainTafsirs]);

  const languageSort = useMemo(() => createLanguageSort(domainTafsirs), [domainTafsirs]);

  const core = useSelectableResources<TafsirResource>({
    resources: tafsirs,
    selectionLimit: MAX_SELECTIONS,
    initialSelectedIds: settings.tafsirIds || [],
    languageSort,
  });

  const groupedTafsirs = core.groupedResources;

  const handleSelectionToggle = useCallback(
    (id: number): boolean => {
      const changed = core.handleSelectionToggle(id);
      if (!changed) {
        setShowLimitWarning(true);
        return false;
      }
      setShowLimitWarning(false);
      return true;
    },
    [core]
  );

  const handleReset = useCallback(() => {
    const englishId = findEnglishTafsirId(tafsirs);
    if (englishId !== undefined) {
      core.setSelections([englishId]);
      setShowLimitWarning(false);
    }
  }, [tafsirs, core]);

  useEffect(() => {
    setTafsirIds([...core.orderedSelection]);
  }, [core.orderedSelection, setTafsirIds]);

  const { handleSelectionToggle: _handleSelectionToggle, ...rest } = core;
  void _handleSelectionToggle;

  return composeSelectionReturn({
    tafsirs,
    groupedTafsirs,
    handleSelectionToggle,
    showLimitWarning,
    handleReset,
    setSelections: rest.setSelections,
    // expose the relevant parts from selectable resources manually to avoid TS errors
    // about unused drag props if we spread rest and the interface is strict
    // But since rest contains drag props and our interface doesn't, we can just spread it if we want functionality
    // but here we are cleaning up. So we pick what we need.
    // Actually, spreading rest is dangerous if we want to be strict.
    // Let's manually pick what we need from rest.
    searchTerm: rest.searchTerm,
    setSearchTerm: rest.setSearchTerm,
    languages: rest.languages,
    activeFilter: rest.activeFilter,
    setActiveFilter: rest.setActiveFilter,
    selectedIds: rest.selectedIds,
    orderedSelection: rest.orderedSelection,
  });
};
