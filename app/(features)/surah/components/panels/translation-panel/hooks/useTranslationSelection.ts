'use client';

import { useRef, useEffect, useCallback, type MutableRefObject } from 'react';

import { useSettings } from '@/app/providers/SettingsContext';
import { useSelectableResources } from '@/lib/hooks/useSelectableResources';
import { TranslationResource } from '@/types';

export const MAX_TRANSLATION_SELECTIONS = 5;

const DEFAULT_SAHEEH_ID = 20;

const isSaheehName = (name: string): boolean => {
  const lower = name.toLowerCase();
  return lower.includes('saheeh international') || lower.includes('sahih international');
};

const findSaheehId = (translations: TranslationResource[]): number | undefined =>
  translations.find((t) => isSaheehName(t.name))?.id;

const computeInitialSelectionIds = (
  translations: TranslationResource[],
  settingsIds?: number[]
): number[] | null => {
  if (translations.length === 0) return null;
  if (settingsIds && settingsIds.length > 0) return settingsIds;
  const sahihId = findSaheehId(translations);
  return sahihId !== undefined ? [sahihId] : [DEFAULT_SAHEEH_ID];
};

const applySelectionsSafely = (
  setSelections: (ids: number[]) => void,
  isUpdatingRef: MutableRefObject<boolean>,
  ids: number[]
): void => {
  isUpdatingRef.current = true;
  setSelections(ids);
  setTimeout(() => {
    isUpdatingRef.current = false;
  }, 100);
};

interface UseTranslationSelectionResult {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  languages: string[];
  groupedTranslations: Record<string, TranslationResource[]>;
  activeFilter: string;
  setActiveFilter: React.Dispatch<React.SetStateAction<string>>;
  selectedIds: Set<number>;
  orderedSelection: number[];
  handleSelectionToggle: (id: number) => boolean;
  handleDragStart: (e: React.DragEvent<HTMLDivElement>, id: number) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, targetId: number) => void;
  handleDragEnd: () => void;
  draggedId: number | null;
  handleReset: () => void;
}

export const useTranslationSelection = (
  translations: TranslationResource[],
  languageSort: (a: string, b: string) => number
): UseTranslationSelectionResult => {
  const { settings, setTranslationIds } = useSettings();

  const s = useSelectableResources<TranslationResource>({
    resources: translations,
    selectionLimit: MAX_TRANSLATION_SELECTIONS,
    languageSort,
  });

  const isUpdatingRef = useRef(false);
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (isUpdatingRef.current || hasInitialized.current) return;
    const initial = computeInitialSelectionIds(translations, settings.translationIds);
    if (!initial) return;
    hasInitialized.current = true;
    applySelectionsSafely(s.setSelections, isUpdatingRef, initial);
  }, [translations, s.setSelections, settings.translationIds]);

  useEffect(() => {
    if (isUpdatingRef.current) return;
    if (!hasInitialized.current) return;

    const current = [...s.orderedSelection];
    if (current.length === 0) {
      return;
    }
    setTranslationIds(current);
  }, [s.orderedSelection, setTranslationIds]);

  const handleReset = useCallback((): void => {
    const sahihId = findSaheehId(translations);
    s.setSelections(sahihId !== undefined ? [sahihId] : []);
  }, [translations, s]);

  return {
    searchTerm: s.searchTerm,
    setSearchTerm: s.setSearchTerm,
    languages: s.languages,
    groupedTranslations: s.groupedResources,
    activeFilter: s.activeFilter,
    setActiveFilter: s.setActiveFilter,
    selectedIds: s.selectedIds,
    orderedSelection: s.orderedSelection,
    handleSelectionToggle: s.handleSelectionToggle,
    handleDragStart: s.handleDragStart,
    handleDragOver: s.handleDragOver,
    handleDrop: s.handleDrop,
    handleDragEnd: s.handleDragEnd,
    draggedId: s.draggedId,
    handleReset,
  } as const;
};
