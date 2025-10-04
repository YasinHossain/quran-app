'use client';

import type { ReactElement, ReactNode } from 'react';

import { usePathname } from 'next/navigation';

import {
  HeaderVisibilityProvider,
  useHeaderVisibility,
} from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { Header } from '@/app/shared/Header';
import { Navigation } from '@/app/shared/IconSidebar';
import { ModernLayout } from '@/app/shared/navigation/ModernLayout';
import { SurahListSidebar } from '@/app/shared/SurahListSidebar';

function LayoutContent({ children }: { children: ReactNode }): ReactElement {
  useHeaderVisibility();
  const pathname = usePathname();
  const isBookmarkPage = pathname.startsWith('/bookmarks');
  const isHomePage = pathname === '/';

  return (
    <ModernLayout>
      {/* Header navigation (keep intact) */}
      {!isHomePage && <Header />}

      {/* Simple unified navigation: desktop left sidebar, mobile bottom */}
      <Navigation />

      {/* Surah list sidebar - for browsing surahs */}
      {!isHomePage && !isBookmarkPage && <SurahListSidebar />}

      {/* Main content area with proper margins for both sidebars */}
      <div className="flex flex-col min-h-[100dvh]">
        <div
          className={`flex-grow min-h-0 transition-all duration-300 ${
            !isHomePage && !isBookmarkPage ? 'lg:ml-96' : !isHomePage ? 'lg:ml-16' : ''
          }`}
        >
          {children}
        </div>
      </div>
    </ModernLayout>
  );
}

export default function FeaturesLayout({ children }: { children: ReactNode }): ReactElement {
  return (
    <HeaderVisibilityProvider>
      <LayoutContent>{children}</LayoutContent>
    </HeaderVisibilityProvider>
  );
}

