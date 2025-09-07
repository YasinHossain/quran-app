import { useCallback, useState } from 'react';

interface OpenPanelsState {
  openPanels: Set<string>;
  openPanel: (panelId: string) => void;
  closePanel: (panelId: string) => void;
  togglePanel: (panelId: string) => void;
  closeAllPanels: () => void;
  isPanelOpen: (panelId: string) => boolean;
}

export const useOpenPanels = (): OpenPanelsState => {
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

  const closeAllPanels = useCallback(() => {
    setOpenPanels(new Set());
  }, []);

  const isPanelOpen = useCallback((panelId: string) => openPanels.has(panelId), [openPanels]);

  return { openPanels, openPanel, closePanel, togglePanel, closeAllPanels, isPanelOpen };
};
