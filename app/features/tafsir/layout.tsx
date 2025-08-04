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
      <div className="h-screen flex flex-col">
        <div className="flex flex-grow overflow-hidden min-h-0">
          <nav aria-label="Primary navigation" className="flex-shrink-0 h-full pt-16">
            <IconSidebar />
          </nav>
          <nav aria-label="Surah navigation" className="flex-shrink-0 h-full pt-16">
            <SurahListSidebar />
          </nav>
          {children}
        </div>
      </div>
    </AudioProvider>
  );
}
