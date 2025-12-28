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

const normalizeSelectionIds = (
  translations: TranslationResource[],
  ids: number[]
): number[] => {
  if (ids.length === 0) return [];
  const validIds = new Set(translations.map((t) => t.id));
  const seen = new Set<number>();
  const normalized: number[] = [];

  ids.forEach((id) => {
    if (!Number.isFinite(id)) return;
    if (!validIds.has(id)) return;
    if (seen.has(id)) return;
    seen.add(id);
    normalized.push(id);
  });

  return normalized;
};

const computeInitialSelectionIds = (
  translations: TranslationResource[],
  settingsIds?: number[]
): number[] | null => {
  if (translations.length === 0) return null;
  if (settingsIds) {
    const normalized = normalizeSelectionIds(translations, settingsIds);
    if (normalized.length > 0) return normalized;
  }
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
  setSelections: (ids: number[]) => void;
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

    setTranslationIds(current);
  }, [s.orderedSelection, setTranslationIds]);

  const handleReset = useCallback((): void => {
    const sahihId = findSaheehId(translations);
    const resetIds = sahihId !== undefined ? [sahihId] : [];
    s.setSelections(resetIds);
    // Directly update settings to ensure immediate sync with verse page
    setTranslationIds(resetIds);
  }, [translations, s, setTranslationIds]);

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
    setSelections: s.setSelections,
    handleReset,
  } as const;
};
