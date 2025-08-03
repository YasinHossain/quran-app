// app/features/page/layout.tsx
'use client';
import Header from '@/app/components/common/Header';
import IconSidebar from '@/app/components/common/IconSidebar';
import SurahListSidebar from '@/app/components/common/SurahListSidebar';
import { AudioProvider } from '@/app/context/AudioContext';

export default function PageLayout({ children }: { children: React.ReactNode }) {
  return (
    <AudioProvider>
      <Header />
      <div className="h-screen flex flex-col pt-16">
        <div className="flex flex-grow overflow-hidden">
          <nav aria-label="Primary navigation" className="flex-shrink-0">
            <IconSidebar />
          </nav>
          <nav aria-label="Surah navigation" className="flex-shrink-0">
            <SurahListSidebar />
          </nav>
          {children}
        </div>
      </div>
    </AudioProvider>
  );
}
