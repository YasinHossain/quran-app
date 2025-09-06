'use client';

import { useCallback, useMemo, useState } from 'react';

export const usePanelState = () => {
  const [openPanels, setOpenPanels] = useState<Set<string>>(new Set());

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

  const isPanelOpen = useCallback((panelId: string) => openPanels.has(panelId), [openPanels]);

  const closeAllPanels = useCallback(() => {
    setOpenPanels(new Set());
  }, []);

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
