'use client';

import { usePathname } from 'next/navigation';
import Header from '@/app/shared/Header';
import IconSidebar from '@/app/shared/IconSidebar';
import SurahListSidebar from '@/app/shared/SurahListSidebar';
import { HeaderVisibilityProvider } from '@/app/(features)/layout/context/HeaderVisibilityContext';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isBookmarkPage = pathname.startsWith('/bookmarks');

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1 overflow-hidden md:gap-4">
        <nav aria-label="Primary navigation" className="hidden md:block basis-20 shrink-0">
          <IconSidebar />
        </nav>
        {!isBookmarkPage && (
          <nav
            aria-label="Surah navigation"
            className="relative basis-0 md:basis-[20.7rem] shrink-0"
          >
            <SurahListSidebar />
          </nav>
        )}
        <main className="flex-grow overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return (
    <HeaderVisibilityProvider>
      <LayoutContent>{children}</LayoutContent>
    </HeaderVisibilityProvider>
  );
}
