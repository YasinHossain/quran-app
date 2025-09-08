import { useEffect, useState } from 'react';

export function useBodyScrollLock(): void {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
}

export function usePanelsState() {
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
  } as const;
}
