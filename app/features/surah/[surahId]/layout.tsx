// app/features/surah/[SurahId]/layout.tsx
'use client';
import Header from '@/app/components/common/Header';
import IconSidebar from '@/app/components/common/IconSidebar';
import SurahListSidebar from '@/app/components/common/SurahListSidebar';
import { SettingsProvider } from '@/app/context/SettingsContext';
import { AudioProvider } from '@/app/context/AudioContext';
import { SidebarProvider } from '@/app/context/SidebarContext';

export default function SurahLayout({ children }: { children: React.ReactNode }) {
  return (
    <SettingsProvider>
      <AudioProvider>
        <SidebarProvider>
          <div className="h-screen flex flex-col">
            <Header />
            <div className="flex flex-grow overflow-hidden">
              <nav aria-label="Primary navigation">
                <IconSidebar />
              </nav>
              <nav aria-label="Surah navigation">
                <SurahListSidebar />
              </nav>
              {children}
            </div>
          </div>
        </SidebarProvider>
      </AudioProvider>
    </SettingsProvider>
  );
}
