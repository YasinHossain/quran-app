'use client';

import {
  HeaderVisibilityProvider,
  useHeaderVisibility,
} from '@/app/(features)/layout/context/HeaderVisibilityContext';
import { useSidebar } from '@/app/providers/SidebarContext';
import { Header } from '@/app/shared/Header';
import { Navigation } from '@/app/shared/IconSidebar';
import { ModernLayout } from '@/app/shared/navigation/ModernLayout';
// Surah list sidebar is now provided by reader/bookmark layouts themselves

import type { ReactElement, ReactNode } from 'react';

function LayoutContent({ children }: { children: ReactNode }): ReactElement {
  const { isHidden } = useHeaderVisibility();
  const { isSurahListOpen, isBookmarkSidebarOpen } = useSidebar();

  const isNavHidden = isHidden || isSurahListOpen || isBookmarkSidebarOpen;

  return (
    <ModernLayout isNavHidden={isNavHidden}>
      <Header />

      {/* Simple unified navigation: desktop left sidebar, mobile bottom */}
      <Navigation />

      {/* Sidebars are managed per-feature (ReaderShell/BookmarksLayout) */}

      {/* Main content area with proper margins for both sidebars */}
      <div className="flex flex-col min-h-[100dvh] xl:pl-16">
        <div className="flex-grow min-h-0 transition-all duration-300">{children}</div>
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
