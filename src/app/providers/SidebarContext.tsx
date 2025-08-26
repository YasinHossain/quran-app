'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

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

  // Enhanced mobile-friendly sidebar handlers
  const setSurahListOpen = useCallback((open: boolean) => {
    _setSurahListOpen(open);

    // Prevent body scroll when drawer is open (mobile)
    if (typeof window !== 'undefined') {
      if (open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }, []);

  const setBookmarkSidebarOpen = useCallback((open: boolean) => {
    _setBookmarkSidebarOpen(open);

    // Prevent body scroll when drawer is open (mobile)
    if (typeof window !== 'undefined') {
      if (open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
  }, []);

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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = '';
      }
    };
  }, []);
  const [surahScrollTop, _setSurahScrollTop] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const stored = sessionStorage.getItem('surahScrollTop');
    return stored ? Number(stored) : 0;
  });
  const [juzScrollTop, _setJuzScrollTop] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const stored = sessionStorage.getItem('juzScrollTop');
    return stored ? Number(stored) : 0;
  });
  const [pageScrollTop, _setPageScrollTop] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const stored = sessionStorage.getItem('pageScrollTop');
    return stored ? Number(stored) : 0;
  });

  const setSurahScrollTop = useCallback(
    (top: number) => {
      _setSurahScrollTop(top);
      sessionStorage.setItem('surahScrollTop', top.toString());
    },
    [_setSurahScrollTop]
  );
  const setJuzScrollTop = useCallback(
    (top: number) => {
      _setJuzScrollTop(top);
      sessionStorage.setItem('juzScrollTop', top.toString());
    },
    [_setJuzScrollTop]
  );
  const setPageScrollTop = useCallback(
    (top: number) => {
      _setPageScrollTop(top);
      sessionStorage.setItem('pageScrollTop', top.toString());
    },
    [_setPageScrollTop]
  );

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
