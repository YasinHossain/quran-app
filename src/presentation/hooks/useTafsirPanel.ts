'use client';

import { useTheme } from '@/app/providers/ThemeContext';

import { useTafsir } from './useTafsir';
import { useTafsirSelection } from './useTafsirSelection';
import { useTafsirTabsScroll } from './useTafsirTabsScroll';

import type { Theme } from '@/app/providers/ThemeContext';
import type { TafsirResource } from '@/types';
import type { Dispatch, SetStateAction, RefObject, DragEvent } from 'react';

export interface UseTafsirPanelReturn {
  theme: Theme;
  tafsirs: TafsirResource[];
  loading: boolean;
  error: string | null;
  isFromCache: boolean;

  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  languages: string[];
  groupedTafsirs: Record<string, TafsirResource[]>;
  activeFilter: string;
  setActiveFilter: Dispatch<SetStateAction<string>>;

  selectedIds: Set<number>;
  orderedSelection: number[];
  handleSelectionToggle: (id: number) => boolean;
  showLimitWarning: boolean;

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

function composeReturn(params: {
  theme: Theme;
  tafsirs: TafsirResource[];
  loading: boolean;
  error: string | null;
  isFromCache: boolean;
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  languages: string[];
  groupedTafsirs: Record<string, TafsirResource[]>;
  activeFilter: string;
  setActiveFilter: Dispatch<SetStateAction<string>>;
  selectedIds: Set<number>;
  orderedSelection: number[];
  handleSelectionToggle: (id: number) => boolean;
  showLimitWarning: boolean;
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
}): UseTafsirPanelReturn {
  return { ...params };
}

export const useTafsirPanel = (isOpen: boolean): UseTafsirPanelReturn => {
  const { theme } = useTheme();

  const { tafsirs: domainTafsirs, loading: apiLoading, error: apiError, isFromCache } = useTafsir();

  const selection = useTafsirSelection(domainTafsirs);

  const { tabsContainerRef, canScrollLeft, canScrollRight, scrollTabsLeft, scrollTabsRight } =
    useTafsirTabsScroll(selection.languages);

  const loading = isOpen && apiLoading;
  const error = apiError;

  return composeReturn({
    theme,
    loading,
    error,
    isFromCache,
    ...selection,
    tabsContainerRef,
    canScrollLeft,
    canScrollRight,
    scrollTabsLeft,
    scrollTabsRight,
  });
};
