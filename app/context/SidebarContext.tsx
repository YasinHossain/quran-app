'use client';
import { createContext, useContext, useEffect, useState } from 'react';

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

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSurahListOpen, setSurahListOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [surahScrollTop, setSurahScrollTop] = useState(() => {
    const stored = sessionStorage.getItem('surahScrollTop');
    return stored ? Number(stored) : 0;
  });
  const [juzScrollTop, setJuzScrollTop] = useState(() => {
    const stored = sessionStorage.getItem('juzScrollTop');
    return stored ? Number(stored) : 0;
  });
  const [pageScrollTop, setPageScrollTop] = useState(() => {
    const stored = sessionStorage.getItem('pageScrollTop');
    return stored ? Number(stored) : 0;
  });

  useEffect(() => {
    sessionStorage.setItem('surahScrollTop', surahScrollTop.toString());
  }, [surahScrollTop]);
  useEffect(() => {
    sessionStorage.setItem('juzScrollTop', juzScrollTop.toString());
  }, [juzScrollTop]);
  useEffect(() => {
    sessionStorage.setItem('pageScrollTop', pageScrollTop.toString());
  }, [pageScrollTop]);

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

export const useSidebar = () => {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
  return ctx;
};
