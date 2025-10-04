'use client';

import { useTheme } from '@/app/providers/ThemeContext';

import { useTabsScroll } from './hooks/useTabsScroll';
import { useTranslationsData } from './hooks/useTranslationsData';
import { useTranslationSelection } from './hooks/useTranslationSelection';

import type { Theme } from '@/app/providers/ThemeContext';
import type { TranslationResource } from '@/types';
import type { Dispatch, SetStateAction, RefObject, DragEvent } from 'react';

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
  handleDragStart: (e: DragEvent<HTMLDivElement>, id: number) => void;
  handleDragOver: (e: DragEvent<HTMLDivElement>) => void;
  handleDrop: (e: DragEvent<HTMLDivElement>, targetId: number) => void;
  handleDragEnd: () => void;
  draggedId: number | null;
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
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    draggedId,
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
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    draggedId,
    handleReset,
    tabsContainerRef,
    canScrollLeft,
    canScrollRight,
    scrollTabsLeft,
    scrollTabsRight,
  };
};
