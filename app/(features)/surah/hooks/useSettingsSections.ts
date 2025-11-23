import { useState, useCallback } from 'react';

import { logger } from '@/src/infrastructure/monitoring/Logger';

const STORAGE_KEY = 'settings-sidebar-open-sections';
const DEFAULT_OPEN_SECTIONS = ['translation', 'font'];
const MUSHAF_SECTION_ID = 'mushaf';
const MAX_OPEN_SECTIONS = 2;

function normalizeSections(sections: string[]): string[] {
  const unique = sections.filter(
    (id, idx) => typeof id === 'string' && sections.indexOf(id) === idx
  );
  return unique.slice(0, MAX_OPEN_SECTIONS);
}

function readInitialState(): string[] {
  if (typeof window === 'undefined') return DEFAULT_OPEN_SECTIONS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return normalizeSections(JSON.parse(saved));
  } catch (error) {
    logger.warn('Failed to parse saved sidebar sections:', undefined, error as Error);
  }
  return normalizeSections(DEFAULT_OPEN_SECTIONS);
}

function persistState(state: string[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    logger.warn('Failed to save sidebar sections to localStorage:', undefined, error as Error);
  }
}

function nextOpenSections(prev: string[], sectionId: string): string[] {
  if (prev.includes(sectionId)) return prev.filter((id) => id !== sectionId);
  if (prev.length >= MAX_OPEN_SECTIONS) {
    const itemsToKeep = Math.max(0, MAX_OPEN_SECTIONS - 1);
    return [...prev.slice(-itemsToKeep), sectionId];
  }
  return [...prev, sectionId];
}

interface UseSettingsSectionsReturn {
  openSections: string[];
  handleSectionToggle: (sectionId: string) => void;
}

export const useSettingsSections = (): UseSettingsSectionsReturn => {
  const [openSections, setOpenSections] = useState<string[]>(() => readInitialState());

  const handleSectionToggle = useCallback(
    (sectionId: string) => {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Toggling section', { sectionId, openSections });
      }

      setOpenSections((prev) => {
        const newState = nextOpenSections(prev, sectionId);
        persistState(newState);
        return newState;
      });
    },
    [openSections]
  );

  return {
    openSections,
    handleSectionToggle,
  };
};
