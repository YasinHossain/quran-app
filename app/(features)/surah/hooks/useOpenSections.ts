'use client';

import { useState } from 'react';

import { logger } from '@/src/infrastructure/monitoring/Logger';

const STORAGE_KEY = 'settings-sidebar-open-sections';

interface UseOpenSectionsReturn {
  openSections: string[];
  toggleSection: (sectionId: string) => void;
}

export const useOpenSections = (
  defaultSections: string[] = ['translation', 'font']
): UseOpenSectionsReturn => {
  const [openSections, setOpenSections] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      logger.warn('Failed to parse saved sidebar sections:', undefined, error as Error);
    }
    return defaultSections;
  });

  const toggleSection = (sectionId: string): void => {
    setOpenSections((prev) => {
      const newState = prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      } catch (error) {
        logger.warn('Failed to save sidebar sections to localStorage:', undefined, error as Error);
      }
      return newState;
    });
  };

  return { openSections, toggleSection };
};
