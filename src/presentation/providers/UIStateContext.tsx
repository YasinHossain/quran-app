'use client';

import React, { createContext, useCallback, useContext, useState, useMemo } from 'react';

interface UIStateContextType {
  // Panel management
  openPanels: Set<string>;
  openPanel: (panelId: string) => void;
  closePanel: (panelId: string) => void;
  togglePanel: (panelId: string) => void;
  isPanelOpen: (panelId: string) => boolean;
  closeAllPanels: () => void;

  // Legacy sidebar compatibility
  isSurahListOpen: boolean;
  setSurahListOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;

  // Scroll persistence
  scrollPositions: Record<string, number>;
  setScrollPosition: (key: string, position: number) => void;
  getScrollPosition: (key: string) => number;
}

const UIStateContext = createContext<UIStateContextType | undefined>(undefined);

export const UIStateProvider = ({ children }: { children: React.ReactNode }) => {
  const [openPanels, setOpenPanels] = useState<Set<string>>(new Set());
  const [scrollPositions, setScrollPositions] = useState<Record<string, number>>(() => {
    if (typeof window === 'undefined') return {};

    // Load scroll positions from sessionStorage
    const stored = sessionStorage.getItem('uiScrollPositions');
    return stored ? JSON.parse(stored) : {};
  });

  // Panel management
  const openPanel = useCallback((panelId: string) => {
    setOpenPanels((prev) => new Set([...prev, panelId]));
  }, []);

  const closePanel = useCallback((panelId: string) => {
    setOpenPanels((prev) => {
      const next = new Set(prev);
      next.delete(panelId);
      return next;
    });
  }, []);

  const togglePanel = useCallback((panelId: string) => {
    setOpenPanels((prev) => {
      const next = new Set(prev);
      if (next.has(panelId)) {
        next.delete(panelId);
      } else {
        next.add(panelId);
      }
      return next;
    });
  }, []);

  const isPanelOpen = useCallback(
    (panelId: string) => {
      return openPanels.has(panelId);
    },
    [openPanels]
  );

  const closeAllPanels = useCallback(() => {
    setOpenPanels(new Set());
  }, []);

  // Legacy sidebar compatibility
  const isSurahListOpen = openPanels.has('surah-list');
  const setSurahListOpen = useCallback(
    (open: boolean) => {
      if (open) {
        openPanel('surah-list');
      } else {
        closePanel('surah-list');
      }
    },
    [openPanel, closePanel]
  );

  const isSettingsOpen = openPanels.has('settings');
  const setSettingsOpen = useCallback(
    (open: boolean) => {
      if (open) {
        openPanel('settings');
      } else {
        closePanel('settings');
      }
    },
    [openPanel, closePanel]
  );

  // Scroll management
  const setScrollPosition = useCallback((key: string, position: number) => {
    setScrollPositions((prev) => {
      const next = { ...prev, [key]: position };
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('uiScrollPositions', JSON.stringify(next));
      }
      return next;
    });
  }, []);

  const getScrollPosition = useCallback(
    (key: string) => {
      return scrollPositions[key] || 0;
    },
    [scrollPositions]
  );

  const value = useMemo(
    () => ({
      // Panel management
      openPanels,
      openPanel,
      closePanel,
      togglePanel,
      isPanelOpen,
      closeAllPanels,

      // Legacy compatibility
      isSurahListOpen,
      setSurahListOpen,
      isSettingsOpen,
      setSettingsOpen,

      // Scroll management
      scrollPositions,
      setScrollPosition,
      getScrollPosition,
    }),
    [
      openPanels,
      openPanel,
      closePanel,
      togglePanel,
      isPanelOpen,
      closeAllPanels,
      isSurahListOpen,
      setSurahListOpen,
      isSettingsOpen,
      setSettingsOpen,
      scrollPositions,
      setScrollPosition,
      getScrollPosition,
    ]
  );

  return <UIStateContext.Provider value={value}>{children}</UIStateContext.Provider>;
};

export const useUIState = () => {
  const context = useContext(UIStateContext);
  if (!context) {
    throw new Error('useUIState must be used within UIStateProvider');
  }
  return context;
};
