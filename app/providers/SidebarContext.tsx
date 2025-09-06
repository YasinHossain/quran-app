'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useBodyScrollLock } from './hooks/useBodyScrollLock';
import { useSidebarScrollPositions } from './hooks/useSidebarScrollPositions';

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
export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSurahListOpen, _setSurahListOpen] = useState(false);
  const [isBookmarkSidebarOpen, _setBookmarkSidebarOpen] = useState(false);

  const setSurahListOpen = useCallback((open: boolean) => {
    _setSurahListOpen(open);
  }, []);

  const setBookmarkSidebarOpen = useCallback((open: boolean) => {
    _setBookmarkSidebarOpen(open);
  }, []);

  useBodyScrollLock(isSurahListOpen || isBookmarkSidebarOpen);

  // Keyboard support for closing drawers
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (isSurahListOpen) {
          setSurahListOpen(false);
        }
        if (isBookmarkSidebarOpen) {
          setBookmarkSidebarOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSurahListOpen, setSurahListOpen, isBookmarkSidebarOpen, setBookmarkSidebarOpen]);

  const {
    surahScrollTop,
    setSurahScrollTop,
    juzScrollTop,
    setJuzScrollTop,
    pageScrollTop,
    setPageScrollTop,
  } = useSidebarScrollPositions();

  const value = useMemo(
    () => ({
      isSurahListOpen,
      setSurahListOpen,
      isBookmarkSidebarOpen,
      setBookmarkSidebarOpen,
      surahScrollTop,
      setSurahScrollTop,
      juzScrollTop,
      setJuzScrollTop,
      pageScrollTop,
      setPageScrollTop,
    }),
    [
      isSurahListOpen,
      setSurahListOpen,
      isBookmarkSidebarOpen,
      setBookmarkSidebarOpen,
      surahScrollTop,
      setSurahScrollTop,
      juzScrollTop,
      setJuzScrollTop,
      pageScrollTop,
      setPageScrollTop,
    ]
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
};

/**
 * Hook for interacting with sidebar state.
 * Call within components to read or update sidebar visibility and
 * scroll positions managed by `SidebarProvider`.
 */
export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
  return ctx;
};
