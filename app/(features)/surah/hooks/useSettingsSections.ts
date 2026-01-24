import { useCallback, useEffect, useLayoutEffect, useState } from 'react';

import { logger } from '@/src/infrastructure/monitoring/Logger';

const STORAGE_KEY = 'settings-sidebar-open-sections';
const DEFAULT_OPEN_SECTIONS = ['translation', 'font'];

function normalizeSections(sections: string[]): string[] {
  return sections.filter((id, idx) => typeof id === 'string' && sections.indexOf(id) === idx);
}

function readInitialState(defaultOpenSections: string[]): string[] {
  if (typeof window === 'undefined') return defaultOpenSections;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return normalizeSections(JSON.parse(saved));
  } catch (error) {
    logger.warn('Failed to parse saved sidebar sections:', undefined, error as Error);
  }
  return normalizeSections(defaultOpenSections);
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

interface UseSettingsSectionsParams {
  defaultOpenSections?: string[];
}

export const useSettingsSections = (params: UseSettingsSectionsParams = {}): UseSettingsSectionsReturn => {
  const defaultOpenSections = normalizeSections(params.defaultOpenSections ?? DEFAULT_OPEN_SECTIONS);

  // Avoid "useLayoutEffect does nothing on the server" warnings during SSR,
  // while still applying localStorage state before the first paint on the client.
  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  // Initialize with defaults to avoid hydration mismatch
  // Sync with localStorage in a layout effect so the user doesn't see a close/open flash on refresh.
  const [openSections, setOpenSections] = useState<string[]>(defaultOpenSections);

  useIsomorphicLayoutEffect(() => {
    setOpenSections(readInitialState(defaultOpenSections));
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
