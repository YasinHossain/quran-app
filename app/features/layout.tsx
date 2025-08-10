'use client';

import Header from '@/app/components/shared/Header';
import IconSidebar from '@/app/components/shared/IconSidebar';
import SurahListSidebar from '@/app/components/shared/SurahListSidebar';
import {
  HeaderVisibilityProvider,
  useHeaderVisibility,
} from '@/app/context/HeaderVisibilityContext';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isHidden } = useHeaderVisibility();
  return (
    <>
      <Header />
      <div className="flex flex-col h-screen">
        <div
          className={`flex flex-grow overflow-hidden min-h-0 transition-[padding-top] duration-300 ${isHidden ? 'pt-0' : 'pt-16'}`}
        >
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

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return (
    <HeaderVisibilityProvider>
      <LayoutContent>{children}</LayoutContent>
    </HeaderVisibilityProvider>
  );
}
