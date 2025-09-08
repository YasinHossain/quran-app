'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { useBodyScrollLock } from './hooks/useBodyScrollLock';
import { useSidebarScrollPositions } from './hooks/useSidebarScrollPositions';

// Helper hook for keyboard controls
const useSidebarKeyboard = (
  isSurahListOpen: boolean,
  setSurahListOpen: (open: boolean) => void,
  isBookmarkSidebarOpen: boolean,
  setBookmarkSidebarOpen: (open: boolean) => void
): void => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        if (isSurahListOpen) setSurahListOpen(false);
        if (isBookmarkSidebarOpen) setBookmarkSidebarOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSurahListOpen, setSurahListOpen, isBookmarkSidebarOpen, setBookmarkSidebarOpen]);
};

interface SidebarContextType {
  isSurahListOpen: boolean;
  setSurahListOpen: (open: boolean) => void;
  isBookmarkSidebarOpen: boolean;
  setBookmarkSidebarOpen: (open: boolean) => void;
  surahScrollTop: number;
  setSurahScrollTop: (top: number) => void;
  juzScrollTop: number;
  setJuzScrollTop: (top: number) => void;
  pageScrollTop: number;
  setPageScrollTop: (top: number) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

/**
 * Provides global sidebar UI state.
 * Wrap components needing access to sidebar visibility and scroll
 * positions with this provider to synchronize their behavior.
 */
// Local hooks to keep provider lean
const useSidebarToggles = () => {
  const [isSurahListOpen, _setSurahListOpen] = useState(false);
  const [isBookmarkSidebarOpen, _setBookmarkSidebarOpen] = useState(false);

  const setSurahListOpen = useCallback((open: boolean): void => {
    _setSurahListOpen(open);
  }, []);

  const setBookmarkSidebarOpen = useCallback((open: boolean): void => {
    _setBookmarkSidebarOpen(open);
  }, []);

  useBodyScrollLock(isSurahListOpen || isBookmarkSidebarOpen);
  useSidebarKeyboard(
    isSurahListOpen,
    setSurahListOpen,
    isBookmarkSidebarOpen,
    setBookmarkSidebarOpen
  );

  return { isSurahListOpen, setSurahListOpen, isBookmarkSidebarOpen, setBookmarkSidebarOpen };
};

const useSidebarContextValue = (
  toggles: ReturnType<typeof useSidebarToggles>,
  positions: ReturnType<typeof useSidebarScrollPositions>
) =>
  useMemo(
    () => ({
      ...toggles,
      surahScrollTop: positions.surahScrollTop,
      setSurahScrollTop: positions.setSurahScrollTop,
      juzScrollTop: positions.juzScrollTop,
      setJuzScrollTop: positions.setJuzScrollTop,
      pageScrollTop: positions.pageScrollTop,
      setPageScrollTop: positions.setPageScrollTop,
    }),
    [toggles, positions]
  );

export const SidebarProvider = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  const toggles = useSidebarToggles();
  const positions = useSidebarScrollPositions();
  const value = useSidebarContextValue(toggles, positions);
  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

/**
 * Hook for interacting with sidebar state.
 * Call within components to read or update sidebar visibility and
 * scroll positions managed by `SidebarProvider`.
 */
export const useSidebar = (): SidebarContextType => {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
  return ctx;
};
