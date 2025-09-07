'use client';

import { useMemo } from 'react';

import { createPanelController } from './panelController';
import { useOpenPanels } from './useOpenPanels';

export interface PanelState {
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
}

export const usePanelState = (): PanelState => {
  const { openPanels, openPanel, closePanel, togglePanel, closeAllPanels, isPanelOpen } =
    useOpenPanels();

  const { isOpen: isSurahListOpen, setOpen: setSurahListOpen } = useMemo(
    () => createPanelController('surah-list', openPanels, openPanel, closePanel),
    [openPanels, openPanel, closePanel]
  );

  const { isOpen: isSettingsOpen, setOpen: setSettingsOpen } = useMemo(
    () => createPanelController('settings', openPanels, openPanel, closePanel),
    [openPanels, openPanel, closePanel]
  );

  return useMemo(
    () => ({
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
    ]
  );
};
