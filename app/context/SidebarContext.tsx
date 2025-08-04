'use client';
import { createContext, useContext, useState } from 'react';

interface SidebarContextType {
  isSurahListOpen: boolean;
  setSurahListOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
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
  const [isSurahListOpen, setSurahListOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
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

  const setSurahScrollTop = (top: number) => {
    _setSurahScrollTop(top);
    sessionStorage.setItem('surahScrollTop', top.toString());
  };
  const setJuzScrollTop = (top: number) => {
    _setJuzScrollTop(top);
    sessionStorage.setItem('juzScrollTop', top.toString());
  };
  const setPageScrollTop = (top: number) => {
    _setPageScrollTop(top);
    sessionStorage.setItem('pageScrollTop', top.toString());
  };

  return (
    <SidebarContext.Provider
      value={{
        isSurahListOpen,
        setSurahListOpen,
        isSettingsOpen,
        setSettingsOpen,
        surahScrollTop,
        setSurahScrollTop,
        juzScrollTop,
        setJuzScrollTop,
        pageScrollTop,
        setPageScrollTop,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
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
