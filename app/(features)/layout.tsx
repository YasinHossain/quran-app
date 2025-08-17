'use client';

import { usePathname } from 'next/navigation';
import Header from '@/app/shared/Header';
import IconSidebar from '@/app/shared/IconSidebar';
import SurahListSidebar from '@/app/shared/SurahListSidebar';
import {
  HeaderVisibilityProvider,
  useHeaderVisibility,
} from '@/app/(features)/layout/context/HeaderVisibilityContext';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isHidden } = useHeaderVisibility();
  const pathname = usePathname();
  const isBookmarkPage = pathname.includes('/bookmarks');

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
          {!isBookmarkPage && (
            <nav aria-label="Surah navigation" className="flex-shrink-0 h-full">
              <SurahListSidebar />
            </nav>
          )}
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
