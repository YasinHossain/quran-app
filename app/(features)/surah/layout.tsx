'use client';

import { SurahWorkspaceNavigation } from '@/app/(features)/surah/components/surah-view/SurahWorkspaceNavigation';
import { AudioProvider } from '@/app/shared/player/context/AudioContext';
import { SurahListSidebar } from '@/app/shared/SurahListSidebar';

export default function SurahLayout({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element {
  return (
    <AudioProvider>
      {/* Mobile sidebar - persists across surah navigations */}
      <div className="xl:hidden">
        <SurahListSidebar />
      </div>

      {/* Desktop left sidebar rendered in workspace via children */}
      {/* The SurahWorkspaceNavigation is rendered via context to avoid prop drilling */}
      <SurahLayoutSidebarProvider>
        {children}
      </SurahLayoutSidebarProvider>
    </AudioProvider>
  );
}

// Context to share the desktop sidebar with WorkspaceReaderLayout
import { createContext, useContext } from 'react';

interface SurahLayoutContextType {
  desktopLeftSidebar: React.ReactNode;
}

const SurahLayoutContext = createContext<SurahLayoutContextType | null>(null);

function SurahLayoutSidebarProvider({ children }: { children: React.ReactNode }) {
  return (
    <SurahLayoutContext.Provider value={{ desktopLeftSidebar: <SurahWorkspaceNavigation /> }}>
      {children}
    </SurahLayoutContext.Provider>
  );
}

export function useSurahLayoutSidebar(): SurahLayoutContextType | null {
  return useContext(SurahLayoutContext);
}
