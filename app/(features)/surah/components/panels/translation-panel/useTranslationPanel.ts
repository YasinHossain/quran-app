'use client';

import { useTheme } from '@/app/providers/ThemeContext';
import { useTabsScroll } from '@/app/shared/resource-panel/hooks/useTabsScroll';

import { useTranslationsData } from './hooks/useTranslationsData';
import { useTranslationSelection } from './hooks/useTranslationSelection';

import type { Theme } from '@/app/providers/ThemeContext';
import type { TranslationResource } from '@/types';
import type { Dispatch, SetStateAction, RefObject } from 'react';

export interface UseTranslationPanelReturn {
  theme: Theme;
  translations: TranslationResource[];
  loading: boolean;
  error: string | null;

  languages: string[];
  groupedTranslations: Record<string, TranslationResource[]>;
  activeFilter: string;
  setActiveFilter: Dispatch<SetStateAction<string>>;
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  selectedIds: Set<number>;
  orderedSelection: number[];
  handleSelectionToggle: (id: number) => boolean;
  setSelections: (ids: number[]) => void;
  handleReset: () => void;

  tabsContainerRef: RefObject<HTMLDivElement | null>;
  canScrollLeft: boolean;
  canScrollRight: boolean;
  scrollTabsLeft: () => void;
  scrollTabsRight: () => void;
}

export const useTranslationPanel = (): UseTranslationPanelReturn => {
  const { theme } = useTheme();
  const { translations, loading, error, languageSort } = useTranslationsData();
  const {
    searchTerm,
    setSearchTerm,
    languages,
    groupedTranslations,
    activeFilter,
    setActiveFilter,
    selectedIds,
    orderedSelection,
    handleSelectionToggle,
    setSelections,
    handleReset,
  } = useTranslationSelection(translations, languageSort);
  const { tabsContainerRef, canScrollLeft, canScrollRight, scrollTabsLeft, scrollTabsRight } =
    useTabsScroll(languages);

  return {
    theme,
    translations,
    loading,
    error,
    languages,
    groupedTranslations,
    activeFilter,
    setActiveFilter,
    searchTerm,
    setSearchTerm,
    selectedIds,
    orderedSelection,
    handleSelectionToggle,
    setSelections,
    handleReset,
    tabsContainerRef,
    canScrollLeft,
    canScrollRight,
    scrollTabsLeft,
    scrollTabsRight,
  };
};
