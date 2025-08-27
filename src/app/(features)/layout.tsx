'use client';

import { usePathname } from 'next/navigation';
import Header from '@/presentation/shared/Header';
import IconSidebar from '@/presentation/shared/IconSidebar';
import SurahListSidebar from '@/presentation/shared/SurahListSidebar';
import ModernLayout from '@/presentation/shared/navigation/ModernLayout';
import {
  HeaderVisibilityProvider,
  useHeaderVisibility,
} from '@/presentation/(features)/layout/context/HeaderVisibilityContext';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isHidden } = useHeaderVisibility();
  const pathname = usePathname();
  // This check determines if the current page is the new bookmarks page.
  // Using startsWith is slightly more robust for routing than includes.
  const isBookmarkPage = pathname.startsWith('/bookmarks');
  // Check if we're on the home page
  const isHomePage = pathname === '/';

  return (
    <ModernLayout>
      {/* Only show main header and sidebars if not on home page */}
      {!isHomePage && (
        <>
          <Header />

          {/* Fixed desktop sidebars - positioned independently */}
          <nav
            aria-label="Primary navigation"
            className={`hidden lg:flex fixed left-0 w-16 bg-background border-r border-border z-10 transition-[top] duration-300 ${isHidden ? 'top-0' : 'top-16'}`}
            style={{ height: isHidden ? '100vh' : 'calc(100vh - 4rem)' }}
          >
            <IconSidebar />
          </nav>

          {/* Unified Surah navigation - handles both desktop and mobile */}
          {!isBookmarkPage && <SurahListSidebar />}
        </>
      )}

      {/* Main content area with proper left margin for sidebars */}
      <div className="flex flex-col min-h-[100dvh]">
        <div
          className={`flex-grow min-h-0 transition-all duration-300 ${!isHomePage && !isBookmarkPage ? 'lg:ml-96' : !isHomePage ? 'lg:ml-16' : ''}`}
        >
          {children}
        </div>
      </div>
    </ModernLayout>
  );
}

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return (
    <HeaderVisibilityProvider>
      <LayoutContent>{children}</LayoutContent>
    </HeaderVisibilityProvider>
  );
}
