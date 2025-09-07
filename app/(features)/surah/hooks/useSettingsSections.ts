import { useState, useCallback } from 'react';

import { logger } from '@/src/infrastructure/monitoring/Logger';

const STORAGE_KEY = 'settings-sidebar-open-sections';
const DEFAULT_OPEN_SECTIONS = ['translation', 'font'];
const MAX_OPEN_SECTIONS = 2;

interface UseSettingsSectionsReturn {
  openSections: string[];
  handleSectionToggle: (sectionId: string) => void;
}

export const useSettingsSections = (): UseSettingsSectionsReturn => {
  const [openSections, setOpenSections] = useState<string[]>(() => {
    if (typeof window === 'undefined') {
      return DEFAULT_OPEN_SECTIONS;
    }

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      logger.warn('Failed to parse saved sidebar sections:', undefined, error as Error);
    }
    return DEFAULT_OPEN_SECTIONS;
  });

  const handleSectionToggle = useCallback(
    (sectionId: string) => {
      if (process.env.NODE_ENV === 'development') {
        logger.debug('Toggling section', { sectionId, openSections });
      }

      setOpenSections((prev) => {
        let newState: string[];

        if (prev.includes(sectionId)) {
          // If section is open, close it
          newState = prev.filter((id) => id !== sectionId);
        } else {
          // If section is closed, open it
          if (prev.length >= MAX_OPEN_SECTIONS) {
            // If already at max sections, remove the oldest one and add the new one
            newState = [...prev.slice(-1), sectionId];
          } else {
            // If less than max sections open, just add the new one
            newState = [...prev, sectionId];
          }
        }

        // Save to localStorage
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
          } catch (error) {
            logger.warn(
              'Failed to save sidebar sections to localStorage:',
              undefined,
              error as Error
            );
          }
        }

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
