'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { usePanelState } from './hooks/usePanelState';
import { useScrollPositions } from './hooks/useScrollPositions';

interface UIStateContextType {
  openPanels: Set<string>;
  openPanel: (panelId: string) => void;
  closePanel: (panelId: string) => void;
  togglePanel: (panelId: string) => void;
  isPanelOpen: (panelId: string) => boolean;
  closeAllPanels: () => void;
  isSurahListOpen: boolean;
  setSurahListOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  scrollPositions: Record<string, number>;
  setScrollPosition: (key: string, position: number) => void;
  getScrollPosition: (key: string) => number;
}

const UIStateContext = createContext<UIStateContextType | undefined>(undefined);

export const UIStateProvider = ({ children }: { children: React.ReactNode }) => {
  const panelState = usePanelState();
  const scrollState = useScrollPositions();

  const value = useMemo(() => ({ ...panelState, ...scrollState }), [panelState, scrollState]);

  return <UIStateContext.Provider value={value}>{children}</UIStateContext.Provider>;
};

export const useUIState = () => {
  const context = useContext(UIStateContext);
  if (!context) {
    throw new Error('useUIState must be used within UIStateProvider');
  }
  return context;
};

