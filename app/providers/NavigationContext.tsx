'use client';

import { useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface NavigationContextType {
  // Bottom sheet state
  isQuranBottomSheetOpen: boolean;
  setQuranBottomSheetOpen: (open: boolean) => void;

  // Navigation helpers
  navigateToSurah: (surahId: number) => void;
  showQuranSelector: () => void;
  hideAllSheets: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

/**
 * Modern navigation provider with bottom sheet and quick actions
 */
export const NavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isQuranBottomSheetOpen, setQuranBottomSheetOpen] = useState(false);

  // Navigation helpers
  const navigateToSurah = useCallback(
    (surahId: number) => {
      router.push(`/surah/${surahId}`);
      setQuranBottomSheetOpen(false);
    },
    [router]
  );

  const showQuranSelector = useCallback(() => {
    setQuranBottomSheetOpen(true);
  }, []);

  const hideAllSheets = useCallback(() => {
    setQuranBottomSheetOpen(false);
  }, []);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        hideAllSheets();
      }

      // Quick shortcuts
      if (event.metaKey || event.ctrlKey) {
        switch (event.key) {
          case 'o': // Cmd/Ctrl + O for Quran selector
            event.preventDefault();
            setQuranBottomSheetOpen(true);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [hideAllSheets]);

  // Prevent body scroll when sheets are open
  useEffect(() => {
    const shouldPreventScroll = isQuranBottomSheetOpen;

    if (typeof window !== 'undefined') {
      const { classList } = document.body;
      if (shouldPreventScroll) {
        classList.add('overflow-hidden', 'touch-none');
      } else {
        classList.remove('overflow-hidden', 'touch-none');
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        document.body.classList.remove('overflow-hidden', 'touch-none');
      }
    };
  }, [isQuranBottomSheetOpen]);

  const value = useMemo(
    () => ({
      isQuranBottomSheetOpen,
      setQuranBottomSheetOpen,
      navigateToSurah,
      showQuranSelector,
      hideAllSheets,
    }),
    [isQuranBottomSheetOpen, navigateToSurah, showQuranSelector, hideAllSheets]
  );

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
};

/**
 * Hook for modern navigation state and actions
 */
export const useNavigation = () => {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider');
  return ctx;
};
