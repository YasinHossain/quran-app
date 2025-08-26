'use client';

import { useState } from 'react';

const STORAGE_KEY = 'settings-sidebar-open-sections';

export const useOpenSections = (defaultSections: string[] = ['translation', 'font']) => {
  const [openSections, setOpenSections] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (error) {
      console.warn('Failed to parse saved sidebar sections:', error);
    }
    return defaultSections;
  });

  const toggleSection = (sectionId: string) => {
    setOpenSections((prev) => {
      let newState: string[];
      if (prev.includes(sectionId)) {
        newState = prev.filter((id) => id !== sectionId);
      } else {
        if (prev.length >= 2) {
          newState = [prev[1], sectionId];
        } else {
          newState = [...prev, sectionId];
        }
      }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      } catch (error) {
        console.warn('Failed to save sidebar sections to localStorage:', error);
      }
      return newState;
    });
  };

  return { openSections, toggleSection };
};
