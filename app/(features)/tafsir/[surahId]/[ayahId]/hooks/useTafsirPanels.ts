'use client';
import { useState } from 'react';

import { getTafsirCached } from '@/lib/tafsir/tafsirCache';

interface UseTafsirPanelsResult {
  openPanels: Record<number, boolean>;
  tafsirTexts: Record<number, string>;
  loading: Record<number, boolean>;
  togglePanel: (id: number) => Promise<void>;
}

export const useTafsirPanels = (verseKey: string): UseTafsirPanelsResult => {
  const [openPanels, setOpenPanels] = useState<Record<number, boolean>>({});
  const [tafsirTexts, setTafsirTexts] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState<Record<number, boolean>>({});

  const togglePanel = async (id: number): Promise<void> => {
    setOpenPanels((prev) => {
      const isOpen = !prev[id];
      if (isOpen && !tafsirTexts[id]) {
        setLoading((l) => ({ ...l, [id]: true }));
        getTafsirCached(verseKey, id)
          .then((text) => setTafsirTexts((t) => ({ ...t, [id]: text })))
          .catch(() => setTafsirTexts((t) => ({ ...t, [id]: 'Error loading tafsir.' })))
          .finally(() => setLoading((l) => ({ ...l, [id]: false })));
      }
      return { ...prev, [id]: isOpen };
    });
  };

  return { openPanels, tafsirTexts, loading, togglePanel };
};
