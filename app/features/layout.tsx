'use client';

import Header from '@/app/components/common/Header';
import IconSidebar from '@/app/components/common/IconSidebar';
import SurahListSidebar from '@/app/components/common/SurahListSidebar';

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex flex-col h-screen">
        <div className="flex flex-grow overflow-hidden min-h-0 pt-16">
          <nav aria-label="Primary navigation" className="flex-shrink-0 h-full">
            <IconSidebar />
          </nav>
          <nav aria-label="Surah navigation" className="flex-shrink-0 h-full">
            <SurahListSidebar />
          </nav>
          {children}
        </div>
      </div>
    </>
  );
}
