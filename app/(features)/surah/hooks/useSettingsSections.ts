import { useState, useCallback, useEffect } from 'react';

import { logger } from '@/src/infrastructure/monitoring/Logger';

const STORAGE_KEY = 'settings-sidebar-open-sections';
const DEFAULT_OPEN_SECTIONS = ['translation', 'font'];
const MAX_OPEN_SECTIONS = 2;

const areSectionsEqual = (a: string[], b: string[]): boolean => {
  if (a.length !== b.length) return false;
  return a.every((value, index) => value === b[index]);
};

function readInitialState(): string[] {
  if (typeof window === 'undefined') return DEFAULT_OPEN_SECTIONS;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (error) {
    logger.warn('Failed to parse saved sidebar sections:', undefined, error as Error);
  }
  return DEFAULT_OPEN_SECTIONS;
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
  if (prev.length >= MAX_OPEN_SECTIONS) return [...prev.slice(-1), sectionId];
  return [...prev, sectionId];
}

interface UseSettingsSectionsReturn {
  openSections: string[];
  handleSectionToggle: (sectionId: string) => void;
}

export const useSettingsSections = (): UseSettingsSectionsReturn => {
  const [openSections, setOpenSections] = useState<string[]>(DEFAULT_OPEN_SECTIONS);

  useEffect(() => {
    const initialState = readInitialState();
    setOpenSections((prev) => (areSectionsEqual(prev, initialState) ? prev : initialState));
  }, []);

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
