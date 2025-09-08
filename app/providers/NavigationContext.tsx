'use client';

import { useRouter } from 'next/navigation';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

// Custom hooks for cleaner component logic
const useKeyboardShortcuts = (
  hideAllSheets: () => void,
  setQuranBottomSheetOpen: (open: boolean) => void
): void => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        hideAllSheets();
      }

      if (event.metaKey || event.ctrlKey) {
        switch (event.key) {
          case 'o':
            event.preventDefault();
            setQuranBottomSheetOpen(true);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [hideAllSheets, setQuranBottomSheetOpen]);
};

const useBodyScrollLock = (shouldLock: boolean): void => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const { classList } = document.body;
    if (shouldLock) {
      classList.add('overflow-hidden', 'touch-none');
    } else {
      classList.remove('overflow-hidden', 'touch-none');
    }

    return () => {
      classList.remove('overflow-hidden', 'touch-none');
    };
  }, [shouldLock]);
};

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
export const NavigationProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => {
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

  // Apply custom hooks for cleaner code
  useKeyboardShortcuts(hideAllSheets, setQuranBottomSheetOpen);
  useBodyScrollLock(isQuranBottomSheetOpen);

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
export const useNavigation = (): NavigationContextType => {
  const ctx = useContext(NavigationContext);
  if (!ctx) throw new Error('useNavigation must be used within NavigationProvider');
  return ctx;
};
