import { useState, useCallback, useEffect } from 'react';

import { logger } from '@/src/infrastructure/monitoring/Logger';

const STORAGE_KEY = 'settings-sidebar-open-sections';
const DEFAULT_OPEN_SECTIONS = ['translation', 'font'];

function normalizeSections(sections: string[]): string[] {
  return sections.filter((id, idx) => typeof id === 'string' && sections.indexOf(id) === idx);
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
  return [...prev, sectionId];
}

interface UseSettingsSectionsReturn {
  openSections: string[];
  handleSectionToggle: (sectionId: string) => void;
}

export const useSettingsSections = (): UseSettingsSectionsReturn => {
  // Initialize with defaults to avoid hydration mismatch
  // Sync with localStorage in useEffect (may cause minor flash but strictly required for hydration)
  const [openSections, setOpenSections] = useState<string[]>(DEFAULT_OPEN_SECTIONS);

  useEffect(() => {
    setOpenSections(readInitialState());
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
