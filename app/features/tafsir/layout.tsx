'use client';
// app/features/tafsir/layout.tsx
import Header from '@/app/components/common/Header';
import IconSidebar from '@/app/components/common/IconSidebar';
import SurahListSidebar from '@/app/components/common/SurahListSidebar';
import { AudioProvider } from '@/app/context/AudioContext';

export default function TafsirLayout({ children }: { children: React.ReactNode }) {
  return (
    <AudioProvider>
      <Header />
      <div className="h-[calc(100vh-64px)] pt-16 flex flex-col">
        <div className="flex flex-grow overflow-hidden min-h-0">
          <nav aria-label="Primary navigation" className="flex-shrink-0 h-full">
            <IconSidebar />
          </nav>
          <nav aria-label="Surah navigation" className="flex-shrink-0 h-full">
            <SurahListSidebar />
          </nav>
          {children}
        </div>
      </div>
    </AudioProvider>
  );
}
