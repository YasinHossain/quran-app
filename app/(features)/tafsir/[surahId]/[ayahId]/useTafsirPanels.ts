import { useEffect, useState } from 'react';

export function useBodyScrollLock(): void {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
}

interface PanelsState {
  isTranslationPanelOpen: boolean;
  openTranslationPanel: () => void;
  closeTranslationPanel: () => void;
  isTafsirPanelOpen: boolean;
  openTafsirPanel: () => void;
  closeTafsirPanel: () => void;
  isWordPanelOpen: boolean;
  openWordPanel: () => void;
  closeWordPanel: () => void;
}

export function usePanelsState(): PanelsState {
  const [isTranslationPanelOpen, setIsTranslationPanelOpen] = useState(false);
  const [isTafsirPanelOpen, setIsTafsirPanelOpen] = useState(false);
  const [isWordPanelOpen, setIsWordPanelOpen] = useState(false);

  return {
    isTranslationPanelOpen,
    openTranslationPanel: () => setIsTranslationPanelOpen(true),
    closeTranslationPanel: () => setIsTranslationPanelOpen(false),
    isTafsirPanelOpen,
    openTafsirPanel: () => setIsTafsirPanelOpen(true),
    closeTafsirPanel: () => setIsTafsirPanelOpen(false),
    isWordPanelOpen,
    openWordPanel: () => setIsWordPanelOpen(true),
    closeWordPanel: () => setIsWordPanelOpen(false),
  };
}
