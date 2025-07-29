'use client';
import { createContext, useContext, useEffect, useState } from 'react';

interface SidebarContextType {
  isSurahListOpen: boolean;
  setSurahListOpen: (open: boolean) => void;
  isSettingsOpen: boolean;
  setSettingsOpen: (open: boolean) => void;
  surahListScrollTop: number;
  setSurahListScrollTop: (top: number) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const [isSurahListOpen, setSurahListOpen] = useState(false);
  const [isSettingsOpen, setSettingsOpen] = useState(false);
  const [surahListScrollTop, setSurahListScrollTop] = useState(() => {
    const stored = sessionStorage.getItem('surahListScrollTop');
    return stored ? Number(stored) : 0;
  });

  useEffect(() => {
    sessionStorage.setItem('surahListScrollTop', surahListScrollTop.toString());
  }, [surahListScrollTop]);

  return (
    <SidebarContext.Provider
      value={{
        isSurahListOpen,
        setSurahListOpen,
        isSettingsOpen,
        setSettingsOpen,
        surahListScrollTop,
        setSurahListScrollTop,
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
